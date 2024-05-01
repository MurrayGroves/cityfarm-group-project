import React, { useState, useEffect } from "react";
import axios from '../api/axiosConfig.js'
import AnimalPopover from "./AnimalPopover.tsx";
import Popover from '@mui/material/Popover';
import Typography from '@mui/material/Typography';
import {Link} from "react-router-dom";
import { Help } from '@mui/icons-material';
import "../pages/AnimalTable.css";
import { DataGrid, GridColDef, GridRowSelectionModel } from '@mui/x-data-grid';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import { Button } from "@mui/material";
import EnclosurePopover from "./EnclosurePopover.tsx";
import { getConfig } from '../api/getToken.js'; 
import { Enclosure } from "../api/enclosures.ts";
import { CityFarm } from "../api/cityfarm.ts";
import { useTheme } from '@mui/material/styles';
import { Animal } from "../api/animals.ts";

const AssociateEnclosure = ({enclosures, setEnclosures, cityfarm, close}: {enclosures: Enclosure[], setEnclosures: (enclosures: Enclosure[]) => void, cityfarm: CityFarm, close: () => void}) => {
    const [enclosureIDs, setEnclosureIDs] = useState<GridRowSelectionModel>([])
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [enclosureList, setEnclosureList] = useState<Enclosure[]>([]);
    const colour = useTheme().palette.mode === 'light' ? 'black' : 'white';

    const token = getConfig();
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);

    const handlePopoverOpen = (e) => {
        setAnchorEl(e.currentTarget);
    };

    const handlePopoverClose = () => {
        setAnchorEl(null);
    };
    useEffect(() => {
        setEnclosureIDs(enclosures.map((enclosure) => enclosure.id));
        console.log('getting enclosures', enclosures);
    }, [])
    
    const handleAttach = () => {
        setEnclosures(enclosureIDs.map((id) => enclosureList.find((enclosure) => enclosure.id === id)!));
    }

    function displayAll() {
        (async () => {
            const enclosures = await cityfarm.getEnclosures(true, null, (enclosures) => setEnclosureList(enclosures));
            setEnclosureList(enclosures);
        })()
    }

    useEffect (() => {
        (async () => {
            if (searchTerm === '') {
                displayAll();
                return;
            }
            try {
                const response = await axios.get(`/enclosures/by_name/${searchTerm}`, token);
                setEnclosureList(response.data.map((enclosure) => new Enclosure(enclosure)));
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

    const cols: GridColDef[] = [
        { field: 'name', editable: true, headerName: 'Name', headerClassName: 'grid-header', headerAlign: 'left', flex: 1,
            renderCell: (enclosure) => <EnclosurePopover cityfarm={cityfarm} enclosureID={enclosure.value.id}/>
        },
        { field: 'holding', headerName: 'Holding', headerClassName: 'grid-header', headerAlign: 'left', flex: 1, cellClassName: 'scroll-cell',
            renderCell: (animalList) => <ul>{animalList.value.map((animal: Animal) => {return(<li key={animal.id}><AnimalPopover cityfarm={cityfarm} animalID={animal.id}/></li>)})}</ul>
        },
        { field: 'capacities', headerName: 'Capacities', headerClassName: 'grid-header', headerAlign: 'left', flex: 1 },
    ]

    const rows = enclosureList.map((enclosure: Enclosure) => ({
        id: enclosure.id,
        name: enclosure,
        holding: enclosure.holding,
        capacities: Object.keys(enclosure.capacities).map((key) => {
            return (` ${key}: ${enclosure.capacities[key]}`)
        })
    }))

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
                    Click the checkbox on the left side of the table to select the enclosure(s).
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
            <Paper elevation={3} style={{ flex: 1 }}>
                <DataGrid
                    keepNonExistentRowsSelected
                    checkboxSelection
                    columns={cols}
                    rows={rows}
                    disableRowSelectionOnClick
                    rowSelectionModel={enclosureIDs}
                    onRowSelectionModelChange={(ids) => {
                        setEnclosureIDs(ids);
                    }}
                />
            </Paper>
        </div>
    )
} 

export default AssociateEnclosure;
