import "./SingleAnimal.css"
import {  useParams } from "react-router-dom";
import axios from "../api/axiosConfig.js";
import {getConfig} from "../api/getToken.js";
import React, { Fragment, useState, useEffect, useCallback } from 'react';
import AnimalPopover from "../components/AnimalPopover.tsx";
import Paper from "@mui/material/Paper";
import Tooltip from "@mui/material/Tooltip";
import FarmMoveButton from "../components/FarmMoveButton.tsx";
import { CachePolicy, CityFarm } from "../api/cityfarm.ts";
import { Animal, Schema, Sex } from "../api/animals.ts";
import { Event } from "../api/events.ts";
import { Grid, IconButton, List, ListItem } from "@mui/material";
import Masonry from '@mui/lab/Masonry';
import EditIcon from "@mui/icons-material/Edit";
import { IndividualEvent } from "../components/IndividualEvent.tsx";
import { EventText } from "../components/EventText.tsx";

import EnclosurePopover from "../components/EnclosurePopover.tsx";
import EnclosureMove from '../components/EnclosureMove.tsx';
import {Enclosure} from "../api/enclosures";
import Button from "@mui/material/Button";
import { ArrowBack, Bedtime, Close, Edit, Undo } from "@mui/icons-material";

import lodash from "lodash"

