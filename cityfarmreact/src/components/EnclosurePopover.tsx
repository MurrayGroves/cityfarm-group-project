import React, { useState, useEffect } from 'react';
import Popover from '@mui/material/Popover';
import Typography from '@mui/material/Typography';
import {Link} from "react-router-dom";
import { Enclosure } from '../api/enclosures.ts';
import AnimalPopover from './AnimalPopover.tsx';
import { CachePolicy, CityFarm } from '../api/cityfarm.ts';

const EnclosurePopover = ({ cityfarm, enclosureID, object }: {cityfarm: CityFarm, enclosureID: string, object: Enclosure |  null}) => {
    const [anchorEl, setAnchorEl] = useState(null);
    const [chosenEnclosure, setChosenEnclosure] = useState<Enclosure>(new Enclosure({name: 'Loading...', holding: [], capacities: {}}));
    const [loading, setLoading] = useState(true);

    const handlePopoverOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handlePopoverClose = () => {
        setAnchorEl(null);
    };

    const open = Boolean(anchorEl);

    useEffect(() => {
        if (loading && object) {
            setChosenEnclosure(object)
            setLoading(false)
            return;
        }

        enclosureID &&
        (async () => {
            let enclosure = await cityfarm.getEnclosure(enclosureID, CachePolicy.USE_CACHE, (enclosure) => setChosenEnclosure(enclosure));
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
