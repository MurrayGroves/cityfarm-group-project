import React, { useState, useEffect } from 'react'
import './NavBar.css'
import {Link} from "react-router-dom";
import Button from '@mui/material/Button';
import LogoutIcon from '@mui/icons-material/Logout';
import { useNavigate } from "react-router-dom";
import question from "../assets/question mark.png"
import Switch from '@mui/material/Switch';
import QuestionPopover from "./QuestionPopover";
import Drawer from '@mui/material/Drawer';
import Fab from '@mui/material/Fab';
import MenuIcon from '@mui/icons-material/Menu';
import { BrowserView, MobileView, isBrowser, isMobile } from 'react-device-detect';

const NavBar = (props) => {
    const navigate = useNavigate();

    const [drawerOpen, setDrawerOpen] = useState(false);

    const toggleDrawer = (value) => {
        setDrawerOpen(value);
    }
    
    return(<>
        {(props.device === 'mobile' || isMobile) && <Fab sx={{m: 2}} color='primary' onClick={() => toggleDrawer(true)}><MenuIcon/></Fab>}
        <Drawer
            variant={(props.device.slice(0, 7) === 'desktop' && isBrowser) ? 'permanent' : 'temporary'}
            anchor='left'
            PaperProps={{className: 'sidebar'}}
            open={drawerOpen}
            onClose={() => toggleDrawer(false)}
            sx={{
                flexShrink: 0,
                '& .MuiDrawer-paper': {
                    boxSizing: 'border-box',
                    backgroundColor: '#000028',
                    width: '150px',
                },
              }}
        >
            <Link to="/"> Home </Link>
            <Link to="/calendar"> Calendar </Link>
            <Link to="/animals"> Livestock </Link>
            <Link to="/enclosures"> Enclosures </Link>
            <Link to="/schemas"> Animal Types </Link>
            <QuestionPopover/>
            <span style={{width: '120px', position: 'absolute', bottom: '0', left: '0', margin: '15px', color: 'white'}}>
                Dark Mode
                <Switch style={{marginLeft: '5px'}} size='small' checked={props.theme === 'dark'} onChange={(e) => {props.setTheme(e.target.checked ? 'dark' : 'light')}}/>
            </span>
            <Button
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
        </Drawer>
    </>)
}

export default NavBar;