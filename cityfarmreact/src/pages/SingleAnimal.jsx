
import * as React from "react";
import "../components/SingleAnimal.css"
import {Link, useParams} from "react-router-dom";
import Typography from "@mui/material/Typography";
import axios from '../api/axiosConfig';
import { useState, useEffect } from 'react';
import Animal from "../components/Animal";
import CloseIcon from "../components/close-512.webp";



const WH = 0, HC = 1, SW = 2;
const events = [ /*These are example events.*/
    {
        title : "Boss Meeting",
        allDay: false,
        start: new  Date(2024,1,1, 13),
        end: new  Date(2024,1,1, 14),
        farms: [],
        animals: ["174447d3-bedb-4311-a16c-1771aa82d173"]
    },
    {
        title : "Bull in with cows",
        allDay: false,
        start: new  Date(2024,1,5, 8),
        end: new  Date(2024,1,8, 16),
        farms: [WH],
        animals: ["05eea36a-1098-4392-913b-25e6508df54c"]
    },
    {
        title : "School Visits",
        allDay: true,
        start: new  Date(2024,1,9, 8),
        end: new  Date(2024,1,9, 23, 59),
        farms: [HC, SW],
        animals: ["05eea36a-1098-4392-913b-25e6508df54c","4735ad94-8a16-4845-870d-513d9947b262"]
    },
    {
        title : "Defra Inspection",
        allDay: true,
        start: new  Date(2024,1,20  ),
        end: new Date(2024,1,20),
        farms: [WH, HC, SW],
        animals: []
    }
];


const SingleAnimal = () => { 
    const { animalID } = useParams();
    const [relEvents,setRelEvents] = useState([])
    const [chosenAnimal, setChosenAnimal] = useState({});
    const [selectedEvent,setSelectedEvent] = useState("No event selected");

    useEffect(() => {
        (async () => {
            try {
                console.log(animalID);
                const response = await axios.get(`/animals/by_id/${animalID}`);

                console.log(response.data);
                setChosenAnimal(response.data);
            } catch (error) {
                window.alert(error);
            }
        })();
    }, []);
    
    useEffect(() => {
        let matchingEvents = []; // Temporary array to collect matching events
        for (let i = 0; i < events.length; i++) {
            for (let j = 0; j < events[i].animals.length; j++) {
                if (animalID === events[i].animals[j]) {
                    console.log("animal:", animalID, "\n events:", events[i].animals[j]);
                    matchingEvents.push(events[i]);
                    break; // Found a matching event, no need to check further animals in this event
                }
            }
        }
        setRelEvents(matchingEvents); // Update the state once with all matching events
    }, [animalID]);

    const handleEventClick=(event)=>{
        setSelectedEvent(event)
    }

    return<>
        <h1>{chosenAnimal.name}</h1>
            <Typography sx={{ p: 1,whiteSpace: 'pre-line' }}>
                Sex: {chosenAnimal.male ? 'Male' : 'Female'}<br/>
                Species: {chosenAnimal.type}<br/>
                <span style={{display:'flex', justifyContent:'start'}}>Father:
                    {<> </>}{chosenAnimal.father ? <Animal key={chosenAnimal.father} animalID={chosenAnimal.father}/>
                : 'Unregistered'}</span>
                Mother: {chosenAnimal.mother ? <Animal key={chosenAnimal.mother} animalID={chosenAnimal.mother}/>
                : 'Unregistered'}<br/>
                Farm: to be completed when database supports different farms
            </Typography>

        <div>
            {relEvents.length !== 0 ? <h2>Linked Events</h2> : <></>}
            {relEvents.map((event, index) => <div key={index}>
                    {/* Display relevant event information very similar to event view*/}
                <h4 onClick={() => handleEventClick(event)}>{event.title}</h4>
                {event.allDay ?(
                            <div>
                                <p>{event.start.toLocaleDateString()} {event.end == null ? <p></p>:event.end.toLocaleDateString()===event.start.toLocaleDateString() ? <p></p>: " - " + event.end.toLocaleDateString()}</p>
                            </div>
                        ):
                        <div>
                            <p>{event.start.toLocaleString([], {year: '2-digit', month: '2-digit', day: '2-digit', hour: '2-digit', minute:'2-digit'})} - {event.start.toLocaleDateString() === event.end.toLocaleDateString() ? event.end.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}): event.end.toLocaleString([], {year: '2-digit', month: '2-digit', day: '2-digit', hour: '2-digit', minute:'2-digit'})}</p>
                        </div>}
                    {event.farms.length !== 0 ? <h3>Farms: </h3> : <></>}
                    {event.farms.includes(WH) ? <p>Windmill Hill </p> : <></>}
                    {event.farms.includes(HC) ? <p>Hartcliffe </p> : <></>}
                    {event.farms.includes(SW) ? <p>St Werberghs</p> : <></>}
                </div>)}
        </div>
        { selectedEvent !== "No event selected" ?
            <div className='componentBox'>
                <div style={{display: "flex", justifyContent: "space-between"}}>
                    <h2 className='boxTitle'>Selected Event</h2>
                    <button className='closeButton' onClick={() => setSelectedEvent("No event selected")}><img src={CloseIcon}/></button>
                </div>
                <div>
                    <h3>{selectedEvent.title}</h3>
                    {
                        selectedEvent.allDay ?
                            <div>
                                <p>{selectedEvent.start.toLocaleDateString()} {selectedEvent.end == null ? <p></p>:selectedEvent.end.toLocaleDateString()===selectedEvent.start.toLocaleDateString() ? <p></p>: " - " + selectedEvent.end.toLocaleDateString()}</p>
                            </div>
                            :
                            <div>
                                <p>{selectedEvent.start.toLocaleString([], {year: '2-digit', month: '2-digit', day: '2-digit', hour: '2-digit', minute:'2-digit'})} - {selectedEvent.start.toLocaleDateString() === selectedEvent.end.toLocaleDateString() ? selectedEvent.end.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}): selectedEvent.end.toLocaleString([], {year: '2-digit', month: '2-digit', day: '2-digit', hour: '2-digit', minute:'2-digit'})}</p>
                            </div>

                    }
                    {selectedEvent.farms.length !== 0 ? <h3>Relevant Farms</h3> : <></>}
                    {selectedEvent.farms.includes(WH) ? <p>Windmill Hill</p> : <></>}
                    {selectedEvent.farms.includes(HC) ? <p>Hartcliffe</p> : <></>}
                    {selectedEvent.farms.includes(SW) ? <p>St Werberghs</p> : <></>}
                    {selectedEvent.animals.length !== 0 ? <h3>Relevant Animals</h3> : <></>}
                    {selectedEvent.animals.map((animalID) => (
                        <p><Animal key={animalID} animalID={animalID} /></p>
                    ))}
                </div>
            </div>
            :
            <></>}
        </>;
}

export default SingleAnimal