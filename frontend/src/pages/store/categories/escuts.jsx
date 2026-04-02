import { useEffect, useState } from "react";
import Title from "../../../components/store/categories/pageTitle";
import ProductDisplay from "../../../components/store/categories/productCategoryDisplay";

function Home() {
  const [products, setProducts] = useState([]);


  useEffect(() => {
    fetch(`http://localhost:8000/api/products/getProductCategory/Escut`)
      .then(response => response.json())
      .then(data => setProducts(data.products))
      .catch(error => console.error(error));
  }, []);

  return (
    <div>
      <Title />

      <ProductDisplay products={products}/>
    </div>
  );
}

export default Home;