import React, {useEffect, useState} from "react";
import "./Home.css"
import AnimalPopover from "../components/AnimalPopover.tsx";
import { useTheme } from "@mui/material";
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import { CachePolicy, CityFarm } from "../api/cityfarm.ts";
import { EventInstance } from "../api/events.js";
import { IndividualEvent } from "../components/IndividualEvent.tsx";

declare module "react" {
    interface CSSProperties {
      "--colour"?: string | number;
    }
}

const Home = ({farms, cityfarm}: {farms: any, cityfarm: CityFarm}) => {
    const [events,setEvents] = useState<EventInstance[]>([])
    const colour = useTheme().palette.mode === 'dark' ? 'white' : 'black';


    //get the events for the next month
    useEffect(() => {
        (async () => {
            try {
                const start = new Date()
                const end =  new Date()
                end.setMonth(end.getMonth()+1)
                setEvents((await cityfarm.getEventsBetween(CachePolicy.USE_CACHE, start, end, (events) => setEvents(events))).sort((a, b) => a.start.getTime() - b.start.getTime()));
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
        {events.slice(0, 4).map((e, index) => (
            <Grid item xs={1} key={index}>
                <IndividualEvent cityfarm={cityfarm} object={e.event} eventID={e.event.id} farms={farms} instance={e}/>
            </Grid>
        ))}
        </Grid>
    </>)
}
export default Home