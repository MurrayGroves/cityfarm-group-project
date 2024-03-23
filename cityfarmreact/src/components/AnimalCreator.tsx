import React, { useState, useEffect } from 'react';
import axios from "../api/axiosConfig.js";
import './AnimalCreator.css';

import {
        FormHelperText, Select, Backdrop, Alert, Dialog, Table, TableCell, TableBody, TableContainer, TableHead, TableRow,
        Paper, MenuItem, FormControl, Button, TextField, Autocomplete
    } from "@mui/material";

import { Add, Delete, Close } from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { getConfig } from '../api/getToken.js';

import { FindOrCreateEvent } from './FindOrCreateEvent.tsx';
import { CityFarm } from '../api/cityfarm.ts';
import { Schema, Animal, Sex } from '../api/animals.ts';

const AnimalCreator = ({farms, cityfarm, setOffset, schemaList, animalList}: {farms: any, cityfarm: CityFarm, setOffset: (number) => void, schemaList: Schema[], animalList: Animal[]}) => {
    const [newAnimal, setNewAnimal] = useState<Animal>(new Animal({name: '', type: '', father: '', mother: '', sex: '', alive: true, farm: '', fields: {}, notes: ''}));
    const [schema, setSchema] = useState<Schema | null>();
    const [fieldList, setFieldList] = useState<string[]>([]);
    const [create, setCreate] = useState(false);
    const [inputErr, setInputErr] = useState({});
    const [showErr, setShowErr] = useState(false);
    const [eventDialog, setEventDialog] = useState(null);
    const [idToEvent, setIdToEvent] = useState({});

    const token = getConfig();

    const reset = () => {
        setCreate(false);
        setNewAnimal({name: '', type: '', father: '', mother: '', sex: Sex.Male, alive: true, farm: '', fields: {}, notes: '', id: '', dateOfBirth: new Date(), breed: ''})
        setInputErr({name: true, type: true, sex: true});
        setSchema(null);
    }

    useEffect(() => {
        setInputErr(prevInputErr => ({...prevInputErr, name: newAnimal.name === ''}));
        setInputErr(prevInputErr => ({...prevInputErr, type: newAnimal.type === ''}));
        setInputErr(prevInputErr => ({...prevInputErr, sex: newAnimal.sex === null}));
        if (!schema) return;
        Object.keys(newAnimal.fields).map((field) => {
            setInputErr(prevInputErr => ({...prevInputErr, [field]: (newAnimal.fields[field] === '' || newAnimal.fields[field] === null) && schema.fields[field].required}))
        });
    }, [newAnimal])

    const fieldTypeSwitch = (key) => {
        if (!schema) return;
        let field = fieldList[key];
        if (newAnimal.fields[field] === undefined) newAnimal.fields[field] = '';    /* initialise field values to empty strings */
        var error = newAnimal.fields[field] === '' && schema.fields[field].required;
        const req = schema.fields[field].required;
        switch(schema.fields[field].type) {   /* check the type of the field and display appropriate input method */
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
                        {!schema.fields[field].required && <MenuItem value={''}><em>Empty</em></MenuItem>}
                        <MenuItem value={1}>Yes</MenuItem>
                        <MenuItem value={0}>No</MenuItem>
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
                        placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                        onChange={(e) => {
                            let newFields = newAnimal.fields;
                            newFields[field] = e.target.value;
                            setNewAnimal({...newAnimal, fields: newFields});
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
                        placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                        onChange={(e) => {
                            let newFields = newAnimal.fields;
                            newFields[field] = e.target.value;
                            setNewAnimal({...newAnimal, fields: newFields});
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
                        placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                        onChange={(e) => {
                            let newFields = newAnimal.fields;
                            newFields[field] = e.target.value;
                            setNewAnimal({...newAnimal, fields: newFields});
                        }}
                    />
                    </FormControl>
                );
            case "cityfarm.api.calendar.EventRef":
                return (
                    newAnimal.fields[field] === null || newAnimal.fields[field] === '' ?
                    <div>
                    <Button variant="contained" onClick={() => setEventDialog(key)}>Select Event</Button>
                    <Dialog open={eventDialog === key} onClose={() => setEventDialog(null)}>
                        <FindOrCreateEvent style={{padding: '1%', width: '30vw', height: '80vh'}} farms={farms} cityfarm={cityfarm} setEvent={(eventID) => {
                            let newFields = newAnimal.fields;
                            newFields[field] = eventID;
                            setNewAnimal({...newAnimal, fields: newFields});
                        }}/>
                    </Dialog>
                    </div>
                    :
                    <div>
                        <Button startIcon={<Close/>} variant="outlined" onClick={() => {
                            let newFields = newAnimal.fields;
                            newFields[field] = '';
                            setNewAnimal({...newAnimal, fields: newFields});                        
                        }}>{idToEvent[newAnimal.fields[field]].event.title}</Button>
                    </div>
                )
            default:
                return <></>;
        };
    }

    return (<>
        {create ? <>
            <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: schema ? '10px' : '0', marginTop: '10px'}}>
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
                                            <li {...props} key={option.name}>
                                                {option.name}
                                            </li>
                                        );
                                    }}
                                    isOptionEqualToValue={(option, value) => option.name === value.name}
                                    renderInput={(params) => <TextField {...params} fullWidth error={newAnimal.type === ''} required size='small' label="Type"/>}
                                    getOptionLabel={option => option.name}
                                    options={schemaList}
                                    onChange={(e, v) => {
                                        if(v) {
                                            setNewAnimal({...newAnimal, type: v.name, fields: {}});
                                            let tempSchema = schemaList.find((schema) => schema.name === v.name);
                                            if (!tempSchema) {
                                                console.error('Schema not found');
                                                return;
                                            };
                                            setSchema(tempSchema);
                                            setOffset(129.6+20+152.5+10);
                                            setFieldList(Object.keys(tempSchema.fields));
                                        } else {
                                            setNewAnimal({...newAnimal, type: '', fields: {}, notes: ''});
                                            setSchema(null);
                                            setOffset(129.6+20);
                                            setFieldList([]);
                                            setInputErr({});
                                        }}}
                                />
                            </TableCell>
                            <TableCell>
                                <Autocomplete
                                    renderOption={(props, option: any) => {
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
                                        animalList.filter((animal)=>{return animal.type === newAnimal.type && animal.sex === Sex.Male}).map((animal)=>{
                                            return {id: animal.id, name: animal.name}
                                        })
                                    }
                                    onChange={(e, v) => {
                                        v ? setNewAnimal({...newAnimal, father: v.id}) : setNewAnimal({...newAnimal, father: ''});
                                    }}
                                />
                            </TableCell>
                            <TableCell>
                                <Autocomplete
                                    renderOption={(props, option: any) => {
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
                                        animalList.filter((animal)=>{return animal.type === newAnimal.type && animal.sex === Sex.Female}).map((animal)=>{
                                            return {id: animal.id, name: animal.name}
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
                                    error={newAnimal.sex === null}
                                    required
                                    label='Sex'
                                    value={newAnimal.sex}
                                    size='small'
                                    onChange={(e) => {
                                        let sex;
                                        switch(e.target.value) {
                                            case 'f':
                                                sex = Sex.Female;
                                                break;
                                            case 'm':
                                                sex = Sex.Male;
                                                break;
                                            case 'c':
                                                sex = Sex.Castrated;
                                                break;
                                            default:
                                                sex = null;
                                        };
                                        setNewAnimal({...newAnimal, sex: sex});
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
                                    <MenuItem value={farms.WH}>Windmill Hill</MenuItem>
                                    <MenuItem value={farms.HC}>Hartcliffe</MenuItem>
                                    <MenuItem value={farms.SW}>St Werburghs</MenuItem>
                                </TextField>
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </TableContainer>
            <div style={{flex: '1'}}>
            <Button style={{height: '40%', margin: '5%'}} className='tallButton' variant='contained' color='warning' endIcon={<Delete/>} onClick={() => {reset(); setOffset(36.5+20)}}>Discard</Button>
            <Button
                className='tallButton'
                variant="contained"
                aria-label="add"
                color='success'
                endIcon={<Add/>}
                style={{height: '40%', margin: '5%'}}
                disabled={(Object.values(inputErr).filter((err) => {return err === true}).length > 0) ? true : undefined}
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
                        window.location.reload();
                    })()
                }}
            >Create</Button>
            </div>
            </div>
            {schema ?
            <div style={{display: 'flex', justifyContent: 'space-between'}}>
            <TableContainer component={Paper} style={{marginRight: '20px'}}>
                <Table>
                    <TableHead>
                        <TableRow>
                            {Object.keys(schema.fields).map((field, index) => {
                                return (
                                <TableCell key={index} style={{width: `${100/(Object.keys(schema.fields).length + 1)}%`}}>{field.charAt(0).toUpperCase() + field.slice(1)}</TableCell>
                                );
                            })}
                            <TableCell style={{width: `${100/(Object.keys(schema.fields).length + 1)}%`}}>Notes</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        <TableRow>
                            {Object.keys(schema.fields).map((key, index) => {
                                return (
                                    <TableCell key={index}>{fieldList ? fieldTypeSwitch(index) : <p>Loading...</p>}</TableCell>
                                );
                            })}
                            <TableCell><TextField size='small' multiline placeholder='Add notes...' fullWidth rows={2} onChange={(e) => {setNewAnimal({...newAnimal, notes: e.target.value})}}/></TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </TableContainer>

            </div>
            : <></>}</>
        : <Button className='tallButton' variant='contained' endIcon={<Add/>} style={{float: 'left', marginTop: '10px'}} onClick={() => {setCreate(true); setOffset(129.6+20)}}>Create</Button>}
        <Backdrop style={{zIndex: '4', background: '#000000AA'}} open={showErr} onClick={() => setShowErr(false)}>
            <Alert severity='warning'>
                Please ensure all required fields are filled
            </Alert>
        </Backdrop>
    </>)
}

export default AnimalCreator;