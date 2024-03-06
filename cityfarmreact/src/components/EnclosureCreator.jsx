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
import FieldSelector from './FieldSelector';

const EnclosureCreator = (props) => {
    const [newEnclosure, setNewEnclosure] = useState({name: '', holding: {}, capacities: {}});
    const [create, setCreate] = useState(false);

    // const fieldTypeSwitch = (field) => {
    //     newAnimal.fields[field] = '' ;
    //     switch(schema._fields[field]._type) {
    //         case "java.lang.Boolean":
    //             return (
    //             <Select
    //                 style={{width: '100%'}}
    //                 value={newAnimal.fields[field]}
    //                 onChange={(e)=>{let tempNewAnimal = newAnimal; tempNewAnimal.fields[field] = e.target.value; setNewAnimal(tempNewAnimal);}}>
    //                 <MenuItem value={true}>Yes</MenuItem>
    //                 <MenuItem value={false}>No</MenuItem>
    //             </Select>
    //             );
    //         case "java.lang.String":
    //             return <TextField/>
    //         case "java.lang.Integer":
    //             return <TextField/>
    //         case "java.lang.Double":
    //             return <TextField/>
    //         case "java.time.ZonedDateTime":
    //             return (
    //             <DatePicker slotProps={{textField: {fullWidth: true}}}/>
    //             )
    //         default:
    //             return <></>;
    //     };
    // }

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
                            <TableCell width='20%'>Holding</TableCell>
                            <TableCell width='20%'>Capacities</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        <TableRow>
                            <TableCell>
                                <TextField 
                                    style={{width: '100%'}} 
                                    onChange={(e)=>{setNewEnclosure({...newAnimal, name: e.target.value})}} label='Name'
                                />
                            </TableCell> /* Table cell for name of enclosure */
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
                                    renderInput={(params) => <TextField {...params} label="Holding"/>}
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
                                    renderInput={(params) => <TextField {...params} label="Capacities"/>}
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
                        </TableRow>
                    </TableBody>
                </Table>
            </TableContainer>
            <Button className='tallButton' variant='contained' endIcon={<DeleteIcon/>} onClick={() => setCreate(false)}>Discard</Button>
            </div>
            <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '20px'}}>
            <Button
            className='tallButton'
            variant="contained"
            aria-label="add"
            endIcon={<AddIcon/>}
            onClick={async() => {
                try{
                    await axios.post(`/enclosures/create`, newEnclosure,
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
            : <></></>
        : <Button variant='contained' endIcon={<AddIcon/>} style={{float: 'right'}} onClick={() => setCreate(true)}>Create</Button>}
    </>)
}

export default EnclosureCreator;