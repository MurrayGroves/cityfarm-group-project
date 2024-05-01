import React, { useState, useEffect } from 'react'
import './NavBar.css'
import {Link} from "react-router-dom";
import Button from '@mui/material/Button';
import LogoutIcon from '@mui/icons-material/Logout';
import { useNavigate } from "react-router-dom";
import Switch from '@mui/material/Switch';
import QuestionPopover from "./QuestionPopover.tsx";
import Drawer from '@mui/material/Drawer';
import Fab from '@mui/material/Fab';
import MenuIcon from '@mui/icons-material/Menu';
import { Divider } from '@mui/material';

const NavBar = (props) => {
    const navigate = useNavigate();

    const [drawerOpen, setDrawerOpen] = useState(false);

    const toggleDrawer = (value) => {
        setDrawerOpen(value);
    }
    
    return(<>
        {props.device === 'mobile' && <Fab sx={{m: 2}} color='primary' onClick={() => toggleDrawer(true)}><MenuIcon/></Fab>}
        <Drawer
            variant={props.device.slice(0, 7) === 'desktop' ? 'permanent' : 'temporary'}
            anchor='left'
            PaperProps={{className: 'sidebar'}}
            open={drawerOpen}
            onClose={() => toggleDrawer(false)}
            sx={{ 
                flexShrink: 0,
                '& .MuiDrawer-paper': {
                    backgroundImage: 'none',
                    boxSizing: 'border-box',
                    backgroundColor: '#000028',
                    width: '150px',
                    overflow: props.device === "mobile" ? 'scroll' : 'hidden'
                },
              }}
        >
            <Link to="/"> Home </Link>
            <Link to="/calendar"> Calendar </Link>
            <Link to="/animals"> Livestock </Link>
            <Link to="/enclosures"> Enclosures </Link>
            <Link to="/schemas"> Animal Types </Link>
            <QuestionPopover/>
            <div style={{marginBottom: '105px'}}/>
            <span style={{backgroundColor: '#000028', width: '150px', position: 'fixed', bottom: '0', left: '0', padding: '15px', color: 'white'}}>
                Dark Mode
                <Switch style={{marginLeft: '5px'}} size='small' checked={props.theme === 'dark'} onChange={(e) => {props.setTheme(e.target.checked ? 'dark' : 'light')}}/>
            </span>
            <span style={{backgroundColor: '#000028', width: '150px', height: '70px', position: 'fixed', bottom: '40px', left: '0'}}>
            {process.env.REACT_APP_AUTH === "true" ? 
                <Button
                variant='outlined'
                style={{height: '40px', margin: '20px 15px 10px 15px'}}
                onClick={() => {
                    props.msal.logoutRedirect({
                        account: props.msal.getAllAccounts()[0]
                    });
                    navigate('/login');
                }}
                endIcon={<LogoutIcon/>}
            >Logout</Button> : <></>
            }</span>
        </Drawer>
    </>)
}

export default NavBar;