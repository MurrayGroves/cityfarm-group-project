import React, { useState, useEffect } from 'react';
import Popover from '@mui/material/Popover';
import Typography from '@mui/material/Typography';
import {Link} from "react-router-dom";
import axios from '../api/axiosConfig.js'
import { getConfig } from '../api/getToken.js';
import { Enclosure } from '../api/enclosures.ts';

const EnclosurePopover = ({ enclosureID }) => {
    const token = getConfig();

    const [anchorEl, setAnchorEl] = useState(null);
    const [chosenEnclosure, setChosenEnclosure] = useState<Enclosure>(new Enclosure({name: 'Loading...', holding: [], capacities: {}}));

    const handlePopoverOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handlePopoverClose = () => {
        setAnchorEl(null);
    };

    const open = Boolean(anchorEl);

    useEffect(() => {
        console.log(enclosureID);
        enclosureID &&
        (async () => {
            const response = await axios.get(`/enclosures/by_id/${enclosureID}`, token)
            const enclosure = response.data;
            setChosenEnclosure(new Enclosure(enclosure));
        })()
    }, [enclosureID]);

    return (
        <div>
            <Typography
                aria-owns={open ? 'mouse-over-popover' : undefined}
                aria-haspopup="true"
                onMouseEnter={handlePopoverOpen}
                onMouseLeave={handlePopoverClose}
            >
                <Link to="/enclosure"> {chosenEnclosure.name} </Link>
            </Typography>
            <Popover
                id="mouse-over-popover"
                sx={{
                    pointerEvents: 'none',
                }}
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
                <Typography sx={{ p: 1,whiteSpace: 'pre-line' }}>
                    {`Name: ${chosenEnclosure.name}`}<br/>
                    {`Holding: ${chosenEnclosure.holding}`}<br/>
                    {`Capacities: ${chosenEnclosure.capacities}`}<br/>
                </Typography>
            </Popover>
        </div>
    );
}

export default EnclosurePopover;
