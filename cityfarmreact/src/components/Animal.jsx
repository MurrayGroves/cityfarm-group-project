import * as React from 'react';
import Popover from '@mui/material/Popover';
import Typography from '@mui/material/Typography';

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

export default function Animal(props) {



    const [anchorEl, setAnchorEl] = React.useState(null);
    const [chosenanimal, setChosenAnimal] = React.useState(aExamples[0]);

    const handlePopoverOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handlePopoverClose = () => {
        setAnchorEl(null);
    };

    const open = Boolean(anchorEl);

    React.useEffect(() => {
        // Update chosenanimal when animalID prop changes
        for (let i = 0; i < aExamples.length; i++) {
            if (props.animalID === aExamples[i].id) {
                setChosenAnimal(aExamples[i]);
            }
        }
    }, [props.animalID]);

    return (
        <div>
            <Typography
                aria-owns={open ? 'mouse-over-popover' : undefined}
                aria-haspopup="true"
                onMouseEnter={handlePopoverOpen}
                onMouseLeave={handlePopoverClose}
            >
                {chosenanimal.name}
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
                {chosenanimal.sex}{'\n'}
                {chosenanimal.type}{'\n'}
                {chosenanimal.father}{'\n'}
                {chosenanimal.mother}{'\n'}
                </Typography>
            </Popover>
        </div>
    );
}