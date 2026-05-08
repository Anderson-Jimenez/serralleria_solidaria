import { Outlet, useLocation } from "react-router-dom";
import { useEffect } from "react";
import Navbar from "../components/store/navbar";
import Footer from "../components/store/footer";
import { CartProvider } from "../contexts/CartContext";

function StoreLayout() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <CartProvider>
      <div className="main-layout">
        <Navbar />
        <main className="content-area">
          <Outlet />
        </main>
        <Footer />
      </div>
    </CartProvider>
  );
}

export default StoreLayout;