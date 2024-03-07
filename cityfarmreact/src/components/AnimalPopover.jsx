import * as React from 'react';
import Popover from '@mui/material/Popover';
import Typography from '@mui/material/Typography';
import { Link } from 'react-router-dom';
import './AnimalPopover.css';
import axios from '../api/axiosConfig';
import { useState, useEffect } from 'react';
import { useTheme } from '@mui/material/styles';
import { getConfig } from '../api/getToken';

const aExamples = [
    {
        name: 'Loading...',
    },
];

const AnimalPopover = (props) => {
    const colour = useTheme().palette.mode === 'light' ? 'black' : 'white';
    const hoverColour = '#f1f1f1';

    const [anchorEl, setAnchorEl] = useState(null);
    const [chosenAnimal, setChosenAnimal] = useState(aExamples[0]);
    const [animalMother, setMother] = useState('Unregistered');
    const [animalFather, setFather] = useState('Unregistered');

    const token = getConfig();

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
                const response = await axios.get(`/animals/by_id/${props.animalID}`, token);
                setChosenAnimal(response.data);
            } catch (error) {
                window.alert(error);
            }
        })();
    }, [props.animalID]);

    useEffect(() => {
        if (chosenAnimal.mother) {
            (async () => {
                try {
                    const mother = await axios.get(`/animals/by_id/${chosenAnimal.mother}`, token);
                    setMother(mother.data.name);
                } catch (error) {
                    if (error.response.status === 401) {
                        window.location.href = '/login';
                        return;
                    } else {
                        window.alert(`mother issue \n ${error}`);
                    }
                }
            })();
        }
        if (chosenAnimal.father) {
            (async () => {
                try {
                    const father = await axios.get(`/animals/by_id/${chosenAnimal.father}`, token);
                    setFather(father.data.name);
                } catch (error) {
                    if (error.response.status === 401) {
                        window.location.href = '/login';
                        return;
                    } else {
                        window.alert(`father issue \n ${error}`);
                    }
                }
            })();
        }
    }, [chosenAnimal]);

    return (
        <div>
            <Typography
                aria-owns={open ? 'mouse-over-popover' : undefined}
                aria-haspopup="true"
                onMouseEnter={handlePopoverOpen}
                onMouseLeave={handlePopoverClose}
                style={{ display: 'inline-block' }}
            >
                <Link
                    className="animalLink"
                    style={{ '--colour': colour, '--hoverColour': hoverColour }}
                    to={`/single-animal/${chosenAnimal._id}`}
                >
                    {chosenAnimal.name}
                </Link>
            </Typography>
            <Popover
                id="mouse-over-popover"
                sx={{ pointerEvents: 'none' }}
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
                    {`Type: ${
                        chosenAnimal.type
                            ? chosenAnimal.type.charAt(0).toUpperCase() + chosenAnimal.type.slice(1)
                            : 'Loading...'
                    }`}
                    <br />
                    {`Father: ${animalFather}`}
                    <br />
                    {`Mother: ${animalMother}`}
                    <br />
                    {`Sex: ${chosenAnimal.sex === 'f' ? 'Female' : chosenAnimal.sex === 'm' ? 'Male' : 'Castrated'}`}
                </Typography>
            </Popover>
        </div>
    );
};

export default AnimalPopover;
