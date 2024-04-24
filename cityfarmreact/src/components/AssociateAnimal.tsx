import React, { useState, useEffect } from "react";
import axios from '../api/axiosConfig.js'
import AnimalPopover from "./AnimalPopover.tsx";
import "../pages/AnimalTable.css";
import { DataGrid, GridColDef, GridRowSelectionModel } from '@mui/x-data-grid';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import {Button} from "@mui/material";

import { getConfig } from '../api/getToken.js';
import { Animal, Sex } from "../api/animals.ts";
import { CityFarm } from "../api/cityfarm.ts";

const AssociateAnimal = ({ animals, setAnimals, cityfarm, close}: {animals: Animal[], setAnimals: (animals: Animal[]) => void, cityfarm: CityFarm, close: () => void}) => {
    const [animalIDs, setAnimalIDs] = useState<GridRowSelectionModel>([]);
    const [linkedAnimals, setLinkedAnimals] = useState<Animal[]>([]);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [animalList, setAnimalList] = useState<Animal[]>([]);

    const token = getConfig();

    useEffect(() => {
        setLinkedAnimals(animalIDs.map((id) => animalList.find((animal) => animal.id === id)!))
    }, [animalIDs])

    useEffect(() => {
        setAnimalIDs(animals.map((animal) => animal.id));
        console.log('getting animals', animals);
    }, [])
    
    useEffect(() => {
        setAnimals(linkedAnimals);
        console.log('setting animals', linkedAnimals);
    }, [linkedAnimals])
    
    function displayAll() {
        (async () => {
            const anis = await cityfarm.getAnimals(true, null, (animals) => setAnimalList(animals));
            setAnimalList(anis);
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
                const anis = response.data.map((animal) => new Animal(animal));
                setAnimalList(anis);
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

    const rows = animalList.map((animal: Animal) => ({
        id: animal.id,
        name: animal,
        type: animal.type,
        sex: animal.sex === Sex.Female ? 'Female' : animal.sex === Sex.Male ? 'Male' : 'Castrated',
    }));
    const cols: GridColDef[] = [
        { field: 'name', headerName: 'Name', headerClassName: 'grid-header', headerAlign: 'left', flex: 1,
            renderCell: (animal) => {return <AnimalPopover cityfarm={cityfarm} animalID={animal.value.id}/>} },
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
                    rowSelectionModel={animalIDs}
                    onRowSelectionModelChange={(ids) => {
                        setAnimalIDs(ids);
                    }}
                />
            </Paper>
            <Button variant='outlined' style={{float: "right"}} onClick={() => {close()}}>Close</Button>
        </div>
    )
}

export default AssociateAnimal
