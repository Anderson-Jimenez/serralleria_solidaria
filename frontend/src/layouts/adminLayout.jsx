import { Outlet } from "react-router-dom";
import Sidebar from "../components/sidebar";
import Header from "../components/header";

function AdminLayout() {
  return (
    <div style={{ display: "flex" }}>
      <Sidebar />
      <div style={{ flex: 1 }}>
        <Header />
        <Outlet />
      </div>
    </div>
  );
}
//Outlet es basicamente donde se renderiza que contenido es, osea, si es contenido del dashboard, de la pagina productos...
export default AdminLayout; 