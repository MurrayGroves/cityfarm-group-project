import React, {useEffect, useState} from "react";
import baseURL from "../api/axiosConfig.js";
import SearchBar from "../components/SearchBar";
const animal1 ={
    "type": "cow",
    "_id": "724a6d0a-de69-4eba-8885-a2d316b4b437",
    "name": "Bob",
    "mother": null,
    "father": null,
    "alive": true,
    "tb_inoculated": true,
    "_created_at": 1699274299
}
const AnimalTable = () => {
    const [animalList, setAnimalList] = useState([]);{/* The State for the list of animals. The initial state is [] */}
    const getAnimals = async () => {
        const response = await  fetch(`${baseURL}/animals`);
        const data = await response.json();
        setAnimalList(data)
    }
    useEffect(() => {
        getAnimals(animalList)
    },[]);

    return(<>
        <SearchBar/>
        animalList?.length > 0 ? (
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
                    <th>Created at</th>
                    </tr>
                    </thead>
                    <tbody>
                        {animalList.map((animal) => (
                            <tr>
                                <th>{animal._id}</th>
                                <th>{animal.name}</th>
                                <th>{animal.type}</th>
                                <th>{animal.father != null ? animal.father : 'unregistered'}</th>
                                <th>{animal.mother != null ? animal.mother : 'unregistered'}</th>
                                <th>{animal.tb_inoculated} </th>
                                <th>{animal.alive}</th>
                                <th>{animal._created_at}</th>
                            </tr>
                        ))}
                </tbody>
                </table>
            </div>
        ) : (
            <div className="empty">
                <h2>No Animals found</h2>
            </div>
        )
    </>)
}
export default AnimalTable;