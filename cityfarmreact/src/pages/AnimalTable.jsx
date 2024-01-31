import React, {useEffect, useState} from "react";
import axios from '../api/axiosConfig'
import SearchBar from "../components/SearchBar";
import FarmTabs from "../components/FarmTabs";
import "../components/AnimalTable.css";
import Animal from "../components/Animal";

const AnimalTable = () => {
    const [animalList, setAnimalList] = useState([]); /* The State for the list of animals. The initial state is [] */
    const [searchTerm, setSearchTerm] = useState(''); /* The term being searched for in the searchbar */
    const [searchMode, setSearchMode] = useState("name") /* The mode of search (by name or id) */
    const [clear, setClear] = useState(0); /* Clear will reset the table to display all animals once updated*/
    const [create, setCreate] = useState({name: '', type: 'chicken', father: 'Unregistered', mother: 'Unregistered', male: 'true', alive: 'true'})
    
    const [farm, setFarm] = useState("");

    useEffect(displayAll,[])
    useEffect(displayAll,[clear])

    function displayAll() {
        (async () => {
            try {
                const response = await axios.get(`/animals`);
                console.log(response.data);
                setAnimalList(response.data);
            } catch (error) {
                window.alert(error);
            }
        })()
    }

    useEffect (() => {
        (async () => {
            if (searchTerm === '') {
                return;
            }
            if (searchMode === "name") {
                try {
                    const response = await axios.get(`/animals/by_name/${searchTerm}`);
                    console.log(response.data);
                    setAnimalList(response.data);
                } catch (error) {
                    window.alert(error);
                }
            }
            else {
                try {
                    const response = await axios.get(`/animals/by_id/${searchTerm}`);
                    console.log(response.data);
                    setAnimalList(response.data);
                } catch (error) {
                    window.alert(error);
                }
            }
        })()
    },[searchTerm])

    return(<>
        <h1>Livestock</h1>

        <SearchBar setSearchMode={setSearchMode} search={setSearchTerm} clearValue={clear} clearSearch={setClear}/>
        {animalList?.length > 0 ? (<>
        <FarmTabs selectFarm={setFarm}/>
        <div className="animal-table">
            <table>
                <thead>
                <tr>
                <th>Name</th>
                <th>Type</th>
                <th>Father</th>
                <th>Mother</th>
                {/*<th>TB Inoculated</th>*/}
                <th>Sex</th>
                </tr>
                </thead>
                <tbody>
                    {animalList.map((animal) => (
                        <tr>
                            <td>{animal.name}</td>
                            <td>{animal.type.toUpperCase()}</td>
                            <td>{animal.father != null ? animal.father : 'Unregistered'}</td>
                            <td>{animal.mother != null ? animal.mother : 'Unregistered'}</td>
                            {/*<td>{animal.tb_inoculated ? 'True' : 'False'}</td>*/}
                            <td>{animal.male ? 'Male' : 'Female'}</td>

                        </tr>
                    ))}
                    <tr>
                        <td><input placeholder="name" value= {create.name} onChange = {(e) => {
                            setCreate((prevCreate) => ({
                                ...prevCreate,
                                name: e.target.value,
                                }))
                        }}></input></td>

                        <td>
                            <select name="type" onChange={(e) => {
                            setCreate((prevCreate) => ({
                                ...prevCreate,
                                type: e.target.value,
                            }))}}>
                                <option value="chicken">Chicken</option>
                                <option value="cow">Cow</option>
                                <option value="goat">Goat</option>
                                <option value="pig">Pig</option>
                                <option value="sheep">Sheep</option>
                            </select>
                        </td>

                        <td>
                        <select name="father" onChange={(e) => {
                            setCreate((prevCreate) => ({
                                ...prevCreate,
                                father: e.target.value,
                            }))}}>
                                <option value="">Unregistered</option>
                            </select>
                        </td>

                        <td>
                        <select name="mother" onChange={(e) => {
                            setCreate((prevCreate) => ({
                                ...prevCreate,
                                mother: e.target.value,
                            }))}}>
                                <option value="">Unregistered</option>
                            </select>
                        </td>

                        {/*
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
                        */}

                        <td>
                            <select name="sex" onChange={(e) => {
                            setCreate((prevCreate) => ({
                                ...prevCreate,
                                male: e.target.value,
                            }))}}>
                                <option value="true">Male</option>
                                <option value="false">Female</option>
                            </select>

                            <button
                            style={{float: "right"}}
                            onClick={async () => {
                                console.log(create);
                                await axios.post(`/animals/${create.type}/create`, create, {crossdomain:true, headers: { "Access-Control-Allow-Origin": 'http://localhost:3000',
                                "Access-Control-Allow-Credentials": true}});
                                window.location.reload(false);
                            }}>Add
                        </button>
                        </td>
                    </tr>
            </tbody>
            </table>
        </div>
        </>) : (
        <div className="empty">
            <h2>No Animals found</h2>
        </div>
        )}
    </>)
}

export default AnimalTable;
