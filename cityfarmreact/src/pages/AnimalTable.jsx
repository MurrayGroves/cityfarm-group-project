import React, {useEffect, useState} from "react";
import { Link } from "react-router-dom";
import { set } from "date-fns";
import axios from '../api/axiosConfig'
import FarmTabs from "../components/FarmTabs";
import AnimalPopover from "../components/AnimalPopover";
import AnimalCreator from "../components/AnimalCreator";
import FarmMoveButton from "../components/FarmMoveButton";
import { getConfig } from '../api/getToken';
import "./AnimalTable.css";
import { DataGrid, useGridApiRef, GridPagination } from '@mui/x-data-grid';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { Autocomplete, Backdrop, TableContainer, Paper, TextField, Button, Select, MenuItem, Fab, FormControlLabel, FormGroup, FormControl, FormHelperText, IconButton, Divider, Grid, Dialog, DialogContent, Alert, AlertTitle } from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete, Done as DoneIcon, Clear as ClearIcon } from '@mui/icons-material';

const AnimalTable = ({farms, device}) => {
    const [animalList, setAnimalList] = useState([]); /* The State for the list of animals. The initial state is [] */
    const [searchTerm, setSearchTerm] = useState(''); /* The term being searched for in the searchbar */
    const [schemaList, setSchemaList] = useState([]);

    const [farm, setFarm] = useState(null);

    const [filterModel, setFilterModel] = useState({items: []});
    const [schemas, setSchemas] = useState([]);
    const [selectedSchema, setSelectedSchema] = useState(null);
    const [newAnimal, setNewAnimal] = useState( useState({name: '', type: '', father: '', mother: '', male: true, alive: true, fields: {}}));
    const [modifyAnimal, setModifyAnimal] = useState({});
    const [editingRow, setEditingRow] = useState(null);

    const [deleteAnimal, setDeleteAnimal] = useState({})

    const [create, setCreate] = useState(false);
    const [del, setDel] = useState(false);

    const [selectedAnimals, setSelectedAnimals] = useState([])
    const token = getConfig();

    const gridApi = useGridApiRef();

    const handleDelAnimal = (animal) => (async () => {
        try {
            const response = await axios.delete(`/animals/by_id/${animal._id}`, token);
        } catch (error) {
            if (error.response.status === 401) {
                window.location.href = "/login";
                return;
            } else {
                window.alert(error);
            }
        }
        window.location.reload(false);
    })()

    function displayAll() {
        (async () => {
            try {
                const response = await axios.get(`/animals`, {params: {farm: farm}, ...token});
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

    function getSchemas() {
        (async () => {
            try {
                const response = await axios.get(`/schemas`, token);
                setSchemaList(response.data.reverse());
            } catch (error) {
                if (error.response.status === 401) {
                    window.location.href = "/login";
                    return;
                } else {
                    window.alert(error);
                }
            }
        })()
    }


    useEffect(getSchemas, [animalList]);

    useEffect(() => {
        (async () => {
            if (searchTerm === '') {
                displayAll();
                return;
            }
            try {
                const response = await axios.get(`/animals/by_name/${searchTerm}`, {params: {farm: farm}, ...token});
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
    },[searchTerm, farm])


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
            father: animal.father !== null ? animal.father : '',
            mother: animal.mother !== null ? animal.mother : '',
            sex: animal.sex ? sexToDisplay[animal.sex] : animal.sex,
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
                    newRow[key] = typeof animal.fields[key] === typeof false ? animal.fields[key] ? "Yes" : "No" : animal.fields[key];
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
            father: animal.father !== null ? animal.father : '',
            mother: animal.mother !== null ? animal.mother : '',
            sex: animal.sex ? sexToDisplay[animal.sex] : animal.sex,
        }));
        setRows(defaultRows);
    }, [animalList])


    function saveAnimal(animal_id) {
        let row = gridApi.current.getRow(animal_id)
        console.log(row);
        console.log(modifyAnimal)
        let old_animal = animalList.find((animal) => {return animal._id === animal_id});
        let animal = {...old_animal};
        animal.father = modifyAnimal.father ? modifyAnimal.father._id ? modifyAnimal.father._id : modifyAnimal.father : old_animal.father;
        animal.mother = modifyAnimal.mother ? modifyAnimal.mother._id ? modifyAnimal.mother._id : modifyAnimal.mother : old_animal.mother;
        animal.name = modifyAnimal.name ? modifyAnimal.name : old_animal.name;

        animal.sex = modifyAnimal.sex ? displayToSex[modifyAnimal.sex] : old_animal.sex;

        animal.fields = {};
        for (let key in old_animal.fields) {
            animal.fields[key] = animal.fields[key] ? animal.fields[key] : old_animal.fields[key];
        }

        if (old_animal !== modifyAnimal) {
            axios.patch(`/animals/by_id/${animal_id}`, animal, token).then(displayAll);
        }
    }

    const sexToDisplay = {
        "m": "Male",
        "f": "Female",
        "c": "Castrated"
    };

    const displayToSex = {
        "Male": "m",
        "Female": "f",
        "Castrated": "c"
    }

    const fieldTypeSwitch = (type, params) => {
        switch(type) { /* check the type of the field and display appropriate input method */
            case "java.lang.Boolean":
                return (
                    <FormControl sx={{width: '100%'}}>
                    <Select
                        value={params.value}
                        onChange={(e) => {
                            let current = {...modifyAnimal};
                            current.fields[params.field] = e.target.value;
                            setModifyAnimal(current);
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
                        defaultValue={params.value}
                        onChange={(e) => {
                            let current = {...modifyAnimal};
                            current.fields[params.field] = e.target.value;
                            setModifyAnimal(current);
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
                        defaultValue={params.value}
                        onChange={(e) => {
                            let current = {...modifyAnimal};
                            current.fields[params.field] = e.target.value;
                            setModifyAnimal(current);
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
                        defaultValue={params.value}
                        onChange={(e) => {
                            let current = {...modifyAnimal};
                            current.fields[params.field] = e.target.value;
                            setModifyAnimal(current);
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
                            let current = {...modifyAnimal};
                            current.fields[params.field] = e.target.value;
                            setModifyAnimal(current);
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
            renderCell: (animal) => {return (animal.value._id ? <AnimalPopover animalID={animal.value._id}/> : <p>Loading...</p>)}, renderEditCell: (params) => {
                params.value = params.value.name;
                return <FormControl sx={{width: '100%'}}>
                    <TextField
                        fullWidth
                        defaultValue={params.value}
                        onChange={(e) => {
                            let current = {...modifyAnimal};
                            current.name = e.target.value;
                            setModifyAnimal(current);
                            gridApi.current.setEditCellValue({id: params.id, field: params.field, value: e.target.value});
                        }}
                    />
                </FormControl>
            } },
        { field: 'type', headerName: 'Type', headerClassName: 'grid-header', headerAlign: 'left', flex: 1,
            renderCell: (cell) => {
                let exists = false;
                schemaList.forEach(schema => {
                    if(schema._name === cell.value) {
                        exists = true;
                    }
                });
                return exists 
                    ? <p>{cell.value}</p>
                    : <p style={{color: 'red'}}>{cell.value}</p>
            }
        },
        { field: 'father', headerName: 'Father', headerClassName: 'grid-header', headerAlign: 'left', flex: 1, editable: true,
        renderCell:(father)=>{
            return father.value?
             <AnimalPopover key={father.value} animalID={father.value}/> : "Unregistered"}, renderEditCell: (params) => {
                let initial_animal = animalList.find((animal) => {return animal._id === params.value});
                let initial_name = initial_animal ? initial_animal.name : 'Unregistered';
                return (
                    <Autocomplete
                        style={{width: '100%'}}
                        size='medium'
                        renderOption={(props, option) => {
                            return (
                                <li {...props} key={option._id}>
                                    {option.name}
                                </li>
                            );
                        }}
                        renderInput={(params) => <TextField {...params}/>}
                        isOptionEqualToValue={(option, value) => option._id === value._id}
                        getOptionLabel={option => option.name}
                        options={
                            animalList.filter((animal)=>{
                                return animal.type.toLowerCase() === params.row.type.toLowerCase() && animal.sex !== "f" && animal._id !== params.row.id
                            })
                        }
                        value={{_id: params.value, name: initial_name}}
                        onChange={(_, value) => {
                            console.log(modifyAnimal)
                            let current = {...modifyAnimal};
                            current.father = value;
                            setModifyAnimal(current);
                            gridApi.current.setEditCellValue({id: params.id, field: params.field, value: value._id});
                        }}
                    />
                );
            }},
        { field: 'mother', headerName: 'Mother', headerClassName: 'grid-header', headerAlign: 'left', flex: 1, editable: true,
            renderCell:(mother)=>{return mother.value?
                <AnimalPopover key={mother.value} animalID={mother.value}/> : "Unregistered"}, renderEditCell: (params) => {
                    let initial_animal = animalList.find((animal) => {return animal._id === params.value});
                    let initial_name = initial_animal ? initial_animal.name : 'Unregistered';
                    return (<Autocomplete
                        style={{width: '100%'}}
                        size='medium'
                        renderOption={(props, option) => {
                            return (
                                <li {...props} key={option._id}>
                                    {option.name}
                                </li>
                            );
                        }}
                        renderInput={(params) => <TextField {...params}/>}
                        isOptionEqualToValue={(option, value) => option._id === value._id}
                        getOptionLabel={option => option.name}
                        options={
                            animalList.filter((animal)=>{
                                return animal.type.toLowerCase() === params.row.type.toLowerCase() && animal.sex === "f" && animal._id !== params.row.id
                            })
                        }
                        value={{_id: params.value, name: initial_name}}
                        onChange={(_, value) => {
                            var current = {...modifyAnimal};
                            current.mother = value;
                            setModifyAnimal(current);
                            gridApi.current.setEditCellValue({id: params.id, field: params.field, value: value._id});
                        }}
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
                renderInput={(params) => <TextField {...params}/>}
                isOptionEqualToValue={(option, value) => option.id === value.id}
                getOptionLabel={option => option.name}
                value={{id: ["Male", "Female", "Castrated"].indexOf(params.value), name: params.value}}
                onChange={(_, value) => {
                    let current = {...modifyAnimal};
                    current.sex = value.name;
                    setModifyAnimal(current);
                    gridApi.current.setEditCellValue({id: params.id, field: params.field, value: value.name});
                }}
                options={
                    [
                        {id: 0, name: "Male"},
                        {id: 1, name: "Female"},
                        {id: 2, name: "Castrated"}
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
            />
            <FarmTabs farms={farms} selectedFarm={farm} setSelectedFarm={setFarm}/>
        </span>
        <div style={{display: 'flex', flexDirection: 'column', height: 'calc(100% - 150.88px)'}}>
        {/* this flex ain't flexing :( */}
        <Paper elevation={3} style={{flex: 1, minHeight: '0', minWidth: '0'}}>
            <DataGrid editMode="row" apiRef={gridApi} disableRowSelectionOnClick filterModel={filterModel} sx={{fontSize: '1rem'}} checkboxSelection
                paginationMode="server"
                rowCount={0}
                slots={{
                    footer: CustomFooter
                }}
                slotProps={{
                    footer: {
                        setFilterModel,
                        selectedSchema,
                        setSelectedSchema,
                        create,
                        setCreate
                    }
                }}
                onRowSelectionModelChange={(ids) => {
                    setSelectedAnimals(ids)
                }}
                columns={[...cols, {
                    field: 'edit',
                    headerName: '',
                    disableColumnMenu: true,
                    sortable: false,
                    headerClassName: 'grid-header',
                    headerAlign: 'right',
                    renderCell: (params) => {
                        return editingRow === params.row.id ?
                            <div>
                                <IconButton sx={{padding:'0px'}} onClick={() => {
                                    saveAnimal(params.row.id);
                                    gridApi.current.stopRowEditMode({id: params.row.id});
                                    setEditingRow(null);
                                }}>
                                    <DoneIcon sx={{color: 'green', padding:'0px'}}/>
                                </IconButton>

                                <IconButton sx={{padding: '0px'}} onClick={() => {
                                    gridApi.current.stopRowEditMode({id: params.row.id, ignoreModifications: true});
                                    setEditingRow(null);
                                }}>
                                    <ClearIcon sx={{color: 'red', padding: '0px'}}/>
                                </IconButton>
                            </div>
                        :
                            <div>
                            <IconButton onClick={() => {
                                let obj = animalList.find((animal) => {return animal._id === params.row.id});
                                setModifyAnimal(obj);
                                gridApi.current.startRowEditMode({ id: params.row.id });
                                setEditingRow(params.row.id);
                            }}>
                                <EditIcon/>
                            </IconButton>
                            <IconButton onClick={() => {
                                let ani = animalList.find((animal) => {return animal._id === params.row.id});
                                setDeleteAnimal(ani);
                                setDel(true);
                            }}>
                                <Delete/>
                            </IconButton>
                            </div>
                    }
                }]}
                rows={rows} onCellClick={(params, event, details) => {
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
                }}

                onRowEditStop={(params, e) => {
                    saveAnimal(params.row.id);
                    setEditingRow(null);
                }}
                onRowEditStart={(params, e) => {
                    setEditingRow(params.row.id);
                    let obj = animalList.find((animal) => {return animal._id === params.row.id});
                    setModifyAnimal(obj);
                }}
            />
        </Paper>
        {device === 'mobile' ?
        <Dialog PaperProps={{sx: {overflow: 'visible'}}} fullWidth maxWidth='xl' open={create} onClose={() => setCreate(false)}>
            <DialogContent sx={{p: 0}}>
                <AnimalCreator animalList={animalList} schemaList={schemaList} setCreate={setCreate} farms={farms} device={device}/>
            </DialogContent>
        </Dialog>
        :
        <>{create && <Paper sx={{mt: '10px'}} elevation={3}><AnimalCreator animalList={animalList} schemaList={schemaList} setCreate={setCreate} farms={farms} device={device}/></Paper>}</>}
        <div className="fmButtons">{
            selectedAnimals.length > 0 ? (
                Object.entries(farms).map((farm) => (
                        <React.Fragment key={farm}>
                            <FarmMoveButton farm={farm} ids={selectedAnimals}/>
                        </React.Fragment>
                    )))
            :  ''}
        </div>
        </div>
        <Backdrop style={{zIndex: '4', background: '#000000AA'}} open={del} onClick={() => {setDel(false);}}>
            <Alert
                severity='warning'
                action={<Button color='warning' variant='contained' onClick={() => handleDelAnimal(deleteAnimal)}>Yes</Button>}
            >
                <AlertTitle>Confirmation</AlertTitle>
                Are you sure you want to delete {deleteAnimal.name}?
            </Alert>
        </Backdrop>
    </>)
}

const CustomFooter = ({setFilterModel, selectedSchema, setSelectedSchema, create, setCreate}) => {
    return (<>
        <Divider/>
        <div style={{maxHeight: '56px', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
            <span style={{display: 'flex', alignItems: 'center'}}>
            <Button sx={{width: '125.9px', margin: '10px'}} variant="contained" onClick={() => {
                setFilterModel({items: []});
                setSelectedSchema(null);
            }}>Clear Filter</Button>
            {selectedSchema ? <p style={{margin: '10px 15px 10px 5px'}}>Showing {selectedSchema._name}s</p> : <></>}
            </span>
            {create ?
            <Button sx={{width: '100px', margin: '10px'}} endIcon={<Delete/>} variant='contained' color='warning' onClick={() => setCreate(false)}>Discard</Button>
            : <Button sx={{width: '100px', margin: '10px'}} variant="contained" color='primary' onClick={() => setCreate(true)} endIcon={<AddIcon/>}>Create</Button>
            }
        </div>
    </>)
}

export default AnimalTable;
