import React, { useState, useEffect } from "react";
import axios from '../api/axiosConfig.js'
import AnimalPopover from "./AnimalPopover.tsx";
import Popover from '@mui/material/Popover';
import Typography from '@mui/material/Typography';
import {Link} from "react-router-dom";
import "../pages/AnimalTable.css";
import { DataGrid, GridColDef, GridRowSelectionModel } from '@mui/x-data-grid';
import { Help } from '@mui/icons-material';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import {Button} from "@mui/material";
import { useTheme } from '@mui/material/styles';
import { getConfig } from '../api/getToken.js';
import { Animal, Sex } from "../api/animals.ts";
import { CityFarm } from "../api/cityfarm.ts";

const AssociateAnimal = ({ animals, setAnimals, cityfarm, close}: {animals: Animal[], setAnimals: (animals: Animal[]) => void, cityfarm: CityFarm, close: () => void}) => {
    const [animalIDs, setAnimalIDs] = useState<GridRowSelectionModel>([]);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [animalList, setAnimalList] = useState<Animal[]>([]);
    const colour = useTheme().palette.mode === 'light' ? 'black' : 'white';

    const token = getConfig();

    /*
    
    ADJUST TO USE CONFIRM BUTTON SO IT DOESN'T REMOVE ANIMALS WHEN THEY DON'T APPEAR IN SEARCH RESULTS

    */
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);

    const handlePopoverOpen = (e) => {
        setAnchorEl(e.currentTarget);
    };

    const handlePopoverClose = () => {
        setAnchorEl(null);
    };

    const handleAttach = () => {
        console.log(animals)
        setAnimals(animalIDs.map((id) => animalList.find((animal) => animal.id === id)!))
    }

    useEffect(() => {
        setAnimalIDs(animals.map((animal) => animal.id));
        console.log('getting animals', animals);
    }, [])
    
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
        type: <ul>animal.type</ul>,
        sex: animal.sex === Sex.Female ? 'Female' : animal.sex === Sex.Male ? 'Male' : 'Castrated',
    }));
    const cols: GridColDef[] = [
        { field: 'name', headerName: 'Name', headerClassName: 'grid-header', headerAlign: 'left', flex: 1,
            renderCell: (animal) => {return <AnimalPopover cityfarm={cityfarm} animalID={animal.value.id}/>} },
        { field: 'type', headerName: 'Type', headerClassName: 'grid-header', headerAlign: 'left', flex: 1 },
        { field: 'sex', headerName: 'Sex', headerClassName: 'grid-header', headerAlign: 'left', flex: 1 },
    ];

    return (
        <div style={{display: 'flex', flexDirection: 'column', height: 'calc(100vh - 148px)'}}>
            <div style={{top: '15px', right:'20px', position: "absolute"}}>
            <Link to="/help">
            <Typography
                aria-owns={open ? 'mouse-over-popover' : undefined}
                aria-haspopup="true"
                onMouseEnter={handlePopoverOpen}
                onMouseLeave={handlePopoverClose}
                style={{display: 'inline-block', margin: '2.5px 0'}}
            >
                <Help/>
            </Typography>
            <Popover
                id="mouse-over-popover"
                sx={{pointerEvents: 'none'}}
                open={open}
                anchorEl={anchorEl}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                }}
                onClose={handlePopoverClose}
                disableRestoreFocus
            >
                <Typography sx={{ p: 1, whiteSpace: 'pre-line' }} maxHeight={400} maxWidth={500}>
                    Click the checkbox on the left side of the table to select the animal(s). You can filter the table by animal type by clicking on the animal type's name.
                    <br/>Click on the Add button to add them.
                </Typography>
            </Popover>
        </Link>
        </div>
            <span style={{display: 'flex', justifyContent: 'space-between'}}>
                <TextField
                    size='small'
                    placeholder='Search'
                    style={{margin: '0 20px 20px 0'}}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Button variant='outlined' style={{marginBottom: '20px'}} onClick={() => {handleAttach(); close()}}>Add</Button>
            </span>
            <Paper elevation={3} style={{ flex: 1, height: 'calc(100% - 60px)' }}>
                <DataGrid
                    keepNonExistentRowsSelected
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
        </div>
    )
}

export default AssociateAnimal
