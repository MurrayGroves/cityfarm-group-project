import React, {useState} from 'react'
import './NavBar.css'
import {Link} from "react-router-dom";

const NavBar = () => {
    return(
        <div className="sidebar" style={{width: "12%"}}>
            <Link to="/"> Home </Link>
            <Link to="/calendar"> Calendar </Link>
            <Link to="/animals"> Livestock </Link>
            <Link to="/enclosures"> Enclosures </Link>
        </div>
    )
}

export default NavBar;