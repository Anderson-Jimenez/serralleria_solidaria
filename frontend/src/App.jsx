import { Routes, Route } from "react-router-dom";

import StoreLayout from "./layouts/storeLayout";
import AdminLayout from "./layouts/adminLayout";

import Dashboard from "./pages/admin/dashboard";

//Store
import Home from "./pages/store/home";

import Products from "./pages/store/products";
import ProductDetail from "./pages/store/productDetails"

//Admin

//Categories
import CategoriesIndex from "./pages/admin/categories/index";
import CategoriesCreate from "./pages/admin/categories/create";
import CategoriesEdit from "./pages/admin/categories/edit";

//Characteristics
import CharacteristicsIndex from "./pages/admin/characteristics/index";
import CharacteristicsCreate from "./pages/admin/characteristics/create";
import CharacteristicsEdit from "./pages/admin/characteristics/edit";

import TypeIndex from "./pages/admin/characteristicTypes/index";
import TypeCreate from "./pages/admin/characteristicTypes/create";
import TypeEdit from "./pages/admin/characteristicTypes/edit";

import ProductsIndex from "./pages/admin/products/index";
import ProductsCreate from "./pages/admin/products/create";
import ProductsEdit from "./pages/admin/products/edit";

import PacksIndex from "./pages/admin/packs/index";
import PacksCreate from "./pages/admin/packs/create";
import PacksEdit from "./pages/admin/packs/edit";
import CustomSolutionForm from "./pages/store/customSolutionForm";  

//import Users from "./pages/admin/users";

//

function App() {
  return (
    <Routes>

      {/* TIENDA PÚBLICA */}
      <Route path="/" element={<StoreLayout />}>
        <Route index element={<Home />} />

        <Route path="products" element={<Products />} />
        <Route path="products/:title" element={<Products />} />
        <Route path="producte/:id" element={<ProductDetail />} />
        <Route path="*" element={<h1>404 - Página no encontrada</h1>} />
        <Route path="solucions_personalitzades" element={<CustomSolutionForm />} />
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

        <Route path="types">
          <Route index element={<TypeIndex />} />
          <Route path="create" element={<TypeCreate />} />
          <Route path="edit/:id" element={<TypeEdit />} />
        </Route>

        <Route path="packs">
          <Route index element={<PacksIndex />} />
          <Route path="create" element={<PacksCreate />} />
          <Route path="edit/:id" element={<PacksEdit />} />
        </Route>
      </Route>

    </Routes>
  );
}

export default App;