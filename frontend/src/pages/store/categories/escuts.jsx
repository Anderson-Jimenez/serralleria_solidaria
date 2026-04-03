import { useEffect, useState } from "react";
import Title from "../../../components/store/categories/pageTitle";
import ProductDisplay from "../../../components/store/categories/productCategoryDisplay";
import ProductDisplayAll from "../../../components/store/categories/productCategoryDisplayAll";


function Home() {
  const [products, setProducts] = useState([]);
  const [latestProducts, setLatestProducts] = useState([]);

  useEffect(() => {
    fetch(`http://localhost:8000/api/products/getProductCategory/Escut`)
      .then(response => response.json())
      .then(data => setProducts(data.products))
      .catch(error => console.error(error));

    fetch(`http://localhost:8000/api/products/getProductCategoryLatest/Escut`)
      .then(response => response.json())
      .then(data => setLatestProducts(data.products))
      .catch(error => console.error(error));
  }, []);

  return (
    <div>
      <Title />
      <h1 className="sectionCategoryTitle">Escuts Destacats</h1>
      <ProductDisplay products={products}/>

      <h1 className="sectionCategoryTitle">Ultims Escuts</h1>
      <ProductDisplay products={latestProducts}/>

      <h1 className="sectionCategoryTitle">Tots els escuts</h1>
      <ProductDisplayAll products={products}/>
    </div>
  );
}

export default Home;