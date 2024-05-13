import React, { useState, useEffect } from "react";
import axios from '../api/axiosConfig'
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import {Button, Backdrop, Alert} from "@mui/material";
import Popover from '@mui/material/Popover';
import Typography from '@mui/material/Typography';
import {Link} from "react-router-dom";
import { Help } from '@mui/icons-material';
import { getConfig } from '../api/getToken';
import { CachePolicy, CityFarm } from "../api/cityfarm.ts";
import { Enclosure } from "../api/enclosures";
import { Schema } from "../api/animals";

const CapacityChanger = ({enclosure, cityfarm}: {enclosure: Enclosure, cityfarm: CityFarm}) => {
    const [linkedCapacities, setLinkedCapacities] = useState<any>([]);
    const [schemaList, setSchemaList] = useState<Schema[]>([]); /* The State for the list of schemas. The initial state is [] */
    const [showErr, setShowErr] = useState<boolean>(false);
    
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);

    const handlePopoverOpen = (e) => {
        setAnchorEl(e.currentTarget);
    };

    const handlePopoverClose = () => {
        setAnchorEl(null);
    };

    useEffect(() => {
        (async () => {
            const schemas = await cityfarm.getSchemas(CachePolicy.USE_CACHE, (schemas) => setSchemaList(schemas));
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
            <div style={{top: '20px', right:'120px', position: "absolute"}}>
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
                        To set the maximum amount of animals of an animal type in this enclosure, type the number into the capacity section on the same row as that type. <br/> Multiple animal types can be added to a single enclosure.
                    </Typography>
                </Popover>
            </Link>
            </div>
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
