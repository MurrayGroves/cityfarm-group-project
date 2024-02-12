import React, {useEffect, useState} from "react";
import axios from '../api/axiosConfig'
import SearchBar from "../components/SearchBar";
import FarmTabs from "../components/FarmTabs";
import "../components/AnimalTable.css";
import Animal from "../components/Animal";
import { DataGrid } from '@mui/x-data-grid';
import { Link } from "react-router-dom";

const colours = {
    WH: "#333388",
    HC: "#FF0000",
    SW: "#3312FF",
    default: "#888888"
}

const AnimalTable = () => {
    const [animalList, setAnimalList] = useState([]); /* The State for the list of animals. The initial state is [] */
    const [searchTerm, setSearchTerm] = useState(''); /* The term being searched for in the searchbar */
    const [searchMode, setSearchMode] = useState("name") /* The mode of search (by name or id) */
    const [clear, setClear] = useState(0); /* Clear will reset the table to display all animals once updated*/
    const [create, setCreate] = useState({name: '', type: 'chicken', father: 'Unregistered', mother: 'Unregistered', male: 'true', alive: 'true'})
    
    const [farm, setFarm] = useState(0);

    useEffect(displayAll,[clear])

    function displayAll() {
        (async () => {
            try {
                const response = await axios.get(`/animals`);
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
                    setAnimalList(response.data);
                } catch (error) {
                    window.alert(error);
                }
            }
            else {
                try {
                    const response = await axios.get(`/animals/by_id/${searchTerm}`);
                    setAnimalList(response.data);
                } catch (error) {
                    window.alert(error);
                }
            }
        })()
    },[searchTerm])

    const rows = animalList.map((animal) => ({
        id: animal._id,
        name: animal,
        type: animal.type,
        father: animal.father != null ? animal.father : 'Unregistered',
        mother: animal.mother != null ? animal.mother : 'Unregistered',
        sex: animal.male ? 'Male' : 'Female',
    }));

    const cols = [
        { field: 'id', headerName: 'ID', headerClassName: 'grid-header', headerAlign: 'left', flex: 1 },
        { field: 'name', headerName: 'Name', headerClassName: 'grid-header', headerAlign: 'left', flex: 1,
            renderCell: (animal) => {return <Animal animalID={animal.value._id}/>} },
        { field: 'type', headerName: 'Type', headerClassName: 'grid-header', headerAlign: 'left', flex: 1 },
        { field: 'father', headerName: 'Father', headerClassName: 'grid-header', headerAlign: 'left', flex: 1 },
        { field: 'mother', headerName: 'Mother', headerClassName: 'grid-header', headerAlign: 'left', flex: 1 },
        { field: 'sex', headerName: 'Sex', headerClassName: 'grid-header', headerAlign: 'left', flex: 1 },
    ];

    return(<>
        <h1>Livestock</h1>
        <SearchBar setSearchMode={setSearchMode} search={setSearchTerm} clearValue={clear} clearSearch={setClear}/>
        <FarmTabs selectFarm={setFarm} colours={colours}/>
        <div className="animal-table">
        <DataGrid columns={cols} rows={rows}/>
        </div>
    </>)
}

export default AnimalTable;
