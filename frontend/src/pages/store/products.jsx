import { useEffect, useState } from "react";
import Title from "../../components/store/categories/pageTitle";
import ProductDisplayAll from "../../components/store/categories/productCategoryDisplayAll";


function Home() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetch(`http://localhost:8000/api/products`)
      .then(response => response.json())
      .then(data => setProducts(data.products))
      .catch(error => console.error(error));
    
    fetch(`http://localhost:8000/api/characteristicTypes`)
      .then(response => response.json())
      .then(data => {
        console.log(data);
        setCategories(data);
      })
      .catch(error => console.error(error));
  }, []);
  
  return (
    <div>
      <Title title={"Productes"}/>

      <h1 className="sectionCategoryTitle">Tots els productes</h1>
      <ProductDisplayAll products={products} categories={categories}/>
    </div>
  );
}

export default Home;