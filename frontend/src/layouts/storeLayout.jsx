import { Outlet, useLocation } from "react-router-dom";
import { useEffect } from "react";
import Navbar from "../components/store/navbar";
import Footer from "../components/store/footer";

function StoreLayout() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  //hace scroll hacia la parte de arriba de la pagina
  return (
    <div className="main-layout">
      <Navbar />
      <main className="content-area">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export default StoreLayout;