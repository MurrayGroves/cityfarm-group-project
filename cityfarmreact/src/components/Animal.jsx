import * as React from 'react';
import Popover from '@mui/material/Popover';
import Typography from '@mui/material/Typography';
import {Link} from "react-router-dom";
import './Animal.css'
import axios from "../api/axiosConfig";

const aExamples =[
    {
    id : 1,
    name:"bob",
    type:"cow",
    sex:"F",
    father : "alice",
    fid : 2,
    mother	:"undefined",
    mid : null,
    tBInoculated : true,
    live : true

}]

export default function Animal(props) {



    const [anchorEl, setAnchorEl] = React.useState(null);
    const [chosenAnimal, setChosenAnimal] = React.useState(aExamples[0]);

    const handlePopoverOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handlePopoverClose = () => {
        setAnchorEl(null);
    };

    const open = Boolean(anchorEl);

    React.useEffect(() => {
        (async () => {
        try {
            const response = await axios.get(`/animals/by_id/${props.animalID}`);
            console.log(response.data);
            setChosenAnimal(response.data);
        } catch (error) {
            window.alert(error);}})()

    }, [props.animalID]);

    return (
        <div>
            <Typography
                aria-owns={open ? 'mouse-over-popover' : undefined}
                aria-haspopup="true"
                onMouseEnter={handlePopoverOpen}
                onMouseLeave={handlePopoverClose}
            >
                <Link to={`/SingleAnimal/${chosenAnimal.id}`}>{chosenAnimal.name}</Link>
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
                    {chosenAnimal.type}{'\n'}
                    {chosenAnimal.father != null ? chosenAnimal.father : 'Unregistered father'}{'\n'}
                    {chosenAnimal.mother != null ? chosenAnimal.mother : 'Unregistered mother'}{'\n'}
                    {chosenAnimal.tb_inoculated ? 'Inoculated : True' : 'Inoculated : False'}{'\n'}
                    {chosenAnimal.male ? 'Male' : 'Female'}{'\n'}
                    {chosenAnimal.alive ? 'Alive : Yes' : 'Alive : No'}{'\n'}
                </Typography>
            </Popover>
        </div>
    );
}