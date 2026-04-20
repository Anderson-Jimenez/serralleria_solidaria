import {useEffect} from 'react';
import { useState } from "react";
import { NavLink } from "react-router-dom";
import { LayoutDashboard, Package, Tags, Boxes, Settings2, NotebookText, Menu, Users, Mails, Truck  } from "lucide-react";

const CustomSolutionPetitions = () => {
    useEffect(() => {
        fetch("http://localhost:8000/api/")
        .then(response => response.json())
        .then(data => setData(data))
        .catch(error => console.error(error));
    }, []);

    return (
        <div className="dashboard-caracteristics">
            <div className="caracteristics-content">
                <div className="table-container">
                <h1>Tipus de Caracteristiques</h1>
                <div className="tableFilters">
                    <input type="text" name="" id="" placeholder="Buscar Tipus de Caracteristiques..."/>

                    <select name="" id="">

                    </select>

                </div>
                <table>
                    <thead>
                    <tr>
                        <th>ID</th>
                        <th>Usuari</th>
                        <th></th>
                        <th>Estat</th>
                        <th>Accions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {data.map((characteristicTypes) => (
                        <tr key={characteristicTypes.id}>
                        <td>{characteristicTypes.id}</td>
                        <td>{characteristicTypes.type}</td>
                        <td>{characteristicTypes.filterType}</td>
                        <td>
                            <span className={characteristicTypes.status === 1 ? "status-active" : "status-inactive"}>
                            {characteristicTypes.status === 1 ? "Actiu" : "Inactiu"}
                            </span>
                        </td>
                        <td className="actions">
                            {/*
                                <Link className="action-icon edit" to={`/admin/types/edit/${characteristicTypes.id}`}>
                                    <Pencil size={18} />
                                </Link>
                            
                                <button className="action-icon power" onClick={() => changeStatusTypeCharacteristic(characteristicTypes.id)}>
                                    <Power size={18} color={characteristicTypes.status === 1 ? "green" : "red"} /> {characteristicTypes.status === 1 ? "Desactivar" : "Activar"}
                                </button>
                            */}


                        </td>



                        </tr>
                    ))}
                    </tbody>
                </table>
                </div>
            </div>


        </div>
  );
};

export default CustomSolutionPetitions;