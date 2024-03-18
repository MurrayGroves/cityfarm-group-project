import React, { useState, useEffect } from "react";
import axios from '../api/axiosConfig'
import FarmTabs from "../components/FarmTabs";
import AnimalPopover from "../components/AnimalPopover";
import "../pages/AnimalTable.css";
import { DataGrid } from '@mui/x-data-grid';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import {Button} from "@mui/material";

import { getConfig } from '../api/getToken';

const AssociateEnclosure = (props) => {
    const [linkedEnclosures, setLinkedEnclosures] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [enclosureList, setEnclosureList] = useState([]);
    const [changed, setChanged] = useState(false);

    const token = getConfig();

    useEffect(() => {
        setLinkedEnclosures(props.enclosures);
        console.log('getting enclosures', props.enclosures);
    }, [])
    
    useEffect(() => {
        changed && props.setEnclosures(linkedEnclosures);
        console.log('setting enclosures', linkedEnclosures);
    }, [linkedEnclosures])

    function displayAll() {
        (async () => {
            try {
                const response = await axios.get(`/enclosures`, token);
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
                const response = await axios.get(`/enclosures/by_name/${searchTerm}`, token);
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
            />
        {/*<FarmTabs selectedFarm={farm} setSelectedFarm={setFarm}/>*/}
            <Paper elevation={3} style={{ marginBottom: '20px'}}>
                <DataGrid
                    autoHeight
                    style={{width: '552px'}}
                    checkboxSelection
                    columns={cols}
                    rows={rows}
                    disableRowSelectionOnClick
                    rowSelectionModel={linkedEnclosures}
                    onRowSelectionModelChange={(ids) => {
                        (changed || linkedEnclosures.length < 1) && setLinkedEnclosures(ids);
                        setChanged(true);
                    }}
                />
            </Paper>
            <Button variant='outlined' style={{float: "right"}} onClick={() => {props.close()}}>Close</Button>
        </div>
    )
} 

export default AssociateEnclosure;
