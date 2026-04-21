import { useEffect, useState } from "react";
import { User, BookAlert, Package, Tags } from "lucide-react";
import GraficLiniaVendes from '../../components/lineChart';

function Dashboard() {

  const [numProducts, setNumProducts] = useState("");
  const [numUsers, setNumUsers] = useState("");
  const [numRequests, setNumRequests] = useState("");
  const [numCategories, setNumCategories] = useState("");
  const [ventesPerMes, setVentesPerMes] = useState([]);

  const dades_exemple = [
    { mes: 'Gen', valor: 97 },
    { mes: 'Feb', valor: 22 },
    { mes: 'Mar', valor: 39 },
    { mes: 'Abr', valor: 52 },
    { mes: 'Mai', valor: 21.5 },
    { mes: 'Jun', valor: 0 },
    { mes: 'Jul', valor: 0 },
    { mes: 'Ago', valor: 0 },
    { mes: 'Set', valor: 0 },
    { mes: 'Oct', valor: 0 },
    { mes: 'Nov', valor: 0 },
    { mes: 'Des', valor: 0 },
  ];

  useEffect(() => {
    fetch("http://localhost:8000/api/productes/countProducts")
      .then(response => response.json())
      .then(data => setNumProducts(data.products))
      .catch(error => console.error(error));
  }, []);

  return (
    <div className="dashboard-content">
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
            <div>
              <BookAlert size={26} />
              <p>Núm.De Solicituds</p>
            </div>
            <p className="numberOf">{numProducts}</p>

          </div>
          <div className="basic-grid-content">
            {/* num Categorias */}
            <div>
              <Tags size={26} />
              <p>Núm.De Categories</p>
            </div>
            <p className="numberOf">{numProducts}</p>

          </div>
          <div className="basic-grid-content">
            {/* num usuaris */}
            <div>
              <User size={26} />
              <p>Núm.De Usuaris</p>
            </div>
            <p className="numberOf">{numProducts}</p>

          </div>
      </div>

      <div className="mainGrid">
        <div className="linear-chart-grid">
          {/* num. ventes per mes, */}

          <GraficLiniaVendes dades={dades_exemple} />
        </div>
      </div>

      {/* productes comprats per categories, productes per categories */}


    </div>
  );
}
export default Dashboard;