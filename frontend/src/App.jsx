import { Routes, Route } from "react-router-dom";

import StoreLayout from "./layouts/storeLayout";
import AdminLayout from "./layouts/adminLayout";

import Home from "./pages/store/home";
import Dashboard from "./pages/admin/dashboard";
import Categories from "./pages/admin/categories";
import Products from "./pages/admin/products";
import Packs from "./pages/admin/packs";
import Characteristics from "./pages/admin/characteristics";
//import Users from "./pages/admin/users";

function App() {
  return (
    <Routes>

      {/* TIENDA PÚBLICA */}
      <Route path="/" element={<StoreLayout />}>
        <Route index element={<Home />} />
      </Route>

      {/* PANEL ADMIN */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="categories" element={<Categories />} />
        <Route path="products" element={<Products />} />
        <Route path="packs" element={<Packs />} />
        <Route path="characteristics" element={<Characteristics />} />
      </Route>

    </Routes>
  );
}

export default App;