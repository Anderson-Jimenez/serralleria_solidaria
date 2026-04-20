import { useEffect, useState } from "react";
import { User, BookAlert, Package, Tags } from "lucide-react";
import GraficBarres from '../../components/barChart';
import GraficLiniaVendes from '../../components/lineChart';


function Dashboard() {

  const [numProducts, setNumProducts] = useState("");
  const [numUsers, setNumUsers] = useState("");
  const [numRequests, setNumRequests] = useState("");
  const [numCategories, setNumCategories] = useState("");

  const dades_exemple = [
    { mes: 'Gen', valor: 97 },
    { mes: 'Feb', valor: 22 },
    { mes: 'Mar', valor: 39 },
    { mes: 'Abr', valor: 52 },
    { mes: 'Mai', valor: 21.5 },
    { mes: 'Jun', valor: 10 },
    { mes: 'Jul', valor: 39 },
    { mes: 'Ago', valor: 22 },
    { mes: 'Set', valor: 7.4 },
    { mes: 'Oct', valor: 78 },
    { mes: 'Nov', valor: 64 },
    { mes: 'Des', valor: 85 },
  ];

  useEffect(() => {
    fetch("http://localhost:8000/api/productes/countProducts")
      .then(response => response.json())
      .then(data => setNumProducts(data.products))
      .catch(error => console.error(error));
  }, []);

  return (
    <div className="dashboard-content">
      <h2 style={{ color: "#444", fontSize: "24px" }}>Resum de vendes</h2>

      <div className="basic-info-grid">
        <div className="basic-grid-content">
          {/* num Productos */}
          <div>
            <Package size={26} />
            <p>Núm.De Productes</p>
          </div>
          <p className="numberOf">{numProducts}</p>
        </div>
        <div className="basic-grid-content">
          {/* num solicitudes */}
          <BookAlert size={26} />
          <p>Núm.De Solicituds</p>
          <p className="numberOf">{numProducts}</p>

        </div>
        <div className="basic-grid-content">
          {/* num Categorias */}
          <Tags size={26} />
          <p>Núm.De Categories</p>
          <p className="numberOf">{numProducts}</p>

        </div>
        <div className="basic-grid-content">
          {/* num usuaris */}
          <User size={26} />
          <p>Núm.De Usuaris</p>
          <p className="numberOf">{numProducts}</p>

        </div>

      </div>

      <div className="mainGrid">
        <div className="circular-chart-grid">
          {/* productes comprats per categories, productes per categories */}
          <GraficLiniaVendes dades={dades_exemple} />
        </div>
      </div>

      {/* num. ventes per mes, */}

    </div>
  );
}
export default Dashboard;