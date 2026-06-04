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
      {/* ♿ h3 sense h2 previ salta nivell de heading — canviat a h2 */}
      <h2 className="dashboard-subtitle">Administra totes les peticions</h2>

      <div className="caracteristics-content">
        <div className="table-container">

          <div className="tableFilters">
            {/* ♿ select sense label associat */}
            <label htmlFor="statusFilter" className="sr-only">Filtrar per estat</label>
            <select
              id="statusFilter"
              className="status-filter"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              aria-label="Filtrar peticions per estat"
            >
              <option value="all">Tots els estats</option>
              <option value="pending">Pendent</option>
              <option value="in_progress">En procés</option>
              <option value="sent">Enviat</option>
              <option value="solved">Resolt</option>
              <option value="rejected">Rebutjat</option>
            </select>
          </div>

          {/* ♿ caption descriu la taula per a lectores de pantalla */}
          {/* ♿ aria-live anuncia canvis quan es filtra */}
          <table aria-label="Llistat de peticions de solucions personalitzades">
            <caption className="sr-only">
              Peticions de solucions personalitzades — {filteredData.length} resultats
            </caption>
            <thead>
              {/* ♿ scope="col" identifica les columnes per a lectores de pantalla */}
              <tr>
                <th scope="col">ID</th>
                <th scope="col">Usuari</th>
                <th scope="col">Email</th>
                <th scope="col">Assumpte</th>
                <th scope="col">Estat</th>
                <th scope="col">Accions</th>
              </tr>
            </thead>

            <tbody aria-live="polite" aria-relevant="all">
              {filteredData.length > 0 ? (
                filteredData.map((item) => (
                  <tr key={item.id}>
                    <td>{item.id}</td>
                    <td>{item.user_id ?? "Desconegut"}</td>
                    <td>{item.user_email}</td>
                    <td>{item.user_issue}</td>

                    <td>
                      {/* ♿ aria-label en l'span perquè el lector llegeixi l'estat clarament */}
                      <span
                        className={statusClasses[item.status] || ""}
                        aria-label={`Estat: ${statusLabels[item.status] || item.status}`}
                      >
                        {statusLabels[item.status] || item.status}
                      </span>
                    </td>

                    <td className="actions">
                      {/* ♿ aria-label descriptiu perquè l'icona sola no és suficient */}
                      <Link
                        to={`/admin/peticions/${item.id}`}
                        className="action-icon edit"
                        aria-label={`Veure detalls de la petició ${item.id} de ${item.user_email}`}
                      >
                        <Eye size={18} aria-hidden="true" />
                        Veure Detalls
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  {/* ♿ role="status" anuncia el missatge d'estat sense resulats */}
                  <td colSpan="6" style={{ textAlign: "center", padding: "20px" }} role="status">
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