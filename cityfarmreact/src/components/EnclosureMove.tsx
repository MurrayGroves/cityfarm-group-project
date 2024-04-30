import {Alert, Dialog, DialogContent, DialogTitle, IconButton, Paper} from "@mui/material";
import React, {ReactNode, useEffect, useState} from "react";
import AnimalPopover from "./AnimalPopover.tsx";
import Button from "@mui/material/Button";
import DeleteIcon from "@mui/icons-material/Delete";
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import axios from "../api/axiosConfig.js";
import './EnclosureMove.css'
import {getConfig} from "../api/getToken.js";
import { CityFarm } from "../api/cityfarm.ts";
import { Enclosure } from "../api/enclosures.ts";
import { Animal } from "../api/animals.ts";
import { Close } from "@mui/icons-material";

const EnclosureMove = ({cityfarm, excludedEnc, enclosures, animalList, close}: {cityfarm: CityFarm, excludedEnc: Enclosure | null, enclosures: Enclosure[], animalList: Animal[], close: () => void})=>{
    //animal list, excluded enclosure,cityfarm

    const token = getConfig()
    const [capacitiesWarning, setCapacitiesWarning] = useState('')

    useEffect(() => {
        console.log(animalList);
    }, [animalList])

    /*
    useEffect(
        ()=>{
            if (props.animalList.length<1){
                setAnimalList([])
            }else {
                (async () => {
                    const newAlist=[]
                    for (const id of props.animalList) {
                        cityfarm
                        try {
                            const req = await axios.get(`/animals/by_id/${id}`, token)
                            newAlist.push(req.data)
                        } catch (error) {
                            if (error.response.status === 401) {
                                window.location.href = "/login";
                                return;
                            } else {
                                window.alert(error);
                            }
                        }
                    }
                    setAnimalList(newAlist)
                })()
            }

        },[props.animalList]
    )
    */

    const filteredEnclosures=()=>{
        let animalListTypes: {[key: string]: number;} = {}
        let newEncList: Enclosure[] = []
        for (const animal of animalList) {
            if (animalListTypes.hasOwnProperty(animal.type)) {
                animalListTypes[animal.type] = animalListTypes[animal.type] + 1;
            } else {
                animalListTypes[animal.type] = 1;
            }
        }
        //console.log(animalListTypes)
        for (const enc of enclosures){
            //console.log(enc)
            let includeFlag = true
            for (const entry of Object.entries(animalListTypes)){
               //console.log(val)
               //console.log(enc.capacities[val[0]])
                if (enc.capacities[entry[0]] < enc.holding.length + entry[1] || enc.capacities[entry[0]] === undefined){
                    includeFlag = false
                }
            }
            if (includeFlag){
                newEncList.push(enc)
            }
        }
        return newEncList
    }

    const enclosureMove = (animalList: Animal[]) =>{
        let name: string = 'livestock'
        if (animalList.length === 1) {
            name = animalList[0].name;
        }
        return(
            <div> Move {name} to one of: <br/>
                {(filteredEnclosures().length == 0 || (filteredEnclosures().length == 1 && filteredEnclosures()[0].id == excludedEnc?.id))
                ? <><WarningAmberIcon/> No enclosures with space available, change selection<br/></>
                : filteredEnclosures().map((enc) => (
                    enc.id !== excludedEnc?.id ? (
                        <Button key={enc.id} onClick={() => {animalTo(enc)}}>
                            {enc.name}<br/>
                        </Button>
                    ) : (
                        <React.Fragment key={enc.id} />
                    )
                ))}
                <br/>
                <IconButton style={{position: 'relative', left: '80%'}} onClick={()=> close()}><Close/></IconButton>
            </div>
        )
    }

    const animalTo = (enc: Enclosure) => {
        (async () => {
            for (const animal of animalList) {
                try {
                    const response = await axios.patch(`/enclosures/moveanimal`, [animal.id, enc.id, excludedEnc?.id], token)
                    // console.log(req);
                } catch (error) {
                    if (error.response.status === 401) {
                        window.location.href = "/login";
                        console.log(error)
                        return;
                    } else {
                        window.alert(error);
                    }
                }
            }
            window.location.reload();
        })();
    }

    return (
        <div>
            <div className={`moveContent ${animalList.length > 0 ? 'moveVisible' : 'moveHidden'}`}>
                <Paper elevation={3} className={'movePaper'}>
                    {enclosureMove(animalList)}
                </Paper>
            </div>
            <div>
                <Dialog open={capacitiesWarning !==''} onClose={()=>{setCapacitiesWarning('')}}>
                    <DialogTitle>Capacity issue for enclosure movement</DialogTitle>
                    <DialogContent >
                        <Alert severity={'warning'}>
                            {capacitiesWarning}
                        </Alert>
                    </DialogContent>
                </Dialog>
            </div>
        </div>
    )


}

export default EnclosureMove