import React, { useState, useEffect } from "react";
import axios from '../api/axiosConfig'
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import {Button, Backdrop, Alert} from "@mui/material";

import { getConfig } from '../api/getToken';
import { CityFarm } from "../api/cityfarm";
import { Enclosure } from "../api/enclosures";
import { Schema } from "../api/animals";

const CapacityChanger = ({enclosure, cityfarm}: {enclosure: Enclosure, cityfarm: CityFarm}) => {
    const [linkedCapacities, setLinkedCapacities] = useState<any>([]);
    const [schemaList, setSchemaList] = useState<Schema[]>([]); /* The State for the list of schemas. The initial state is [] */
    const [showErr, setShowErr] = useState<boolean>(false);
    
    useEffect(() => {
        (async () => {
            const schemas = await cityfarm.getSchemas(true, (schemas) => setSchemaList(schemas));
            setSchemaList(schemas);
            setLinkedCapacities(enclosure.capacities);
        })()
    },[])

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
            <Paper elevation={3} style={{ marginBottom: '20px'}}>
                <DataGrid
                    autoHeight
                    style={{width: '552px'}}
                    columns={cols}
                    rows={rows}
                    disableRowSelectionOnClick
                    processRowUpdate = {(newVal, oldVal) => {
                        const newInt = parseInt(newVal.number)
                        if (!Number.isInteger(newInt) || newInt < 0 ) { setShowErr(true); console.log("RAAHAHAAHAH");return oldVal; }
                        if (newVal.number === oldVal.number) { return newVal; }
                        enclosure.capacities[newVal.id] = newInt
                        return newVal;
                    }}
                />
            </Paper>
            <Backdrop style={{zIndex: '4', background: '#000000AA'}} open={showErr} onClick={() => setShowErr(false)}>
                <Alert severity='warning'>
                    Make sure values are integers
                </Alert>
            </Backdrop>

        </div>

        
    )

}

export default CapacityChanger
