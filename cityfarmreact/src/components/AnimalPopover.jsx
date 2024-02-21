import * as React from 'react';
import Popover from '@mui/material/Popover';
import Typography from '@mui/material/Typography';
import {Link} from "react-router-dom";
import './AnimalPopover.css'
import axios from "../api/axiosConfig";
import { useState, useEffect } from 'react';

const aExamples = [
    {

    name:"error",

}]


const AnimalPopover = (props) => {
    const [anchorEl, setAnchorEl] = useState(null);
    const [chosenAnimal, setChosenAnimal] = useState(aExamples[0]);
    const [animalMother, setMother] = useState("Unregistered")
    const [animalFather, setFather] = useState("Unregistered")

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

    useEffect(()=>{
        if(chosenAnimal.mother !== undefined && chosenAnimal.mother !== null){
            console.log("hello");
            (async ()=>{
            try{
                const mother = await axios.get(`/animals/by_id/${chosenAnimal.mother}`);
                setMother(mother.data.name);
            } catch (error) {
                if (error.response.status === 401) {
                    window.location.href = "/login";
                    return;
                } else {
                    window.alert(error);
                }
            }})()}
        if (chosenAnimal.father !== undefined && chosenAnimal.father !== null){
            (async ()=>{
            try{
                const father = await axios.get(`/animals/by_id/${chosenAnimal.father}`);
                setFather(father.data.name);
            } catch (error) {
                if (error.response.status === 401) {
                    window.location.href = "/login";
                    return;
                } else {
                    window.alert(error);
                }
            }})()
        }

    },[chosenAnimal])

    return (
        <div>
            <Typography
                aria-owns={open ? 'mouse-over-popover' : undefined}
                aria-haspopup="true"
                onMouseEnter={handlePopoverOpen}
                onMouseLeave={handlePopoverClose}
                    // style={{margin: '5px 0'}}
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
                    {`Father : ${animalFather}`}<br/>
                    {`Mother : ${animalMother}`}<br/>
                    {chosenAnimal.tb_inoculated ? 'Inoculated: True' : 'Inoculated: False'}<br/>
                    {chosenAnimal.male ? 'Sex: Male' : 'Sex: Female'}<br/>
                    {chosenAnimal.alive ? 'Live: Yes' : 'Live: No'}
                </Typography>
            </Popover>
        </div>
    );
}

export default AnimalPopover;