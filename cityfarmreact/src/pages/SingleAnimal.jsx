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
import FarmMoveButton from "../components/FarmMoveButton";

export function readableFarm(farm) {
    switch(farm) {
        case "WH": return <span>Windmill Hill</span>;
        case "HC": return <span>Hartcliffe</span>;
        case "SW": return <span>St Werburghs</span>;
        case '': return <span>None</span>;
        default: return <span>Loading...</span>;
    }
}

const SingleAnimal = (props) => {

    const farms = props.farms;

    const { animalID } = useParams();

    const [relEvents,setRelEvents] = useState([])
    const [chosenAnimal, setChosenAnimal] = useState({name: 'Loading...', type: 'Loading...'});
    const [selectedEvent,setSelectedEvent] = useState("No event selected");
    const [schema, setSchema] = useState();
    const [children,setChildren] = useState([])
    const [eventsAll,setEventAll] = useState(false)

    const token = getConfig();



    useEffect(() => {
        (async () => {
            try {
                const response = await axios.get(`/animals/by_id/${animalID}`, token);
                setChosenAnimal(response.data);

                const events = await axios.get(`/events/by_animal/${animalID}`, token)
                setRelEvents(eventsConversion(events.data))

            } catch (error) {
                if (error.response.status === 401) {
                    window.location.href = "/login";
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
                    window.location.href = "/login";
                    return;
                } else {
                    window.alert(error);
                }
            };
        })()
        },[chosenAnimal])
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
                    return <span key={name}><b>{name.charAt(0).toUpperCase() + name.slice(1)}:</b> {value ? 'Yes' : 'No'}</span>;
                case "java.lang.String":
                    return <span key={name}><b>{name.charAt(0).toUpperCase() + name.slice(1)}:</b> {value}</span>;
                case "java.lang.Integer":
                    return <span key={name}><b>{name.charAt(0).toUpperCase() + name.slice(1)}:</b> {value}</span>;
                case "java.lang.Double":
                    return <span key={name}><b>{name.charAt(0).toUpperCase() + name.slice(1)}: </b>{value}</span>;
                case "java.time.ZonedDateTime":
                    return <span key={name}><b>{name.charAt(0).toUpperCase() + name.slice(1)}: </b>{new Date(value).toLocaleDateString()}</span>;
                default:
                    return <></>;
            }
        }
    }

    const singleEvent = (e,index)=>{
        return(
            <Paper elevation={3} className="event-box" key={index}>
                <h2 onClick={() => handleEventClick(e)}>{e.title}</h2>
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
                        {e.enclosures.map((enclosure, index) => (
                            <p key={index}>{enclosure.name}</p>
                        ))}
                    </div>}
                {e.description !== "" ?
                    <div>
                        <h3>Description</h3>
                        {e.description}
                    </div> : <></>}
            </Paper>
        )
    }

    return<>

        <h1>{chosenAnimal.name}</h1>
        <div className='details'>
        <div><b>Sex:</b> {chosenAnimal.sex === undefined ? <span>Loading...</span> : (chosenAnimal.sex === 'f' ? <span>Female</span> : (chosenAnimal.sex === 'm' ? <span>Male</span> : <span>Castrated</span>))}</div>
        <div><b>Species:</b> {chosenAnimal.type}</div>
        <div style={{display: 'flex'}}>
            <span style={{marginRight: '0.5em'}}><b>Father:</b></span>
            {chosenAnimal.father ?
                <AnimalPopover key={chosenAnimal.father} animalID={chosenAnimal.father}/>
            : <span>Unregistered</span>}
        </div>
        <div style={{display: 'flex'}}>
            <span style={{marginRight: '0.5em'}}><b>Mother:</b></span>
            {chosenAnimal.mother ?
                <AnimalPopover key={chosenAnimal.mother} animalID={chosenAnimal.mother}/>
            : <span>Unregistered</span>}
        </div>
        <div>
            <b>Farm:</b> {readableFarm(chosenAnimal.farm)}
        </div>
        <div>
            {chosenAnimal.notes && <span><b>Notes: </b>{chosenAnimal.notes}</span>}
        </div>
        {chosenAnimal.fields && Object.entries(chosenAnimal.fields).map(([name, value]) => {
            return fieldTypeSwitch(name, value);
        })}
        </div>

        {
            Array.isArray(children) && children.length > 0 && (
            <div className="children">
                <b>Children:</b>
                {children.map((animal, index) => {
                    return (<AnimalPopover key={animal} animalID={animal} />);
                })}
            </div>
        )}
        <div className="farmButtons">
            {Object.entries(farms).map((farm) => (
                <React.Fragment key={farm}>
                    <FarmMoveButton farm={farm} ids={[chosenAnimal._id]  }/>
                </React.Fragment>
            ))}
        </div>


        <div>
            {relEvents.length !== 0 ? <h2 onClick={()=>setEventAll(!eventsAll)}>Linked Event, click for more</h2> : <></>}

                <div className="events-container">
                    {!eventsAll ? <>
                    {relEvents.slice(0, 3).map((e, index)=>(
                        singleEvent(e,index)
                    ))} </>
                        :
                    <>
                        {relEvents.map((e, index)=>(
                            singleEvent(e,index)
                        ))} </>

                    }
                </div>

        </div>
        {selectedEvent !== "No event selected" && (
            <Paper elevation={3} className='selectedBox'>
                <SelectedEvent event={selectedEvent} setEvent={setSelectedEvent} farms={farms}/>
            </Paper>
        )}
        </>;
}

export default SingleAnimal