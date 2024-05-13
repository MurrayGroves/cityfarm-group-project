import React, {useEffect, useState} from "react";
import axios from '../api/axiosConfig.js'
import FarmTabs from "../components/FarmTabs.tsx";
import AnimalPopover from "../components/AnimalPopover.tsx";
import AnimalCreator from "../components/AnimalCreator.tsx";
import FarmMoveButton from "../components/FarmMoveButton.tsx";
import "./AnimalTable.css";
import { DataGrid, useGridApiRef, FooterPropsOverrides, GridColDef, GridFilterModel } from '@mui/x-data-grid';
import { Collapse, Autocomplete, Backdrop, Paper, TextField, Button, Select, MenuItem, FormControl, IconButton, Divider, Dialog, DialogContent, Alert, AlertTitle, ButtonGroup } from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete, Done as DoneIcon, Clear as ClearIcon, ArrowDropDownCircle as Arrow } from '@mui/icons-material';

import { EventText } from "../components/EventText.tsx";
import { EventSelectorButton } from "../components/EventSelectorButton.tsx";

import { getConfig } from '../api/getToken.js';

import { Animal, Schema, Sex } from '../api/animals.ts';
import { CachePolicy, CityFarm } from "../api/cityfarm.ts";
import { Link } from "react-router-dom";
import { TypePopover } from "../components/TypePopover.tsx";

