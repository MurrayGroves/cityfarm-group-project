import React, { useState, useEffect } from "react";
import axios from '../api/axiosConfig'
import FarmTabs from "../components/FarmTabs";
import AnimalPopover from "../components/AnimalPopover";
import "../pages/AnimalTable.css";
import { DataGrid } from '@mui/x-data-grid';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";

const WH = "WH", HC = "HC", SW = "SW";
const AssociateAnimal = (props) => {
    const [linkedAnimals, setLinkedAnimals] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [animalList, setAnimalList] = useState([]);
    const linkAnimals = () => {
        console.log(linkedAnimals)
        props.setAnimals(linkedAnimals)
    }
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
    const [farm, setFarm] = useState([WH,HC,SW]);
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
    const rows = animalList.map((animal) => ({
        id: animal._id,
        name: animal,
        type: animal.type,
        sex: animal.male ? 'Male' : 'Female',
    }));
    const cols = [
        { field: 'name', headerName: 'Name', headerClassName: 'grid-header', headerAlign: 'left', flex: 1,
            renderCell: (animal) => {return <AnimalPopover animalID={animal.value._id}/>} },
        { field: 'type', headerName: 'Type', headerClassName: 'grid-header', headerAlign: 'left', flex: 1 },
        { field: 'sex', headerName: 'Sex', headerClassName: 'grid-header', headerAlign: 'left', flex: 1 },
    ];

    return (
        <div>
        <TextField
        size='small'
        placeholder='Search'
        style={{margin: '0 20px 20px 0'}}
        onChange={(e) => setSearchTerm(e.target.value)}
        ></TextField>
        {/*<FarmTabs selectedFarm={farm} setSelectedFarm={setFarm}/>*/}
        <Paper style={{ marginBottom: '20px'}}>
        <DataGrid checkboxSelection columns={cols}
         rows={rows} disableRowSelectionOnClick
         onRowSelectionModelChange={(data) => {setLinkedAnimals(data);}}
          getRowId={(row) => row.id}/>
        </Paper>
        <Button colour="primary" onClick={linkAnimals}></Button>
        </div>
    )

}


export default AssociateAnimal