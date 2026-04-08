import { useEffect, useState } from "react";
import Title from "../../../components/store/categories/pageTitle";
import ProductDisplay from "../../../components/store/categories/productCategoryDisplay";
import ProductDisplayAll from "../../../components/store/categories/productCategoryDisplayAll";
import FeaturedProducts from "../../../components/store/home/featuredProducts";
import GeneralProducts from "../../../components/store/home/generalProducts";



function Shields() {
  const [products, setProducts] = useState([]);
  const [latestProducts, setLatestProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetch(`http://localhost:8000/api/products/getProductCategory/Escut`)
      .then(response => response.json())
      .then(data => setProducts(data.products))
      .catch(error => console.error(error));

    fetch(`http://localhost:8000/api/products/getProductCategoryLatest/Escut`)
      .then(response => response.json())
      .then(data => setLatestProducts(data.products))
      .catch(error => console.error(error));
    
    fetch(`http://localhost:8000/api/characteristic-types`)
      .then(response => response.json())
      .then(data => {
        console.log(data);
        setCategories(data);
      })
      .catch(error => console.error(error));
  }, []);
  
  return (
    <div>
      <Title title={"Escuts"} />
      <FeaturedProducts products={products} />

      <GeneralProducts products={latestProducts} title={"Ultims Escuts"}/>

      <h1 className="sectionCategoryTitle">Tots els escuts</h1>
      <ProductDisplayAll products={products} categories={categories}/>
    </div>
  );
}

export default Shields;