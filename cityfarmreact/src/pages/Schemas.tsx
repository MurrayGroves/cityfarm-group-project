import React, {useEffect, useState} from "react";
import axios from "../api/axiosConfig";
import "./AnimalTable.css";

import Grid from "@mui/material/Grid";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { IconButton, Select, Backdrop, Alert } from "@mui/material";
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete'
import TextField from '@mui/material/TextField';
import { Schema } from '../api/animals.ts';
import { CityFarm } from "../api/cityfarm.ts";
import { getConfig } from '../api/getToken';

const classToReadable = {
    "java.lang.Boolean": "Yes/No",
    "java.lang.String": "Text",
    "java.lang.Integer": "Whole Number",
    "java.lang.Double": "Decimal Number",
    "cityfarm.api.calendar.EventRef": "Event",
}

const Schemas = ({farms, cityfarm}: {farms: any, cityfarm: CityFarm}) => {
    const [schemaList, setSchemaList] = useState<Schema[]>([]); /* The State for the list of schemas. The initial state is [] */
    const [searchTerm, setSearchTerm] = useState<string>(''); /* The term being search for in the searchbar */
    const [newFields, setNewFields] = useState<any>([{"name": "", "type": "", "required": ""}])
    const [newSchemaName, setNewSchemaName] = useState<string>("");
    const [showErr, setShowErr] = useState<boolean>(false);

    const token = getConfig();

    const [inputErr, setInputErr] = useState({});

    useEffect(() => {
        setInputErr(prevInputErr => ({...prevInputErr, name: newSchemaName === ''}));
    }, [newSchemaName]);

    useEffect(() => {
        Object.keys(newFields).map((field, index) => {
            index !== newFields.length - 1 && setInputErr(prevInputErr => ({...prevInputErr, [index]: (newFields[field].name === '' || newFields[field].type === '' || newFields[field].required === '')}));
        });
    }, [newFields]);

    function checkIfNewRowNeeded() {
        let changed = false;
        Object.values(newFields[newFields.length-1]).map((value) => {
            if (value !== "") {
                changed = true;
            }

            return null;
        })

        if (changed) {
            setNewFields([...newFields, {"name": "", "type": "", "required": ""}])
        }
    }

    function displayAll() {
        (async () => {
            const schemas = await cityfarm.getSchemas(true, (schemas) => setSchemaList(schemas));
            setSchemaList(schemas);
        })()
    }

    function deleteRow(index) {
        setNewFields(newFields.filter((value, thisIndex) => {
            if (thisIndex === index) {
                return false;
            }

            return true;
        }));
    }

    useEffect (() => {
        (async () => {
            if (searchTerm === '') {
                displayAll();
                return;
            }
            const schema = await cityfarm.getSchema(searchTerm, true, (schema) => setSchemaList(new Array (schema)))
            setSchemaList(new Array(schema!))
        })()
    },[searchTerm])

    return(<>
        <h1>Animal Types</h1>
        <h2>Create New Animal Type</h2>
        <Paper sx={{marginTop: '20px'}} elevation={3}>
        <TableContainer>
        <div style={{marginBottom: '20px', display: 'flex'}}>
            <TextField error={newSchemaName === ''} required style={{margin: '15px 15px 0 15px'}} label='Name' placeholder="Species Name" value={newSchemaName} size="small"
                onChange={(e) => {
                    setNewSchemaName(e.target.value.charAt(0).toUpperCase() + e.target.value.slice(1));
                }}
            />
            <Button disableElevation variant="contained" aria-label="add" endIcon={<AddIcon />} style={{maxHeight: '40px', margin: '15px 15px 0 0'}}
                onClick={() => {
                    if (Object.values(inputErr).filter((err) => err === true).length > 0) {
                        return setShowErr(true);
                    }
                    (async () => {
                        newFields.pop();
                        let fieldsObj = {};
                        newFields.map((field) => {
                            fieldsObj = {...fieldsObj,
                                [field.name]: {
                                    type: field.type,
                                    required: field.required,
                                }
                            }
                            
                            return null;
                        });

                        let request = {
                            name: newSchemaName,
                            fields: fieldsObj,
                        }
                        try {
                            await axios.post(`/schemas/create`, request, token);
                            window.location.reload();
                        } catch(error) {
                            window.alert(error);
                        }
                    })()
                }}
            >
                Create
            </Button>
        </div>
            <Table aria-label="fields table">
                <TableHead>
                    <TableRow>
                        <TableCell sx={{minWidth: '168px'}} width='30%'>Property Name</TableCell>
                        <TableCell width='30%'>Data Type</TableCell>
                        <TableCell width='30%'>Required</TableCell>
                        <TableCell width='10%'/>
                    </TableRow>
                </TableHead>
                <TableBody>
                {newFields.map((field, index) => {
                    return (
                    <TableRow
                        key={index}
                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                    >
                    <TableCell component="th" scope="row">
                        <TextField fullWidth error={field["name"] === '' && index !== newFields.length - 1} required placeholder="Property Name" id="field name" variant="outlined" size="small" value={field["name"]}
                            onChange={(e) => {
                                setNewFields(newFields.map((elem, changeIndex) => {
                                    if (changeIndex === index) {
                                        elem["name"] = e.target.value;
                                        return elem;
                                    } else {
                                        return elem;
                                    }
                                }))
                                checkIfNewRowNeeded();
                            }}
                        />
                    </TableCell>
                    <TableCell align="left">
                        <FormControl fullWidth error={field["type"] === '' && index !== newFields.length - 1} required sx={{ m: 1, minWidth: 120 }} size="small">
                            <Select size="small" value={field["type"] || ''} onChange={(e) => {
                                setNewFields(newFields.map((elem, changeIndex) => {
                                    if (changeIndex === index) {
                                        elem["type"] = e.target.value;
                                        return elem;
                                    } else {
                                        return elem;
                                    }
                                }))
                                checkIfNewRowNeeded();
                            }}>
                                {Object.entries(classToReadable).map(([javaName, className], index) => 
                                    <MenuItem value={javaName} key={index}>{className}</MenuItem>
                                )}
                            </Select>
                        </FormControl>
                    </TableCell>
                    <TableCell align="left">
                        <FormControl fullWidth error={field["required"] === '' && index !== newFields.length - 1} required sx={{ m: 1, minWidth: 120 }} size="small">
                            <Select size="small" value={field["required"]} onChange={(e) => {
                                setNewFields(newFields.map((elem, changeIndex) => {
                                    if (changeIndex === index) {
                                        console.log(typeof e.target.value)
                                        elem["required"] = e.target.value as boolean;
                                        console.log(elem["required"])
                                        return elem;
                                    } else {
                                        return elem;
                                    }
                                }))
                                checkIfNewRowNeeded();
                            }}>
                                <MenuItem value={1}>Yes</MenuItem>
                                <MenuItem value={0}>No</MenuItem>
                            </Select>
                        </FormControl>
                    </TableCell>
                    <TableCell align="right">
                        {
                            (index !== newFields.length-1) ? 
                                <IconButton onClick={() => deleteRow(index)}>
                                    <DeleteIcon/> 
                                </IconButton>
                                : ""
                        }
                    </TableCell>
                    </TableRow>
                )})}
                </TableBody>
            </Table>
        </TableContainer>
        </Paper>

        <h2>Existing Animal Types</h2>

        <TextField style={{margin: '10px 0 20px 0'}} placeholder="Search" value={searchTerm} size="small"
            onChange={(e) => {
                setSearchTerm(e.target.value);
            }}
        />
        <Grid container spacing={3} columns={{xs: 1, lg: 2}}>
            {schemaList.map((schema) => (
                <Grid item xs={1} key={schema.name}>
                    <div className="schema-card">
                        <h2 style={{margin: '0 0 10px 0'}}>{schema.name}</h2>
                        <Paper elevation={3}>
                        <TableContainer>
                            <Table aria-label="fields table">
                                <TableHead>
                                <TableRow>
                                    <TableCell width='30%'>Property Name</TableCell>
                                    <TableCell width='30%'>Data Type</TableCell>
                                    <TableCell width='25%'>Required</TableCell>
                                    <TableCell width='15%'>
                                        <IconButton onClick={async () => {
                                            try {
                                                await axios.patch(`/schemas/by_name/${schema.name}/hidden`, {hidden: true}, token)
                                                window.location.reload();
                                            } catch (error) {
                                                if (error.response.status === 401) {
                                                    window.location.href = "/login";
                                                    return;
                                                } else {
                                                    window.alert(error);
                                                }
                                            }
                                        }}><DeleteIcon/>
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                                </TableHead>
                                <TableBody>
                                {Object.entries(schema.fields).map(([name, properties]) => (
                                    <TableRow
                                    key={name}
                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                    >
                                    <TableCell component="th" scope="row">
                                        {name}
                                    </TableCell>
                                    <TableCell align="left">{classToReadable[properties.type]}</TableCell>
                                    <TableCell align="left">{properties.required ? "Yes" : "No"}</TableCell>
                                    </TableRow>
                                ))}
                                </TableBody>
                            </Table>
                            </TableContainer>
                            </Paper>
                    </div>
                </Grid>
            ))}
        </Grid>
        <Backdrop style={{zIndex: '4', background: '#000000AA'}} open={showErr} onClick={() => setShowErr(false)}>
            <Alert severity='warning'>
                Please ensure all required fields are filled
            </Alert>
        </Backdrop>
    </>)
}

export default Schemas;
