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
import { FormHelperText, IconButton, Select } from "@mui/material";
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

const AnimalCreator = (props) => {
    const [newAnimal, setNewAnimal] = useState({name: '', type: '', father: '', mother: '', male: true, alive: true, fields: {}});
    const [schemaList, setSchemaList] = useState([]);
    const [schema, setSchema] = useState();
    const [fieldList, setFieldList] = useState([]);
    const [create, setCreate] = useState(false);

    const fieldTypeSwitch = (key) => {
        let field = fieldList[key];
        if(newAnimal.fields[field] === undefined) {newAnimal.fields[field] = ''}; {/* initialise field values to enpty strings */}
        switch(schema._fields[field]._type) { /* check the type of the field and display appropriate input method */
            case "java.lang.Boolean":
                return (
                    <FormControl required={schema._fields[field]._required} sx={{width: '100%'}}>
                    <FormHelperText style={{marginLeft: '5px'}}>{schema._fields[field]._required ? 'Required' : 'Not Required'}</FormHelperText>
                    <Select
                        value={newAnimal.fields[field] !== undefined ? newAnimal.fields[field] : ''}
                        onChange={(e) => {
                            let newFields = newAnimal.fields;
                            newFields[field] = e.target.value;
                            setNewAnimal({...newAnimal, fields: newFields});
                        }}
                    >
                        <MenuItem value={''}><em>Empty</em></MenuItem>
                        <MenuItem value={true}>Yes</MenuItem>
                        <MenuItem value={false}>No</MenuItem>
                    </Select>
                    </FormControl>
                );
            case "java.lang.String":
                return (
                    <FormControl required={schema._fields[field]._required} sx={{width: '100%'}}>
                    <FormHelperText style={{marginLeft: '5px'}}>{schema._fields[field]._required ? 'Required' : 'Not Required'}</FormHelperText>
                    <TextField
                        fullWidth
                        placeholder={field[0].toUpperCase() + field.slice(1)}
                        onChange={(e) => {
                            let newFields = newAnimal.fields;
                            newFields[field] = e.target.value;
                            setNewAnimal({...newAnimal, field: newFields});
                        }}
                    />
                    </FormControl>
                );
            case "java.lang.Integer":
                return (
                    <FormControl required={schema._fields[field]._required} sx={{width: '100%'}}>
                    <FormHelperText style={{marginLeft: '5px'}}>{schema._fields[field]._required ? 'Required' : 'Not Required'}</FormHelperText>
                    <TextField
                        type='number'
                        fullWidth
                        placeholder={field[0].toUpperCase() + field.slice(1)}
                        onChange={(e) => {
                            let newFields = newAnimal.fields;
                            newFields[field] = e.target.value;
                            setNewAnimal({...newAnimal, field: newFields});
                        }}
                    />
                    </FormControl>
                );
            case "java.lang.Double":
                return (
                    <FormControl required={schema._fields[field]._required} sx={{width: '100%'}}>
                    <FormHelperText style={{marginLeft: '5px'}}>{schema._fields[field]._required ? 'Required' : 'Not Required'}</FormHelperText>
                    <TextField
                        type='number'
                        fullWidth
                        placeholder={field[0].toUpperCase() + field.slice(1)}
                        onChange={(e) => {
                            let newFields = newAnimal.fields;
                            newFields[field] = e.target.value;
                            setNewAnimal({...newAnimal, field: newFields});
                        }}
                    />
                    </FormControl>
                );
            case "java.time.ZonedDateTime":
                return (
                    <FormControl required={schema._fields[field]._required} sx={{width: '100%'}}>
                    <FormHelperText style={{marginLeft: '5px'}}>{schema._fields[field]._required ? 'Required' : 'Not Required'}</FormHelperText>
                    <DatePicker
                        onChange={(e) => {
                            let newFields = newAnimal.fields;
                            newFields[field] = e.$d;
                            setNewAnimal({...newAnimal, fields: newFields});
                        }}
                        slotProps={{textField: {fullWidth: true}}}
                    />
                    </FormControl>
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
        console.log(newAnimal);
    },[newAnimal])

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
                            <TableCell><TextField fullWidth onChange={(e)=>{setNewAnimal({...newAnimal, name: e.target.value})}} label='Name'/></TableCell>
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
                                    isOptionEqualToValue={(option, value) => option._name === value._name}
                                    renderInput={(params) => <TextField {...params} label="Type"/>}
                                    getOptionLabel={option => option._name.charAt(0).toUpperCase() + option._name.slice(1)}
                                    options={schemaList}
                                    onChange={(e, v) => {
                                        if(v) {
                                            setNewAnimal({...newAnimal, type: v._name, fields: {}});
                                            let tempSchema = schemaList.filter((schema) => schema._name === v._name).pop();
                                            setSchema(tempSchema);
                                            setFieldList(Object.keys(tempSchema._fields));
                                        } else {
                                            setNewAnimal({...newAnimal, type: '', fields: {}});
                                            setSchema();
                                            setFieldList([]);
                                        }}}
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
                    <TableHead>
                        <TableRow>
                            <TableCell style={{borderRight: '1px solid rgba(224, 224, 224, 1)', width: `${100/(Object.keys(schema._fields).length + 1)}%`}}>Property Name</TableCell>
                            {Object.keys(schema._fields).map((field, index) => {
                                return (
                                <TableCell key={index} style={{width: `${100/(Object.keys(schema._fields).length + 1)}%`}}>{field.charAt(0).toUpperCase() + field.slice(1)}</TableCell>
                                );
                            })}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        <TableRow>
                            <TableCell style={{borderRight: '1px solid rgba(224, 224, 224, 1)'}} variant='head'>Property Value</TableCell>
                            {Object.keys(schema._fields).map((_, index) => {
                                return (
                                    <TableCell key={index}>{fieldList ? fieldTypeSwitch(index) : <p>Loading...</p>}</TableCell>
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