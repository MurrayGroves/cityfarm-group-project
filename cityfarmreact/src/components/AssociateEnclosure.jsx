import React, { useState, useEffect } from "react";
import axios from '../api/axiosConfig'
import FarmTabs from "../components/FarmTabs";
import AnimalPopover from "../components/AnimalPopover";
import "../pages/AnimalTable.css";
import { DataGrid } from '@mui/x-data-grid';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import {Button} from "@mui/material";


const AssociateEnclosure = (props) => {
    const [linkedEnclosures, setLinkedEnclosures] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [enclosureList, setEnclosureList] = useState([]);
    const linkEnclosures = () => {
        console.log(linkedEnclosures)
        props.setEnclosures(linkedEnclosures)
    }

    function displayAll() {
        (async () => {
            try {
                const response = await axios.get(`/enclosures`);
                setEnclosureList(response.data);
            } catch (error) {
                window.alert(error);
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
                const response = await axios.get(`/enclosures/by_name/${searchTerm}`);
                setEnclosureList(response.data);
            } catch (error) {
                window.alert(error);
            }
        })()
    },[searchTerm])

    const cols =  [
        { field: 'name', editable: true, headerName: 'Name', headerClassName: 'grid-header', headerAlign: 'left', flex: 1 },
        { field: 'holding', headerName: 'Holding', headerClassName: 'grid-header', headerAlign: 'left', flex: 1 },
        { field: 'capacities', headerName: 'Capacities', headerClassName: 'grid-header', headerAlign: 'left', flex: 1 },
    ]

    const rows = enclosureList.map((enclosure) => ({
        id: enclosure._id,
        name: enclosure.name,
        holding: Object.keys(enclosure.holding).map((key) => {
            return (` ${key}:
            ${Object.keys(enclosure.holding[key]).map((animal) => {
                return enclosure.holding[key][animal].name
            })}`)
        }),
        capacities: Object.keys(enclosure.capacities).map((key) => {
            return (` ${key}: ${enclosure.capacities[key]}`)
        })
    }))

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
         onRowSelectionModelChange={(ids) => {
            console.log(ids)
            setLinkedEnclosures(ids)}}/>
        </Paper>
        <Button variant='outlined' color='tertiary' style={{float: "right"}} onClick={() => {linkEnclosures()}}>Link to Event</Button>
        </div>
    )
} 

export default AssociateEnclosure;
