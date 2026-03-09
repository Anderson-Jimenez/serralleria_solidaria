import { useState } from "react";
import { useNavigate } from "react-router-dom";

function ProductsCreate() {
    const navigate = useNavigate();

    // Estados basados en la estructura de la tabla Product
    const [code, setCode] = useState("");
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [stock, setStock] = useState(0);
    const [highlightedImg, setHighlightedImg] = useState("");
    const [price, setPrice] = useState(0); // Columna "€"
    const [discount, setDiscount] = useState(0);
    const [highlighted, setHighlighted] = useState(0);
    const [categoryId, setCategoryId] = useState("");
    const [productType, setProductType] = useState("simple");

    const handleSubmit = (e) => {
        e.preventDefault();

        fetch("http://localhost:8000/api/products", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify({
                code,
                name,
                description,
                stock,
                highlighted_img: highlightedImg,
                price,
                discount,
                highlighted,
                category_id: categoryId,
                product_type: productType
            })
        })
        .then(async res => {
            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(JSON.stringify(errorData));
            }
            return res.json();
        })
        .then(data => {
            console.log('Producto creado:', data);
            navigate("/admin/products");
        })
        .catch(err => {
            console.error('Error detallado:', err);
            alert('Error al crear el producto. Revisa la consola.');
        });
    };

    return (
        <div className="edit-form">
            <h1 className="dashboard-title">Crear Producte</h1>
            <h3 className="dashboard-subtitle">Afegeix un nou producte al catàleg</h3>
            
            <form onSubmit={handleSubmit} className="flex-column">
                
                <div className="flex">
                    <div className="w50 flex-column">
                        <label>Codi:</label>
                        <input type="text" value={code} onChange={(e) => setCode(e.target.value)} required />
                    </div>
                    <div className="w50 flex-column">
                        <label>Nom:</label>
                        <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
                    </div>
                </div>

                <div className="flex">
                    <div className="w50 flex-column">
                        <label>Preu (€):</label>
                        <input type="number" step="0.01" value={price} onChange={(e) => setPrice(e.target.value)} />
                    </div>
                    <div className="w50 flex-column">
                        <label>Descompte (%):</label>
                        <input type="number" value={discount} onChange={(e) => setDiscount(e.target.value)} />
                    </div>
                </div>

                <div className="flex">
                    <div className="w50 flex-column">
                        <label>Stock:</label>
                        <input type="number" value={stock} onChange={(e) => setStock(e.target.value)} />
                    </div>
                    <div className="w50 flex-column">
                        <label>Tipus de Producte:</label>
                        <select value={productType} onChange={(e) => setProductType(e.target.value)}>
                            <option value="simple">Simple</option>
                            <option value="pack">Pack</option>
                        </select>
                    </div>
                </div>

                <div className="flex">
                    <div className="w50 flex-column">
                        <label>ID Categoria:</label>
                        <input type="number" value={categoryId} onChange={(e) => setCategoryId(e.target.value)} />
                    </div>
                    <div className="w50 flex-column">
                        <label>Destacat:</label>
                        <select value={highlighted} onChange={(e) => setHighlighted(Number(e.target.value))}>
                            <option value="0">No</option>
                            <option value="1">Sí</option>
                        </select>
                    </div>
                </div>

                <label>URL Imatge Destacada:</label>
                <input type="text" value={highlightedImg} onChange={(e) => setHighlightedImg(e.target.value)} />

                <label>Descripció:</label>
                <textarea value={description} onChange={(e) => setDescription(e.target.value)} />

                <input type="submit" value="Guardar Producte" style={{marginTop: '20px'}} />
            </form>
        </div>
    );
}

export default ProductsCreate;