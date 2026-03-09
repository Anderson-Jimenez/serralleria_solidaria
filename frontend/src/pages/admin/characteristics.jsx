function Characteristics() {
  return (
    <div className="dashboard-content table-container">
      <table>
        <thead>
          <tr>
            <th><input type="checkbox"/></th>
            <th>ID</th>
            <th>Nom</th>
            <th>Descripció</th>
            <th>Estat</th>
            <th>Accions</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><input type="checkbox"/></td>
            <td>18233</td>
            <td>Bombins</td>
            <td class="description">Lorem Ipsum is simply dummy text...</td>
            <td>Actiu</td>
            <td class="actions">
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
export default Characteristics;