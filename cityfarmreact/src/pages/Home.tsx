import React, {useEffect, useState} from "react";
import axios from "../api/axiosConfig.js";
import "./Home.css"
import { getConfig } from '../api/getToken.js';
import { Button } from "@mui/material";
import AnimalPopover from "../components/AnimalPopover.jsx";
import { useTheme } from "@mui/material";
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import { CityFarm } from "../api/cityfarm.js";
import { EventInstance } from "../api/events.js";

declare module "react" {
    interface CSSProperties {
      "--colour"?: string;
    }
}

const Home = ({farms, cityfarm}: {farms: any, cityfarm: CityFarm}) => {
    const [events,setEvents] = useState<EventInstance[]>([])
    const colour = useTheme().palette.mode === 'dark' ? 'white' : 'black';



    //get the events for the next 2 months (IF IT WORKS)
    useEffect(() => {
        (async () => {
            try {
                const start = new Date()
                const end =  new Date()
                end.setMonth(end.getMonth()+2)
                setEvents(await cityfarm.getEventsBetween(true, start, end, (events) => setEvents(events)));
            } catch (error) {
                if (error.response?.status === 401) {
                    window.location.href = "/login";
                    return;
                } else {
                    console.error(error);
                }
            }
        })();
    }, []);

    return(<>
        <h1>City Farm Livestock Manager</h1>
        <p>
            Welcome to the livestock manager application for the livestock managers of city farms across the Bristol area!<br/>
            For redirection to the main sites of the farms click here:
        </p>
        <ul>
            <li><a style={{'--colour': colour}} href="https://www.windmillhillcityfarm.org.uk/" target="_blank">Windmill Hill</a></li>
            <li><a style={{'--colour': colour}} href="https://www.swcityfarm.co.uk/" target="_blank">St Werburghs</a></li>
            <li><a style={{'--colour': colour}} href="https://hartcliffecityfarm.org.uk/" target="_blank">Hartcliffe</a></li>
        </ul>
        <p>
            On the left is the side menu, this contains various ways to manage livestock across the three farms.<br/>
            Hover over the question mark on the nav bar in any page to see useful help on that page and click it for an overall view of the entire website.
        </p>
        <br/>
        {events.length > 0 && <h2>Upcoming Events</h2>}
        {/*  events are mapped below, same as in selected event with some visual changes*/}
        <Grid container spacing={3} columns={{xs: 1, md: 2, lg: 3, xl: 4 }}>
        {events.slice(0, 4).map((e, index)=>(
            <Grid item xs={1} key={index}>
            <Paper elevation={3} className="event-box">
                <h2>{e.event.title}</h2>
                {
                    e.event.allDay ?
                        <div>
                            <p>{e.start.toLocaleDateString()} {e.end == null ? <></> : e.end.toLocaleDateString() === e.start.toLocaleDateString() ? <></> : " - " + e.end.toLocaleDateString()}</p>
                        </div>
                        :
                        <div>
                            <p>{e.start.toLocaleString([], {year: '2-digit', month: '2-digit', day: '2-digit', hour: '2-digit', minute:'2-digit'})} - {e.start.toLocaleDateString() === e.end.toLocaleDateString() ? e.end.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}): e.end.toLocaleString([], {year: '2-digit', month: '2-digit', day: '2-digit', hour: '2-digit', minute:'2-digit'})}</p>
                        </div>

                }
                {e.event.farms.length !== 0 ? <h3>Farms</h3> : <></>}
                {e.event.farms.includes(farms.WH) ? <p>Windmill Hill</p> : <></>}
                {e.event.farms.includes(farms.HC) ? <p>Hartcliffe</p> : <></>}
                {e.event.farms.includes(farms.SW) ? <p>St Werberghs</p> : <></>}
                {e.event.animals.length !== 0 ? <h3>Animals</h3> : <></>}
                {e.event.animals.map((animalID) => (
                    <AnimalPopover key={animalID._id} animalID={animalID._id}/>
                ))}
                {e.event.enclosures.length !== 0 &&
                    <div>
                        <h3>Enclosures</h3>
                        {e.event.enclosures.map((enclosure, index) => (
                            <p key={index}>{enclosure.name}</p>
                        ))}
                    </div>}
                {e.event.description !== "" ?
                    <div>
                        <h3>Description</h3>
                        {e.event.description}
                    </div> : <></>}
            </Paper>
            </Grid>
        ))}
        </Grid>
    </>)
}
export default Home