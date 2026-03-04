function Sidebar() {
  return (
    <div style={{
      width: "200px",
      background: "#111",
      color: "#fff",
      minHeight: "100vh",
      padding: "20px"
    }}>
      <h3>Mi Tienda</h3>
      <ul style={{ listStyle: "none", padding: 0 }}>
        <li>Dashboard</li>
        <li>Productos</li>
        <li>Pedidos</li>
        <li>Usuarios</li>
      </ul>
    </div>
  );
}

export default Sidebar;