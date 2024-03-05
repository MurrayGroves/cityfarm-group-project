import Eevent from "../assets/example event.png"
import React, {useEffect, useState} from "react";
import axios from "../api/axiosConfig";
import "./Homepage.css"
import { getConfig } from '../api/getToken';
import {Button} from "@mui/material";
import AnimalPopover from "../components/AnimalPopover";
import {eventsConversion} from "./Calendar";

const Homepage = ({farms}) => {

  const [events,setEvents] = useState([])
  const token = getConfig();

  //get the events for the next 2 months (IF IT WORKS)
  useEffect(() => {
        (async () => {
            try {
                const start = new Date()
                const end =  new Date()
                end.setMonth(end.getMonth()+2)
                console.log(start,end)
                const response = await axios.get(`/events`, {params: {from: start.toISOString(), to: end.toISOString()}, ...token});
                setEvents(eventsConversion(response.data.slice(0, 5)));
            } catch (error) {
                window.alert(error);
            }
        })();
    }, []);

  return(<>
      <h1>City Farm Livestock Manager</h1>
      Welcome to the livestock manager application for the livestock managers of
    city farms across the Bristol area! For redirection to the main sites of the farms click here:
    <ul>
      <li> <a href="https://www.windmillhillcityfarm.org.uk/" target="_blank">Windmill Hill</a></li>
      <li> <a href="https://www.swcityfarm.co.uk/" target="_blank">St Werburghs</a></li>
      <li> <a href="https://hartcliffecityfarm.org.uk/" target="_blank">Hartcliffe</a></li>
    </ul>
    On the left is the side menu, this contains various ways to manage livestock across the three farms.
      Hover over the question mark on the nav bar in any page to see useful help on that page and click it for an overall view of the entire website.
      <h2>Upcoming Events:</h2>
    {/*  events are mapped below, same as in selected event with some visual changes*/}
    <div className="events-container">
    {events.map((e)=>(
        <div className="event-box" key={e.title}>
             <h2>{e.title}</h2>
             {
                 e.allDay ?
                     <div>
                         <p>{e.start.toLocaleDateString()} {e.end == null ? <></> : e.end.toLocaleDateString() === e.start.toLocaleDateString() ? <></> : " - " + e.end.toLocaleDateString()}</p>
                     </div>
                     :
                     <div>
                         <p>{e.start.toLocaleString([], {year: '2-digit', month: '2-digit', day: '2-digit', hour: '2-digit', minute:'2-digit'})} - {e.start.toLocaleDateString() === e.end.toLocaleDateString() ? e.end.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}): e.end.toLocaleString([], {year: '2-digit', month: '2-digit', day: '2-digit', hour: '2-digit', minute:'2-digit'})}</p>
                     </div>

             }
             {e.farms.length !== 0 ? <h3>Farms</h3> : <></>}
             {e.farms.includes(farms.WH) ? <p>Windmill Hill</p> : <></>}
             {e.farms.includes(farms.HC) ? <p>Hartcliffe</p> : <></>}
             {e.farms.includes(farms.SW) ? <p>St Werberghs</p> : <></>}
             {e.animals.length !== 0 ? <h3>Animals</h3> : <></>}
             {e.animals.map((animalID) => (
                 <AnimalPopover key={animalID._id} animalID={animalID._id}/>
             ))}
             {e.enclosures.length !== 0 &&
                 <div>
                     <h3>Enclosures</h3>
                     {e.enclosures.map((enclosureName, index) => (
                         <p key={index}>{enclosureName}</p>
                     ))}
                 </div>}
             {e.description !== "" ?
                 <div>
                     <h3>Description</h3>
                     {e.description}
                 </div> : <></>}
         </div>
     ))}
    </div>





</>)
}
export default Homepage