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

  const [changedTitle, setChangedTitle] = useState("");


  useEffect(() => {
    const productsUrl = title ? `http://localhost:8000/api/products/getProductCategory/${title}`:`http://localhost:8000/api/products`;

    const latestUrl = title ? `http://localhost:8000/api/products/getProductCategoryLatest/${title}` : `http://localhost:8000/api/productes/getProductLatest`;

    fetch(productsUrl)
      .then(res => res.json())
      .then(data => setProducts(data.products))
      .catch(console.error);

    fetch(latestUrl)
      .then(res => res.json())
      .then(data => setLatestProducts(data.products))
      .catch(console.error);

    fetch(`http://localhost:8000/api/characteristic-types`)
      .then(res => res.json())
      .then(data => setCharacteristicTypes(data))
      .catch(console.error);

    setChangedTitle(title || "Productes");

  });

  return (
    <div>
      <Title title={changedTitle} />
      <FeaturedProducts products={products} title={changedTitle} />

      <GeneralProducts products={latestProducts} title={"Ultims " + changedTitle} />

      <ProductDisplayAll products={products} characteristics={characteristicType} title={changedTitle} />
    </div>
  );
}

export default Products;