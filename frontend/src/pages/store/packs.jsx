import { useEffect, useState } from "react";
import { useParams } from 'react-router-dom';
import Title from "../../components/store/categories/pageTitle";
import ProductSearchCategories from "../../components/store/categories/productDisplaySearchCategory";
import ProductSearch from "../../components/store/categories/productDisplaySearch";
import FeaturedProducts from "../../components/store/home/featuredProducts";
import CustomSolutionSeparator from "../../components/store/customSolutionsSeparator";



function Products() {

  const [packs, setPacks] = useState([]);
  const [characteristicType, setCharacteristicTypes] = useState([]);
  const [changedTitle, setChangedTitle] = useState("");


  useEffect(() => {

    fetch('http://localhost:8000/api/packs')
      .then(res => res.json())
      .then(data => setPacks(data))
      .catch(console.error);


    fetch(`http://localhost:8000/api/characteristic-types`)
      .then(res => res.json())
      .then(data => setCharacteristicTypes(data))
      .catch(console.error);

    console.log(packs);

  }, []);

  return (
    <div>
      <Title title='Packs' />

      <FeaturedProducts products={packs} title='Packs' />

      <CustomSolutionSeparator /> 

      <ProductSearch products={packs} characteristics={characteristicType} title='Packs' />

    </div>
  );
}

export default Products;