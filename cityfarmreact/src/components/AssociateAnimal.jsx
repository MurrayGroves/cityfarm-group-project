import React, { useState, useEffect } from "react";
import axios from '../api/axiosConfig'
import AnimalPopover from "../components/AnimalPopover.tsx";
import "../pages/AnimalTable.css";
import { DataGrid } from '@mui/x-data-grid';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import {Button} from "@mui/material";

import { getConfig } from '../api/getToken';

const AssociateAnimal = (props) => {
    const [linkedAnimals, setLinkedAnimals] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [animalList, setAnimalList] = useState([]);
    const [changed, setChanged] = useState(false);

    const token = getConfig();

    useEffect(() => {
        setLinkedAnimals(props.animals);
        console.log('getting animals', props.animals);
    }, [])
    
    useEffect(() => {
        changed && props.setAnimals(linkedAnimals);
        console.log('setting animals', linkedAnimals);
    }, [linkedAnimals])
    
    function displayAll() {
        (async () => {
            try {
                const response = await axios.get(`/animals`, token);
                setAnimalList(response.data);
            } catch (error) {
                if (error.response.status === 401) {
                    window.location.href = "/login";
                    return;
                } else {
                    window.alert(error);
                }
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
                const response = await axios.get(`/animals/by_name/${searchTerm}`, token);
                setAnimalList(response.data);
            } catch (error) {
                if (error.response.status === 401) {
                    window.location.href = "/login";
                    return;
                } else {
                    window.alert(error);
                }
            }
        })()
    },[searchTerm])

    const rows = animalList.map((animal) => ({
        id: animal._id,
        name: animal,
        type: animal.type,
        sex: animal.sex === 'f' ? 'Female' : animal.sex === 'm' ? 'Male' : 'Castrated',
    }));
    const cols = [
        { field: 'name', headerName: 'Name', headerClassName: 'grid-header', headerAlign: 'left', flex: 1,
            renderCell: (animal) => {return <AnimalPopover cityfarm={props.cityfarm} animalID={animal.value._id}/>} },
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
            />
            <Paper elevation={3} style={{ marginBottom: '20px'}}>
                <DataGrid
                    autoHeight
                    checkboxSelection
                    columns={cols}
                    rows={rows}
                    disableRowSelectionOnClick
                    rowSelectionModel={linkedAnimals}
                    onRowSelectionModelChange={(ids) => {
                        (changed || linkedAnimals.length < 1) && setLinkedAnimals(ids);
                        setChanged(true);
                    }}
                />
            </Paper>
            <Button variant='outlined' style={{float: "right"}} onClick={() => {props.close()}}>Close</Button>
        </div>
    )

}

export default AssociateAnimal
