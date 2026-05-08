import { useEffect, useState } from "react";
import PrincipalPanell from "../../components/store/home/principalPanel";
import FeaturedProducts from "../../components/store/home/featuredProducts";
import WhoWeAre from "../../components/store/quiSom";
import CustomSolutionSeparator from "../../components/store/customSolutionsSeparator";

function Home() {
  const [data, setData] = useState({ products: [], featured_products: [] });

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch('http://localhost:8000/api/homescreens');
        if (!response.ok) throw new Error('Error en la API');
        const result = await response.json();
        setData(result);
      } catch (error) {
        console.error('Error al obtener datos:', error);
      }
    }
    fetchData();
  }, []);

  return (
    <div className="home-page">
      <PrincipalPanell />
      {/* Pasamos directamente la lista de destacados */}
      <FeaturedProducts products={data.featured_products} title={"Productes"}/>
      <CustomSolutionSeparator /> 
      <WhoWeAre />
    </div>
  );
}

export default Home;