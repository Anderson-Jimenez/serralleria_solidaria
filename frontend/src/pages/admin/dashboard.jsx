function Dashboard() {
  return (
    <div className="dashboard-content">
      <h2 style={{ color: "#444", fontSize: "24px" }}>Resum de vendes</h2>
      
      <div className="mainGrid">
        <div className="basic-info-grid">
          <div className="basic-grid-content">
            {/* Productos */}
          </div>
          <div className="basic-grid-content">
            {/* solicitudes */}
          </div>
          <div className="basic-grid-content">
            {/* Categorias */}
          </div>
          <div className="basic-grid-content">
            {/* usuaris */}
          </div>
          
        </div>
        <div className="circular-chart-grid">
          {/* productes comprats per categories, productes per categories */}
        </div>
      </div>

      {/* num. ventes per mes, */}

    </div>
  );
}
export default Dashboard;