import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import { Link } from "react-router-dom";

function PacksEdit() {

    const { id } = useParams();

    const [code, setCode] = useState("");
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState("");
    const [stock, setStock] = useState("");
    const [discount, setDiscount] = useState("");
    const [highlighted, setHighlighted] = useState("");
    const [category_id, setCategoty_id] = useState("");
    const [product_type, setProduct_id] = useState("");


    const navigate = useNavigate();
    useEffect(() => {
        fetch(`http://localhost:8000/api/packs/${id}`)
            .then(res => res.json())
            .then(data => {
                setCode(data.code);
                setName(data.name);
                setDescription(data.description);
                setPrice(data.price);
                setStock(data.stock);
                setDiscount(data.discount);
                setHighlighted(data.highlighted);
                setCategoty_id(data.category_id);
                setProduct_id(data.product_type);

            });
    }, [id]);

    const handleSubmit = (e) => {
        e.preventDefault();
        fetch(`http://localhost:8000/api/packs/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                code,
                name,
                description,
                price,
                stock,
                discount,
                highlighted,
                category_id,
                product_type,
            })
        })
            .then(res => res.json())
            .then(() => {
                navigate("/admin/packs");
            })
            .catch(err => console.error(err));
    };

    return (
        <div className="edit-form">
            <h1 className="dashboard-title">Editar la caracteristica</h1>
            <h3 className="dashboard-subtitle">Modifica les dades de la caracteristica</h3>

            <form onSubmit={handleSubmit} className="flex-column">
                <div className="flex">
                    <div className="w50 flex-column">
                        <label htmlFor="code">Codi: </label>
                        <input type="text" value={code} onChange={(e) => setCode(e.target.value)} />
                    </div>
                    <div className="w50 flex-column">
                        <label htmlFor="name">Nom: </label>
                        <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
                    </div>
                </div>

                <label htmlFor="description">Descripció: </label>
                <textarea value={description} onChange={(e) => setDescription(e.target.value)} />

                <div className="flex">
                    <div className="w50 flex-column">
                        <label htmlFor="price">Preu: </label>
                        <input type="text" value={price} onChange={(e) => setPrice(e.target.value)} />
                    </div>
                    <div className="w50 flex-column">
                        <label htmlFor="stock">Stock: </label>
                        <input type="text" value={stock} onChange={(e) => setStock(e.target.value)} />
                    </div>
                </div>

                <div className="flex">
                    <div className="w50 flex-column">
                        <label htmlFor="discount">Descompte: </label>
                        <input type="text" value={discount} onChange={(e) => setDiscount(e.target.value)} />
                    </div>
                </div>
                
                <label htmlFor="category">Descripció: </label>
                <textarea value={category_id} onChange={(e) => setCategory_id(e.target.value)} />

                <label htmlFor="product_type">Tipus Producte: </label>
                <textarea value={product_type} onChange={(e) => setProduct_type(e.target.value)} />


                <input type="submit" value="Guardar" />
            </form>
        </div>
    );
}
export default PacksEdit;