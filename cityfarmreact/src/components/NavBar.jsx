import React from 'react'
import './NavBar.css'
import {Link} from "react-router-dom";

import Switch from '@mui/material/Switch';

const NavBar = (props) => {
    return(
        <div className="sidebar">
            <Link to="/"> Home </Link>
            <Link to="/calendar"> Calendar </Link>
            <Link to="/animals"> Livestock </Link>
            <Link to="/enclosures"> Enclosures </Link>
            <Link to="/schemas"> Animal Types </Link>
            <span style={{width: '100%', position: 'absolute', bottom: '10px', left: '10px', color: 'white'}}>Dark Mode<Switch style={{marginLeft: '5px'}} size='small' onChange={(e) => {props.setDark(e.target.checked); console.log(e.target.checked)}}/></span>
        </div>
    )
}

export default NavBar;