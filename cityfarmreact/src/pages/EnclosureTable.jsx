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
        ) : (
            <div className="empty">
                <h2>No enclosures found</h2>
            </div>
        )}
    </>)
}

export default EnclosureTable;