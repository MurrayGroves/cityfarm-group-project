import * as React from 'react';
import Popover from '@mui/material/Popover';
import Typography from '@mui/material/Typography';
import {Link} from "react-router-dom";
import './Enclosure.css';
import AnimalPopover from './AnimalPopover';

let exampleHolding = new Map([
    ["cow", aExamples[0]],
    ["sheep", aExamples[1]]
]
);

let exampleCapacities = new Map([
    ["cow", 3]
    ["sheep", 4]
]);

const aExamples =[
    {
    id : 1,
    name:"bob",
    type:"cow",
    sex:"F",
    father : "undefined",
    mother	:"undefined",
    tBInoculated : true,
    live : true

},
    {
        id : 2,
        name:"alice",
        type:"sheep",
        sex:"M",
        father : "undefined",
        mother	:"undefined",
        tBInoculated : true,
        live : true

    }]

const eExamples =[
    {
    id : 1,
    name:"pen",
    holding: exampleHolding,
    capacities: exampleCapacities

}]

const Enclosure = (props) => {
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [chosenenclosure, setChosenEnclosure] = React.useState(eExamples[0]);

    const handlePopoverOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handlePopoverClose = () => {
        setAnchorEl(null);
    };

    const open = Boolean(anchorEl);

    React.useEffect(() => {
        // Update chosenenclosure when enclosureID prop changes
        for (let i = 0; i < eExamples.length; i++) {
            if (props.enclosureID === eExamples[i].id) {
                setChosenEnclosure(eExamples[i]);
            }
        }
    }, [props.enclosureID]);

    return (
        <div>
            <Typography
                aria-owns={open ? 'mouse-over-popover' : undefined}
                aria-haspopup="true"
                onMouseEnter={handlePopoverOpen}
                onMouseLeave={handlePopoverClose}
            >
                <Link to="/enclosure"> {chosenenclosure.name} </Link>
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
                {chosenenclosure.name}{'\n'}
                {chosenenclosure.holding}{'\n'}
                {chosenenclosure.capacities}{'\n'}
                </Typography>
            </Popover>
        </div>
    );
}

export default Enclosure;
