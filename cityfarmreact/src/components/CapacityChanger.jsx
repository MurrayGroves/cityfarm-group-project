import React, { useState, useEffect } from "react";
import axios from '../api/axiosConfig'
import { DataGrid } from '@mui/x-data-grid';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import {Button} from "@mui/material";

import { getConfig } from '../api/getToken';

const CapacityChanger = (props) => {
    const [linkedCapacities, setLinkedCapacities] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [schemaList, setSchemaList] = useState([]); /* The State for the list of schemas. The initial state is [] */
    const [changed, setChanged] = useState(false);

    const token = getConfig();
    
    function displayAll() {
        (async () => {
            try {
                const response = await axios.get(`/schemas`, token);
                setSchemaList(response.data.reverse());
                console.log(schemaList[0]);
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
                const response = await axios.get(`/schemas/by_name/${searchTerm}`, token);
                setSchemaList(response.data.reverse());
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

    const rows = schemaList.map((schema) => ({
        id: 1 ,
        type: schema._name,
        number: 0
    }));
    const cols = [
        { field: 'type', headerName: 'Type', headerClassName: 'grid-header', headerAlign: 'left', flex: 1} ,
        { field: 'number', headerName: 'Capacity', headerClassName: 'grid-header', headerAlign: 'left', flex: 1 },
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
                    style={{width: '552px'}}
                    columns={cols}
                    rows={rows}
                    disableRowSelectionOnClick
                />
            </Paper>
            <Button variant='outlined' style={{float: "right"}} onClick={() => {props.close()}}>Close</Button>
        </div>
    )

}

export default CapacityChanger
