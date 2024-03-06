import React from 'react'
import './NavBar.css'
import {Link} from "react-router-dom";
import Button from '@mui/material/Button';
import LogoutIcon from '@mui/icons-material/Logout';
import { useNavigate } from "react-router-dom";
import Switch from '@mui/material/Switch';

const NavBar = (props) => {
    const navigate = useNavigate();
    return(
        <div className="sidebar">
            <Link to="/"> Home </Link>
            <Link to="/calendar"> Calendar </Link>
            <Link to="/animals"> Livestock </Link>
            <Link to="/enclosures"> Enclosures </Link>
            <Link to="/schemas"> Animal Types </Link>
            <span style={{width: '100%', position: 'absolute', bottom: '0', left: '0', margin: '10px', color: 'white'}}>
                Dark Mode
                <Switch color='tertiary' style={{marginLeft: '5px'}} size='medium' checked={props.theme === 'dark'} onChange={(e) => {props.setTheme(e.target.checked ? 'dark' : 'light')}}/>
            </span>
            <Button
                color='tertiary'
                style={{margin: '15px', width: '120px', height: '40px', position: 'absolute', bottom: '40px', left: 0}}
                variant='outlined'
                onClick={() => {
                    props.msal.logoutRedirect({
                        account: props.msal.getAllAccounts()[0]
                    });
                    navigate('/login');
                }}
                endIcon={<LogoutIcon/>}
            >Logout</Button>
        </div>
    )
}

export default NavBar;