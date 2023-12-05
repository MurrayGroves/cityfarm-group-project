import React, {useState} from "react";
import axios from "../api/axiosConfig";
import "./SearchBar.css";
import SearchIcon from './search.png';

const SearchBar = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const searchAnimals = async () => {
        const response = await axios.get(`animals/by_name/${searchTerm}`);
        console.log(response.data);
        // handle data
    }

    return(
        <div className="app">
            <div className="search">
                <input
                    placeholder="Search"
                    value= {searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)} /*Sets the "event" to the search term (basically anything in the searchbar gets set to this value)*/
                />
                <button className="searchButton">
                <img src={SearchIcon} /*TODO: Get an image of a magnifying glass for the searchBar*/
                     alt="search" /*Alternative tag is useful for screen readers */
                     height="20"
                     width="20"
                     onClick={() => {if(searchTerm !== "") {searchAnimals(searchTerm)}}} /*calls the search function to find an animal / enclosure */
                /></button>
            </div>
        </div>
    )
}

export default SearchBar;