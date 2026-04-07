import React from 'react';
import { useRef, useState, useEffect } from 'react';
import { Star, ShoppingCart } from 'lucide-react';

function productCategoryDisplayAll({ products, categories }) {

    const [productsFiltrats, setProductsFiltrats] = useState([]);
    const [savedFilters, setSavedFilters] = useState([]);

    useEffect(() => {
        setProductsFiltrats(products);
    }, [products]);

    const saveFilter = (e) => {
        let filterValue = e.target.value;

        if (savedFilters.includes(filterValue)) {
            const updatedFilters = savedFilters.filter(item => item !== filterValue);
            setSavedFilters(prevLlista => [...prevLlista, updatedFilters]);
        }
        else {
            setSavedFilters(prevLlista => [...prevLlista, filterValue]);
        }

        searchProductsInStore(e);
    }

    const searchProductsInStore = (e) => {
        let text = e.target.value;

        fetch(`http://localhost:8000/api/products/searchProductsInStore`, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify({
                searchText: text || "",
                filters: savedFilters || [],
                category: "Escut",
            })
        })
            .then(async response => {
                const data = await response.json();

                if (!response.ok) {
                    // Si la resposta no és 200, imprimim tot l'objecte per saber què falla
                    console.error("Error del servidor:", data);
                    return;
                }

                if (data.success) {
                    setProductsFiltrats(data.products);
                }
            })
            .catch(error => console.error('Error en la petició:', error));

        /*
        fetch(`http://localhost:8000/api/products/searchProductsInStore/${'Escut'}/${text}`, {
                method: 'GET',
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },
                body: JSON.stringify({
                    searchText: text,
                    filters: savedFilters // Enviem l'array directament
                })
            })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        setProductsFiltrats(data.products);
                    } else {
                        console.error('Error en la lògica del servidor:', data.message);
                    }
                })
                .catch(error => console.error('Error en la petició:', error));
        */
    }

    return (
        <section id='categoryProductDisplayAll' className='categoryProductDisplay'>
            <div className='displayFilters'>
                <h2>Filtres</h2>
                <div className="allFilters">
                    {categories.map((category) => (
                        <div className="uniqueCharacteristic" key={category.id}>
                            <h3>{category.type}</h3>

                            {category.filterType === 'checkbox' ?

                                category.characteristic && category.characteristic.map((char) => (

                                    <div key={char.id}>
                                        <input type="checkbox" id={`check-${char.id}`} value={`${char.id}`} onChange={saveFilter} />
                                        <label htmlFor={`check-${char.id}`}>{char.description}</label>
                                    </div>

                                )) : category.filterType === 'select' ? (

                                    <select name={`select-${category.id}`} key={category.id}>
                                        <option value="" >Selecciona...</option>

                                        {category.characteristic?.map((char) => (

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
                <input type="text" placeholder='Buscar Escuts...' onChange={searchProductsInStore} />
                <div className='searchDisplayResult'>
                    {productsFiltrats.map((product) => (
                        <div className='productDisplay'>
                            <div className='productImg'>


                            </div>
                            <div className='productContent'>
                                <div><Star fill='#ffd900' /> <Star fill='#ffd900' /> <Star fill='#ffd900' /> <Star fill='#ffd900' /> <Star fill='#ffd900' /></div>
                                <h4>{product.name}</h4>
                                <p>{product.description}</p>
                                <div className='buyProduct'>
                                    <p>{product.sale_price}€</p>
                                    <ShoppingCart />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

            </div>
        </section>
    );
}

export default productCategoryDisplayAll;