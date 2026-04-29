import { useEffect, useState } from "react";
import { Eye } from "lucide-react";
import { Link } from "react-router-dom";

function CustomSolutionPetitions() {
  const [data, setData] = useState([]);
  const [statusFilter, setStatusFilter] = useState("all");

  const statusClasses = {
    pending: "pendingStatus",
    in_progress: "inProgressStatus",
    sent: "sentStatus",
    solved: "solvedStatus",
    rejected: "rejectedStatus",
  };

  const statusLabels = {
    pending: "Pendent",
    in_progress: "En procés",
    sent: "Enviat",
    solved: "Resolt",
    rejected: "Rebutjat",
  };

  useEffect(() => {
    fetch("http://localhost:8000/api/solucionsPersonalitzades")
      .then((response) => response.json())
      .then((res) => {
        if (res.success) {
          setData(res.data);
        }
      })
      .catch((error) => console.error(error));
  }, []);

  const filteredData =
    statusFilter === "all"
      ? data
      : data.filter((item) => item.status === statusFilter);

  return (
    <div className="dashboard-caracteristics">
      <h1 className="dashboard-title">Peticions de Solucions Personalitzades</h1>
      <h3 className="dashboard-subtitle">Administra totes les peticions</h3>

      <div className="caracteristics-content">
        <div className="table-container">

          <div className="tableFilters">
            <select
              className="status-filter"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">Tots els estats</option>
              <option value="pending">Pendent</option>
              <option value="in_progress">En procés</option>
              <option value="sent">Enviat</option>
              <option value="solved">Resolt</option>
              <option value="rejected">Rebutjat</option>
            </select>
          </div>

          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Usuari</th>
                <th>Email</th>
                <th>Assumpte</th>
                <th>Estat</th>
                <th>Accions</th>
              </tr>
            </thead>

            <tbody>
              {filteredData.length > 0 ? (
                filteredData.map((item) => (
                  <tr key={item.id}>
                    <td>{item.id}</td>
                    <td>{item.user_id ?? "Desconegut"}</td>
                    <td>{item.user_email}</td>
                    <td>{item.user_issue}</td>

                    <td>
                      <span className={statusClasses[item.status] || ""}> {statusLabels[item.status] || item.status}</span>
                    </td>

                    <td className="actions">
                        <Link to={`/admin/peticions/${item.id}`} className="action-icon edit" title="Veure Detalls">
                          <Eye size={18} /> Veure Detalls
                        </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" style={{ textAlign: "center", padding: "20px" }}>
                    No hi ha peticions disponibles.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default CustomSolutionPetitions;