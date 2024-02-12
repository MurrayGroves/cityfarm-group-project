import "./FarmTabs.css";
import Button from '@mui/material/Button';

const FarmTabs = (props) => {
    return (
        <div className="tab-container">
            <Button variant='contained' disableElevation onClick={()=>{props.selectFarm("wh")}} /*color={props.colours.WH}*/>Windmill Hill</Button>
            <Button variant='contained' disableElevation onClick={()=>{props.selectFarm("hc")}} /*color={props.colours.HC}*/>Hartecliffe</Button>
            <Button variant='contained' disableElevation onClick={()=>{props.selectFarm("sw")}} /*color={props.colours.SW}*/>St Werburghs</Button>
        </div>
    );
}

export default FarmTabs;
