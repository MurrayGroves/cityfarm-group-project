import React, {useEffect, useState} from "react";
import baseURL from "../api/axiosConfig.js";
import SearchBar from "../components/SearchBar";

const animal1 = {
    "type": "cow",
    "_id": "0",
    "name": "Bob",
    "mother": null,
    "father": null,
    "alive": true,
    "tb_inoculated": true,
}

const AnimalTable = () => {
    const [animalList, setAnimalList] = useState([]); /* The State for the list of animals. The initial state is [] */
    const getAnimals = async () => {}
    useEffect (() => {
        (async () => {
            const response = await fetch(`${baseURL}/animals`);
            const data = await response.json();
            setAnimalList(data)
        })()
        //getAnimals()
    },[]);

    return (<>{animalList}</>)

    return(<>
        <SearchBar/>
        {animalList?.length > 0 ? (
            <div className="Table">
                <table>
                    <thead>
                    <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Type</th>
                    <th>Father</th>
                    <th>Mother</th>
                    <th>TB inoculated</th>
                    <th>Alive</th>
                    </tr>
                    </thead>
                    <tbody>
                        {animalList.map((animal) => (
                            <tr>
                                <td>{animal._id}</td>
                                <td>{animal.name}</td>
                                <td>{animal.type}</td>
                                <td>{animal.father != null ? animal.father : 'unregistered'}</td>
                                <td>{animal.mother != null ? animal.mother : 'unregistered'}</td>
                                <td>{animal.tb_inoculated} </td>
                                <td>{animal.alive}</td>
                            </tr>
                        ))}
                </tbody>
                </table>
            </div>
        ) : (
            <div className="empty">
                <h2>No Animals found</h2>
            </div>
        )}
    </>)
}

export default AnimalTable;