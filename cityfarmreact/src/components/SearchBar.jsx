import React, {useState} from "react";
import SearchIcon from "./search.png";

const SearchBar = (props) => {
    const [query, setQuery] = useState('');
    const [mode, setMode] = useState("name");

    return(
        <div className="search" style={{marginBottom: "20px"}}>
            <input
                placeholder="Search"
                //value={query}
                onChange={(e) => props.search(e.target.value)}
                //onChange={(e) => setQuery(e.target.value)} /*Sets the "event" to the search term (basically anything in the searchbar gets set to this value)*/
            />
            {/*<button className="searchButton">
            <img src={SearchIcon} /*TODO: Get an image of a magnifying glass for the searchBar
                    alt="search" /*Alternative tag is useful for screen readers 
                    height="12"
                    width="12"
                    onClick={() => {
                        mode === "name" ?  props.setSearchMode("name") : props.setSearchMode("id")
                        if (query !== "") props.search(query)}} /*calls the search function to find an animal / enclosure 

            /></button>
            <button
                onClick={() => {if(query !== "")
                    setQuery('');
                    props.clearValue ? props.clearSearch(0) : props.clearSearch(1);
                }}>Clear
            </button>*/}
            <select onChange={(e)=>props.setSearchMode(e.target.value)}> {/*value={mode}*/}
                <option>Name</option>
                <option>ID</option>
            </select>
        </div>
    )
}

export default SearchBar;
