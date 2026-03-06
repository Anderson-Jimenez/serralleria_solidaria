import { Outlet } from "react-router-dom";
//import Header from "../components/header";
//import Footer from "../components/footer";

function StoreLayout() {
  return (
    <div>
      <main>
        <Outlet />
      </main>
    </div>
  );
}

export default StoreLayout;