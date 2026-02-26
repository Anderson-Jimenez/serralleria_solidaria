import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import Card from "../components/Card";

function Dashboard() {
  return (
    <div style={{ display: "flex" }}>
      <Sidebar />

      <div style={{ flex: 1, padding: "20px" }}>
        <Navbar />

        <h2>Dashboard</h2>

        <div style={{ display: "flex", gap: "20px" }}>
          <Card title="Ventas Hoy" value="$1,200" />
          <Card title="Usuarios" value="350" />
          <Card title="Pedidos" value="89" />
        </div>
      </div>
    </div>
  );
}

export default Dashboard;