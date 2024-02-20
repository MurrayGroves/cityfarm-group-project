import * as React from "react";
import "./SingleAnimal.css"
import {  useParams } from "react-router-dom";
import Typography from "@mui/material/Typography";
import axios from '../api/axiosConfig';
import { useState, useEffect } from 'react';
import AnimalPopover from "../components/AnimalPopover";
import CloseIcon from "../assets/close-512.webp";
import SelectedEvent from "../components/SelectedEvent";

const WH = 0, HC = 1, SW = 2;
const SingleAnimal = () => {
    const { animalID } = useParams();
    const [relEvents,setRelEvents] = useState([])
    const [chosenAnimal, setChosenAnimal] = useState({});
    const [selectedEvent,setSelectedEvent] = useState("No event selected");

    useEffect(() => {
        (async () => {
            try {
                const response = await axios.get(`/animals/by_id/${animalID}`);
                setChosenAnimal(response.data);
                const events = await axios.get(`/events/by_animal/${animalID}`)
                setRelEvents(eventsConversion(events.data))
            } catch (error) {
                window.alert(error);
            }
        })();
    }, [animalID]);

    const eventsConversion=(events)=>{
        let changed=[]
        for (let i=0;i<events.length;i++){
            changed.push(
                {
                    title : events[i].title,
                    allDay: events[i].allDay,
                    start: new  Date(events[i].start),
                    end: new  Date(events[i].end),
                    farms: events[i].farms,
                    animals: events[i].animals,
                    description: events[i].description,
                    enclosures: events[i].enclosures
                }
            )
        }
        return changed
    }

    const handleEventClick=(event)=>{
        setSelectedEvent(event)
    }

    return<>
        <h1>{chosenAnimal.name}</h1>
        Sex: {chosenAnimal.male ? 'Male' : 'Female'}<br/>
        Species: {chosenAnimal.type}<br/>
        <span style={{display: 'flex'}}>
            <span style={{marginRight: '0.5em'}}>Father:</span>
            {chosenAnimal.father ?
                <AnimalPopover key={chosenAnimal.father} animalID={chosenAnimal.father}/>
            : 'Unregistered'}
        </span>
        <span style={{display: 'flex'}}>
            <span style={{marginRight: '0.5em'}}>Mother:</span>
            {chosenAnimal.mother ? 
                <AnimalPopover key={chosenAnimal.mother} animalID={chosenAnimal.mother}/>
            : 'Unregistered'}
        </span>
        Farm: to be completed when database supports different farms
        <div>
            {relEvents.length !== 0 ? <h2>Linked Events</h2> : <></>}
            {relEvents.map((event, index) => {
            return(
                <div key={index}>
                    {/* Display relevant event information very similar to event view*/}
                    <h3 onClick={() => handleEventClick(event)}>{event.title}</h3>
                    {event.allDay ?
                        <div>
                            <p>{event.start.toLocaleDateString()} {event.end == null ? <></> : event.end.toLocaleDateString()===event.start.toLocaleDateString() ? <></> : " - " + event.end.toLocaleDateString()}</p>
                        </div>
                        :
                        <div>
                            <p>{event.start.toLocaleString([], {year: '2-digit', month: '2-digit', day: '2-digit', hour: '2-digit', minute:'2-digit'})} - {event.start.toLocaleDateString() === event.end.toLocaleDateString() ? event.end.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : event.end.toLocaleString([], {year: '2-digit', month: '2-digit', day: '2-digit', hour: '2-digit', minute:'2-digit'})}</p>
                        </div>}
                    {event.farms.length !== 0 ? <h4>Farms: </h4> : <></>}
                    {event.farms.includes(WH) ? <p>Windmill Hill </p> : <></>}
                    {event.farms.includes(HC) ? <p>Hartcliffe </p> : <></>}
                    {event.farms.includes(SW) ? <p>St Werberghs</p> : <></>}
                </div>
            )})}
        </div>
        {selectedEvent !== "No event selected" && (
            <>
                <SelectedEvent event={selectedEvent} />
                <button className='closeCross' onClick={() => setSelectedEvent("No event selected")}><img src={CloseIcon} alt="Close"/></button>
            </>
        )}
        </>;
}

export default SingleAnimal