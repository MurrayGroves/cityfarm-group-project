
import * as React from "react";
//import aExamples from "./../components/Animal";
//import events from "./Calendar";
import { Link, useParams } from "react-router-dom";
import Typography from "@mui/material/Typography";
import axios from '../api/axiosConfig';
import { useState, useEffect } from 'react';

const aExamples =[
    {
        id: 1,
        name: "ERROR",
        type: "",
        male: "",
        father: "",
        fid: 2,
        mother: "",
}]

const WH = 0, HC = 1, SW = 2;
const events = [ /*These are example events.*/
    {
        title : "Boss Meeting",
        allDay: false,
        start: new  Date(2024,1,1, 13),
        end: new  Date(2024,1,1, 14),
        farms: [],
        animals: ["64ca1356-e519-4f88-a5e9-593157dec235"]
    },
    {
        title : "Bull in with cows",
        allDay: false,
        start: new  Date(2024,1,5, 8),
        end: new  Date(2024,1,8, 16),
        farms: [WH],
        animals: ["64ca1356-e519-4f88-a5e9-593157dec234"]
    },
    {
        title : "School Visits",
        allDay: true,
        start: new  Date(2024,1,9, 8),
        end: new  Date(2024,1,9, 23, 59),
        farms: [HC, SW],
        animals: ["05eea36a-1098-4392-913b-25e6508df54c","64ca1356-e519-4f88-a5e9-593157dec235"]
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

    return(<>
        <h1>{chosenAnimal.name}</h1>
            <Typography sx={{ p: 1,whiteSpace: 'pre-line' }}>
                Sex: {chosenAnimal.male ? 'Male' : 'Female'}<br/>
                Species: {chosenAnimal.type}<br/>
                Father: {chosenAnimal.fid ? (<Link to={`/SingleAnimal/${chosenAnimal.fid}`}>{chosenAnimal.father}</Link>)
                : (chosenAnimal.father? chosenAnimal.father : 'Unregistered')}<br/>
                Mother: {chosenAnimal.mid ? (<Link to={`/SingleAnimal/${chosenAnimal.mid}`}>{chosenAnimal.mother}</Link>)
                : (chosenAnimal.mother? chosenAnimal.mother : 'Unregistered')}<br/>
                Farm: to be completed when database supports different farms
            </Typography>

        <div>
            {relEvents.length !== 0 ? <h2>Linked Events</h2> : <></>}
            {relEvents.map((event, index) => (
                <div key={index}>
                    {/* Display relevant event information very similar to event view*/}
                    {event.title} {"\n"}
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
                </div>))}
        </div>
        </>
    );
}

export default SingleAnimal