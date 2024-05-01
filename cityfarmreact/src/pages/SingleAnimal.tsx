import "./SingleAnimal.css"
import {  useParams } from "react-router-dom";
import React, { Fragment, useState, useEffect } from 'react';
import AnimalPopover from "../components/AnimalPopover.tsx";
import Paper from "@mui/material/Paper";
import SelectedEvent from "../components/SelectedEvent.tsx";
import FarmMoveButton from "../components/FarmMoveButton.tsx";
import { CityFarm } from "../api/cityfarm.ts";
import { Animal, Schema, Sex } from "../api/animals.ts";
import { Event } from "../api/events.ts";
import { Grid, List, ListItem } from "@mui/material";
import Masonry from '@mui/lab/Masonry';
import EditIcon from "@mui/icons-material/Edit";
import { IndividualEvent } from "../components/IndividualEvent.tsx";
import { EventText } from "../components/EventText.tsx";

import EnclosurePopover from "../components/EnclosurePopover.tsx";
import EnclosureMove from '../components/EnclosureMove.tsx';
import {Enclosure} from "../api/enclosures";
import Button from "@mui/material/Button";

export function readableFarm(farm) {
    switch(farm) {
        case "WH": return <span>Windmill Hill</span>;
        case "HC": return <span>Hartcliffe</span>;
        case "SW": return <span>St Werburghs</span>;
        case '': return <span>None</span>;
        default: return <span>Loading...</span>;
    }
}
const SingleAnimal = ({farms, cityfarm}: {farms: any, cityfarm: CityFarm}) => {

    const { animalID } = useParams<string>();

    const [relEvents,setRelEvents] = useState<Event[]>([]);
    const [chosenAnimal, setChosenAnimal] = useState<Animal>(new Animal({name: 'Loading...', type: 'Loading...'}));
    const [selectedEvent, setSelectedEvent] = useState<Event>();
    const [schema, setSchema] = useState<Schema>();
    const [children, setChildren] = useState<string[]>(new Array<string>());
    const [animals, setAnimals] = useState<Animal[]>([]);
    const [animalEnclosure , setAnimalEnclosure] = useState<Enclosure | null>(null)
    const [allEnclosures,setAllEnclosures] =useState <Enclosure[]>([])
    const [animalMoving,setAnimalMoving] = useState<Animal[]>([])

    useEffect(() => {
        (async () => {
            const animal = await cityfarm.getAnimal(animalID!, true, (animal) => {setChosenAnimal(animal)});
            setChosenAnimal(animal!);
            const events = await cityfarm.getEvents(true, (events) => {setRelEvents(events.filter((event) => {
                return event.animals.map((animal) => animal.id).includes(animalID)
            }))})
            setRelEvents(events.filter((event) => {
                return event.animals.map((animal) => animal.id).includes(animalID!)
            }));
            const enclosures = await cityfarm.getEnclosures(true, null, (enclosures) => setAllEnclosures(enclosures));
            setAllEnclosures(enclosures);


            for (const enclosure of enclosures){
                for (const an of enclosure.holding){
                    if (animal.id === an.id){
                        setAnimalEnclosure(enclosure)
                    }
                }
            }
    })()}, [animalID]);

    useEffect(()=>{
        let kids = new Array<string>();
        (async () => {
            const anis = await cityfarm.getAnimals(true, null, (animals) => {setAnimals(animals)});
            setAnimals(anis)

            if (chosenAnimal.sex !== Sex.Castrated) {

                if (chosenAnimal.sex === Sex.Male) {

                    for (let a of animals) {
                        if (a.father === chosenAnimal.id) {
                            kids.push(a.id)
                        }
                    }
                } else {

                    for (let a of animals) {
                        if (a.mother === chosenAnimal.id) {
                            kids.push(a.id)
                        }
                    }
                }

                setChildren(kids)

            }
        })()
    },[chosenAnimal])


    function getSchema() {
        (async () => {
            const schema = await cityfarm.getSchema(chosenAnimal.type, true, (schema) => {setSchema(schema)})
            if (!schema) {
                console.error(`No schema with name ${chosenAnimal.type} found.`);
            } else {
                setSchema(schema);
            }
        })()
    }

    useEffect(() => {
        chosenAnimal.type !== 'Loading...' && getSchema();
    }, [chosenAnimal]);

    const fieldTypeSwitch = (name, value) => {
        if (schema && value !== '') {
            switch(schema.fields[name].type) {
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
                case "cityfarm.api.calendar.EventRef":
                    return <div style={{display: 'inline-block'}}>
                            <div style={{marginRight: '1em'}}>
                                <u><b>{name}</b></u>
                            </div>
                            <Paper style={{padding: '0.3em'}}>
                                <EventText secondary={false} cityfarm={cityfarm} eventID={value} farms={farms}/>
                            </Paper>
                        </div>
                default:
                    return <></>;
            }
        }
    }

    const singleEvent = (e: Event)=>{
        return(
            <Grid item xs={1}>
                <IndividualEvent cityfarm={cityfarm} eventID={e.id} farms={farms}/>
            </Grid>
        )
    }


    const openEnclosureMove =()=>{
        console.log(allEnclosures,chosenAnimal)


        setAnimalMoving([chosenAnimal])
        console.log(animalMoving)
    }
    const closeEnclosureMove =()=>{
        setAnimalMoving([])
    }



    return (<>
        <h1>{chosenAnimal.name}</h1>
        <div className='details'>
        <div><b>Sex:</b> {chosenAnimal.sex === undefined ? <span>Loading...</span> : (chosenAnimal.sex === Sex.Female ? <span>Female</span> : (chosenAnimal.sex === Sex.Male ? <span>Male</span> : <span>Castrated</span>))}</div>
        <div><b>Species:</b> {chosenAnimal.type}</div>
        <div style={{display: 'flex'}}>
            <span style={{marginRight: '0.5em'}}><b>Father:</b></span>
            {chosenAnimal.father ?
                <AnimalPopover cityfarm={cityfarm} animalID={chosenAnimal.father}/>
            : <span>Unregistered</span>}
        </div>
        <div style={{display: 'flex'}}>
            <span style={{marginRight: '0.5em'}}><b>Mother:</b></span>
            {chosenAnimal.mother ?
                <AnimalPopover cityfarm={cityfarm} animalID={chosenAnimal.mother}/>
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
                <List>
                    {children.map((animalID, index) => {
                        return (<ListItem style={{margin: '0', padding: '0'}}><p style={{marginRight: '4px'}}>-</p><AnimalPopover key={index} cityfarm={cityfarm} animalID={animalID} /></ListItem>);
                    })}
                </List>
            </div>
        )}
        <div style={{display:'flex'}}><b>Enclosure: </b> {animalEnclosure!=null ? <><EnclosurePopover cityfarm={cityfarm} enclosureID={animalEnclosure.id}/>{' '}
             </>: 'None'}<Button onClick={openEnclosureMove} variant='outlined'><EditIcon/></Button></div>
        
        <div className="farmButtons">
            {Object.values(farms).map((farm, index) => (
                <Fragment key={index}>
                    <FarmMoveButton cityfarm={cityfarm} farm={farm as string} ids={[chosenAnimal.id]}/>
                </Fragment>
            ))}
        </div>


        <div>
            {relEvents.length !== 0 ? <h2 style={{marginTop: '2%'}}>Linked Events</h2> : <></>}
            <Masonry spacing={3} columns={{xs: 1, md: 2, lg: 3, xl: 4}} sequential>
                {relEvents.map((e, index)=>(
                    <Fragment key={index}>{singleEvent(e)}</Fragment>
                ))}
            </Masonry>
        </div>
        {selectedEvent && (
            <Paper elevation={3} className='selectedBox'>
                <SelectedEvent event={selectedEvent} setEvent={setSelectedEvent} cityfarm={cityfarm} farms={farms}/>
            </Paper>
        )}
        <EnclosureMove cityfarm={cityfarm} excludedEnc={animalEnclosure}
                       enclosures={allEnclosures} animalList={animalMoving} close={closeEnclosureMove} />
    </>);
}

export default SingleAnimal