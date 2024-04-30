import {Alert, Dialog, DialogContent, DialogTitle, Paper} from "@mui/material";
import React, {ReactNode, useEffect, useState} from "react";
import AnimalPopover from "./AnimalPopover.tsx";
import Button from "@mui/material/Button";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "../api/axiosConfig.js";
import './EnclosureMove.css'
import {getConfig} from "../api/getToken.js";
import { CityFarm } from "../api/cityfarm.ts";
import { Enclosure } from "../api/enclosures.ts";
import { Animal } from "../api/animals.ts";

const EnclosureMove = ({cityfarm, excludedEnc, enclosures, animalList, close}: {cityfarm: CityFarm, excludedEnc: Enclosure | null, enclosures: Enclosure[], animalList: Animal[], close: () => void})=>{
    //animal list, excluded enclosure,cityfarm

    const token = getConfig()
    const [capacitiesWarning, setCapacitiesWarning] = useState('')

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
                if (enc.capacities[entry[0]] < entry[1] || enc.capacities[entry[0]] === undefined){
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
        let name: string | ReactNode = 'animal group'
        if (animalList.length === 1) {
            name = <AnimalPopover key={animalList[0].id} animalID={animalList[0].id} cityfarm={cityfarm}/>
        }
        return(
            <div> Moving {name} to one of: <br/>{
                filteredEnclosures().map((enc) => (
                    enc.id !== excludedEnc?.id ? (
                        <Button key={enc.id} onClick={() => {animalTo(enc);window.location.reload();}}>
                            {enc.name}<br/>
                        </Button>
                    ) : (
                        <React.Fragment key={enc.id} />
                    )
                ))}
                <Button startIcon={<DeleteIcon />} onClick={()=> close()}/>
            </div>
        )
    }

    const animalTo = (enc: Enclosure) =>{
        (async () => {
            for (const animal of animalList) {
                try {
                    const req = await axios.patch(`/enclosures/moveanimal`, [animal.id, enc.id, excludedEnc?.id], token)
                    // console.log(req);
                    //window.location.reload(false);
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
        })();
    }

    if(excludedEnc === null) return <p>Error</p>

    return (
        <div>
            <div className={`moveContent ${animalList.length>0 ? 'moveVisible' : 'moveHidden'}`}>
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