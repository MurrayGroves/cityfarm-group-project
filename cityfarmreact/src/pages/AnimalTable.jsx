import React, {useEffect, useState} from "react";
import axios from '../api/axiosConfig'
import SearchBar from "../components/SearchBar";
import FarmTabs from "../components/FarmTabs";
import "./AnimalTable.css";
import Animal from "../components/Animal";
import { DataGrid } from '@mui/x-data-grid';
import TableContainer from '@mui/material/TableContainer';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import AnimalCreator from "../components/AnimalCreator";


const WH = 0, HC = 1, SW = 2;
const colours = {
    WH: "#333388",
    HC: "#FF0000",
    SW: "#3312FF",
    default: "#888888"
};

const AnimalTable = () => {
    const [animalList, setAnimalList] = useState([]); /* The State for the list of animals. The initial state is [] */
    const [searchTerm, setSearchTerm] = useState(''); /* The term being searched for in the searchbar */
    
    const [farm, setFarm] = useState();

    //useEffect(displayAll,[clear])

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

    useEffect(() => {
        (async () => {
            if (searchTerm === '') {
                displayAll();
                return;
            }
            try {
                const response = await axios.get(`/animals/by_name/${searchTerm}`);
                setAnimalList(response.data);
            } catch (error) {
                window.alert(error);
            }
        })()
    },[searchTerm])

    useEffect(() => {
        setAnimalList(animalList.filter((animal)=>{animal.farms.includes(farm)}))
    },[farm])

    const rows = animalList.map((animal) => ({
        id: animal._id,
        name: animal,
        type: animal.type,
        father: animal.father !== '' && animal.father !== null ? animal.father : 'Unregistered',
        mother: animal.mother !== '' && animal.mother !== null ? animal.mother : 'Unregistered',
        sex: animal.male ? 'Male' : 'Female',
    }));

    const cols = [
        { field: 'name', headerName: 'Name', headerClassName: 'grid-header', headerAlign: 'left', flex: 1,
            renderCell: (animal) => {return <Animal animalID={animal.value._id}/>} },
        { field: 'type', headerName: 'Type', headerClassName: 'grid-header', headerAlign: 'left', flex: 1 },
        { field: 'father', headerName: 'Father', headerClassName: 'grid-header', headerAlign: 'left', flex: 1 },
        { field: 'mother', headerName: 'Mother', headerClassName: 'grid-header', headerAlign: 'left', flex: 1 },
        { field: 'sex', headerName: 'Sex', headerClassName: 'grid-header', headerAlign: 'left', flex: 1 },
    ];

    return(<>
        <h1>Livestock</h1>
        <span style={{display: 'flex', justifyContent: 'space-between', height: '60px'}}>
            <TextField
                size='small'
                placeholder='Search'
                style={{margin: '0 20px 20px 0'}}
                onChange={(e) => setSearchTerm(e.target.value)}
            ></TextField>
            <FarmTabs selectFarm={setFarm} colours={colours}/>
        </span>
        <TableContainer component={Paper} style={{marginBottom: '20px'}}>
            <DataGrid columns={cols} rows={rows}/>
        </TableContainer>
        <TableContainer component={Paper} style={{marginBottom: '20px'}}>
            <AnimalCreator animalList={animalList}/>
        </TableContainer>
    </>)
}

export default AnimalTable;
