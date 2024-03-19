import React, {useEffect, useState} from "react";
import axios from "../api/axiosConfig";
import TextField from '@mui/material/TextField';
import "../pages/AnimalTable.css";
import FarmTabs from "../components/FarmTabs";
import TableContainer from '@mui/material/TableContainer';
import Paper from '@mui/material/Paper';
import { DataGrid } from "@mui/x-data-grid";
import EditIcon from '@mui/icons-material/Edit';
import Button from '@mui/material/Button';
import { diff } from "deep-object-diff";
import AnimalPopover from "../components/AnimalPopover";
import EnclosureCreator from "../components/EnclosureCreator";
import { getConfig } from '../api/getToken';

const EnclosureTable = ({farms}) => {
    const [enclosureList, setEnclosureList] = useState([]); /* The State for the list of enclosures. The initial state is [] */
    const [searchTerm, setSearchTerm] = useState(''); /* The term being search for in the searchbar */
    const [editMode, setEditMode] = useState(false); /* Whether edit mode is on. Initial state is false */

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
        { field: 'holding', headerName: 'Holding', headerClassName: 'grid-header', headerAlign: 'left', flex: 1 },
        { field: 'capacities', headerName: 'Capacities', headerClassName: 'grid-header', headerAlign: 'left', flex: 1 },
    ]

    const rows = enclosureList.map((enclosure) => ({
        id: enclosure._id,
        name: enclosure.name,
        holding: enclosure.holding.map((animal) => {
            return (`${animal.name}`)
        }),
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
        <TableContainer component={Paper} style={{marginBottom: '20px', height: 'calc(100vh - (40px + 36.5px + 60px + 48px + (2*21.44px))'}}>
            <DataGrid rows={rows} columns={cols}
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
        </TableContainer>
        <Button style={{float: 'right'}} aria-label="edit" onClick={() => setEditMode(true)} variant='contained' endIcon={<EditIcon/>}>Edit</Button>
        <EnclosureCreator/>
    </>)
}

export default EnclosureTable;
