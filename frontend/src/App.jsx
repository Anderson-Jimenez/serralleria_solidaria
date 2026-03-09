import { Routes, Route } from "react-router-dom";

import StoreLayout from "./layouts/storeLayout";
import AdminLayout from "./layouts/adminLayout";

import Home from "./pages/store/home";
import Dashboard from "./pages/admin/dashboard";

//Categories
import CategoriesIndex from "./pages/admin/categories/index";
import CategoriesCreate from "./pages/admin/categories/create";
import CategoriesEdit from "./pages/admin/categories/edit";

import ProductsIndex from "./pages/admin/products/index";
import ProductsCreate from "./pages/admin/products/create";
import ProductsEdit from "./pages/admin/products/edit";

import Characteristics from "./pages/admin/characteristics";
import Packs from "./pages/admin/packs";

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

        <Route path="categories">
          <Route index element={<CategoriesIndex />} />
          <Route path="create" element={<CategoriesCreate />} />
          <Route path="edit/:id" element={<CategoriesEdit />} /> {/*segun fuentes de inteligencias artificiales, es asi, no encontre */}
        </Route>
        <Route path="products">
          <Route index element={<ProductsIndex />}/>
          <Route path="create" element={<ProductsCreate />}/>
          <Route path="edit/:id" element={<ProductsEdit />}/>
        </Route>

        <Route path="packs" element={<Packs />} />
        <Route path="characteristics" element={<Characteristics />} />
      </Route>

    </Routes>
  );
}

export default App;