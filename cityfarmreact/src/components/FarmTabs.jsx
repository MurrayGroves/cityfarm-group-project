import { useEffect, useState } from "react";
import "./FarmTabs.css";

const FarmTabs = (props) => {
    return (
        <div className="tab-container">
            <button style={{borderColor: "#FF0000"}} onClick={()=>{props.selectFarm("wh")}}>Windmill Hill</button>
            <button style={{borderColor: "#6666FF"}} onClick={()=>{props.selectFarm("hc")}}>Hartecliff</button>
            <button style={{borderColor: "#3312FF"}} onClick={()=>{props.selectFarm("sw")}}>St Werburghs</button>
        </div>
    );
}

export default FarmTabs;