const AnimalTable = ({farms, cityfarm, device}: {farms: any, cityfarm: CityFarm, device: any}) => {
    const [animalList, setAnimalList] = useState<Animal[]>([]); /* The State for the list of animals. The initial state is [] */
    const [searchTerm, setSearchTerm] = useState(''); /* The term being searched for in the searchbar */
    const [schemaList, setSchemaList] = useState<Schema[]>([]);

    const [farm, setFarm] = useState(null);

    const [filterModel, setFilterModel] = useState<GridFilterModel>({items: []});
    const [selectedSchema, setSelectedSchema] = useState<Schema | null>(null);
    const [modifyAnimal, setModifyAnimal] = useState<any>({});
    const [editingRow, setEditingRow] = useState(null);

    const [selectedAnimals, setSelectedAnimals] = useState<string[]>([])

    const [rows, setRows] = useState<any[]>([]);
    const [deleteAnimals, setDeleteAnimals] = useState<Animal[]>(new Array<Animal>)

    const [create, setCreate] = useState(false);
    const [del, setDel] = useState(false);

    const token = getConfig();

    const gridApi = useGridApiRef();

    const handleDelAnimals = (animals: Animal[]) => {
        animals.map(async (animal) => {
            try {
                const response = await axios.delete(`/animals/by_id/${animal.id}`, token);
            } catch (error) {
                if (error.response.status === 401) {
                    window.location.href = "/login";
                    return;
                } else {
                    window.alert(error);
                }
            }})
        window.location.reload();
    }

    function displayAll() {
        (async () => {
            const animals = await cityfarm.getAnimals(CachePolicy.NO_CACHE, farm, (animals) => {setAnimalList(animals)});
            setAnimalList(animals);
        })()
    }

    function getSchemas() {
        (async () => {
            const schemas = await cityfarm.getSchemas(CachePolicy.USE_CACHE, (schemas) => {setSchemaList(schemas)});
            console.debug("Fetched schemas: ", schemas);
            setSchemaList(schemas);
        })()
    }

    useEffect(getSchemas, [animalList]);

    useEffect(() => {
        (async () => {
            if (searchTerm === '') {
                displayAll();
                return;
            }
            const newList = cityfarm.animals_cache.filter((animal) => animal.name.toLowerCase().includes(searchTerm.toLowerCase()));
            setAnimalList(newList);
        })()
    },[searchTerm, farm])

    async function calculateColumnsAndRows(schema: Schema | null) {
        let newCols = [...defaultCols];

        console.debug("Calculating columns and rows with schema: ", schema);
        console.debug("Default columns");

        if (schema) {
            for (let key in schema.fields) {
                if (schema.fields[key].type === "cityfarm.api.calendar.EventRef") {
                    newCols.push({type: 'singleSelect', field: key, headerName: key, headerClassName: 'grid-header', headerAlign: 'left', flex: 1, editable: true, renderEditCell: (params) => {
                        return <EventSelectorButton open={key} style={{margin: '5%'}} farms={farms} cityfarm={cityfarm} currentEventID={params.row[key]} setEventID={(eventID) => {
                            console.log("Calling setEventID with ", eventID)
                            let current = {...modifyAnimal};
                            if (current.fields === undefined) {
                                current.fields = {}
                            }
                            current.fields[key] = eventID;
                            setModifyAnimal(current);
                            gridApi.current.setEditCellValue({id: params.id, field: key, value: eventID});
                        }}/>
                        
                    }, renderCell: (params) => {
                        console.log("params.row[key]: ", params.row[key]);
                        const animal = animalList.find((animal) => animal.id === params.row.id);
                        return <EventText cityfarm={cityfarm} eventID={params.row[key] ? params.row[key] : animal ? animal.fields[key] : null} farms={farms}/>
                    }});
                } else {
                    newCols.push({type: 'singleSelect', field: key, headerName: key, headerClassName: 'grid-header', headerAlign: 'left', flex: 1, editable: true, renderEditCell: (params) => {
                        return fieldTypeSwitch(schema.fields[key].type, params);
                    }});
                }
            }
        }


        const defaultRows = animalList.map((animal) => ({
            id: animal.id,
            name: animal,
            type: animal.type,
            father: animal.father !== null ? animal.father : '',
            mother: animal.mother !== null ? animal.mother : '',
            sex: animal.sex,
        }));

        let newRows: any[] = [];
        for (let i = 0; i < defaultRows.length; i++) {
            let newRow = defaultRows[i];
            if (schema) {
                if (newRow.type.toLowerCase() !== schema.name.toLowerCase()) {
                    continue;
                }
                let animal = animalList.find((animal) => {return animal.id === newRow.id});
                if (!animal) {
                    continue;
                }
                for (let key in schema.fields) {
                    newRow[key] = typeof animal.fields[key] === typeof false ? animal.fields[key] ? "Yes" : "No" : animal.fields[key];
                }
            }

            newRows.push(newRow);
        }
        setRows(newRows);
        setCols(newCols);
    }

    useEffect(() => {
        console.log("Recalculating columns and rows", selectedSchema, animalList)
        calculateColumnsAndRows(selectedSchema);
    }, [selectedSchema, animalList])


    useEffect(() => {
         const defaultRows = animalList.map((animal) => ({
             id: animal.id,
             name: animal,
             type: animal.type.charAt(0).toUpperCase() + animal.type.slice(1),
             father: animal.father !== null ? animal.father : '',
             mother: animal.mother !== null ? animal.mother : '',
             sex: animal.sex,
         }));
         setRows(defaultRows);
         calculateColumnsAndRows(selectedSchema);
    }, [animalList])


    async function saveAnimal(animal_id) {
        let row = gridApi.current.getRow(animal_id)
        console.log(row);
        console.log(modifyAnimal)
        let old_animal = animalList.find((animal) => {return animal.id === animal_id});
        if (old_animal === undefined || old_animal === null) return;
        let schema = await cityfarm.getSchema(old_animal.type, CachePolicy.USE_CACHE);
        if (!old_animal) {
            console.error("Could not find animal with id ", animal_id);
            return;
        }

        if (!schema) {
            console.error("Could not find schema with name ", old_animal.type);
            return;
        }
        let animal: any = {...old_animal};
        animal.father = modifyAnimal.father ? modifyAnimal.father.id ? modifyAnimal.father.id : modifyAnimal.father : old_animal.father;
        animal.mother = modifyAnimal.mother ? modifyAnimal.mother.id ? modifyAnimal.mother.id : modifyAnimal.mother : old_animal.mother;
        animal.name = modifyAnimal.name ? modifyAnimal.name : old_animal.name;

        if (modifyAnimal.sex !== null && modifyAnimal.sex !== undefined && modifyAnimal.sex !== '') {
            switch (modifyAnimal.sex) {
                case Sex.Male:
                    animal.sex = "m";
                    break;
                case Sex.Female:
                    animal.sex = "f";
                    break;
                case Sex.Castrated:
                    animal.sex = "c";
                    break;
                default:
                    animal.sex = null;
            }
        } else {
            switch (old_animal.sex) {
                case Sex.Male:
                    animal.sex = "m";
                    break;
                case Sex.Female:
                    animal.sex = "f";
                    break;
                case Sex.Castrated:
                    animal.sex = "c";
                    break;
                default:
                    animal.sex = null;
            }
        }

        animal.fields = {...modifyAnimal.fields};
        for (let key in old_animal.fields) {
            animal.fields[key] = animal.fields[key] ? animal.fields[key] : old_animal.fields[key];
            if (schema.fields[key].type === "java.lang.Boolean") {
                if (animal.fields[key] === 'Yes') {
                    animal.fields[key] = true;
                } else if (animal.fields[key] === 'No') {
                    animal.fields[key] = false;
                }
            } 
        }

        if (old_animal !== modifyAnimal) {
            axios.patch(`/animals/by_id/${animal_id}`, animal, token).then(displayAll);
        }
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
                            current.fields = {...current.fields, [params.field]: e.target.value};
                            console.log("Fields:", current.fields)
                            setModifyAnimal(current);
                            gridApi.current.setEditCellValue({id: params.id, field: params.field, value: e.target.value});
                        }}
                    >
                        <MenuItem value={''}><em>Empty</em></MenuItem>
                        <MenuItem value={'Yes'}>Yes</MenuItem>
                        <MenuItem value={'No'}>No</MenuItem>
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
                            current.fields = {...current.fields};
                            current.fields[params.field] = e.target.value;
                            setModifyAnimal(current);
                            gridApi.current.setEditCellValue({id: params.id, field: params.field, value: e.target.value});
                        }}
                    />
                    </FormControl>
                );
            default:
                return <></>;
        };
    }

    const defaultCols: GridColDef[] = [
        { field: 'name', type: 'singleSelect', headerName: 'Name', headerClassName: 'grid-header', headerAlign: 'left', flex: 1, editable: true,
        renderCell: (animal) => {return (animal.value.id ? <Link to={`/single-animal/${animal.value.id}`}>{
                animal.value.alive ? <p>{animal.value.name}</p> : <del>{animal.value.name}</del>
                }</Link> : <p>Loading...</p>)}, renderEditCell: (params) => {

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
            }},
        { field: 'type', type: 'singleSelect', headerName: 'Type', headerClassName: 'grid-header', headerAlign: 'left', flex: 1,
            renderCell: (cell) => {
                let exists = false;
                schemaList.forEach(schema => {
                    if(schema.name === cell.value) {
                        exists = true;
                    }
                });
                return exists 
                    ? <TypePopover schemaName={cell.value}/>
                    : <p style={{color: 'red'}}>{cell.value}</p>
            }
        },
        { field: 'father', type: 'singleSelect', headerName: 'Father', headerClassName: 'grid-header', headerAlign: 'left', flex: 1, editable: true,
        renderCell:(father)=>{
            return father.value?
             <AnimalPopover key={father.value} cityfarm={cityfarm} animalID={father.value}/> : "Unregistered"}, renderEditCell: (params) => {
                let initial_animal = animalList.find((animal) => {return animal.id === params.value});
                let initial_name = initial_animal ? initial_animal.name : 'Unregistered';
                return (
                    <Autocomplete
                        style={{width: '100%'}}
                        size='medium'
                        renderOption={(props, option: any) => {
                            return (
                                <li {...props} key={option.id}>
                                    {option.name}
                                </li>
                            );
                        }}
                        renderInput={(params) => <TextField {...params}/>}
                        isOptionEqualToValue={(option, value) => option.id === value.id}
                        getOptionLabel={option => option.name}
                        options={
                            animalList.filter((animal)=>{
                                return animal.type.toLowerCase() === params.row.type.toLowerCase() && animal.sex !== Sex.Female && animal.id !== params.row.id
                            }).map((animal) => {return {id: animal.id, name: animal.name}})
                        }
                        value={{id: params.value, name: initial_name}}
                        onChange={(_, value) => {
                            console.log(modifyAnimal)
                            let current = {...modifyAnimal};
                            current.father = value;
                            setModifyAnimal(current);
                            gridApi.current.setEditCellValue({id: params.id, field: params.field, value: value.id});
                        }}
                    />
                );
            }},
        { field: 'mother', type: 'singleSelect', headerName: 'Mother', headerClassName: 'grid-header', headerAlign: 'left', flex: 1, editable: true,
            renderCell:(mother)=>{return mother.value?
                <AnimalPopover key={mother.value} cityfarm={cityfarm} animalID={mother.value}/> : "Unregistered"}, renderEditCell: (params) => {
                    let initial_animal = animalList.find((animal) => {return animal.id === params.value});
                    let initial_name = initial_animal ? initial_animal.name : 'Unregistered';
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
                        options={
                            animalList.filter((animal)=>{
                                return animal.type.toLowerCase() === params.row.type.toLowerCase() && animal.sex === Sex.Female && animal.id !== params.row.id
                            }).map((animal) => {return {id: animal.id, name: animal.name}})
                        }
                        value={{id: params.value, name: initial_name}}
                        onChange={(_, value) => {
                            var current = {...modifyAnimal};
                            current.mother = value;
                            setModifyAnimal(current);
                            gridApi.current.setEditCellValue({id: params.id, field: params.field, value: value ? value.id : null});
                        }}
                    />)
                }},
        { field: 'sex', type: 'singleSelect', headerName: 'Sex', headerClassName: 'grid-header', headerAlign: 'left', flex: 1, editable: true,
            renderCell: (params) => {
                switch (params.value) {
                    case Sex.Male:
                        return "Male";
                    case Sex.Female:
                        return "Female";
                    case Sex.Castrated:
                        return "Castrated";
                    default:
                        return "Unknown";
                }
            },
            renderEditCell: (params) => {
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
                    value={{id: params.value, name: ["Male", "Female", "Castrated"][params.value]}}
                    onChange={(_, value) => {
                        let current = {...modifyAnimal};
                        if (value) {
                            switch (value.name) {
                                case 'Male':
                                    current.sex = Sex.Male;
                                    break;
                                case 'Female':
                                    current.sex = Sex.Female;
                                    break;
                                case 'Castrated':
                                    current.sex = Sex.Castrated;
                                    break;
                                default:
                                    current.sex = null;
                            }
                        } else {
                            current.sex = null;
                        }
    
                        setModifyAnimal(current);
                        gridApi.current.setEditCellValue({id: params.id, field: params.field, value: value ? value.id : null});
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
    const [createClicked, setCreateClicked] = useState(false);

    return(<>
        <h1>Livestock</h1>
        <span style={{display: 'flex', justifyContent: 'space-between', height: '60px'}}>
            <TextField
                size='small'
                placeholder='Search'
                style={{margin: '0 20px 20px 0'}}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
            <FarmTabs farms={farms} setSelectedFarm={setFarm}/>
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
                        setCreate,
                        device
                    } as FooterPropsOverrides
                }}
                onRowSelectionModelChange={(ids) => {
                    setSelectedAnimals(ids.map(id => id.toString()));
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
                                let obj = animalList.find((animal) => {return animal.id === params.row.id});
                                setModifyAnimal(obj);
                                gridApi.current.startRowEditMode({ id: params.row.id });
                                setEditingRow(params.row.id);
                            }}>
                                <EditIcon/>
                            </IconButton>
                            <IconButton onClick={() => {
                                let animals = new Array<Animal>
                                if (gridApi.current.getSelectedRows().size > 0) {
                                    animals = animalList.filter((animal => Array.from(gridApi.current.getSelectedRows().keys()).includes(animal.id)))
                                } else {
                                    animals = animalList.filter((animal) => animal.id === params.row.id)
                                }
                                setDeleteAnimals(animals);
                                setDel(true);
                            }}>
                                <Delete/>
                            </IconButton>
                            </div>
                    }
                }]}
                rows={rows}
                onCellClick={(params, event, details) => {
                    if (params.field === 'type') {
                        const newModel: GridFilterModel = {
                            items: [
                                {
                                    id: 1,
                                    field: "type",
                                    operator: "is",
                                    value: String(params.value),
                                },
                            ],
                        };
                        setFilterModel(newModel);
                        const schema_name: string = String(params.value).toLowerCase();

                        console.debug("Selected schema name: ", schema_name)
                        console.debug("Schemas: ", schemaList)
                        let schema = schemaList.find((schema) => {return schema.name.toLowerCase() === schema_name});
                        console.debug("Selected schema: ", schema);
                        setSelectedSchema(schema ? schema : null);
                    }
                }}

                onRowEditStop={(params, e) => {
                    saveAnimal(params.row.id);
                    setEditingRow(null);
                }}
                onRowEditStart={(params, e) => {
                    setEditingRow(params.row.id);
                    let obj = animalList.find((animal) => {return animal.id === params.row.id});
                    setModifyAnimal(obj);
                }}
            />
        </Paper>

        {device === 'mobile' ?
        <Dialog PaperProps={{sx: {overflow: 'visible'}}} fullWidth maxWidth='xl' open={create} onClose={() => setCreate(false)}>
            <DialogContent sx={{p: 0}}>
                <AnimalCreator cityfarm={cityfarm} animalList={animalList} schemaList={schemaList} create={create} createClicked={createClicked} setCreateClicked={setCreateClicked} farms={farms} device={device}/>
            </DialogContent>
        </Dialog>
        : <>
        <div style={{marginTop: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
            <h2 style={{margin: '0'}}>Create Animal</h2>
            <ButtonGroup>
                {create && <Button variant='contained' onClick={() => setCreateClicked(true)} color='success' endIcon={<AddIcon/>}>Create</Button>}
                <Button variant='contained' onClick={() => setCreate(!create)} color={create ? 'warning' : 'primary'} endIcon={create ? <Delete/> : <Arrow/>}>{create ? 'Discard' : 'Expand'}</Button>
            </ButtonGroup>
        </div>
        <Collapse in={create}>
            <Paper sx={{mt: '10px'}} elevation={3}>
                <AnimalCreator cityfarm={cityfarm} animalList={animalList} schemaList={schemaList} create={create} createClicked={createClicked} setCreateClicked={setCreateClicked} farms={farms} device={device}/>
            </Paper>
        </Collapse></>}
        <div className="fmButtons">
            {selectedAnimals.length > 0 ? (
                Object.values(farms).map((farm, index) => (
                        <React.Fragment key={index}>
                            <FarmMoveButton cityfarm={cityfarm} farm={farm as string} ids={selectedAnimals}/>
                        </React.Fragment>
                    )))
            :  ''}
        </div>
        </div>
        <Backdrop style={{zIndex: '4', background: '#000000AA'}} open={del} onClick={() => {setDel(false);}}>
            <Alert
                severity='warning'
                action={<Button color='warning' variant='contained' onClick={() => handleDelAnimals(deleteAnimals)}>Yes</Button>}
            >
                <AlertTitle>Confirmation</AlertTitle>
                {deleteAnimals.length > 1
                    ? <p>Are you sure you want to delete {deleteAnimals.at(0)?.name} and {deleteAnimals.length - 1} other(s)?</p>
                    : deleteAnimals.length > 0 && <p>Are you sure you want to delete {deleteAnimals.at(0)?.name}?</p>}
            </Alert>
        </Backdrop>
    </>)
}

type CustomFooterProps = {
    setFilterModel: any,
    selectedSchema: any,
    setSelectedSchema: any,
    create: any,
    setCreate: any,
    device: any
}

const CustomFooter: React.FC<CustomFooterProps> = ({setFilterModel, selectedSchema, setSelectedSchema, create, setCreate, device}: {setFilterModel: any, selectedSchema: Schema, setSelectedSchema: (schema: Schema | null) => void, create: boolean, setCreate: (create: boolean) => void, device: String}) => {
    return (<>
        <Divider/>
        <div style={{maxHeight: '56px', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
            <span style={{display: 'flex', alignItems: 'center'}}>
            <Button sx={{width: '125.9px', margin: '10px'}} variant="contained" onClick={() => {
                setFilterModel({items: []});
                setSelectedSchema(null);
            }}>Clear Filter</Button>
            {selectedSchema ? <p style={{margin: '10px 15px 10px 5px'}}>Showing {selectedSchema.name}s</p> : <></>}
            </span>
            {device === 'mobile' && <Button sx={{width: '100px', margin: '10px'}} variant="contained" color='primary' onClick={() => setCreate(true)} endIcon={<AddIcon/>}>Create</Button>}
        </div>
    </>)
}

export default AnimalTable;
