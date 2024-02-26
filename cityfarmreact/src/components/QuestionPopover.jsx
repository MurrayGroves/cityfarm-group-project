import * as React from 'react';
import Popover from '@mui/material/Popover';
import Typography from '@mui/material/Typography';
import {Link,  useLocation} from "react-router-dom";
import './AnimalPopover.css'
import { useState, useEffect } from 'react';
import { useTheme } from '@mui/material/styles';
import {calData,liveData,encData,typeData} from '../pages/HelpPage'
import { getConfig } from '../api/getToken';
import question from "../assets/question mark.png";

const QuestionPopover = (props) => {
    const colour = useTheme().palette.mode === 'light' ? 'black' : 'white';
    const location = useLocation();
    const [anchorEl, setAnchorEl] = useState(null);



    const handlePopoverOpen = (e) => {
        setAnchorEl(e.currentTarget);
    };

    const handlePopoverClose = () => {
        setAnchorEl(null);
    };

    const open = Boolean(anchorEl);

    const getContentForCurrentPath = () => {
        switch (location.pathname) {
            case '/calendar':
                return calData;
            case '/animals':
                return liveData;
            case '/enclosures':
                return encData
            case '/schemas':
                return typeData
            case '/':
                return "this is the homepage"
            default:
                return 'for more info click on the question mark';
        }
    };


    return (
        <div>
            <Typography
                aria-owns={open ? 'mouse-over-popover' : undefined}
                aria-haspopup="true"
                onMouseEnter={handlePopoverOpen}
                onMouseLeave={handlePopoverClose}
                style={{display: 'inline-block', margin: '2.5px 0'}}
            >
                <Link to="/help"><img src={question} width={25} height={25}/></Link>
            </Typography>
            <Popover
                id="mouse-over-popover"
                sx={{pointerEvents: 'none'}}
                open={open}
                anchorEl={anchorEl}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                }}
                onClose={handlePopoverClose}
                disableRestoreFocus
            >
                <Typography sx={{ p: 1, whiteSpace: 'pre-line' }} maxHeight={400} maxWidth={500}>
                    {getContentForCurrentPath()}
                </Typography>
            </Popover>
        </div>
    );
}

export default QuestionPopover
