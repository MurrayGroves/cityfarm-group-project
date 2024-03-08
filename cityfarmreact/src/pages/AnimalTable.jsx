import React, {useEffect, useState} from "react";
import axios from '../api/axiosConfig'
import FarmTabs from "../components/FarmTabs";
import AnimalPopover from "../components/AnimalPopover";
import "./AnimalTable.css";
import { DataGrid, useGridApiRef } from '@mui/x-data-grid';
import TableContainer from '@mui/material/TableContainer';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Switch from '@mui/material/Switch';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

import EditIcon from '@mui/icons-material/Edit';

import AnimalCreator from "../components/AnimalCreator";

import { getConfig } from '../api/getToken';
import { Link } from "react-router-dom";
import { set } from "date-fns";
import { FormControlLabel, FormGroup, FormControl, FormHelperText, IconButton } from "@mui/material";
import Autocomplete from '@mui/material/Autocomplete';

const AnimalTable = ({farms}) => {
    const [animalList, setAnimalList] = useState([]); /* The State for the list of animals. The initial state is [] */
    const [searchTerm, setSearchTerm] = useState(''); /* The term being searched for in the searchbar */
    
    const [farm, setFarm] = useState(Object.keys(farms)[0]);

    const [filterModel, setFilterModel] = useState({items: []});
    const [schemas, setSchemas] = useState([]);
    const [selectedSchema, setSelectedSchema] = useState(null);
    const [newAnimal, setNewAnimal] = useState( useState({name: '', type: '', father: '', mother: '', male: true, alive: true, fields: {}}));

    const token = getConfig();

    const gridApi = useGridApiRef();

    function displayAll() {
        (async () => {
            try {
                const response = await axios.get(`/animals`, token);
                setAnimalList(response.data);
            } catch (error) {
                console.log(error);
                if (error.response.status === 401) {
                    window.location.href = "/login";
                    return;
                } else {
                    window.alert(error);
                }
            };
        })()
    }

    useEffect(() => {
        (async () => {
            if (searchTerm === '') {
                displayAll();
                return;
            }
            try {
                const response = await axios.get(`/animals/by_name/${searchTerm}`, token);
                setAnimalList(response.data);
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

    useEffect(() => {
        (async () => {
            try {
                const response = await axios.get(`/schemas`, token);
                setSchemas(response.data);
            } catch (error) {
                if (error.response.status === 401) {
                    window.location.href = "/login";
                    return;
                } else {
                    window.alert(error);
                }
            }
        })()
    }, [])


    function calculateColumnsAndRows(schema) {
        let newCols = defaultCols;

        if (schema) {
            for (let key in schema._fields) {
                newCols.push({field: key, headerName: key, headerClassName: 'grid-header', headerAlign: 'left', flex: 1, editable: true, renderEditCell: (params) => {
                    return fieldTypeSwitch(schema._fields[key]._type, params);
                }});
            }
        }
 
        setCols(newCols);

        const defaultRows = animalList.map((animal) => ({
            id: animal._id,
            name: animal,
            type: animal.type.charAt(0).toUpperCase() + animal.type.slice(1),
            father: animal.father !== null ? animal : 'Unregistered',
            mother: animal.mother !== null ? animal : 'Unregistered',
            sex: animal.male ? 'Male' : 'Female',
        }));

        let newRows = [];
        for (let i = 0; i < defaultRows.length; i++) {
            let newRow = defaultRows[i];
            if (schema) {
                if (newRow.type.toLowerCase() !== schema._name.toLowerCase()) {
                    continue;
                }
                let animal = animalList.find((animal) => {return animal._id === newRow.id});
                for (let key in schema._fields) {
                    newRow[key] = animal.fields[key];
                }
            }
       
            newRows.push(newRow);
        }
        setRows(newRows);
    }

    useEffect(() => {
        calculateColumnsAndRows(selectedSchema);
    }, [selectedSchema, animalList])

    const [rows, setRows] = useState([]);

    useEffect(() => {
        const defaultRows = animalList.map((animal) => ({
            id: animal._id,
            name: animal,
            type: animal.type.charAt(0).toUpperCase() + animal.type.slice(1),
            father: animal.father !== null ? animal : 'Unregistered',
            mother: animal.mother !== null ? animal : 'Unregistered',
            sex: animal.male ? 'Male' : 'Female',
        }));
        setRows(defaultRows);
    }, [animalList])


    const fieldTypeSwitch = (type, params) => {
        switch(type) { /* check the type of the field and display appropriate input method */
            case "java.lang.Boolean":
                return (
                    <FormControl sx={{width: '100%'}}>
                    <Select
                        value={params.value}
                        onChange={(e) => {
                            gridApi.current.setEditCellValue({id: params.id, field: params.field, value: e.target.value});
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
                    <FormControl sx={{width: '100%'}}>
                    <TextField
                        fullWidth
                        placeholder={params.value}
                        onChange={(e) => {
                            gridApi.current.setEditCellValue({id: params.id, field: params.field, value: e.target.value});
                        }}
                    />
                    </FormControl>
                );
            case "java.lang.Integer":
                return (
                    <FormControl sx={{width: '100%'}}>
                    <TextField
                        type='number'
                        fullWidth
                        placeholder={params.value}
                        onChange={(e) => {
                            gridApi.current.setEditCellValue({id: params.id, field: params.field, value: e.target.value});
                        }}
                    />
                    </FormControl>
                );
            case "java.lang.Double":
                return (
                    <FormControl  sx={{width: '100%'}}>
                    <TextField
                        type='number'
                        fullWidth
                        placeholder={params.value}
                        onChange={(e) => {
                            gridApi.current.setEditCellValue({id: params.id, field: params.field, value: e.target.value});
                        }}
                    />
                    </FormControl>
                );
            case "java.time.ZonedDateTime":
                return (
                    <FormControl sx={{width: '100%'}}>
                    <DatePicker
                        onChange={(e) => {
                            gridApi.current.setEditCellValue({id: params.id, field: params.field, value: e.target.value});
                        }}
                        slotProps={{textField: {fullWidth: true}}}
                    />
                    </FormControl>
                )
            default:
                return <></>;
        };
    }

    const defaultCols = [
        { field: 'name', headerName: 'Name', headerClassName: 'grid-header', headerAlign: 'left', flex: 1, editable: true,
            renderCell: (animal) => {return <AnimalPopover animalID={animal.value._id}/>}, renderEditCell: (params) => {
                params.value = params.value.name;
                return fieldTypeSwitch("java.lang.String", params);
            } },
        { field: 'type', headerName: 'Type', headerClassName: 'grid-header', headerAlign: 'left', flex: 1 },
        { field: 'father', headerName: 'Father', headerClassName: 'grid-header', headerAlign: 'left', flex: 1, editable: true,
        renderCell:(animal)=>{return animal.value.father?
             <AnimalPopover key={animal.value.father} animalID={animal.value.father}/> : "Unregistered"}, renderEditCell: (params) => {
                return (
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
                                        animalList.filter((animal)=>{return animal.type.toLowerCase() === params.row.type.toLowerCase() && animal.male === true && animal._id !== params.row.id}).map((animal)=>{
                                            return {id: animal._id, name: animal.name}
                                        })
                                    }
                    />
                );
            }},
        { field: 'mother', headerName: 'Mother', headerClassName: 'grid-header', headerAlign: 'left', flex: 1, editable: true,
            renderCell:(animal)=>{return animal.value.mother?
                <AnimalPopover key={animal.value.mother} animalID={animal.value.mother}/> : "Unregistered"}, renderEditCell: (params) => {
                    return (<Autocomplete
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
                            animalList.filter((animal)=>{console.log(animal);return animal.type.toLowerCase() === params.row.type.toLowerCase() && animal.male === false && animal._id !== params.row.id}).map((animal)=>{
                                return {id: animal._id, name: animal.name}
                            })
                        }
                    />)
                }},
        { field: 'sex', headerName: 'Sex', headerClassName: 'grid-header', headerAlign: 'left', flex: 1, editable: true, renderEditCell: (params) => {
            return (<Autocomplete
                style={{width: '100%'}}
                size='medium'
                renderOption={(props, option) => {
                    return (
                        <li {...props} key={option.id}>
                            {option.name}
                        </li>
                    );
                }}
                renderInput={(params) => <TextField {...params} label="Sex"/>}
                isOptionEqualToValue={(option, value) => option.id === value.id}
                getOptionLabel={option => option.name}
                options={
                    [
                        {id: 1, name: "Male"},
                        {id: 2, name: "Female"},
                        {id: 3, name: "Castrated"}
                    ]
                }
            />)
        }},
    ];
    const [cols, setCols] = useState(defaultCols);

    return(<>
        <h1>Livestock</h1>
        <span style={{display: 'flex', justifyContent: 'space-between', height: '60px'}}>
            <TextField
                size='small'
                placeholder='Search'
                style={{margin: '0 20px 20px 0'}}
                onChange={(e) => setSearchTerm(e.target.value)}
            ></TextField>
            <FarmTabs farms={farms} selectedFarm={farm} setSelectedFarm={setFarm}/>
        </span>
        <Paper style={{height: 'calc(100% - 525px)', marginBottom: '20px'}}>
            <DataGrid apiRef={gridApi} isCellEditable={() => true} disableRowSelectionOnClick filterModel={filterModel} style={{fontSize: '1rem'}} checkboxSelection columns={[...cols, {
                field: 'edit',
                headerName: 'Edit',
                headerClassName: 'grid-header',
                headerAlign: 'right',
                flex: 0.1,
                renderCell: (params) => {
                    return <IconButton onClick={() => {
                        gridApi.current.startRowEditMode({ id: params.id });
                    }}><EditIcon/></IconButton>
                    
                }
            }]} rows={rows} onCellClick={(params, event, details) => {
                if (params.field === 'type') {
                    setFilterModel({
                        items: [
                         {
                          id: 1,
                          field: "type",
                          operator: "contains",
                          value: params.value,
                         },
                        ]
                    })

                    let schema = schemas.find((schema) => {return schema._name.toLowerCase() === params.value.toLowerCase()});
                    setSelectedSchema(schema);
                }
            }}/>
        </Paper>
        <div style={{marginTop: '1%', display: 'flex'}}>            
            <Button variant="contained" onClick={() => {
                setFilterModel({items: []});
                setSelectedSchema(null);
            }}>Clear Filter</Button>
            {selectedSchema ? <p style={{marginLeft: '1%'}}>Currently filtering to show {selectedSchema._name}s</p> : <></>}
        </div>
        <AnimalCreator animalList={animalList}/>
    </>)
}

export default AnimalTable;
