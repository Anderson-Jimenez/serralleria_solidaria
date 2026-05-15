import { PaymentElement, AddressElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { useState, useEffect } from 'react';
import { useCart } from '../../contexts/CartContext';

const STEPS = ['Direcció', 'Observacions i extres', 'Pagament'];

function CheckoutForm({ subtotal, cartItems, clientSecret }) {
    const stripe = useStripe();
    const elements = useElements();
    const { refreshCart } = useCart();
    const [currentStep, setCurrentStep] = useState(0);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        installation: false,
        observations: '',
        shipping: false,
    });
    const [installationCost, setInstallationCost] = useState(0);
    const [installationMessage, setInstallationMessage] = useState('');

    const [shippingCost, setShippingCost] = useState(0);
    const [shippingAddress, setShippingAddress] = useState('');

    const total = subtotal + (formData.installation ? installationCost : 0) + (formData.shipping ? shippingCost : 0);


    const calculateInstallationPrice = (s) => {
        if (s <= 250) return 90;
        if (s <= 500) return 120;
        if (s <= 1000) return 180;
        return null;
    };

    useEffect(() => {
        if (!formData.installation) {
            setInstallationCost(0);
            setInstallationMessage('');
            return;
        }
        const cost = calculateInstallationPrice(subtotal);
        if (cost !== null) {
            setInstallationCost(cost);
            setInstallationMessage('');
        } else {
            setInstallationCost(0);
            setInstallationMessage('Pressupost a consultar (més de 1.000€ en productes)');
        }
    }, [formData.installation]);

    useEffect(() => {
        if (!formData.shipping) {
            setShippingCost(0);
            return;
        }
        else {
            setShippingCost(9);
        }
    }, [formData.shipping]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        console.log('Body complet:', JSON.stringify(formData));

        if (!stripe || !elements) return;

        // Validació instal·lació
        if (formData.installation && installationMessage !== '') {
            alert('Per a comandes de més de 1.000€, contacta amb nosaltres.');
            return;
        }

        setLoading(true);

        try {
            const token = localStorage.getItem('token');
            const orderId = localStorage.getItem('order_id');

            // 2. Actualitzar el PaymentIntent amb el total real (subtotal + instal·lació + enviament)
            const paymentIntentId = clientSecret.split('_secret_')[0];
            const updateRes = await fetch('http://localhost:8000/api/payment/updateIntent', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    paymentIntentId,
                    total,      // ja inclou subtotal + installationCost + shippingCost
                    order_id: orderId,
                    shipping_address: shippingAddress,
                }),
            });

            const updateData = await updateRes.json();

            // 3. Enviar dades al backend per crear/actualitzar l'ordre
            const res = await fetch('http://localhost:8000/api/orders/checkout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    ...formData,
                    order_id: orderId,
                    installation_price: installationCost,
                    shipping_price: shippingCost,
                    shipping_address: shippingAddress,
                    total: total,
                    cartItems,
                }),
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.error || 'Error al processar la comanda');
            }

            // 4. Confirmar el pagament amb Stripe (redirigeix sol si va bé)
            const { error } = await stripe.confirmPayment({
                elements,
                confirmParams: {
                    return_url: `${window.location.origin}`,
                },
            });

            // Només arriba aquí si hi ha error (si va bé, Stripe redirigeix)
            if (error) {
                alert(error.message);
            }

        } catch (err) {
            console.error(err);
            alert(err.message);
        } finally {
            setLoading(false);
        }

    };

    return (
        <div className="checkout-page">
            <h1>Finalitzar comanda</h1>
            <div className="checkout-grid">

                <div className="checkout-form">
                    <div className="stepper">
                        {STEPS.map((step, index) => (
                            <div key={index} className={`stepper-step ${index === currentStep ? 'active' : ''} ${index < currentStep ? 'completed' : ''}`}>
                                <div className="stepper-circle">
                                    {index < currentStep ? '✓' : index + 1}
                                </div>
                                <span className="stepper-label">{step}</span>
                                {index < STEPS.length - 1 && <div className="stepper-line" />}
                            </div>
                        ))}
                    </div>

                    <form onSubmit={handleSubmit}>

                        {/* Step 1 — Direcció */}
                        <div style={{ display: currentStep === 0 ? 'block' : 'none' }}>
                            <AddressElement options={{ mode: 'shipping' }} />
                            <div className="step-actions">
                                <button className="paymentFormButtonBack" type="button">
                                    Tornar al carret
                                </button>
                                <button className="paymentFormButton" type="button" onClick={async () => {
                                    const addressElement = elements.getElement('address');
                                    const { value: addressValue, complete } = await addressElement.getValue();

                                    if (!complete) {
                                        alert('Si us plau, omple tota l\'adreça');
                                        return;
                                    }

                                    const { name, address } = addressValue;
                                    const formatted = `${name}, ${address.line1}${address.line2 ? ' ' + address.line2 : ''}, ${address.city}, ${address.postal_code}, ${address.country}`;
                                    setShippingAddress(formatted);
                                    setCurrentStep(1);
                                }}>
                                    Següent
                                </button>
                            </div>
                        </div>

                        {/* Step 2 — Observacions i instal·lació */}
                        <div style={{ display: currentStep === 1 ? 'block' : 'none' }}>

                            <div className="form-group align-center">
                                <label>Necessita instal·lació?</label>
                                <div className="toggle-row">
                                    <input
                                        type="checkbox"
                                        id="installation"
                                        name="installation"
                                        checked={formData.installation}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>

                            <div className="form-group align-center">
                                <label>Necessita enviament?</label>
                                <div className="toggle-row">
                                    <input
                                        type="checkbox"
                                        id="shipping"
                                        name="shipping"
                                        checked={formData.shipping}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label>Observacions</label>
                                <textarea
                                    name="observations"
                                    value={formData.observations}
                                    onChange={handleChange}
                                    rows="4"
                                    placeholder="Afegeix qualsevol comentari o indicació especial..."
                                />
                            </div>

                            <div className="step-actions">
                                <button className="paymentFormButtonBack" type="button" onClick={() => setCurrentStep(0)}>
                                    Anterior
                                </button>
                                <button
                                    className="paymentFormButton"
                                    type="button"
                                    onClick={() => setCurrentStep(2)}
                                    disabled={formData.installation && installationMessage !== ''}
                                >
                                    Següent
                                </button>
                            </div>
                        </div>

                        {/* Step 3 — Pagament */}
                        <div style={{ display: currentStep === 2 ? 'block' : 'none' }}>
                            <PaymentElement />
                            <div className="step-actions">
                                <button className="paymentFormButtonBack" type="button" onClick={() => setCurrentStep(1)}>
                                    Anterior
                                </button>
                                <button className="paymentFormButton" type="submit" disabled={!stripe || loading}>
                                    {loading ? 'Processant...' : `Pagar ${total.toFixed(2)}€`}
                                </button>
                            </div>
                        </div>

                    </form>
                </div>

                <div className="order-summary">
                    <h2>Resum de la comanda</h2>
                    <ul>
                        {cartItems.map(item => (
                            <li key={item.id}>
                                <span>{item.product.name} x{item.quantity}</span>
                                <span>{Number(item.subtotal).toFixed(2)}€</span>
                            </li>
                        ))}
                    </ul>
                    <p><span>Subtotal productes:</span><span>{subtotal.toFixed(2)}€</span></p>
                    {formData.installation && installationCost > 0 && (
                        <p><span>Instal·lació:</span><span>{installationCost}€</span></p>
                    )}
                    {formData.shipping && shippingCost > 0 && (
                        <p><span>Enviament:</span><span>{shippingCost}€</span></p>
                    )}
                    <p className="total-row">
                        <strong>Total:</strong>
                        <strong>{total.toFixed(2)}€</strong>
                    </p>
                </div>

            </div>
        </div>
    );
}

export default CheckoutForm;