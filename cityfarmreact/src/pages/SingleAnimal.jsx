import * as React from "react";
import "./SingleAnimal.css"
import {  useParams } from "react-router-dom";
import Typography from "@mui/material/Typography";
import axios from '../api/axiosConfig';
import { useState, useEffect } from 'react';
import AnimalPopover from "../components/AnimalPopover";
import CloseIcon from "../assets/close-512-light.webp";
import Paper from "@mui/material/Paper";
import SelectedEvent from "../components/SelectedEvent";

import { getConfig } from '../api/getToken';

const SingleAnimal = (props) => {

    const farms = props.farms;

    const { animalID } = useParams();

    const [relEvents,setRelEvents] = useState([])
    const [chosenAnimal, setChosenAnimal] = useState({name: 'Loading...', type: 'Loading...'});
    const [selectedEvent,setSelectedEvent] = useState("No event selected");
    const [schema, setSchema] = useState();
    const [children,setChildren] = useState([])

    const token = getConfig();

    function readableFarm(farm) {
        switch(farm) {
            case "WH": return <span>Windmill Hill</span>;
            case "HC": return <span>Hartcliffe</span>;
            case "SW": return <span>St Werburghs</span>;
            case '': return <span>None</span>;
            default: return <span>Loading...</span>;
        }
    }

    useEffect(() => {
        (async () => {
            try {
                const response = await axios.get(`/animals/by_id/${animalID}`, token);
                setChosenAnimal(response.data);

                const events = await axios.get(`/events/by_animal/${animalID}`, token)
                setRelEvents(eventsConversion(events.data))

            } catch (error) {
                if (error.response.status === 401) {
                    // window.location.href = "/login";
                    return;
                } else {
                    window.alert(error);
                }
            }
        })();
    }, [animalID]);

    useEffect(()=>{
        let kids =[];
        let animals = [];
        (async () => {
            try {
                const response = await axios.get(`/animals`,token);
                animals=response.data
                if (chosenAnimal.sex!=='c') {

                    if (chosenAnimal.sex === 'm') {

                        for (let a of animals) {
                            if (a.father === chosenAnimal._id) {
                                kids.push(a._id)
                            }
                        }
                    } else {
                        for (let a of animals) {
                            if (a.mother === chosenAnimal._id) {
                                kids.push(a._id)
                            }
                        }
                    }

                    setChildren(kids)
                }
            } catch (error) {
                if (error.response.status === 401) {
                    // window.location.href = "/login";
                    return;
                } else {
                    window.alert(error);
                }
            };
        })()
        },[animalID])
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
        return changed;
    }

    const handleEventClick=(event)=>{
        setSelectedEvent(event)
    }

    function getSchema() {
        (async () => {
            try {
                const response = await axios.get(`/schemas/by_name/${chosenAnimal.type}`, token);
                setSchema(response.data.pop());
            } catch (error) {
                if (error.response.status === 401) {
                    window.location.href = "/login";
                    return;
                } else {
                    window.alert(error);
                }
            }
        })()
    }

    useEffect(() => {
        chosenAnimal.type !== 'Loading...' && getSchema();
    }, [chosenAnimal]);

    const fieldTypeSwitch = (name, value) => {
        if (schema && value !== '') {
            switch(schema._fields[name]._type) {
                case "java.lang.Boolean":
                    return <span key={name}>{name.charAt(0).toUpperCase() + name.slice(1)}: {value ? 'Yes' : 'No'}</span>;
                case "java.lang.String":
                    return <span key={name}>{name.charAt(0).toUpperCase() + name.slice(1)}: {value}</span>;
                case "java.lang.Integer":
                    return <span key={name}>{name.charAt(0).toUpperCase() + name.slice(1)}: {value}</span>;
                case "java.lang.Double":
                    return <span key={name}>{name.charAt(0).toUpperCase() + name.slice(1)}: {value}</span>;
                case "java.time.ZonedDateTime":
                    return <span key={name}>{name.charAt(0).toUpperCase() + name.slice(1)}: {new Date(value).toLocaleDateString()}</span>;
                default:
                    return <></>;
            }
        }
    }

    return<>
        <h1>{chosenAnimal.name}</h1>
        <div>Sex: {chosenAnimal.sex === undefined ? <span>Loading...</span> : (chosenAnimal.sex === 'f' ? <span>Female</span> : (chosenAnimal.sex === 'm' ? <span>Male</span> : <span>Castrated</span>))}</div>
        <div>Species: {chosenAnimal.type.charAt(0).toUpperCase() + chosenAnimal.type.slice(1)}</div>
        <div style={{display: 'flex'}}>
            <span style={{marginRight: '0.5em'}}>Father:</span>
            {chosenAnimal.father ?
                <AnimalPopover key={chosenAnimal.father} animalID={chosenAnimal.father}/>
            : <span>Unregistered</span>}
        </div>
        <div style={{display: 'flex'}}>
            <span style={{marginRight: '0.5em'}}>Mother:</span>
            {chosenAnimal.mother ? 
                <AnimalPopover key={chosenAnimal.mother} animalID={chosenAnimal.mother}/>
            : <span>Unregistered</span>}
        </div>
        <div>
            Farm: {readableFarm(chosenAnimal.farm)}
        </div>
        <div>
            {chosenAnimal.notes && `Notes: ${chosenAnimal.notes}`}
        </div>
        {chosenAnimal.fields && Object.entries(chosenAnimal.fields).map(([name, value]) => {
            return fieldTypeSwitch(name, value);
        })}
        <br/>
        {
            Array.isArray(children) && children.length > 0 && (
            <div>
                Children:
                {children.map((animal, index) => {
                    return (<AnimalPopover key={animal} animalID={animal} />);
                })}
            </div>
        )}


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
                    {event.farms.includes(farms.WH) ? <p>Windmill Hill </p> : <></>}
                    {event.farms.includes(farms.HC) ? <p>Hartcliffe </p> : <></>}
                    {event.farms.includes(farms.SW) ? <p>St Werburghs</p> : <></>}
                </div>
            )})}
        </div>
        {selectedEvent !== "No event selected" && (
            <Paper elevation={3} className='selectedBox'>
                <SelectedEvent event={selectedEvent} setEvent={setSelectedEvent} farms={farms}/>
            </Paper>
        )}
        </>;
}

export default SingleAnimal