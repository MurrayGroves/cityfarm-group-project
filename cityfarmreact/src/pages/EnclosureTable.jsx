import React, {useEffect, useState} from "react";
import axios from "../api/axiosConfig";
import TextField from '@mui/material/TextField';
import "../pages/AnimalTable.css";
import FarmTabs from "../components/FarmTabs";
import TableContainer from '@mui/material/TableContainer';
import { Paper, Divider } from '@mui/material';
import { DataGrid, GridPagination } from "@mui/x-data-grid";
import { Edit, Add } from '@mui/icons-material';
import Button from '@mui/material/Button';
import AnimalPopover from "../components/AnimalPopover.tsx";
import EnclosureCreator from "../components/EnclosureCreator";
import { getConfig } from '../api/getToken';

const EnclosureTable = ({farms, cityfarm}) => {
    const [enclosureList, setEnclosureList] = useState([]); /* The State for the list of enclosures. The initial state is [] */
    const [searchTerm, setSearchTerm] = useState(''); /* The term being search for in the searchbar */
    const [editMode, setEditMode] = useState(false); /* Whether edit mode is on. Initial state is false */
    const [create, setCreate] = useState(false);

    const token = getConfig();

    const [farm, setFarm] = useState(null);

    function displayAll() {
        (async () => {
            try {
                const response = await axios.get(`/enclosures`, {params: {farm: farm}, ...token});
                setEnclosureList(response.data);
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

    useEffect (() => {
        (async () => {
            if (searchTerm === '') {
                displayAll();
                return;
            }
            try {
                const response = await axios.get(`/enclosures/by_name/${searchTerm}`, {params: {farm: farm}, ...token});
                setEnclosureList(response.data);
            } catch (error) {
                if (error.response.status === 401) {
                    window.location.href = "/login";
                    return;
                } else {
                    window.alert(error);
                }
            }
        })()
    },[searchTerm, farm])

    const cols =  [
        { field: 'name', editable: true, headerName: 'Name', headerClassName: 'grid-header', headerAlign: 'left', flex: 1 },
        { field: 'holding', headerName: 'Holding', headerClassName: 'grid-header', headerAlign: 'left', flex: 1, cellClassName: 'scroll-cell',
            renderCell: (animalList) => <ul>{animalList.value.map(animal => {console.log(animal); return(<li key={animal._id}><AnimalPopover cityfarm={cityfarm} animalID={animal._id}/></li>)})}</ul>
        },
        { field: 'capacities', headerName: 'Capacities', headerClassName: 'grid-header', headerAlign: 'left', flex: 1 },
    ]

    console.log(enclosureList)

    const rows = enclosureList.map((enclosure) => ({
        id: enclosure._id,
        name: enclosure.name,
        holding: enclosure.holding,
        capacities: Object.keys(enclosure.capacities).map((key) => {
            return (` ${key}: ${enclosure.capacities[key]}`)
        })
    }))

    return(<>
        <h1>Enclosures</h1>
        <span style={{display: 'flex', justifyContent: 'space-between', height: '60px'}}>
            <TextField
                size='small'
                placeholder='Search'
                style={{margin: '0 20px 20px 0'}}
                onChange={(e) => setSearchTerm(e.target.value)}
            ></TextField>
            <FarmTabs farms={farms} selectedFarm={farm} setSelectedFarm={setFarm}/>
        </span>
        <div style={{display: 'flex', flexDirection: 'column', height: 'calc(100% - 150.88px)'}}>
        <Paper elevation={3} style={{flex: 1}}>
            <DataGrid rows={rows} columns={cols}
            slots={{
                footer: CustomFooter
            }}
            slotProps={{
                footer: {
                    setEditMode,
                    setCreate
                }
            }}
            style={{fontSize: '1rem'}}
            isCellEditable={() => editMode}
            processRowUpdate = {(newVal, oldVal) => {
                if (newVal.name === oldVal.name) { return newVal; }
                const newName = newVal.name;
                const _id = oldVal.id;
                (async() => {
                    try{
                        const response = await axios.patch(`/enclosures/by_id/${_id}/name/${newName}`, null, token)
                        console.log(response);
                        window.location.reload(false);
                    } catch (error) {
                        if (error.response.status === 401) {
                            window.location.href = "/login";
                            return;
                        } else {
                            window.alert(error);
                        }
                    }
                })();
                setEditMode(false);
                return newVal;
            }}/>
        </Paper>
        {create && <EnclosureCreator setCreate={setCreate}/>}
        </div>
    </>)
}

const CustomFooter = ({setEditMode, setCreate}) => {
    return (<>
        <Divider/>
        <div style={{maxHeight: '56.5px', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
            <span style={{display: 'flex', alignItems: 'center'}}>
            <Button className="tallButton" sx={{margin: '10px'}} aria-label="edit" onClick={() => setEditMode(true)} variant='contained' endIcon={<Edit/>}>Edit</Button>
            <Button sx={{maxWidth: '100px', float: 'right'}} variant='contained' endIcon={<Add/>} style={{float: 'right'}} onClick={() => setCreate(true)}>Create</Button>
            </span>
            <GridPagination/>
        </div>
    </>)
}

export default EnclosureTable;
