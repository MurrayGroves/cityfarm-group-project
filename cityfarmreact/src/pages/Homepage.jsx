import Eevent from "../assets/example event.png"
import React, {useEffect, useState} from "react";
import axios from "../api/axiosConfig";
import "./Homepage.css"
import { getConfig } from '../api/getToken';
import {Button} from "@mui/material";
import AnimalPopover from "../components/AnimalPopover";
const WH = "WH", HC = "HC", SW = "SW";
const Homepage = () => {
  const [calShowing,setCalShowing] = useState(false)
  const [calContent,setCalContent] = useState(<></>)
  const [liveShowing,setLiveShowing] = useState(false)
  const [liveContent,setLiveContent] = useState(<></>)
  const [encShowing,setEncShowing] = useState(false)
  const [encContent,setEncContent] = useState(<></>)
  const [typeShowing,setTypeShowing] = useState(false)
  const [typeContent,setTypeContent] = useState(<></>)
  const [events,setEvents] = useState([])
  const token = getConfig();
  const showCal =()=>{
    if (calShowing){setCalShowing(false)}else {setCalShowing(true)}}
  useEffect(()=>{
    if (calShowing){
      setCalContent(
          <>
            This displays a calendar which shows relevant events for you and the animals,
            each event has  a title, a description, start and end times (or date), an indicator whether it lasts a full day or not,
            a list of relevant animals it effects, a list of what farms it happens in and the people associated with that event. For example:
            <p><img src={Eevent} width={400} height={200}/></p>
          </>
      )}else{
      setCalContent(<></>)}},[calShowing])
  const showLive =()=>{
    if (liveShowing){setLiveShowing(false)}else {setLiveShowing(true)}}
  useEffect(()=>{
    if (liveShowing){
      setLiveContent(
          <>
            LIVESTOCK
          </>
      )}else{
      setLiveContent(<></>)}},[liveShowing])
  const showEnc =()=>{
    if (encShowing){setEncShowing(false)}else {setEncShowing(true)}}
  useEffect(()=>{
    if (encShowing){
      setEncContent(
          <>
            ENCLOSURES
          </>
      )}else{
      setEncContent(<></>)}},[encShowing])
  const showType =()=>{
    if (typeShowing){setTypeShowing(false)}else {setTypeShowing(true)}}
  useEffect(()=>{
    if (typeShowing){
      setTypeContent(
          <>
            ANIMAL TYPES
          </>
      )}else{
      setTypeContent(<></>)}},[typeShowing])
  const eventsConversion=(events)=>{
    let changed=[]
    for (let i=0;i<events.length;i++){
        changed.push(
            {
                title : events[i].event.title,
                allDay: events[i].event.allDay,
                start: new  Date(events[i].start),
                end: new  Date(events[i].end),
                farms: events[i].event.farms,
                animals: events[i].event.animals,
                description: events[i].event.description,
                enclosures: events[i].event.enclosures
            }
        )
    }
    console.log(changed)
    return changed
}
  useEffect(() => {
        (async () => {
            try {
                const start = new Date()
                const end =  new Date()
                end.setMonth(end.getMonth()+1)
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
    On the left is the side menu, this contains various ways to manage livestock across the three farms. Below are instructions and help to navigate your way around the application, click the headers to reveal their content.

    <h2 onClick={showCal}>Calendar</h2>
    {calContent}

    <h2 onClick={showLive}>Animal Table</h2>
    {liveContent}
    <h2 onClick={showEnc}>Enclosures</h2>
    {encContent}
    <h2 onClick={showType}>Animal Types</h2>
    {typeContent}
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
             {e.farms.includes(WH) ? <p>Windmill Hill</p> : <></>}
             {e.farms.includes(HC) ? <p>Hartcliffe</p> : <></>}
             {e.farms.includes(SW) ? <p>St Werberghs</p> : <></>}
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