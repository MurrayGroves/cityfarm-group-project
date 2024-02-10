import React, {useEffect, useState} from "react";
import axios from "../api/axiosConfig";
import SearchBar from "../components/SearchBar";
import "../components/AnimalTable.css";

import Grid from "@mui/material/Grid";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableFooter from '@mui/material/TableFooter';
import Paper from '@mui/material/Paper';
import { Menu, Select } from "@mui/material";
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import TextField from '@mui/material/TextField';

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
    const [searchMode, setSearchMode] = useState("name") /* The mode of search (by name or id) */
    const [clear, setClear] = useState(0); /* Clear will reset the table to display all enclosures once updated*/
    const [newFields, setNewFields] = useState([{"name": "", "type": "", "required": ""}])


    useEffect(displayAll,[])
    useEffect(displayAll,[clear]);

    function displayAll() {
        (async () => {
            try {
                const response = await axios.get(`/schemas`);
                console.log(response.data);
                setSchemaList(response.data);
            } catch (error) {
                window.alert(error);
            }
        })()
    }
    useEffect (() => {
        (async () => {
            if (searchTerm === '') {
                try {
                    const response = await axios.get(`/schemas`);
                    console.log(response.data);
                    setSchemaList(response.data);
                } catch (error) {
                    window.alert(error);
                }
            }
            else if (searchMode === "name") {
                try {
                    const response = await axios.get(`/schemas/by_name/${searchTerm}`);
                    console.log(response.data);
                    setSchemaList(response.data);
                } catch (error) {
                    window.alert(error);
                }
            }
            else {
                try {
                const response = await axios.get(`/schemas/by_id/${searchTerm}`);
                console.log(response.data);
                setSchemaList(response.data);
                } catch (error) {
                    window.alert(error);
                }
            }
        })()
    },[searchTerm])

    return(<>
        <h1>Schemas</h1>

        <h2>Create New Schema</h2>
        <div style = {{width: "90%"}}>
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="fields table">
                    <TableHead>
                    <TableRow>
                        <TableCell>Field Name</TableCell>
                        <TableCell align="left">Type</TableCell>
                        <TableCell align="left">Required</TableCell>
                    </TableRow>
                    </TableHead>
                    <TableBody>
                    {newFields.map((field, index) => (
                        <TableRow
                        key={index}
                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                        >
                        <TableCell component="th" scope="row">
                            <TextField placeholder="field name" id="field name" variant="outlined" size="small" value={field["name"]} onChange={(e) => {
                                setNewFields(newFields.map((elem, changeIndex) => {
                                    if (changeIndex == index) {
                                        elem["name"] = e.target.value;
                                        return elem;
                                    } else {
                                        return elem;
                                    }
                                }))
                            }}/>
                        </TableCell>
                        <TableCell align="left">
                            <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
                                <Select height="10px" value={classToReadable[field["type"]]} onChange={(e) => {
                                    setNewFields(newFields.map((elem, changeIndex) => {
                                        if (changeIndex == index) {
                                            elem["type"] = e.target.value;
                                            return elem;
                                        } else {
                                            return elem;
                                        }
                                    }))
                                }}>
                                    {Object.entries(classToReadable).map(([javaName, className]) => 
                                        <MenuItem value={javaName}>{className}</MenuItem>
                                    )}
                                </Select>
                            </FormControl>
                        </TableCell>
                        <TableCell align="left">
                            <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
                                <Select height="10px" value={field["required"]} onChange={(e) => {
                                    setNewFields(newFields.map((elem, changeIndex) => {
                                        if (changeIndex == index) {
                                            elem["required"] = e.target.value;
                                            return elem;
                                        } else {
                                            return elem;
                                        }
                                    }))
                                }}>
                                    <MenuItem value={true}>Yes</MenuItem>
                                    <MenuItem value={false}>No</MenuItem>
                                </Select>
                            </FormControl>
                        </TableCell>
                        </TableRow>
                    ))}
                    </TableBody>
                    <TableFooter>
                        <div style={{padding: "2.5%", paddingTop: "0%"}}>
                            <Button variant="contained" aria-label="add" endIcon={<AddIcon />} onClick={() => {}}>
                                Create
                            </Button>   
                        </div>
                        
                    </TableFooter>
                </Table>
                </TableContainer>
        </div>

        <h2>Existing Schemas</h2>

        <TextField placeholder="Search" value={searchTerm} size="small" onChange={(e) => {
            setSearchTerm(e.target.value);
        }}/>
        <Grid container spacing={2}>
            {schemaList.map((schema) => (
                <Grid item xs={5} key={schema._name}>
                    <div className="schema-card">
                        <h2>{schema._name}</h2>
                        <TableContainer component={Paper}>
                            <Table sx={{ minWidth: 650 }} aria-label="fields table">
                                <TableHead>
                                <TableRow>
                                    <TableCell>Field Name</TableCell>
                                    <TableCell align="left">Type</TableCell>
                                    <TableCell align="left">Required</TableCell>
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
