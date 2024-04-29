import {Alert, Dialog, DialogContent, DialogTitle, Paper} from "@mui/material";
import React, {useEffect, useState} from "react";
import AnimalPopover from "./AnimalPopover.tsx";
import Button from "@mui/material/Button";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "../api/axiosConfig";
import './EnclosureMove.css'
import {getConfig} from "../api/getToken";

const EnclosureMove = (props)=>{
    //animal list, excluded enclosure,cityfarm

    const excludedEnc = props.excludedEnc
    const cityfarm = props.cityfarm
    const enclosures = props.enclosures
    const close = props.close
    const token=getConfig()
    const [capacitiesWarning,setCapacitiesWarning] = useState('')
    const [animalList,setAnimalList]=useState([])

    useEffect(
        ()=>{
            if (props.animalList.length<0){
                setAnimalList([])
            }else {
                (async () => {
                    const newAlist=[]
                    for (const id of props.animalList) {
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


    for (const item of Object.entries(props)){
        if(item[1] ===undefined || item[1] ===null){
            return <></>
        }
    }

    const filteredEnclosures=()=>{
        let animalListTypes={}
        let newEncList=[]
        for (const animal of animalList){
            //console.log(animal.type,Object.keys(animalListTypes))
            if (animal.type in Object.keys(animalListTypes)){
                console.log("hello")
                animalListTypes[animal.type] = animalListTypes[animal.type]+1
            }else{
                animalListTypes[animal.type] = 1
            }
        }
        //console.log(animalListTypes)
        for (const enc of enclosures){
            console.log(enc)
            let includeFlag = true
            for (const val of Object.entries(animalListTypes)){
               console.log(val)
               console.log(enc.capacities[val[0]])
                if (enc.capacities[val[0]]<val[1] || enc.capacities[val[0]]===undefined){
                    includeFlag=false
                }
            }
            if (includeFlag){
                newEncList.push(enc)
            }
        }
        return newEncList
    }

    const enclosureMove =(animalList) =>{
        let name = ' animal group'
        if (animalList.length === 1){
            name = <AnimalPopover key={animalList[0]._id} animalID={animalList[0]._id} cityfarm={cityfarm}/>
        }
        return(
            <div> Moving {name} to one of: <br/>{
                filteredEnclosures().map((enc) => (
                    enc._id !== excludedEnc._id ? (
                        <Button key={enc._id} onClick={() => {animalTo(enc);window.location.reload(false);}}>
                            {enc.name}<br />
                        </Button>
                    ) : (
                        <React.Fragment key={enc._id} />
                    )
                ))}
                <Button startIcon={<DeleteIcon />} onClick={()=> close()}/>
            </div>
        )
    }
    const animalTo = (enc) =>{
        (async () => {
            for (const animal of animalList) {
                try {
                    const req = await axios.patch(`/enclosures/moveanimal`,[animal._d,enc._id,excludedEnc._id], token)
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

    return(
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