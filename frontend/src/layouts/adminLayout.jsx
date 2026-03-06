import { Outlet } from "react-router-dom";
import Sidebar from "../components/sidebar";
import Header from "../components/header";

function AdminLayout() {
  return (
    <main style={{ display: "flex", minHeight: "100vh", width: "100%" }}>
      <Sidebar />
      <div style={{ display: "flex", flexDirection: "column", flex: 1, minWidth: 0, backgroundColor: "#F8F3F0" }}>
        <Header />
        <div style={{ padding: "30px", flex: 1 }}>
          <Outlet />
        </div>
      </div>
    </main>
  );
}

export default AdminLayout;