import React, {useState} from 'react'
import './NavBar.css'
import {Link} from "react-router-dom";

const NavBar = (props) => {
    const [open, setOpen] = useState(true); /*Navbar starts closed*/

    const openNavbar = () => {
        open ? setOpen(false) : setOpen(true); /*switches the value of open between true and false*/
        props.openNavbar(open)
    }

    if (open) {
        return(
        <div id="sidebar" className="sidebar" style={{width: "12%"}}>
            <a href="" onClick={() => openNavbar()}>×</a>
            <Link to="/"> Home </Link>
            <Link to="/calendar"> Calendar </Link>
            <Link to="/animals"> Livestock </Link>
            <Link to="/enclosures"> Enclosures </Link>
            <Link to="/create"> AddAnimal </Link>
        </div>
        )
    }
    
    return (
        <button className="openbtn" onClick={() => openNavbar()}>☰</button>
    );
}

export default NavBar;