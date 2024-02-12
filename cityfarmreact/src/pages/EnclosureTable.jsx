import React, {useEffect, useState} from "react";
import axios from "../api/axiosConfig";
import SearchBar from "../components/SearchBar";
import "../components/AnimalTable.css";
import FarmTabs from "../components/FarmTabs";
import { DataGrid } from "@mui/x-data-grid";

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

    const [farm, setFarm] = useState("");

    useEffect(displayAll,[clear]);

    function displayAll() {
        (async () => {
            try {
                const response = await axios.get(`/enclosures`);
                console.log(response.data);
                setEnclosureList(response.data);
            } catch (error) {
                window.alert(error);
            }
        })()
    }

    useEffect (() => {
        (async () => {
            if (searchTerm === '') {
                return;
            }
            if (searchMode === "name") {
                try {
                    const response = await axios.get(`/enclosures/by_name/${searchTerm}`);
                    console.log(response.data);
                    setEnclosureList(response.data);
                } catch (error) {
                    window.alert(error);
                }
            }
            else {
                try {
                const response = await axios.get(`/enclosures/by_id/${searchTerm}`);
                console.log(response.data);
                setEnclosureList(response.data);
                } catch (error) {
                    window.alert(error);
                }
            }
        })()
    },[searchTerm])

    const cols =  [
        { field: 'id', headerName: 'ID',  headerClassName: 'grid-header', headerAlign: 'left', flex: 1 },
        { field: 'name', headerName: 'Name', headerClassName: 'grid-header', headerAlign: 'left', flex: 1 },
        { field: 'holding', headerName: 'Holding', headerClassName: 'grid-header', headerAlign: 'left', flex: 1 },
        { field: 'capacities', headerName: 'Capacities', headerClassName: 'grid-header', headerAlign: 'left', flex: 1 },
    ]

    const rows = enclosureList.map((enclosure) => ({
        id: enclosure._id,
        name: enclosure.name,
        holding: Object.keys(enclosure.holding).map((key) => {
            return (` ${key}:
            ${Object.keys(enclosure.holding[key]).map((animal) => {
                return enclosure.holding[key][animal].name
            })}`)
        }),
        capacities: Object.keys(enclosure.capacities).map((key) => {
            return (` ${key}: ${enclosure.capacities[key]}`)
        })
    }))

    return(<>
        <h1>Enclosures</h1>
        <SearchBar setSearchMode={setSearchMode} search={setSearchTerm} clearValue={clear} clearSearch={setClear}/>
        <FarmTabs selectFarm={setFarm} colours={colours}/>
        <div className="animal-table">
            <DataGrid rows={rows} columns={cols}/>
        </div>
    </>)
}

export default EnclosureTable;
