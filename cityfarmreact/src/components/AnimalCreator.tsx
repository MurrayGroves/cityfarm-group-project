import React, { useState, useEffect } from 'react';
import axios from "../api/axiosConfig.js";
import './AnimalCreator.css';
import { TransitionGroup } from 'react-transition-group';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Divider, Fab, FormHelperText, Select, Backdrop, Alert, MenuItem, FormControl, TextField, Autocomplete, Collapse } from '@mui/material';
import { Add as AddIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { getConfig } from '../api/getToken.js';

import { CityFarm } from '../api/cityfarm.ts';
import { Schema, Animal, Sex } from '../api/animals.ts';
import { EventSelectorButton } from './EventSelectorButton.tsx';

const AnimalCreator = ({farms, schemaList, animalList, device, create, createClicked, setCreateClicked}: {farms: any, schemaList: Schema[], animalList: Animal[], device: any, create: boolean, createClicked: boolean, setCreateClicked: (clicked: boolean) => void}) => {
    const [newAnimal, setNewAnimal] = useState<any>(new Animal({name: '', type: '', father: '', mother: '', sex: '', alive: true, farm: '', fields: {}, notes: ''}));
    const [schema, setSchema] = useState<Schema | null>();
    const [fieldList, setFieldList] = useState<string[]>([]);
    const [inputErr, setInputErr] = useState({});
    const [showErr, setShowErr] = useState(false);
    const [eventDialog, setEventDialog] = useState(null);
    const [idToEvent, setIdToEvent] = useState({});

    useEffect(() => {
        if (createClicked) handleCreate();
        setCreateClicked(false);
    }, [createClicked])

    useEffect(() => {
        !create && reset();
    }, [create])

    const token = getConfig();

    const reset = () => {
        setNewAnimal(new Animal({name: '', type: '', father: '', mother: '', sex: '', alive: true, farm: '', fields: {}, notes: ''}));
        setSchema(null);
        setFieldList(new Array);
        setInputErr(new Object);
    }

    const handleCreate = () => {
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
                        {!schema.fields[field].required && <MenuItem value={''}><em>Empty</em></MenuItem>}
                        <MenuItem value={1}>Yes</MenuItem>
                        <MenuItem value={0}>No</MenuItem>
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
                            setNewAnimal({...newAnimal, fields: newFields});
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
                            setNewAnimal({...newAnimal, fields: newFields});
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
                            setNewAnimal({...newAnimal, fields: newFields});
                        }}
                    />
                    </FormControl>
                );
            case "cityfarm.api.calendar.EventRef":
                return (
                    <EventSelectorButton key={key} cityfarm={new CityFarm} farms={farms} currentEventID={newAnimal.fields[field]} setEventID={(eventID) => {
                        let newFields = newAnimal.fields;
                        newFields[field] = eventID;
                        setNewAnimal({...newAnimal, fields: newFields});
                    }} style={undefined}/>
                )
            default:
                return <></>;
        };
    }

    const [typeInput, setTypeInput] = useState('');
    const [fatherInput, setFatherInput] = useState('');
    const [motherInput, setMotherInput] = useState('');

    return (<>
        <TableContainer>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell sx={{minWidth: '135px'}} width='16.7%'>Name</TableCell>
                        <TableCell sx={{minWidth: '135px'}} width='16.7%'>Type</TableCell>
                        <TableCell sx={{minWidth: '135px'}} width='16.7%'>Father</TableCell>
                        <TableCell sx={{minWidth: '135px'}} width='16.7%'>Mother</TableCell>
                        <TableCell sx={{minWidth: '135px'}} width='16.6%'>Sex</TableCell>
                        <TableCell sx={{minWidth: '135px'}} width='16.6%'>Farm</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    <TableRow>
                        <TableCell sx={{ borderBottom: 'none' }}>
                            <TextField
                                fullWidth
                                error={newAnimal.name === ''}
                                required
                                size='small'
                                onChange={(e) => {
                                    setNewAnimal({ ...newAnimal, name: e.target.value });
                                } }
                                label='Name' />
                        </TableCell>
                        <TableCell sx={{ borderBottom: 'none' }}>
                            <Autocomplete
                                value={schema || null}
                                inputValue={typeInput}
                                onInputChange={(_, newInput) => setTypeInput(newInput)}
                                isOptionEqualToValue={(option, value) => option.name === value.name}
                                renderInput={(params) => <TextField {...params} fullWidth error={newAnimal.type === ''} required size='small' label="Type" />}
                                getOptionLabel={option => option.name}
                                options={schemaList}
                                onChange={(_, v) => {
                                    if (v) {
                                        setNewAnimal({ ...newAnimal, mother: '', father: '', type: v.name, fields: {} });
                                        setSchema(v);
                                        setFieldList(Object.keys(v.fields));
                                    } else {
                                        setNewAnimal({ ...newAnimal, mother: '', father: '', type: '', fields: {}, notes: '' });
                                        setSchema(null);
                                        setFieldList([]);
                                        setInputErr({});
                                    }
                                } } />
                        </TableCell>
                        <TableCell sx={{borderBottom: 'none'}}>
                            <Autocomplete
                                value={animalList.find((animal) => newAnimal.father === animal.id) || null}
                                inputValue={fatherInput}
                                onInputChange={(_, newInput) => setFatherInput(newInput)}
                                renderInput={(params) => <TextField {...params} fullWidth required={false} size='small' label="Father" />}
                                isOptionEqualToValue={(option, value) => option.id === value.id}
                                getOptionLabel={option => option.name}
                                options={animalList.filter((animal) => { return animal.type === newAnimal.type && (animal.sex === Sex.Male || animal.sex === Sex.Castrated); }).map((animal) => {
                                    return animal;
                                })}
                                onChange={(_, v) => {
                                    v ? setNewAnimal({ ...newAnimal, father: v.id }) : setNewAnimal({ ...newAnimal, father: '' });
                                } } />
                        </TableCell>
                        <TableCell sx={{borderBottom: 'none'}}>
                            <Autocomplete
                                value={animalList.find((animal) => newAnimal.mother === animal.id) || null}
                                inputValue={motherInput}
                                onInputChange={(_, newInput) => setMotherInput(newInput)}
                                renderInput={(params) => <TextField {...params} fullWidth required={false} size='small' label="Mother" />}
                                isOptionEqualToValue={(option, value) => option.id === value.id}
                                getOptionLabel={option => option.name}
                                options={animalList.filter((animal) => { return animal.type === newAnimal.type && animal.sex === Sex.Female; }).map((animal) => {
                                    return animal;
                                })}
                                onChange={(_, v) => {
                                    v ? setNewAnimal({ ...newAnimal, mother: v.id }) : setNewAnimal({ ...newAnimal, mother: '' });
                                } } />
                        </TableCell>
                        <TableCell sx={{borderBottom: 'none'}}>
                            <TextField
                                select
                                fullWidth
                                error={newAnimal.sex === null}
                                required
                                label='Sex'
                                value={newAnimal.sex || ''}
                                size='small'
                                onChange={(e) => {
                                    setNewAnimal({ ...newAnimal, sex: e.target.value });
                                }}
                            >
                                <MenuItem value={'f'}>Female</MenuItem>
                                <MenuItem value={'m'}>Male</MenuItem>
                                <MenuItem value={'c'}>Castrated</MenuItem>
                            </TextField>
                        </TableCell>
                        <TableCell sx={{borderBottom: 'none'}}>
                            <TextField select fullWidth label='Farm' value={newAnimal.farm} size='small' onChange={(e) => { setNewAnimal({ ...newAnimal, farm: e.target.value }); } }>
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
        <Collapse in={schema instanceof Schema}>
        <Divider/>
        <Divider/>
        <Divider/>
        <TableContainer>
            <Table>
                <TableHead>
                    <TableRow>
                        {Object.keys(schema?.fields ?? {}).map((field, index) => {
                            return (
                            <TableCell key={index} style={{width: `${100/(Object.keys(schema?.fields ?? {}).length + 1)}%`}}>{field.charAt(0).toUpperCase() + field.slice(1)}</TableCell>
                            );
                        })}
                        <TableCell style={{width: `${100/(Object.keys(schema?.fields ?? {}).length + 1)}%`}}>Notes</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    <TableRow>
                        {Object.keys(schema?.fields ?? {}).map((key, index) => {
                            return (
                                <TableCell sx={{borderBottom: 'none'}} key={index}>{fieldList ? fieldTypeSwitch(index) : <p>Loading...</p>}</TableCell>
                            );
                        })}
                        <TableCell sx={{borderBottom: 'none'}}><TextField size='small' multiline placeholder='Add notes...' fullWidth rows={2} onChange={(e) => {setNewAnimal({...newAnimal, notes: e.target.value})}}/></TableCell>
                    </TableRow>
                </TableBody>
            </Table>
        </TableContainer>
        {device === 'mobile' &&
        <Fab
            sx={{position: 'absolute', bottom: '90px', right: '-10px'}}
            color='success'
            onClick={() => handleCreate()}
        >
            <AddIcon/>
        </Fab>}
        </Collapse>
        <Backdrop style={{zIndex: '4', background: '#000000AA'}} open={showErr} onClick={() => setShowErr(false)}>
            <Alert severity='warning'>
                Please ensure all required fields are filled
            </Alert>
        </Backdrop>
    </>)
}

export default AnimalCreator;