import React, {useEffect, useState} from "react";
import axios from "../api/axiosConfig";
import SearchBar from "../components/SearchBar";
import "../components/AnimalTable.css";

const EnclosureTable = () => {
    const [enclosureList, setEnclosureList] = useState([]); /* The State for the list of enclosures. The initial state is [] */
    useEffect (() => {
        (async () => {
            try {
                const response = await axios.get(`/enclosures`);
                console.log(response);
                setEnclosureList(response.data);
            } catch (error) {
                window.alert(error);
            }
        })()
    },[]);

    return(<>
        <h1>Enclosures</h1>
        <SearchBar/>
        {enclosureList?.length > 0 ? (
            <div className="animal-table">
                <table>
                    <thead>
                    <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Capacities</th>
                    <th>Holding</th>
                    </tr>
                    </thead>
                    <tbody>
                        {enclosureList.map((enclosure) => (
                            <tr>
                                <td>{enclosure._id}</td>
                                <td>{enclosure.name}</td>
                                <td>{enclosure.capacities}</td>
                                <td>{enclosure.holding ? 'Livestock' : 'Full'}</td>
                            </tr>
                        ))}
                </tbody>
                </table>
            </div>
        ) : (
            <div className="empty">
                <h2>No enclosures found</h2>
            </div>
        )}
    </>)
}

export default EnclosureTable;