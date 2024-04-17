import Button from "@mui/material/Button";
import React from "react";
import axios from "../api/axiosConfig";
import {getConfig} from "../api/getToken";
import "./FarmMoveButton.css"
import {useTheme} from "@mui/material";

const FarmMoveButton = (props) => {
    const token = getConfig();
    const theme = useTheme().palette;
    let buttonColor;
    function farmMove(ids,farm){
        for (let a of ids){
            let animal;
            (async () => {
                try {

                    const response = await axios.get(`/animals/by_id/${a}`,token);
                    animal=response.data
                    if (animal.farm !== farm[0]) {
                        animal.farm = farm[0];
                        await axios.patch(`/animals/by_id/${a}`, animal, token)
                        window.location.reload()
                    }

                } catch (error) {

                    if (error.response.status === 401) {
                        window.location.href = "/login";
                        return;
                    } else {
                        window.alert(error);
                    }
                };
            })()



        }

    }

    switch (props.farm[0]) {
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
        <Button onClick={() =>farmMove(props.ids,props.farm)} variant="contained" color={buttonColor}>
            Move to {Object.entries(props.farm)[0][1]}
        </Button>
    </div>)
}

export default FarmMoveButton