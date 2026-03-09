function Characteristics() {
  return (
    <div className="dashboard-content">
      <h1>Caracteristiques</h1>
      <div className="caracteristics-content">
        <div className="table-container">

          <div className="tableFilters">
            <input type="text" name="" id="" placeholder="Buscar Caracteristiques..."/>
                
            <select name="" id="">

            </select> 
               
            <button>Afegir Seguretat +</button>
          </div>

          <table>
            <thead>
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
          <div className="tableFilters">
            <input type="text" name="" id="" placeholder="Buscar Caracteristiques..."/>
                
            <select name="" id="">

            </select> 
               
            <button>Afegir Tipus +</button>
          </div>
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