export function readableFarm(farm) {
    switch(farm) {
        case "WH": return <span>Windmill Hill</span>;
        case "HC": return <span>Hartcliffe</span>;
        case "SW": return <span>St Werburghs</span>;
        case '': return <span>None</span>;
        default: return <span>None</span>;
    }
}
const SingleAnimal = ({farms, cityfarm}: {farms: any, cityfarm: CityFarm}) => {

    const { animalID } = useParams<string>();
    const token = getConfig();
    const [relEvents,setRelEvents] = useState<Event[]>([]);
    const [chosenAnimal, setChosenAnimal] = useState<Animal | null>(null);
    const [schema, setSchema] = useState<Schema>();
    const [children, setChildren] = useState<Animal[]>([]);
    const [animalEnclosure , setAnimalEnclosure] = useState<Enclosure | null>(null)
    const [allEnclosures,setAllEnclosures] =useState <Enclosure[]>([])
    const [animalMoving,setAnimalMoving] = useState<Animal[]>([])

    useEffect(() => {
        (async () => {
            const animal = await cityfarm.getAnimal(animalID!, CachePolicy.USE_CACHE, (animal) => {setChosenAnimal(animal)});
            setChosenAnimal(animal!);
            const events = await cityfarm.getEventsByAnimal(animalID!, CachePolicy.USE_CACHE, (events) => {setRelEvents(events)})
            setRelEvents(events);
            const enclosures = await cityfarm.getEnclosures(CachePolicy.USE_CACHE, null, (enclosures) => setAllEnclosures(enclosures));
            setAllEnclosures(enclosures);

            for (const enclosure of enclosures){
                for (const an of enclosure.holding){
                    if ((animal ? animal.id : "") === an.id){
                        setAnimalEnclosure(enclosure)
                    }
                }
            }
    })()}, [animalID]);

    useEffect(() => {
        const animal = cityfarm.animals_cache.find((animal) => animal.id === animalID)
        if (!lodash.isEqual(animal, chosenAnimal)) {
            console.debug("Setting chosen animal")
            setChosenAnimal(animal ?? null)
        } else {
            console.debug("not setting chosen")
        }
    }, [cityfarm.animals_cache])

    useEffect(()=>{
        if (chosenAnimal === null) {
            return;
        }
        (async () => {
            if (chosenAnimal.sex === Sex.Female) {
                const animals = await cityfarm.getAnimalsByMother(chosenAnimal.id, CachePolicy.USE_CACHE, (animals) => {setChildren(animals)});
                if (animals) setChildren(animals);
            } else {
                const animals = await cityfarm.getAnimalsByFather(chosenAnimal.id, CachePolicy.USE_CACHE, (animals) => {setChildren(animals)});
                if (animals) setChildren(animals)
            }
        })()
    },[chosenAnimal])

    useEffect(() => {
        if (chosenAnimal === null) return;
        chosenAnimal.type !== 'Loading...' && getSchema();
    }, [chosenAnimal?.type]);

    const getSchema = useCallback(() => {
        if (chosenAnimal === null) {
            return;
        }

        (async () => {
            const schema = await cityfarm.getSchema(chosenAnimal.type, CachePolicy.USE_CACHE, (schema) => {setSchema(schema)})
            if (!schema) {
                console.error(`No schema with name ${chosenAnimal.type} found.`);
            } else {
                setSchema(schema);
            }
        })()
    }, [chosenAnimal?.type])


    if (chosenAnimal === null) {
        return <div>
            <h1>Loading...</h1>
            <div className='details'>
                <div><b>Status:</b> Loading...</div>
                <div><b>Sex:</b> Loading...</div>
                <div><b>Species:</b> Loading...</div>
                <div style={{display: 'flex'}}>
                    <span style={{marginRight: '0.5em'}}><b>Father:</b></span>
                    Loading...
                </div>
                <div style={{display: 'flex'}}>
                    <span style={{marginRight: '0.5em'}}><b>Mother:</b></span>
                    Loading...
                </div>
                <div>
                    <b>Farm:</b> Loading...
                </div>
                <div>
                    <span><b>Notes:</b> Loading...</span>
                </div>
                Loading...
                </div>

                {
                    <div className="children">
                        <b>Children:</b>
                        Loading...
                    </div>
                }
                <div style={{display:'flex'}}><b>Enclosure: </b> Loading...</div>
            </div>
    }


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
                            <Paper elevation={3} style={{padding: '0.3em', marginBottom: '10px'}}>
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
                <IndividualEvent cityfarm={cityfarm} object={e} eventID={e.id} farms={farms}/>
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

    const handleKill = () => {
        (async () => {
            try {
                const response = await axios.patch(`/animals/by_id/${chosenAnimal.id}`, {...chosenAnimal, alive: !chosenAnimal.alive}, token);
                console.log(response);
                window.location.reload();
            } catch (error) {
                console.log(error)
                if (error.response.status === 401) {
                    window.location.href = "/login";
                    return;
                } else {
                    window.alert(error);
                }
            }
        })()
    }


    return (<>
        <h1>{chosenAnimal.name}</h1>
        <div className='details'>
        <div style={{display: 'flex'}}>
            <b style={{marginRight: '5px'}}>Status:</b> {chosenAnimal.alive ? <span>Live</span> : <span>Dead</span>}
            <Tooltip title={chosenAnimal.alive ? 'Kill' : 'Undo'}><IconButton sx={{p: 0, ml: '5px'}} color="error" onClick={() => handleKill()}>
                {chosenAnimal.alive ?
                    <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24"><path fill="#F00000" d="M240-80v-170q-39-17-68.5-45.5t-50-64.5q-20.5-36-31-77T80-520q0-158 112-259t288-101q176 0 288 101t112 259q0 42-10.5 83t-31 77q-20.5 36-50 64.5T720-250v170H240Zm80-80h40v-80h80v80h80v-80h80v80h40v-142q38-9 67.5-30t50-50q20.5-29 31.5-64t11-74q0-125-88.5-202.5T480-800q-143 0-231.5 77.5T160-520q0 39 11 74t31.5 64q20.5 29 50.5 50t67 30v142Zm100-200h120l-60-120-60 120Zm-80-80q33 0 56.5-23.5T420-520q0-33-23.5-56.5T340-600q-33 0-56.5 23.5T260-520q0 33 23.5 56.5T340-440Zm280 0q33 0 56.5-23.5T700-520q0-33-23.5-56.5T620-600q-33 0-56.5 23.5T540-520q0 33 23.5 56.5T620-440ZM480-160Z"/></svg>
                : <Undo/>}
            </IconButton></Tooltip>
        </div>
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
                <div style={{overflowY: 'auto', height: '15.6em', overflowX: 'visible', paddingRight: '0.3em'}}>
                    <List>
                        {children.map((animal, index) => {
                            return (<ListItem key={animal.id} style={{margin: '0', padding: '0'}}><p style={{marginRight: '4px'}}>-</p><AnimalPopover object={animal} key={index} cityfarm={cityfarm} animalID={animal.id!} /></ListItem>);
                        })}
                    </List>
                </div>
            </div>
        )}
        <div style={{display:'flex'}}><b style={{marginRight: '5px'}}>Enclosure: </b> {animalEnclosure!=null ? <EnclosurePopover cityfarm={cityfarm} enclosureID={animalEnclosure.id}/> : 'None'}
            <Tooltip title='Edit'><IconButton onClick={openEnclosureMove} sx={{ p: 0, ml: '5px' }} size="small"><EditIcon sx={{fontSize: '1'}}/></IconButton></Tooltip></div>
        
        <div className="farmButtons">
            {Object.values(farms).map((farm, index) => (
                <Fragment key={index}>
                    <FarmMoveButton cityfarm={cityfarm} farm={farm as string} ids={[chosenAnimal.id]}/>
                </Fragment>
            ))}
        </div>

        <EnclosureMove cityfarm={cityfarm} excludedEnc={animalEnclosure}
                       enclosures={allEnclosures} animalList={animalMoving} close={closeEnclosureMove} />

        <div>
            {relEvents.length !== 0 ? <h2 style={{marginTop: '2%'}}>Linked Events</h2> : <></>}
            <Masonry spacing={3} columns={{xs: 1, md: 2, lg: 3, xl: 4}} sequential>
                {relEvents.map((e, index)=>(
                    <Fragment key={index}>{singleEvent(e)}</Fragment>
                ))}
            </Masonry>
        </div>


    </>);
}

export default SingleAnimal