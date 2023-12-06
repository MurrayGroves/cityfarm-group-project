import React, {useEffect, useState} from "react";
import axios from '../api/axiosConfig'
import SearchBar from "../components/SearchBar";
import "../components/AnimalTable.css";

const AnimalTable = () => {
    const [animalList, setAnimalList] = useState([]); /* The State for the list of animals. The initial state is [] */
    const [searchTerm, setSearchTerm] = useState(''); /* The term being search for in the searchbar */
    const [clear, setClear] = useState(0); /* Clear will reset the table to display all animals once updated*/
    useEffect (() => {
        (async () => {
            try {
                const response = await axios.get(`/animals`);
                console.log(response.data);
                setAnimalList(response.data);
            } catch (error) {
                window.alert(error);
            }
        })()
    },[]);
    useEffect (() => {
        (async () => {
            try {
                const response = await axios.get(`/animals`);
                console.log(response.data);
                setAnimalList(response.data);
            } catch (error) {
                window.alert(error);
            }
        })()
    },[clear]);
    useEffect (() => {
        (async () => {
            try {
                const response = await axios.get(`/animals/by_name/${searchTerm}`);
                console.log(response.data);
                setAnimalList(response.data);
            } catch (error) {
                window.alert(error);
            }
        })()
    },[searchTerm])

    return(<>
        <h1>Livestock</h1>
        <SearchBar search={setSearchTerm} clearValue={clear} clearSearch={setClear}/>
        {/*<CreateButton/>*/}
        {animalList?.length > 0 ? (
            <div className="animal-table">
                <table>
                    <thead>
                    <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Type</th>
                    <th>Father</th>
                    <th>Mother</th>
                    <th>TB Inoculated</th>
                    <th>Gender</th>
                    <th>Live</th>
                    </tr>
                    </thead>
                    <tbody>
                        {animalList.map((animal) => (
                            <tr>
                                <td>{animal._id}</td>
                                <td>{animal.name}</td>
                                <td>{animal.type.toUpperCase()}</td>
                                <td>{animal.father != null ? animal.father : 'Unregistered'}</td>
                                <td>{animal.mother != null ? animal.mother : 'Unregistered'}</td>
                                <td>{animal.tb_inoculated ? 'True' : 'False'}</td>
                                <td>{animal.male ? 'Male' : 'Female'}</td>
                                <td>{animal.alive ? 'Yes' : 'No'}</td>
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