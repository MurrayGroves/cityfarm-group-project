import React, { useState, useEffect } from 'react';
import axios from "../api/axiosConfig";
import './AnimalCreator.css';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { IconButton, Select } from "@mui/material";
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
    const [schema, setSchema] = useState();
    const [create, setCreate] = useState(false);

    const fieldTypeSwitch = (field) => {
        newAnimal.fields[field] = '' ;
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
                return <TextField/>
            case "java.lang.Integer":
                return <TextField/>
            case "java.lang.Double":
                return <TextField/>
            case "java.time.ZonedDateTime":
                return (
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DatePicker slotProps={{textField: {fullWidth: true}}}/>
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

    return (<>
        {create ? <>
            <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '20px'}}>
            <TableContainer component={Paper} style={{marginRight: '20px'}}>
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
                            <TableCell><TextField style={{width: '100%'}} onChange={(e)=>{setNewAnimal({...newAnimal, name: e.target.value})}} label='Name'/></TableCell>
                            <TableCell>
                                <Autocomplete
                                    style={{width: '100%'}}
                                    size='medium'
                                    renderOption={(props, option) => {
                                        return (
                                            <li {...props} key={option._name}>
                                                {option._name.charAt(0).toUpperCase() + option._name.slice(1)}
                                            </li>
                                        );
                                    }}
                                    renderInput={(params) => <TextField {...params} label="Type"/>}
                                    getOptionLabel={option => option._name.charAt(0).toUpperCase() + option._name.slice(1)}
                                    options={schemaList}
                                    onChange={(e, v) => {v ? setNewAnimal({...newAnimal, type: v._name}) : setNewAnimal({...newAnimal, type: ''})}}
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
                </Table>
            </TableContainer>
            <Button className='tallButton' variant='contained' endIcon={<DeleteIcon/>} onClick={() => setCreate(false)}>Discard</Button>
            </div>
            {schema ?
            <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '20px'}}>
            <TableContainer component={Paper} style={{marginRight: '20px'}}>
                <Table>
                    <TableHead> {/*style={{borderTop: '2px dashed rgba(196, 196, 196, 1)'}}*/}
                        <TableRow>
                            <TableCell style={{borderRight: '1px solid rgba(224, 224, 224, 1)', width: `${100/(Object.keys(schema._fields).length + 1)}%`}}>Field Name</TableCell>
                            {Object.keys(schema._fields).map((field) => {
                                return (
                                <TableCell style={{width: `${100/(Object.keys(schema._fields).length + 1)}%`}}>{field.charAt(0).toUpperCase() + field.slice(1)}</TableCell>
                                );
                            })}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        <TableRow>
                            <TableCell style={{borderRight: '1px solid rgba(224, 224, 224, 1)'}} variant='head'>Field Value</TableCell>
                            {Object.keys(schema._fields).map((field) => {
                                return (
                                <TableCell variant='head'>{fieldTypeSwitch(field)}</TableCell>
                                );
                            })}
                        </TableRow>
                    </TableBody>
                </Table>
            </TableContainer>
            <Button
            className='tallButton'
            variant="contained"
            aria-label="add"
            endIcon={<AddIcon/>}
            onClick={async() => {
                try{
                    await axios.post(`/animals/create`, newAnimal,
                    { crossdomain: true, headers: {
                        "Access-Control-Allow-Origin": 'http://localhost:3000',
                        "Access-Control-Allow-Credentials": true
                    }})
                } catch(error) {
                    window.alert(error);
                }
                window.location.reload(false);
            }}
            >Create</Button>
            </div>
            : <></>}</>
        : <Button variant='contained' endIcon={<AddIcon/>} style={{float: 'right'}} onClick={() => setCreate(true)}>Create</Button>}
    </>)
}

export default AnimalCreator;