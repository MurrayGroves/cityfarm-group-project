import React, {useEffect, useState} from "react";
import baseURL from "../api/axiosConfig";

const SearchBar = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const searchAnimals = async (animalName) => {
        const response = await  fetch(`${baseURL}/animals/by_name/${searchTerm}`);
        const data = await response.json();
        setSearchTerm(data)
    }
    useEffect(() => {
        //searchAnimals(searchTerm);
    },[]);
    return(
        <div className="app">
            <h1>App</h1>
            <div className="search">
                <input
                    placeholder="Search for animals"
                    value= {searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)} /*Sets the "event" to the search term (basically anything in the searchbar gets set to this value)*/
                />
                <img //src={SearchIcon} /*TODO: Get an image of a magnifying glass for the searchBar*/
                     alt="search" /*Alternative tag is useful for screen readers */
                     onClick={() => searchAnimals(searchTerm)} /*calls the search function to find an animal*/
                />
            </div>
        </div>
    )
}

export default SearchBar;