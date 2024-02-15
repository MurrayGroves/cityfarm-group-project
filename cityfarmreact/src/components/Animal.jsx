import * as React from 'react';
import Popover from '@mui/material/Popover';
import Typography from '@mui/material/Typography';
import {Link} from "react-router-dom";
import './Animal.css'
import axios from "../api/axiosConfig";
import { useState, useEffect } from 'react';

const aExamples = [
    {
    id : 1,
    name:"bob",
    type:"cow",
    sex:"F",
    father : "alice",
    fid : 2,
    mother	:"undefined",
    mid : null,
    tb_inoculated : true,
    live : true
}]

    
const Animal = (props) => {
    const [anchorEl, setAnchorEl] = useState(null);
    const [chosenAnimal, setChosenAnimal] = useState(aExamples[0]);

    const handlePopoverOpen = (e) => {
        setAnchorEl(e.currentTarget);
    };

    const handlePopoverClose = () => {
        setAnchorEl(null);
    };

    const open = Boolean(anchorEl);

    useEffect(() => {
        (async () => {
        try {
            const response = await axios.get(`/animals/by_id/${props.animalID}`);
            setChosenAnimal(response.data);
        } catch (error) {
            window.alert(error);
        }})()
    }, [props.animalID]);

    return (
        <div>
            <Typography
                aria-owns={open ? 'mouse-over-popover' : undefined}
                aria-haspopup="true"
                onMouseEnter={handlePopoverOpen}
                onMouseLeave={handlePopoverClose}
                style={{margin: '5px 0'}}
            >
                <Link to={`/single-animal/${chosenAnimal._id}`}>{chosenAnimal.name}</Link>
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
                <Typography sx={{ p: 1, whiteSpace: 'pre-line' }}>
                    {`Type: ${chosenAnimal.type}`}<br/>
                    {chosenAnimal.father != null ? `Father: ${chosenAnimal.father}` : 'Father: Unregistered'}<br/>
                    {chosenAnimal.mother != null ? `Mother: ${chosenAnimal.mother}` : 'Mother: Unregistered'}<br/>
                    {chosenAnimal.tb_inoculated ? 'Inoculated: True' : 'Inoculated: False'}<br/>
                    {chosenAnimal.male ? 'Sex: Male' : 'Sex: Female'}<br/>
                    {chosenAnimal.alive ? 'Live: Yes' : 'Live: No'}<br/>
                </Typography>
            </Popover>
        </div>
    );
}

export default Animal;