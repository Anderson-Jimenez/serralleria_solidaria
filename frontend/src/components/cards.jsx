function Card({ title, value }) {
  return (
    <div style={{
      background: "#fff",
      padding: "20px",
      borderRadius: "8px",
      boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
      flex: 1
    }}>
      <h4>{title}</h4>
      <p style={{ fontSize: "24px", fontWeight: "bold" }}>
        {value}
      </p>
    </div>
  );
}

export default Card;