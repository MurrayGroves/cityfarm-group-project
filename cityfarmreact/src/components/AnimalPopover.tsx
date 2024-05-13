import React from 'react';
import Popover from '@mui/material/Popover';
import Typography from '@mui/material/Typography';
import {Link} from "react-router-dom";
import { useState, useEffect } from 'react';
import { useTheme } from '@mui/material/styles';
import { CachePolicy, CityFarm } from '../api/cityfarm.ts';
import { Animal, Sex, Schema } from '../api/animals.ts';

declare module "react" {
    // augment CSSProperties here
    interface CSSProperties {
      "--colour"?: string | number;
      "--hoverColour"?: string | number;
    }
}

const AnimalPopover = ({cityfarm, animalID, object}: {cityfarm: CityFarm, animalID: string, object: Animal | null}) => {
    const colour = useTheme().palette.mode === 'light' ? 'black' : 'white';
    const hoverColour = '#f1f1f1';

    const [anchorEl, setAnchorEl] = useState(null);
    const [chosenAnimal, setChosenAnimal] = useState<Animal | null>(null);
    const [animalMother, setMother] = useState("Unregistered")
    const [animalFather, setFather] = useState("Unregistered")
    const [loading, setLoading] = useState(true)

    const handlePopoverOpen = (e) => {
        setAnchorEl(e.currentTarget);
    };

    const handlePopoverClose = () => {
        setAnchorEl(null);
    };

    const open = Boolean(anchorEl);

    useEffect(() => {
        if (object) {
            setChosenAnimal(object)
            setLoading(false)
            return;
        }

        (async () => {
            let animal = await cityfarm.getAnimal(animalID, CachePolicy.PREFER_CACHE, (animal) => setChosenAnimal(animal));

            setChosenAnimal(animal)
            setLoading(false)
        })()
    }, [animalID]);


    useEffect(()=>{
        if (chosenAnimal === null) {
            return;
        }

        if(chosenAnimal.mother){
            (async ()=>{
                let mother = await cityfarm.getAnimal(chosenAnimal.mother, CachePolicy.PREFER_CACHE, (animal) => setMother(animal.name));
                setMother(mother ? mother.name : "Animal Not Found");
            })()}
        if (chosenAnimal.father){
            (async ()=>{
                let father = await cityfarm.getAnimal(chosenAnimal.father, CachePolicy.PREFER_CACHE, (animal) => setFather(animal.name));
                setFather(father ? father.name : "Animal Not Found")
            })()
        }
    },[chosenAnimal])

    if (chosenAnimal === null) {
        return <div>
            <Typography
                aria-owns={open ? 'mouse-over-popover' : undefined}
                aria-haspopup="true"
                onMouseEnter={handlePopoverOpen}
                onMouseLeave={handlePopoverClose}
                style={{display: 'inline-block', color: 'coral'}}
            >
                {loading ? "" : "Animal Not Found"}
            </Typography>
            <Popover
                id="mouse-over-popover"
                sx={{pointerEvents: 'none'}}
                open={open}
                anchorEl={anchorEl}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                }}
                onClose={handlePopoverClose}
                disableRestoreFocus
            >
                <Typography sx={{ p: 1, whiteSpace: 'pre-line' }}>
                    <b>{`You probably deleted it, but dont worry - you can edit this animal and change it to an existing animal.`}</b>
                </Typography>
            </Popover>
            </div>
    }

    return (
        <div>
            <Typography
                aria-owns={open ? 'mouse-over-popover' : undefined}
                aria-haspopup="true"
                onMouseEnter={handlePopoverOpen}
                onMouseLeave={handlePopoverClose}
                style={{display: 'inline-block'}}
            >
            <Link className='animalLink' style={{'--colour': colour, '--hoverColour': hoverColour}} to={`/single-animal/${chosenAnimal.id}`}>{chosenAnimal.name}</Link>
            </Typography>
            <Popover
                id="mouse-over-popover"
                sx={{pointerEvents: 'none'}}
                open={open}
                anchorEl={anchorEl}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                }}
                onClose={handlePopoverClose}
                disableRestoreFocus
            >
                <Typography sx={{ p: 1, whiteSpace: 'pre-line' }}>
                    {`Type: ${chosenAnimal.type ? chosenAnimal.type : 'Loading...'}`}<br/>
                    {`Father: ${animalFather}`}<br/>
                    {`Mother: ${animalMother}`}<br/>
                    {`Sex: ${chosenAnimal.sex === Sex.Female ? 'Female' : (chosenAnimal.sex === Sex.Male ? 'Male' : 'Castrated')}`} <br/><br/>
                    <b>{`Click name for more info`}</b>
                </Typography>
            </Popover>
        </div>
    );
}

export default AnimalPopover;