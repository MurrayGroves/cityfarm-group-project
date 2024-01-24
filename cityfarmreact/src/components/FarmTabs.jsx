import { useEffect, useState } from "react";
import "./FarmTabs.css";

const FarmTabs = (props) => {

    return (
        <div className="tab-container">
            <button style={{backgroundColor: "#FF0000"}} onClick={()=>{props.selectFarm("wh")}}>Windmill Hill</button>
            <button style={{backgroundColor: "#6666FF"}} onClick={()=>{props.selectFarm("hc")}}>Hartecliff</button>
            <button style={{backgroundColor: "#3312FF", color: "white"}} onClick={()=>{props.selectFarm("sw")}}>St Werburghs</button>
        </div>
    );
}

export default FarmTabs;
