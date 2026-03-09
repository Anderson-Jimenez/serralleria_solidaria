import { Routes, Route } from "react-router-dom";

import StoreLayout from "./layouts/storeLayout";
import AdminLayout from "./layouts/adminLayout";

import Home from "./pages/store/home";
import Dashboard from "./pages/admin/dashboard";

//Categories
import CategoriesIndex from "./pages/admin/categories/index";
import CategoriesCreate from "./pages/admin/categories/create";
import CategoriesEdit from "./pages/admin/categories/edit";

//Characteristics
import CharacteristicsIndex from "./pages/admin/characteristics/index";
import CharacteristicsCreate from "./pages/admin/characteristics/create";
import CharacteristicsEdit from "./pages/admin/characteristics/edit";

import ProductsIndex from "./pages/admin/products/index";
import ProductsCreate from "./pages/admin/products/create";
import ProductsEdit from "./pages/admin/products/edit";

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

        <Route path="characteristics">
          <Route index element={<CharacteristicsIndex />} />
          <Route path="create" element={<CharacteristicsCreate />} />
          <Route path="edit/:id" element={<CharacteristicsEdit />} />
        </Route>

        <Route path="packs" element={<Packs />} />
      </Route>

    </Routes>
  );
}

export default App;