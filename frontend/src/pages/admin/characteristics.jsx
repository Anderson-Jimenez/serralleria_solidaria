function Characteristics() {
  return (
    <div className="dashboard-content">
      <div className="caracteristics-content">
        <div className="table-container">
          <table>
            <thead>
              
              <tr className="tableFilters">
                <td colSpan={2}> <input type="text" name="" id="" /> </td>
                <td> 
                  <select name="" id="">

                  </select> 
                </td>
                <td><button>Afegir Seguretat +</button></td>
              </tr>

              <tr>
                <th><input type="checkbox" /></th>
                <th>ID</th>
                <th>Seguretat</th>
                <th>--</th>
              </tr>
              
            </thead>
            <tbody>

              <tr>
                <td><input type="checkbox" /></td>
                <td>18233</td>
                <td>Segurrro</td>
                <td></td>
              </tr>

            </tbody>
          </table>
        </div>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th><input type="checkbox" /></th>
                <th>ID</th>
                <th>Tipus</th>
                <th>ID Caracteristica</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><input type="checkbox" /></td>
                <td>18233</td>
                <td>Bombins</td>
                <td>1</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
export default Characteristics;