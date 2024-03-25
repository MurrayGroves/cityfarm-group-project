import React, { useState, useEffect } from 'react';
import axios from "../api/axiosConfig";
import './AnimalCreator.css';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Divider from '@mui/material/Divider';
import Fab from '@mui/material/Fab';
import { FormHelperText, Select, Backdrop, Alert } from "@mui/material";
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
    const [inputErr, setInputErr] = useState({});
    const [showErr, setShowErr] = useState(false);

    const token = getConfig();

    const reset = () => {
        props.setCreate(false);
        setNewAnimal({name: '', type: '', father: '', mother: '', sex: '', alive: true, farm: '', fields: {}, notes: ''})
        setInputErr({name: true, type: true, sex: true});
        setSchema();
    }

    useEffect(() => {
        setInputErr(prevInputErr => ({...prevInputErr, name: newAnimal.name === ''}));
        setInputErr(prevInputErr => ({...prevInputErr, type: newAnimal.type === ''}));
        setInputErr(prevInputErr => ({...prevInputErr, sex: newAnimal.sex === ''}));
        Object.keys(newAnimal.fields).map((field) => {
            setInputErr(prevInputErr => ({...prevInputErr, [field]: newAnimal.fields[field] === '' && schema._fields[field]._required}))
        });
    }, [newAnimal])

    const fieldTypeSwitch = (key) => {
        let field = fieldList[key];
        if (newAnimal.fields[field] === undefined) newAnimal.fields[field] = '';    /* initialise field values to empty strings */
        var error = newAnimal.fields[field] === '' && schema._fields[field]._required;
        const req = schema._fields[field]._required;
        switch(schema._fields[field]._type) {   /* check the type of the field and display appropriate input method */
            case "java.lang.Boolean":
                return (
                    <FormControl fullWidth error={error} required={req}>
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
                    <FormControl fullWidth error={error} required={req}>
                    <FormHelperText style={{margin: '0 0 2.5px 5px'}}>{req ? 'Required' : 'Not Required'}</FormHelperText>
                    <TextField
                        fullWidth
                        size='small'
                        placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
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
                    <FormControl fullWidth error={error} required={req}>
                    <FormHelperText style={{margin: '0 0 2.5px 5px'}}>{req ? 'Required' : 'Not Required'}</FormHelperText>
                    <TextField
                        type='number'
                        fullWidth
                        size='small'
                        placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
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
                    <FormControl fullWidth error={error} required={req}>
                    <FormHelperText style={{margin: '0 0 2.5px 5px'}}>{req ? 'Required' : 'Not Required'}</FormHelperText>
                    <TextField
                        type='number'
                        fullWidth
                        size='small'
                        placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
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
                    <FormControl fullWidth error={error} required={req}>
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

    return (<>
        <TableContainer>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell sx={{minWidth: '120px'}} width='16.7%'>Name</TableCell>
                        <TableCell sx={{minWidth: '120px'}} width='16.7%'>Type</TableCell>
                        <TableCell sx={{minWidth: '120px'}} width='16.7%'>Father</TableCell>
                        <TableCell sx={{minWidth: '120px'}} width='16.7%'>Mother</TableCell>
                        <TableCell sx={{minWidth: '120px'}} width='16.6%'>Sex</TableCell>
                        <TableCell sx={{minWidth: '120px'}} width='16.6%'>Farm</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    <TableRow>
                        <TableCell sx={{borderBottom: 'none'}}>
                            <TextField
                                fullWidth
                                error={newAnimal.name === ''}
                                required
                                size='small'
                                value={newAnimal.name}
                                onChange={(e)=>{
                                    setNewAnimal({...newAnimal, name: e.target.value});
                                }}
                                label='Name'/>
                        </TableCell>
                        <TableCell sx={{borderBottom: 'none'}}>
                            <Autocomplete
                                renderOption={(props, option) => {
                                    return (
                                        <li {...props} key={option._name}>
                                            {option._name}
                                        </li>
                                    );
                                }}
                                isOptionEqualToValue={(option, value) => option._name === value._name}
                                renderInput={(params) => <TextField {...params} fullWidth error={newAnimal.type === ''} required size='small' label="Type"/>}
                                getOptionLabel={option => option._name}
                                options={props.schemaList}
                                onChange={(e, v) => {
                                    if(v) {
                                        setNewAnimal({...newAnimal, type: v._name, fields: {}});
                                        let tempSchema = props.schemaList.filter((schema) => schema._name === v._name).pop();
                                        setSchema(tempSchema);
                                        setFieldList(Object.keys(tempSchema._fields));
                                    } else {
                                        setNewAnimal({...newAnimal, type: '', fields: {}, notes: ''});
                                        setSchema();
                                        setFieldList([]);
                                        setInputErr({});
                                    }}}
                            />
                        </TableCell>
                        <TableCell sx={{borderBottom: 'none'}}>
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
                        <TableCell sx={{borderBottom: 'none'}}>
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
                        <TableCell sx={{borderBottom: 'none'}}>
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
                        <TableCell sx={{borderBottom: 'none'}}>
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
        {schema ? <>
        <Divider/>
        <Divider/>
        <Divider/>
        <TableContainer>
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
                                <TableCell sx={{borderBottom: 'none'}} key={index}>{fieldList ? fieldTypeSwitch(index) : <p>Loading...</p>}</TableCell>
                            );
                        })}
                        <TableCell sx={{borderBottom: 'none'}}><TextField size='small' multiline placeholder='Add notes...' fullWidth rows={2} onChange={(e) => {setNewAnimal({...newAnimal, notes: e.target.value})}}/></TableCell>
                    </TableRow>
                </TableBody>
            </Table>
        </TableContainer>
        <Fab
            sx={props.device === 'mobile' ? {position: 'absolute', bottom: '90px', right: '-10px'} : {position: 'absolute', bottom: '110px', right: '10px'}}
            color='success'
            onClick={() => {
                if (Object.values(inputErr).filter((err) => err === true).length > 0) {
                    return setShowErr(true);
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
        ><AddIcon/></Fab></>
        : <></>}
        <Backdrop style={{zIndex: '4', background: '#000000AA'}} open={showErr} onClick={() => setShowErr(false)}>
            <Alert severity='warning'>
                Please ensure all required fields are filled
            </Alert>
        </Backdrop>
    </>)
}

export default AnimalCreator;