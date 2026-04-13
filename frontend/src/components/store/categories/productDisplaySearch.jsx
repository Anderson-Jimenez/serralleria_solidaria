import React from 'react';
import { useRef, useState, useEffect } from 'react';
import { Star, ShoppingCart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';


function productDisplaySearch({ products, characteristics, title }) {

    const [productsFiltrats, setProductsFiltrats] = useState([]);
    const [savedFilters, setSavedFilters] = useState([]);
    const [dinamicFilters, setDinamicFilters] = useState({});
    const [savedText, setSavedText] = useState("");
    const navigate = useNavigate();


    useEffect(() => {
        setProductsFiltrats(products);
    }, [products]);

    useEffect(() => {
        console.log("Filtres actualitzats:", savedFilters);
    }, [savedFilters]);

    useEffect(() => {
        console.log("Filtres select actualitzats:", dinamicFilters);
    }, [dinamicFilters]);


    const handleProductClick = (productId) => {
        navigate(`/producte/${productId}`);
    };

    const saveFilter = (e) => {
        const filterValue = e.target.value;
        let updatedFilters;

        if (filterValue != "") {
            if (savedFilters.includes(filterValue)) {
                updatedFilters = savedFilters.filter(item => item !== filterValue);
            }
            else {
                updatedFilters = [...savedFilters, filterValue];
            }
        }
        else{
            updatedFilters = [...savedFilters];
        }


        setSavedFilters(updatedFilters);

        searchProductsInStore(savedText, updatedFilters, dinamicFilters);
    }

    const handleSelectChange = (e) => {
        const { name, value } = e.target;

        let updatedFilters = {...dinamicFilters, [name]: value};

        if (value === "") {
          delete updatedFilters[name];
        }

        setDinamicFilters(updatedFilters);

        searchProductsInStore(savedText, savedFilters, updatedFilters);
    };

    const searchProductsInStore = (text = savedText, filters = savedFilters, selectFilters = dinamicFilters) => {
        fetch(`http://localhost:8000/api/products/searchAllProductsInStore`, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify({
                searchText: text,
                filters: filters,
                selectFilters: selectFilters,
            })
        })
            .then(async response => {
                const data = await response.json();

                if (!response.ok) {
                    console.error("Error del servidor:", data);
                    return;
                }

                if (data.success) {
                    setProductsFiltrats(data.products);
                }
                else {
                    console.warn("El servidor diu que no ha tingut èxit:", data.message);
                }
            })
            .catch(error => console.error('Error en la petició:', error));
    }

    return (
        <section className='categoryProductDisplay'>
            <h2 className="title">Tots els {title}</h2>
            <div id='categoryProductDisplayAll'>
                <div className='displayFilters'>
                    <h2>Filtres</h2>
                    <div className="allFilters">
                        <div className="uniqueCharacteristic" key="sale_price">
                            <h3>Preu</h3>
                            <p>No vull fer mes o menys ara</p>
                        </div>
                        {characteristics.map((characteristic) => (
                            <div className="uniqueCharacteristic" key={characteristic.id}>
                                <h3>{characteristic.type}</h3>

                                {characteristic.filterType === 'checkbox' ?

                                    characteristic.characteristic && characteristic.characteristic.map((char) => (

                                        <div key={char.id}>
                                            <input type="checkbox" id={`check-${char.id}`} value={`${char.id}`} onChange={saveFilter} />
                                            <label htmlFor={`check-${char.id}`}>{char.description}</label>
                                        </div>

                                    )) : characteristic.filterType === 'select' ? (

                                        <select name={characteristic.id} key={characteristic.id} onChange={handleSelectChange}>
                                            <option value="" >Selecciona...</option>

                                            {characteristic.characteristic?.map((char) => (

                                                <option value={`${char.id}`} key={char.id}>
                                                    {char.description}
                                                </option>

                                            ))}

                                        </select>) : (
                                        <p>No vull fer mes o menys ara</p>
                                    )}


                            </div>

                        ))}
                    </div>
                </div>
                <div className='searchDisplay'>
                    <input type="text" placeholder='Buscar Escuts...' onChange={(e) => { setSavedText(e.target.value); }} onKeyUp={(e) => { searchProductsInStore(e.target.value, savedFilters, dinamicFilters) }} />
                    <div className='searchDisplayResult'>
                        {productsFiltrats.map((product) => (
                            <div
                                className="card"
                                key={product.id}
                                onClick={() => handleProductClick(product.id)}
                            >
                                {product.discount > 0 ? (
                                    <span className="badge discount">-{product.discount}%</span>
                                ) : product.is_new ? (
                                    <span className="badge new">Nou</span>
                                ) : null}

                                <div className="imageContainer">
                                    {product.primary_image ? (
                                        <img src={`http://localhost:8000/storage/${product.primary_image.path}`} alt={product.name} />
                                    ) : (
                                        <div className="noImage">No Image</div>
                                    )}
                                </div>

                                <div className="info">
                                    <h4>{product.name}</h4>
                                    <p className="desc">{product.description}</p>

                                    <div className="bottom">
                                        <div className="priceGroup">
                                            <span className="currentPrice">{product.sale_price}€</span>
                                            {product.discount > 0 && <span className="oldPrice">{product.base_price}€</span>}
                                        </div>

                                        <button
                                            className="cartBtn"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                            }}
                                        >
                                            <ShoppingCart size={20} color="white" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                </div>
            </div>
        </section>
    );
}

export default productDisplaySearch;