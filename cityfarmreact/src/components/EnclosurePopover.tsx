import React, { useState, useEffect } from 'react';
import Popover from '@mui/material/Popover';
import Typography from '@mui/material/Typography';
import {Link} from "react-router-dom";
import { Enclosure } from '../api/enclosures.ts';
import AnimalPopover from './AnimalPopover.tsx';
import { CityFarm } from '../api/cityfarm.ts';

const EnclosurePopover = ({ cityfarm, enclosureID }: {cityfarm: CityFarm, enclosureID: string}) => {
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
        //console.log(enclosureID);
        enclosureID &&
        (async () => {
            const enclosure = await cityfarm.getEnclosure(enclosureID, true, (enclosure) => setChosenEnclosure(enclosure));
            setChosenEnclosure(enclosure!);
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
                <Link to={`/single-enclosure/${chosenEnclosure.id}`}> {chosenEnclosure.name} </Link>
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
                    {`Holding: `}
                    {chosenEnclosure.holding.map((animal) => (
                        animal.name + ' '))}<br/>
                    {`Capacities: ${Object.keys(chosenEnclosure.capacities).map((key) => {
                        return (` ${key}: ${chosenEnclosure.capacities[key]}`)})}`}<br/>
                </Typography>
            </Popover>
        </div>
    );
}

export default EnclosurePopover;
