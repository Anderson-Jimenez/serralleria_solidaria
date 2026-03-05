import { Outlet } from "react-router-dom";
import Sidebar from "../components/sidebar";
import Header from "../components/header";

function StoreLayout() {
  return (
    <Outlet/>
  );
}
//Outlet es basicamente donde se renderiza que contenido es, osea, si es contenido del dashboard, de la pagina productos...
export default StoreLayout; 