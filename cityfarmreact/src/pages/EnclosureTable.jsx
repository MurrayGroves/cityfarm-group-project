import React, {useEffect, useState} from "react";
import axios from "../api/axiosConfig";
import SearchBar from "../components/SearchBar";
import TextField from '@mui/material/TextField';
import "../pages/AnimalTable.css";
import FarmTabs from "../components/FarmTabs";
import TableContainer from '@mui/material/TableContainer';
import Paper from '@mui/material/Paper';
import { DataGrid } from "@mui/x-data-grid";
import EditIcon from '@mui/icons-material/Edit';
import IconButton from '@mui/material/IconButton';
import { diff } from "deep-object-diff";

const colours = {
    WH: "#333388",
    HC: "#FF0000",
    SW: "#3312FF",
    default: "#888888"
}

const EnclosureTable = () => {
    const [enclosureList, setEnclosureList] = useState([]); /* The State for the list of enclosures. The initial state is [] */
    const [searchTerm, setSearchTerm] = useState(''); /* The term being search for in the searchbar */
    const [searchMode, setSearchMode] = useState("name") /* The mode of search (by name or id) */
    const [clear, setClear] = useState(0); /* Clear will reset the table to display all enclosures once updated*/
    const [editMode, setEditMode] = useState(false); /* Whether edit mode is on. Initial state is false */

    const [farm, setFarm] = useState("");

    //useEffect(displayAll,[clear]);

    function displayAll() {
        (async () => {
            try {
                const response = await axios.get(`/enclosures`);
                setEnclosureList(response.data);
            } catch (error) {
                window.alert(error);
            }
        })()
    }

    useEffect (() => {
        (async () => {
            if (searchTerm === '') {
                displayAll();
                return;
            }
            if (searchMode === "name") {
                try {
                    const response = await axios.get(`/enclosures/by_name/${searchTerm}`);
                    setEnclosureList(response.data);
                } catch (error) {
                    window.alert(error);
                }
            }
            else {
                try {
                    const response = await axios.get(`/enclosures/by_id/${searchTerm}`);
                    setEnclosureList(response.data);
                } catch (error) {
                    window.alert(error);
                }
            }
        })()
    },[searchTerm])

    const cols =  [
        { field: 'name', editable: true, headerName: 'Name', headerClassName: 'grid-header', headerAlign: 'left', flex: 1 },
        { field: 'holding', headerName: 'Holding', headerClassName: 'grid-header', headerAlign: 'left', flex: 1 },
        { field: 'capacities', headerName: 'Capacities', headerClassName: 'grid-header', headerAlign: 'left', flex: 1 },
    ]

    const rows = enclosureList.map((enclosure) => ({
        id: enclosure._id,
        name: enclosure.name,
        holding: Object.keys(enclosure.holding).map((key) => {
            return (`${Object.keys(enclosure.holding[key]).map((animal) => {
                return enclosure.holding[key][animal].name
            })}`)
        }),
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
            <FarmTabs selectFarm={setFarm} colours={colours}/>
        </span>
        <TableContainer component={Paper} style={{borderRadius: '20px'}}>
            <DataGrid rows={rows} columns={cols} 
            isCellEditable = {() => editMode} 
            // onCellEditStop = {(params: GridCellParams, event) => {
                
            //     setEditMode(!editMode);
            // }}
            processRowUpdate = {(newVal, oldVal) => {
                console.log("it gets here")
                const result = diff(oldVal, newVal);
                console.log(result);
                const newName = newVal.name;
                console.log(newName);
                const _id = oldVal.id;
                console.log(_id);
                (async() =>{
                    try{
                        const response = await axios.patch(`/enclosures/by_id/${_id}/name/${newName}`)
                        console.log(response);
                        window.location.reload(false);
                    }catch (error){
                        window.alert(error);
                    }
                })();
                setEditMode(false);
                return newVal;
            }}/>
        </TableContainer>
        <IconButton aria-label="edit" onClick={() => setEditMode(true)} size="small">
        <EditIcon fontSize = "small"/>
        <div>
            Edit
        </div>
        </IconButton>
    </>)
}

export default EnclosureTable;
