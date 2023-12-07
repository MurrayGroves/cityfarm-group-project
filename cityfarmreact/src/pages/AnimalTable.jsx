import React, {useEffect, useState} from "react";
import axios from '../api/axiosConfig'
import SearchBar from "../components/SearchBar";
import "../components/AnimalTable.css";
import CreateButton from "../components/CreateButton";

const AnimalTable = () => {
    const [animalList, setAnimalList] = useState([]); /* The State for the list of animals. The initial state is [] */
    const [searchTerm, setSearchTerm] = useState(''); /* The term being search for in the searchbar */
    const [clear, setClear] = useState(0); /* Clear will reset the table to display all animals once updated*/
    const [create, setCreate] = useState({name: '', type: '', father: '', mother: '', tb_inoculated: '', male: '', alive: ''})
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
            if (searchTerm === '') {
                return;
            }
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
            if (searchTerm === '') {
                return;
            }
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
        {animalList?.length > 0 ? (
            <div className="animal-table">
                <table style={{width: "100%"}}>
                    <thead>
                    <tr>
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
                                <td>{animal.name}</td>
                                <td>{animal.type.toUpperCase()}</td>
                                <td>{animal.father != null ? animal.father : 'Unregistered'}</td>
                                <td>{animal.mother != null ? animal.mother : 'Unregistered'}</td>
                                <td>{animal.tb_inoculated ? 'True' : 'False'}</td>
                                <td>{animal.male ? 'Male' : 'Female'}</td>
                                <td>{animal.alive ? 'Yes' : 'No'}</td>
                            </tr>
                        ))}
                        <tr>
                            <td><input placeholder="name" value= {create.name} onChange = {(e) => {
                                setCreate((prevCreate) => ({
                                    ...prevCreate,
                                    name: e.target.value,
                                  }))
                            }}></input></td>

                            <td><input placeholder="type" value= {create.type} onChange = {(e) => {
                                setCreate((prevCreate) => ({
                                    ...prevCreate,
                                    type: e.target.value,
                                  }))
                            }}></input></td>

                            <td><input placeholder="father" value= {create.father} onChange = {(e) => {
                                setCreate((prevCreate) => ({
                                    ...prevCreate,
                                    father: e.target.value,
                                  }))
                            }}></input></td>

                            <td><input placeholder="mother" value= {create.mother} onChange = {(e) => {
                                setCreate((prevCreate) => ({
                                    ...prevCreate,
                                    mother: e.target.value,
                                  }))
                            }}></input></td>

                            <td><input placeholder="tb inoculated" value= {create.tb_inoculated} onChange = {(e) => {
                                setCreate((prevCreate) => ({
                                    ...prevCreate,
                                    tb_inoculated: 'true'.includes(e.target.value),
                                  }))
                            }}></input></td>

                            <td><input placeholder="gender" value= {create.male} onChange = {(e) => {
                                setCreate((prevCreate) => ({
                                    ...prevCreate,
                                    male: 'true'.includes(e.target.value),
                                  }))
                            }}></input></td>

                            <td><input placeholder="live" value= {create.alive} onChange = {(e) => {
                                setCreate((prevCreate) => ({
                                    ...prevCreate,
                                    alive: 'true'.includes(e.target.value),
                                  }))
                            }}></input>
                            <button
                                height="20"
                                width="20"
                                onClick={() => {
                                    axios.post(`/animals/${create.type}/create`, create, {crossdomain:true ,headers: {    "Access-Control-Allow-Origin": "*",
                                    "Access-Control-Allow-Credentials": true}});
                                    window.location.reload(false);
                                }}>Add
                            </button>
                            </td>
                        </tr>
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