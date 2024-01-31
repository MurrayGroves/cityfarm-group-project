import React, {useEffect, useState} from "react";
import axios from "../api/axiosConfig";
import SearchBar from "../components/SearchBar";
import "../components/AnimalTable.css";
import FarmTabs from "../components/FarmTabs";

const EnclosureTable = () => {
    const [enclosureList, setEnclosureList] = useState([]); /* The State for the list of enclosures. The initial state is [] */
    const [searchTerm, setSearchTerm] = useState(''); /* The term being search for in the searchbar */
    const [searchMode, setSearchMode] = useState("name") /* The mode of search (by name or id) */
    const [clear, setClear] = useState(0); /* Clear will reset the table to display all enclosures once updated*/

    const [farm, setFarm] = useState("wh");

    useEffect(displayAll,[])
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

    return(<>
        <h1>Enclosures</h1>
        <SearchBar setSearchMode={setSearchMode} search={setSearchTerm} clearValue={clear} clearSearch={setClear}/>
        {enclosureList?.length > 0 ? (<>
            <FarmTabs selectFarm={setFarm}/>
            <div className="animal-table">
                <table style={{width: '100%'}}>
                    <thead>
                    <tr>
                    <th>Name</th>
                    <th>Holding</th>
                    <th>Capacities</th>
                    </tr>   
                    </thead>
                    <tbody>
                        {enclosureList.map((enclosure) => (
                            <tr>
                                <td>{enclosure.name}</td>
                                <td>{Object.keys(enclosure.holding).map((key) => {
                                    return(<>
                                        {key}: {Object.keys(enclosure.holding[key]).map((animal) => {
                                            return(<>
                                                {enclosure.holding[key][animal].name},
                                            </>)
                                        })} <br></br>
                                    </>)
                                })}</td>

                                <td>{Object.keys(enclosure.capacities).map((key) => {
                                    return(<>
                                        {key}: {enclosure.capacities[key]} <br></br>
                                    </>)
                                })}</td>
                            </tr>
                        ))}
                </tbody>
                </table>
            </div>
        </>) : (
            <div className="empty">
                <h2>No enclosures found</h2>
            </div>
        )}
    </>)
}

export default EnclosureTable;
