import React, { useState, useEffect } from 'react';
import axios from "../api/axiosConfig";
import '../pages/AnimalTable.css';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { IconButton, Select, TableFooter } from "@mui/material";
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';

import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

const AnimalCreator = (props) => {

    const [newAnimal, setNewAnimal] = useState({name: '', type: '', father: '', mother: '', male: true, alive: true, fields: {}})
    const [schemaList, setSchemaList] = useState([]);
    const [schema, setSchema] = useState()

    const fieldTypeSwitch = (field) => {
        newAnimal.fields[field] = '';
        switch(schema._fields[field]._type) {
            case "java.lang.Boolean":
                return (
                <Select
                    style={{width: '100%'}}
                    value={newAnimal.fields[field]}
                    onChange={(e)=>{let tempNewAnimal = newAnimal; tempNewAnimal.fields[field] = e.target.value; setNewAnimal(tempNewAnimal);}}>
                    <MenuItem value={true}>Yes</MenuItem>
                    <MenuItem value={false}>No</MenuItem>
                </Select>
                );
            case "java.lang.String":
                return <TextField></TextField>
            case "java.lang.Integer":
                return <TextField></TextField>
            case "java.lang.Double":
                return <TextField></TextField>
            case "java.time.ZonedDateTime":
                return (
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DatePicker/>
                </LocalizationProvider>
                )
            default:
                return <></>;
        };
    }

    useEffect(() => {
        (async () => {
            try {
                const response = await axios.get(`/schemas`);
                setSchemaList(response.data.reverse());
            } catch (error) {
                window.alert(error);
            }
        })()
    },[]);

    useEffect(() => {
        setSchema(schemaList.filter((schema) => schema._name === newAnimal.type).pop());
        newAnimal.fields = {};
    },[newAnimal.type]);

    useEffect(() => {
        console.log(newAnimal);
    },[newAnimal]);

    return (
        <Table>
            <TableHead>
                <TableRow>
                    <TableCell width='20%'>Name</TableCell>
                    <TableCell width='20%'>Type</TableCell>
                    <TableCell width='20%'>Father</TableCell>
                    <TableCell width='20%'>Mother</TableCell>
                    <TableCell width='20%'>Sex</TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                <TableRow>
                    <TableCell><TextField style={{width: '100%'}} onChange={(e)=>{setNewAnimal({...newAnimal, name: e.target.value})}} label='Name'></TextField></TableCell>
                    <TableCell>
                        <Select style={{width: '100%'}} value={newAnimal.type} onChange={(e) => {setNewAnimal({...newAnimal, type: e.target.value})}}>
                        {schemaList.map((schema) => {
                            return <MenuItem value={schema._name}>{(schema._name.charAt(0).toUpperCase()) + schema._name.slice(1)}</MenuItem>;
                        })}
                        </Select>
                    </TableCell>
                    <TableCell>
                        <Autocomplete
                            style={{width: '100%'}}
                            size='medium'
                            renderOption={(props, option) => {
                                return (
                                    <li {...props} key={option.id}>
                                        {option.name}
                                    </li>
                                );
                            }}
                            renderInput={(params) => <TextField {...params} label="Father"/>}
                            isOptionEqualToValue={(option, value) => option.id === value.id}
                            getOptionLabel={option => option.name}
                            options={
                                props.animalList.filter((animal)=>{return animal.type === newAnimal.type && animal.male === true}).map((animal)=>{
                                    return {id: animal._id, name: animal.name}
                                })
                            }
                            onChange={(e, v)=>{v ? setNewAnimal({...newAnimal, father: v.id}) : setNewAnimal({...newAnimal, father: ''})}}
                        />
                    </TableCell>
                    <TableCell>
                        <Autocomplete
                            style={{width: '100%'}}
                            size='medium'
                            renderOption={(props, option) => {
                                return (
                                    <li {...props} key={option.id}>
                                        {option.name}
                                    </li>
                                );
                            }}
                            renderInput={(params) => <TextField {...params} label="Mother"/>}
                            isOptionEqualToValue={(option, value) => option.id === value.id}
                            getOptionLabel={option => option.name}
                            options={
                                props.animalList.filter((animal)=>{return animal.type === newAnimal.type && animal.male !== true}).map((animal)=>{
                                    return {id: animal._id, name: animal.name}
                                })
                            }
                            onChange={(e, v)=>{v ? setNewAnimal({...newAnimal, mother: v.id}) : setNewAnimal({...newAnimal, mother: ''})}}
                        />
                    </TableCell>
                    <TableCell>
                        <Select style={{width: '100%'}} value={newAnimal.male} onChange={(e) => {setNewAnimal({...newAnimal, male: e.target.value})}}>
                            <MenuItem value={true}>Male</MenuItem>  
                            <MenuItem value={false}>Female</MenuItem>   
                        </Select>
                    </TableCell>
                </TableRow>
            </TableBody>
            {schema ? 
            <TableFooter>
                <TableRow>
                    <TableCell style={{borderBottom: '0', borderRight: '1px solid rgba(224, 224, 224, 1)'}} variant='head'>Field Name</TableCell>
                    {Object.keys(schema._fields).map((field) => {
                        return (
                        <TableCell variant='head'>{field.charAt(0).toUpperCase() + field.slice(1)}</TableCell>
                        );
                    })}
                </TableRow>
                <TableRow>
                    <TableCell style={{borderBottom: '0', borderRight: '1px solid rgba(224, 224, 224, 1)'}} variant='head'>Field Value</TableCell>
                    {Object.keys(schema._fields).map((field) => {
                        return (
                        <TableCell variant='head'>{fieldTypeSwitch(field)}</TableCell>
                        );
                    })}
                    <TableCell>
                        <Button
                        style={{float: 'right'}}
                        variant="contained"
                        aria-label="add"
                        endIcon={<AddIcon/>}
                        onClick={async() => {
                            await axios.post(`/animals/create`, newAnimal,
                            {crossdomain: true, headers: {
                                "Access-Control-Allow-Origin": 'http://localhost:3000',
                                "Access-Control-Allow-Credentials": true
                            }})
                            window.location.reload(false);
                        }}>Create</Button>
                        
                    </TableCell>
                </TableRow>                  
            </TableFooter>
            : <></>}
        </Table>
    )
}

export default AnimalCreator;