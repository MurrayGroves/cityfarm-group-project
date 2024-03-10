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
import TableFooter from '@mui/material/TableFooter';
import Paper from '@mui/material/Paper';
import { IconButton, Select } from "@mui/material";
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete'
import TextField from '@mui/material/TextField';

import { getConfig } from '../api/getToken';

const classToReadable = {
    "java.lang.Boolean": "Yes/No",
    "java.lang.String": "Text",
    "java.lang.Integer": "Whole Number",
    "java.lang.Double": "Decimal Number",
    "java.time.ZonedDateTime": "Date & Time",
}

const Schemas = () => {
    const [schemaList, setSchemaList] = useState([]); /* The State for the list of enclosures. The initial state is [] */
    const [searchTerm, setSearchTerm] = useState(''); /* The term being search for in the searchbar */
    const [newFields, setNewFields] = useState([{"name": "", "type": "", "required": ""}])
    const [newSchemaName, setNewSchemaName] = useState("");
    const [editing, setEditing] = useState(false);
    const token = getConfig();

    var inputErr = {}

    useEffect(() => {
        inputErr['name'] = newSchemaName === ''
        console.log(inputErr);
    }, [newSchemaName])

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
            try {
                const response = await axios.get(`/schemas`, token);
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
    }

    function deleteRow(index) {
        setNewFields(newFields.filter((value, thisIndex) => {
            if (thisIndex === index) {
                return false;
            }

            return true;
        }));
    }

    const showError = () => {
        window.alert('Please ensure all required fields are filled.')
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

    return(<>
        <h1>Animal Types</h1>
        <h2>Create New Animal Type</h2>
        <TableContainer style={{marginTop: '20px'}} component={Paper}>
        <div style={{marginBottom: '20px', display: 'flex'}}>
            <TextField error={newSchemaName === ''} required style={{margin: '15px 15px 0 15px'}} placeholder="Species Name" value={newSchemaName} size="small"
                onChange={(e) => {
                    setNewSchemaName(e.target.value);
                    setEditing(true);
                }}
            />
            <Button disableElevation variant="contained" aria-label="add" endIcon={<AddIcon />} style={{maxHeight: '40px', marginTop: '15px'}}
                onClick={() => {
                    if (Object.values(inputErr).filter((err) => err === true).length > 0) {
                        showError();
                        return;
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
                            window.location.reload(false);
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
                        <TableCell width='30%'>Property Name</TableCell>
                        <TableCell width='30%'>Data Type</TableCell>
                        <TableCell width='30%'>Required</TableCell>
                        <TableCell width='10%'/>
                    </TableRow>
                </TableHead>
                <TableBody>
                {newFields.map((field, index) => {
                    field.name && (inputErr[field.name] = 
                        (field["name"] === '' && editing && index !== newFields.length - 1) ||
                        (field["type"] === '' && editing && index !== newFields.length - 1) ||
                        (field["required"] === '' && editing && index !== newFields.length - 1))
                    return (
                    <TableRow
                        key={index}
                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                    >
                    <TableCell component="th" scope="row">
                        <TextField fullWidth error={field["name"] === '' && editing && index !== newFields.length - 1} required placeholder="Property Name" id="field name" variant="outlined" size="small" value={field["name"]}
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
                                setEditing(true);
                            }}
                        />
                    </TableCell>
                    <TableCell align="left">
                        <FormControl fullWidth error={field["type"] === '' && editing && index !== newFields.length - 1} required sx={{ m: 1, minWidth: 120 }} size="small">
                            <Select height="10px" value={field["type"] || ''} onChange={(e) => {
                                setNewFields(newFields.map((elem, changeIndex) => {
                                    if (changeIndex === index) {
                                        elem["type"] = e.target.value;
                                        return elem;
                                    } else {
                                        return elem;
                                    }
                                }))
                                checkIfNewRowNeeded();
                                setEditing(true);
                            }}>
                                {Object.entries(classToReadable).map(([javaName, className], index) => 
                                    <MenuItem value={javaName} key={index}>{className}</MenuItem>
                                )}
                            </Select>
                        </FormControl>
                    </TableCell>
                    <TableCell align="left">
                        <FormControl fullWidth error={field["required"] === '' && editing && index !== newFields.length - 1} required sx={{ m: 1, minWidth: 120 }} size="small">
                            <Select height="10px" value={field["required"]} onChange={(e) => {
                                setNewFields(newFields.map((elem, changeIndex) => {
                                    if (changeIndex === index) {
                                        elem["required"] = e.target.value;
                                        return elem;
                                    } else {
                                        return elem;
                                    }
                                }))
                                checkIfNewRowNeeded();
                                setEditing(true);
                            }}>
                                <MenuItem value={true}>Yes</MenuItem>
                                <MenuItem value={false}>No</MenuItem>
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

        <h2>Existing Animal Types</h2>

        <TextField style={{margin: '10px 0 20px 0'}} placeholder="Search" value={searchTerm} size="small"
            onChange={(e) => {
                setSearchTerm(e.target.value);
            }}
        />
        <Grid container spacing={2} columns={2}>
            {schemaList.map((schema) => (
                <Grid item xs={1} key={schema._name}>
                    <div className="schema-card">
                        <h2 style={{margin: '0 0 10px 0'}}>{schema._name}</h2>
                        <TableContainer component={Paper}>
                            <Table aria-label="fields table">
                                <TableHead>
                                <TableRow>
                                    <TableCell width='30%'>Property Name</TableCell>
                                    <TableCell width='30%'>Data Type</TableCell>
                                    <TableCell width='25%'>Required</TableCell>
                                    <TableCell width='15%'>
                                        <IconButton onClick={async () => {
                                            try {
                                                await axios.patch(`/schemas/by_name/${schema._name}/hidden`, {hidden: true}, token)
                                                window.location.reload(false);
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
                                {Object.entries(schema._fields).map(([name, properties]) => (
                                    <TableRow
                                    key={name}
                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                    >
                                    <TableCell component="th" scope="row">
                                        {name}
                                    </TableCell>
                                    <TableCell align="left">{classToReadable[properties._type]}</TableCell>
                                    <TableCell align="left">{properties._required ? "Yes" : "No"}</TableCell>
                                    </TableRow>
                                ))}
                                </TableBody>
                            </Table>
                            </TableContainer>
                    </div>
                </Grid>
            ))}
        </Grid>
    </>)
}

export default Schemas;
