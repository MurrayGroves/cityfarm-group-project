import React, {useState} from 'react'
import './NavBar.css'
import {Link} from "react-router-dom";

const NavBar = () => {
    const [open, setOpen] = useState(false); /*Navbar starts closed*/
    const openNavbar = () => {
        open ? setOpen(false) : setOpen(true); /*switches the value of open between true and false*/
    }

    if (open) {
        return(
        <div id="sidebar" className="sidebar" style={{width: 250}}>
            <a href="javascript:void(0)" onClick={() => openNavbar()}>×</a>
            <Link to="/"> Home </Link>
            <Link to="/calendar"> Calendar </Link>
            <Link to="/animals"> Animals </Link>
            <Link to="/create"> AddAnimal </Link>
        </div>
        )
    }
    return (
        <button className="openbtn" onClick={() => openNavbar()}>☰ </button>
    );
}
export default NavBar;