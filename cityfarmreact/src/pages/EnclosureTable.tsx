import React, {useEffect, useState} from "react";
import axios from "../api/axiosConfig.js";
import TextField from '@mui/material/TextField';
import "../pages/AnimalTable.css";
import { Link } from 'react-router-dom';
import FarmTabs from "../components/FarmTabs.tsx";
import { Paper, Divider } from '@mui/material';
import { DataGrid, GridColDef, GridPagination, GridSlotsComponentsProps } from "@mui/x-data-grid";
import { Edit, Add } from '@mui/icons-material';
import Button from '@mui/material/Button';
import AnimalPopover from "../components/AnimalPopover.tsx";
import EnclosureCreator from "../components/EnclosureCreator.tsx";
import { getConfig } from '../api/getToken.js';
import { Schema } from '../api/animals.ts';
import EnclosurePopover from "../components/EnclosurePopover.tsx";
import { Enclosure } from "../api/enclosures.ts";
import { CachePolicy, CityFarm } from "../api/cityfarm.ts";

declare module '@mui/x-data-grid' {
    interface FooterPropsOverrides {
        setCreate?: (create: boolean) => void;
        setFilterModel?: any;
        selectedSchema?: Schema;
        setSelectedSchema?: (schema: Schema) => void;
        create?: boolean;
        handleOpenAnimalsPopup?: () => void;
    }
}

const EnclosureTable = ({farms, cityfarm}: {farms: any, cityfarm: CityFarm}) => {
    const [enclosureList, setEnclosureList] = useState<Enclosure[]>([]); /* The State for the list of enclosures. The initial state is [] */
    const [searchTerm, setSearchTerm] = useState<string>(''); /* The term being search for in the searchbar */
    const [create, setCreate] = useState<boolean>(false);

    const token = getConfig();

    const [farm, setFarm] = useState(null);

    function displayAll() {
        (async () => {
            const enclosures = await cityfarm.getEnclosures(CachePolicy.USE_CACHE, farm, (enclosures) => setEnclosureList(enclosures));
            setEnclosureList(enclosures);
        })()
    }

    useEffect (() => {
        (async () => {
            if (searchTerm === '') {
                displayAll();
                return;
            }
            try {
                const response = await axios.get(`/enclosures/by_name/${searchTerm}`, {params: {farm: farm}, ...token});
                setEnclosureList(response.data);
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

    const cols: GridColDef[] = [
        { field: 'name', editable: true, headerName: 'Name', headerClassName: 'grid-header', headerAlign: 'left', flex: 1,
            renderCell: (enclosure) => <Link to={`/single-enclosure/${enclosure.value.id}`}> {enclosure.value.name} </Link>
        },
        { field: 'holding', headerName: 'Holding', headerClassName: 'grid-header', headerAlign: 'left', flex: 1, cellClassName: 'scroll-cell',
            renderCell: (animalList) => <ul style={{marginLeft: '1em'}}>{animalList.value.map(animal => {return(<li key={animal.id}><AnimalPopover cityfarm={cityfarm} animalID={animal.id}/></li>)})}</ul>
        },
        { field: 'capacities', headerName: 'Capacities', headerClassName: 'grid-header', headerAlign: 'left', flex: 1 },
    ]

    const rows = enclosureList.map((enclosure: Enclosure) => ({
        id: enclosure.id,
        name: enclosure,
        holding: enclosure.holding,
        capacities: Object.keys(enclosure.capacities).map((key) => {
            return (` ${key}: ${enclosure.capacities[key]}`)
        })
    }))

    return(<>
        <h1>Enclosures</h1>
        <span style={{display: 'flex', justifyContent: 'space-between', height: '60px'}}>
            <TextField
                size='small'
                placeholder='Search'
                style={{margin: '0 20px 20px 0'}}
                onChange={(e) => setSearchTerm(e.target.value)}
            ></TextField>
            <FarmTabs farms={farms} setSelectedFarm={setFarm}/>
        </span>
        <div style={{display: 'flex', flexDirection: 'column', height: 'calc(100% - 150.88px)'}}>
        <Paper elevation={3} style={{flex: 1}}>
            <DataGrid rows={rows} columns={cols}
            slots={{
                footer: CustomFooter
            }}
            slotProps={{
                footer: {
                    setCreate
                }}}
            style={{fontSize: '1rem'}}
            processRowUpdate = {(newVal, oldVal) => {
                if (newVal.name === oldVal.name) { return newVal; }
                const newName = newVal.name;
                const _id = oldVal.id;
                (async() => {
                    try{
                        const response = await axios.patch(`/enclosures/by_id/${_id}/name/${newName}`, null, token)
                        console.log(response);
                        window.location.reload();
                    } catch (error) {
                        if (error.response.status === 401) {
                            window.location.href = "/login";
                            return;
                        } else {
                            window.alert(error);
                        }
                    }
                })();
                return newVal;
            }}/>
        </Paper>
        {create && <EnclosureCreator setCreateProp={setCreate} cityfarm={cityfarm} farms={farms}/>}
        </div>
    </>)
}

const CustomFooter = (props: NonNullable<GridSlotsComponentsProps['footer']>) => {
    return (<>
        <Divider/>
        <div style={{maxHeight: '56.5px', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
            <Button sx={{maxWidth: '100px', marginLeft: '10px'}} variant='contained' endIcon={<Add/>} onClick={() => props.setCreate!(true)}>Create</Button>
            <GridPagination/>
        </div>
    </>)
}

export default EnclosureTable;
