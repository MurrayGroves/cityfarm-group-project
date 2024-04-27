import React, { useState, useEffect } from "react";
import axios from '../api/axiosConfig'
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import {Button} from "@mui/material";

import { getConfig } from '../api/getToken';
import { CityFarm } from "../api/cityfarm";
import { Enclosure } from "../api/enclosures";
import { Schema } from "../api/animals";

const CapacityChanger = ({enclosure, cityfarm, close}: {enclosure: Enclosure, cityfarm: CityFarm, close: () => void}) => {
    const [linkedCapacities, setLinkedCapacities] = useState<any>([]);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [schemaList, setSchemaList] = useState<Schema[]>([]); /* The State for the list of schemas. The initial state is [] */

    const token = getConfig();
    
    function displayAll() {
        (async () => {
            const schemas = await cityfarm.getSchemas(true, (schemas) => setSchemaList(schemas));
            setSchemaList(schemas);
            setLinkedCapacities(enclosure.capacities);
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
        id: schema.name,
        number: linkedCapacities[schema.name] == null ? 0 : linkedCapacities[schema.name],
    }));

    const cols: GridColDef[] = [
        { field: 'id', headerName: 'Type', headerClassName: 'grid-header', headerAlign: 'left', flex: 1} ,
        { field: 'number', editable: true, headerName: 'Capacity', headerClassName: 'grid-header', headerAlign: 'left', flex: 1 },
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
                    processRowUpdate = {(newVal, oldVal) => {
                        const newInt = parseInt(newVal.number)
                        if (!Number.isInteger(newInt)) { return oldVal; }
                        if (newInt < 0) { return oldVal; }
                        if (newVal.number === oldVal.number) { return newVal; }
                        enclosure.capacities[newVal.id] = newVal.number
                        enclosure.capacities[newVal.id] = newInt
                        return newVal;
                    }}
                />
            </Paper>
            <Button variant='outlined' style={{float: "right"}} onClick={() => {close()}}>Close</Button>
        </div>
    )

}

export default CapacityChanger
