import Button from "@mui/material/Button";
import React, { useState, useEffect } from "react";
import axios from "../api/axiosConfig";
import {getConfig} from "../api/getToken";
import "./FarmMoveButton.css"
import {useTheme} from "@mui/material";
import { CachePolicy, CityFarm } from "../api/cityfarm.ts";
import { Animal } from '../api/animals.ts';

const FarmMoveButton = ({ids, farm, cityfarm}: {ids: string[], farm: string, cityfarm: CityFarm}) => {
    
    const token = getConfig();
    const [animal, setAnimal] = useState<Animal>()

    useEffect(() => {
        (async () => {
            if (animal && animal.farm !== farm) {
                animal.farm = farm;
                try {
                    await axios.patch(`/animals/by_id/${animal.id}`, animal, token)
                } catch(error) {
                    console.log(error.message)
                    window.alert(error.message);
                }
                // Update cache
                await cityfarm.getAnimal(animal.id, CachePolicy.NO_CACHE);
            }
    })()
    }, [animal])

    let buttonColor;

    function farmMove(ids: string[]){
        for (let a of ids){
            (async () => {
                const animal = await cityfarm.getAnimal(a, CachePolicy.USE_CACHE, (animal) => setAnimal(animal));
                setAnimal(animal!);
            })()
        }
    }

    switch (farm) {
        case 'WH':
            buttonColor='WH'
            break;
        case 'HC':
            buttonColor='HC'
            break;
        case 'SW':
            buttonColor='SW'
            break;
        default:
            buttonColor='primary'
    }

    return (
    <div className="fButton">
        <Button onClick={() => farmMove(ids)} variant="contained" color={buttonColor}>
            <span>Move to { farm }</span>
        </Button>
    </div>)
}

export default FarmMoveButton