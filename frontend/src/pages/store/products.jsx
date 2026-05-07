import { useEffect, useState } from "react";
import { useParams } from 'react-router-dom';
import Title from "../../components/store/categories/pageTitle";
import ProductSearchCategories from "../../components/store/categories/productDisplaySearchCategory";
import ProductSearch from "../../components/store/categories/productDisplaySearch";
import FeaturedProducts from "../../components/store/home/featuredProducts";
import CustomSolutionSeparator from "../../components/store/customSolutionsSeparator";



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

    console.log(products);

  }, [title]);

  return (
    <div>
      <Title title={changedTitle} />

      <FeaturedProducts products={products} title={changedTitle} />

      <CustomSolutionSeparator /> 

      { title ? <ProductSearchCategories products={products} characteristics={characteristicType} title={changedTitle} /> : <ProductSearch products={products} characteristics={characteristicType} title={changedTitle} />}

    </div>
  );
}

export default Products;