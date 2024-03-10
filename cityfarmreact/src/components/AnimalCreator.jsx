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
import { getConfig } from '../api/getToken';

const AnimalCreator = (props) => {
    const [newAnimal, setNewAnimal] = useState({name: '', type: '', father: '', mother: '', sex: '', alive: true, farm: '', fields: {}, notes: ''});
    const [schema, setSchema] = useState();
    const [fieldList, setFieldList] = useState([]);
    const [create, setCreate] = useState(false);

    const token = getConfig();

    const reset = () => {
        setCreate(false);
        setNewAnimal({name: '', type: '', father: '', mother: '', sex: '', alive: true, farm: '', fields: {}, notes: ''})
        setSchema();
    }

    var inputErr = {}

    const showError = () => {
        window.alert('Please ensure all required fields are filled.')
    }

    const fieldTypeSwitch = (key) => {
        let field = fieldList[key];
        if (newAnimal.fields[field] === undefined) newAnimal.fields[field] = '';    /* initialise field values to empty strings */
        var error = newAnimal.fields[field] === '' && schema._fields[field]._required;
        const req = schema._fields[field]._required;
        inputErr[key] = error;
        switch(schema._fields[field]._type) {   /* check the type of the field and display appropriate input method */
            case "java.lang.Boolean":
                return (
                    <FormControl error={error} required={req} sx={{width: '100%'}}>
                    <FormHelperText style={{margin: '0 0 2.5px 5px'}}>{req ? 'Required' : 'Not Required'}</FormHelperText>
                    <Select
                        value={newAnimal.fields[field] !== undefined ? newAnimal.fields[field] : ''}
                        size='small'
                        onChange={(e) => {
                            let newFields = newAnimal.fields;
                            newFields[field] = e.target.value;
                            setNewAnimal({...newAnimal, fields: newFields});
                        }}
                    >
                        {!schema._fields[field]._required && <MenuItem value={''}><em>Empty</em></MenuItem>}
                        <MenuItem value={true}>Yes</MenuItem>
                        <MenuItem value={false}>No</MenuItem>
                    </Select>
                    </FormControl>
                );
            case "java.lang.String":
                return (
                    <FormControl error={error} required={req} sx={{width: '100%'}}>
                    <FormHelperText style={{margin: '0 0 2.5px 5px'}}>{req ? 'Required' : 'Not Required'}</FormHelperText>
                    <TextField
                        fullWidth
                        size='small'
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
                    <FormControl error={error} required={req} sx={{width: '100%'}}>
                    <FormHelperText style={{margin: '0 0 2.5px 5px'}}>{req ? 'Required' : 'Not Required'}</FormHelperText>
                    <TextField
                        type='number'
                        fullWidth
                        size='small'
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
                    <FormControl error={error} required={req} sx={{width: '100%'}}>
                    <FormHelperText style={{margin: '0 0 2.5px 5px'}}>{req ? 'Required' : 'Not Required'}</FormHelperText>
                    <TextField
                        type='number'
                        fullWidth
                        size='small'
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
                    <FormControl error={error} required={req} sx={{width: '100%'}}>
                    <FormHelperText style={{margin: '0 0 2.5px 5px'}}>{req ? 'Required' : 'Not Required'}</FormHelperText>
                    <DatePicker
                        onChange={(e) => {
                            let newFields = newAnimal.fields;
                            newFields[field] = e.$d.toISOString();
                            setNewAnimal({...newAnimal, fields: newFields});
                        }}
                        slotProps={{textField: {fullWidth: true, size: 'small'}}}
                    />
                    </FormControl>
                )
            default:
                return <></>;
        };
    }

    useEffect(() => {
        inputErr['name'] = newAnimal.name === '';
        inputErr['type'] = newAnimal.type === '';
        inputErr['sex'] = newAnimal.sex === '';
    }, [newAnimal])

    return (<>
        {create ? <>
            <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '20px'}}>
            <TableContainer component={Paper} style={{marginRight: '20px'}}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell width='16.7%'>Name</TableCell>
                            <TableCell width='16.7%'>Type</TableCell>
                            <TableCell width='16.7%'>Father</TableCell>
                            <TableCell width='16.7%'>Mother</TableCell>
                            <TableCell width='16.6%'>Sex</TableCell>
                            <TableCell width='16.6%'>Farm</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        <TableRow>
                            <TableCell>
                                <TextField
                                    fullWidth
                                    error={newAnimal.name === ''}
                                    required
                                    size='small'
                                    onChange={(e)=>{
                                        setNewAnimal({...newAnimal, name: e.target.value});
                                    }}
                                    label='Name'/>
                            </TableCell>
                            <TableCell>
                                <Autocomplete
                                    renderOption={(props, option) => {
                                        return (
                                            <li {...props} key={option._name}>
                                                {option._name.charAt(0).toUpperCase() + option._name.slice(1)}
                                            </li>
                                        );
                                    }}
                                    isOptionEqualToValue={(option, value) => option._name === value._name}
                                    renderInput={(params) => <TextField {...params} fullWidth error={newAnimal.type === ''} required size='small' label="Type"/>}
                                    getOptionLabel={option => option._name.charAt(0).toUpperCase() + option._name.slice(1)}
                                    options={props.schemaList}
                                    onChange={(e, v) => {
                                        if(v) {
                                            setNewAnimal({...newAnimal, type: v._name, fields: {}});
                                            let tempSchema = props.schemaList.filter((schema) => schema._name === v._name).pop();
                                            setSchema(tempSchema);
                                            props.setOffset(129.6+20+152.5+20);
                                            setFieldList(Object.keys(tempSchema._fields));
                                        } else {
                                            setNewAnimal({...newAnimal, type: '', fields: {}, notes: ''});
                                            setSchema();
                                            props.setOffset(129.6+20);
                                            setFieldList([]);
                                        }}}
                                />
                            </TableCell>
                            <TableCell>
                                <Autocomplete
                                    renderOption={(props, option) => {
                                        return (
                                            <li {...props} key={option.id}>
                                                {option.name}
                                            </li>
                                        );
                                    }}
                                    renderInput={(params) => <TextField {...params} fullWidth required={false} size='small' label="Father"/>}
                                    isOptionEqualToValue={(option, value) => option.id === value.id}
                                    getOptionLabel={option => option.name}
                                    options={
                                        props.animalList.filter((animal)=>{return animal.type === newAnimal.type && animal.sex === 'm'}).map((animal)=>{
                                            return {id: animal._id, name: animal.name}
                                        })
                                    }
                                    onChange={(e, v) => {
                                        v ? setNewAnimal({...newAnimal, father: v.id}) : setNewAnimal({...newAnimal, father: ''});
                                    }}
                                />
                            </TableCell>
                            <TableCell>
                                <Autocomplete
                                    renderOption={(props, option) => {
                                        return (
                                            <li {...props} key={option.id}>
                                                {option.name}
                                            </li>
                                        );
                                    }}
                                    renderInput={(params) => <TextField {...params} fullWidth required={false} size='small' label="Mother"/>}
                                    isOptionEqualToValue={(option, value) => option.id === value.id}
                                    getOptionLabel={option => option.name}
                                    options={
                                        props.animalList.filter((animal)=>{return animal.type === newAnimal.type && animal.sex === 'f'}).map((animal)=>{
                                            return {id: animal._id, name: animal.name}
                                        })
                                    }
                                    onChange={(e, v) => {
                                        v ? setNewAnimal({...newAnimal, mother: v.id}) : setNewAnimal({...newAnimal, mother: ''})
                                    }}
                                />
                            </TableCell>
                            <TableCell>
                                <TextField
                                    select
                                    fullWidth
                                    error={newAnimal.sex === ''}
                                    required
                                    label='Sex'
                                    value={newAnimal.sex}
                                    size='small'
                                    onChange={(e) => {
                                        setNewAnimal({...newAnimal, sex: e.target.value});
                                    }}
                                >
                                    <MenuItem value={'f'}>Female</MenuItem>  
                                    <MenuItem value={'m'}>Male</MenuItem>
                                    <MenuItem value={'c'}>Castrated</MenuItem>
                                </TextField>
                            </TableCell>
                            <TableCell>
                                <TextField select fullWidth label='Farm' value={newAnimal.farm} size='small' onChange={(e) => {setNewAnimal({...newAnimal, farm: e.target.value})}}>
                                    <MenuItem value={''}><em>Empty</em></MenuItem>
                                    <MenuItem value={props.farms.WH}>Windmill Hill</MenuItem>
                                    <MenuItem value={props.farms.HC}>Hartcliffe</MenuItem>
                                    <MenuItem value={props.farms.SW}>St Werburghs</MenuItem>
                                </TextField>
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </TableContainer>
            <Button className='tallButton' variant='contained' endIcon={<DeleteIcon/>} onClick={() => {reset(); props.setOffset(36.5+20)}}>Discard</Button>
            </div>
            {schema ?
            <div style={{display: 'flex', justifyContent: 'space-between'}}>
            <TableContainer component={Paper} style={{marginRight: '20px'}}>
                <Table>
                    <TableHead>
                        <TableRow>
                            {Object.keys(schema._fields).map((field, index) => {
                                return (
                                <TableCell key={index} style={{width: `${100/(Object.keys(schema._fields).length + 1)}%`}}>{field.charAt(0).toUpperCase() + field.slice(1)}</TableCell>
                                );
                            })}
                            <TableCell style={{width: `${100/(Object.keys(schema._fields).length + 1)}%`}}>Notes</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        <TableRow>
                            {Object.keys(schema._fields).map((_, index) => {
                                return (
                                    <TableCell key={index}>{fieldList ? fieldTypeSwitch(index) : <p>Loading...</p>}</TableCell>
                                );
                            })}
                            <TableCell><TextField size='small' multiline fullWidth rows={2} onChange={(e) => {setNewAnimal({...newAnimal, notes: e.target.value})}}/></TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </TableContainer>
            <Button
                className='tallButton'
                variant="contained"
                aria-label="add"
                endIcon={<AddIcon/>}
                onClick={() => {
                    if (Object.values(inputErr).filter((err) => err === true).length > 0) {
                        showError();
                        return;
                    }
                    (async () => {
                        try {
                            await axios.post(`/animals/create`, newAnimal, token)
                        } catch(error) {
                            if (error.response.status === 401) {
                                window.location.href = "/login";
                                return;
                            } else {
                                window.alert(error);
                            }
                        }
                        window.location.reload(false);
                    })()
                }}
            >Create</Button>
            </div>
            : <></>}</>
        : <Button className='tallButton' variant='contained' endIcon={<AddIcon/>} style={{float: 'right'}} onClick={() => {setCreate(true); props.setOffset(129.6+20)}}>Create</Button>}
    </>)
}

export default AnimalCreator;