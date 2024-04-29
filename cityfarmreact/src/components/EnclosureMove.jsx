import {Paper} from "@mui/material";
import React from "react";
import AnimalPopover from "./AnimalPopover.tsx";
import Button from "@mui/material/Button";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "../api/axiosConfig";
import './EnclosureMove.css'
import {getConfig} from "../api/getToken";

const EnclosureMove = (props)=>{
    //animal list, excluded enclosure,cityfarm
    const animalList = props.animalList
    const excludedEnc = props.excludedEnc
    const cityfarm = props.cityfarm
    const enclosures = props.enclosures
    const close = props.close
    const token=getConfig()

    for (const item of Object.entries(props)){
        if(item[1] ===undefined || item[1] ===null){
            return <></>
        }
    }

    console.log(Object.entries(props))

    const enclosureMove =(animalList) =>{
        let name = ' animal group'
        if (animalList.length === 1){
            name = <AnimalPopover key={animalList[0]} animalID={animalList[0]} cityfarm={cityfarm}/>
        }
        return(
            <div> Moving {name} to one of: <br/>{
                enclosures.map((enc) => (
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
                    const req = await axios.patch(`/enclosures/moveanimal`,[animal,enc._id,excludedEnc._id], token)
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

    <div className={`moveContent ${animalList.length>0 ? 'moveVisible' : 'moveHidden'}`}>
        <Paper elevation={3} className={'movePaper'}>
            {enclosureMove(animalList)}
        </Paper>
    </div>


    )


}

export default EnclosureMove