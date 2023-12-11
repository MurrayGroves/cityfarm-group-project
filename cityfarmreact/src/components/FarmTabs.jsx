import { useEffect, useState } from "react";

const FarmTabs = (props) => {
    const [farm, setFarm] = useState("");

    /*
    useEffect(() => {
        props.setFarm(farm);        
    },[farm]);
    */

    return (
        <div>
            <button></button>
            <button></button>
            <button></button>
        </div>
    );
}

export default FarmTabs;