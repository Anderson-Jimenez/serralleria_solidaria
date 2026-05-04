import { Routes, Route } from "react-router-dom";
import StoreLayout from "./layouts/storeLayout";
import AdminLayout from "./layouts/adminLayout";
import Dashboard from "./pages/admin/dashboard";

//Store
import Home from "./pages/store/home";
import Products from "./pages/store/products";
import ProductDetail from "./pages/store/productDetails";
import Profile from "./pages/store/profile";

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

import UsersIndex from "./pages/admin/users/index";
import UsersCreate from "./pages/admin/users/create";
import UsersEdit from "./pages/admin/users/edit";

import OrdersIndex from "./pages/admin/orders/index";
import OrdersPDF from "./pages/admin/orders/orderPDF";


import CustomSolutionForm from "./pages/store/customSolutionForm";
import CustomSolutionPetitions from "./pages/admin/customSolutions/index";
import CustomSolutionDetails from "./pages/admin/customSolutions/show";
import AdminRoute from './components/AdminRoute';

function App() {
  return (
    <Routes>
      {/* TIENDA PÚBLICA */}
      <Route path="/" element={<StoreLayout />}>
        <Route index element={<Home />} />
        <Route path="products" element={<Products />} />
        <Route path="products/:title" element={<Products />} />
        <Route path="producte/:id" element={<ProductDetail />} />
        <Route path="solucions_personalitzades" element={<CustomSolutionForm />} />
        <Route path="profile" element={<Profile />} />
        <Route path="*" element={<h1>404 - Página no encontrada</h1>} />
        
      </Route>


      {/* PANEL ADMIN - protegit */}
      <Route path="/admin" element={
          <AdminRoute>
              <AdminLayout />
          </AdminRoute>
      } >
        <Route index element={<Dashboard />} />
        <Route path="/admin/peticions/:id" element={<CustomSolutionDetails />} />
        <Route path="categories">
          <Route index element={<CategoriesIndex />} />
          <Route path="create" element={<CategoriesCreate />} />
          <Route path="edit/:id" element={<CategoriesEdit />} />
        </Route>
        <Route path="products">
          <Route index element={<ProductsIndex />} />
          <Route path="create" element={<ProductsCreate />} />
          <Route path="edit/:id" element={<ProductsEdit />} />
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
        <Route path="orders">
          <Route index element={<OrdersIndex />} />
        </Route>
        <Route path="users">
          <Route index element={<UsersIndex />} />
          <Route path="create" element={<UsersCreate />} />
          <Route path="edit/:id" element={<UsersEdit />} />
        </Route>
        <Route path="solucionsPersonalitzades" element={<CustomSolutionPetitions />} />
      </Route>

      <Route path="/orders/pdf/:id" element={<OrdersPDF />} />

    </Routes>
  );
}

export default App;