import { useEffect, useState } from "react";
import { useParams } from 'react-router-dom';
import Title from "../../components/store/categories/pageTitle";
import ProductDisplayAll from "../../components/store/categories/productCategoryDisplayAll";
import FeaturedProducts from "../../components/store/home/featuredProducts";
import GeneralProducts from "../../components/store/home/generalProducts";



function Products() {

  const { title } = useParams();

  const [products, setProducts] = useState([]);
  const [latestProducts, setLatestProducts] = useState([]);
  const [characteristicType, setCharacteristicTypes] = useState([]);


  if (!title) {
    useEffect(() => {
      fetch(`http://localhost:8000/api/products`)
        .then(response => response.json())
        .then(data => setProducts(data.products))
        .catch(error => console.error(error));

      fetch("http://localhost:8000/api/productes/getProductLatest")
        .then(response => response.json())
        .then(data => setLatestProducts(data.products))
        .catch(error => console.error(error));

      fetch(`http://localhost:8000/api/characteristic-types`)
        .then(response => response.json())
        .then(data => {
          console.log(data);
          setCharacteristicTypes(data);
        })
        .catch(error => console.error(error));
    }, []);
  }
  else {
    useEffect(() => {
      fetch(`http://localhost:8000/api/products/getProductCategory/${title}`)
        .then(response => response.json())
        .then(data => setProducts(data.products))
        .catch(error => console.error(error));

      fetch(`http://localhost:8000/api/products/getProductCategoryLatest/${title}`)
        .then(response => response.json())
        .then(data => setLatestProducts(data.products))
        .catch(error => console.error(error));

      fetch(`http://localhost:8000/api/characteristic-types`)
        .then(response => response.json())
        .then(data => {
          console.log(data);
          setCharacteristicTypes(data);
        })
        .catch(error => console.error(error));
    }, []);
  }


  return (
    <div>
      <Title title={title} />
      <FeaturedProducts products={products} title={title}/>

      <GeneralProducts products={latestProducts} title={"Ultims " + title} />

      <ProductDisplayAll products={products} characteristics={characteristicType} title={title}/>
    </div>
  );
}

export default Products;