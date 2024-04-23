import React, {useState, useEffect} from 'react';
import "../pages/Calendar.css";
import AnimalPopover from "./AnimalPopover";
import Close from '@mui/icons-material/Close';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import {  DialogContent, DialogTitle, Fab, ToggleButton, ToggleButtonGroup } from "@mui/material";
import { IconButton, Button, ButtonGroup, Checkbox, FormControlLabel, FormGroup, Dialog, } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import Delete from '@mui/icons-material/Delete';
import AssociateAnimal from './AssociateAnimal';
import AssociateEnclosure from './AssociateEnclosure';
import { EventCreator } from './EventCreator.tsx';
import { EventInstance, Event, EventRecurring, EventOnce } from '../api/events.ts';
import { CityFarm } from '../api/cityfarm.ts';


const EventDisplay = ({
    selectedEvent, setSelectedEvent,
    modifiedEvent, modifyEvent, setModifiedEvent, setModifiedEventAnimals, setModifiedEventEnclosures, setModifyEvent,
    createEvent,
    handleDelEvent, handlePatchEvent,
    showingTime, functionopenPopup, functionclosePopup,
    openAnimalsPopup, openEnclosurePopup,
    changeAllDay,
    farms, cityfarm,
    setShowErr
    }: {selectedEvent: EventInstance | null, setSelectedEvent: (eventInstance: EventInstance | null) => void, modifiedEvent: Event | null, modifyEvent: boolean, setModifiedEvent: (event: Event | null) => void,
        setModifiedEventAnimals: (animals: string[]) => void, setModifiedEventEnclosures: (enclosures: string[]) => void, setModifyEvent: (modify: boolean)=>void,
        createEvent: boolean, handleDelEvent: () => void, handlePatchEvent: () => void, showingTime: (show: boolean) => JSX.Element, functionopenPopup: (type: string) => void, functionclosePopup: () => void,
        openAnimalsPopup: boolean, openEnclosurePopup: boolean, changeAllDay: (allDay: boolean, type: string) => void, farms: any, cityfarm: CityFarm, setShowErr: (show: boolean) => void
    }) => {
    
        console.log("selected", selectedEvent);

    return (<>
        <div style={{overflow: 'auto'}}>
            { selectedEvent !== null && !modifyEvent ?
                <>
                    <div style={{display: "flex", justifyContent: "space-between"}}>
                        <h2 className='boxTitle'>Selected Event</h2>
                        <span style={{display: 'flex', justifyContent: 'right'}}>
                            {!modifyEvent && <IconButton sx={{height: '40px'}} onClick={()=>{setModifyEvent(true)}}><EditIcon/></IconButton>}
                            <IconButton sx={{height: '40px'}} onClick={() => handleDelEvent()}><Delete/></IconButton>
                            <IconButton sx={{height: '40px'}} onClick={() => {setModifyEvent(false); setSelectedEvent(null)}}><Close/></IconButton>
                        </span>
                    </div>
                    <div className='selectedEvent'>
                        <h2 className='noMarginTop'>{selectedEvent.event.title}</h2>
                        {
                            selectedEvent.event.allDay ?
                                <div>
                                    <p>{selectedEvent.start.toLocaleDateString()} {selectedEvent.end == null ? <></> : selectedEvent.end.toLocaleDateString() === selectedEvent.start.toLocaleDateString() ? <></> : " - " + selectedEvent.end.toLocaleDateString()}</p>
                                </div>
                                :
                                <div>
                                    <p>{selectedEvent.start.toLocaleString([], {year: '2-digit', month: '2-digit', day: '2-digit', hour: '2-digit', minute:'2-digit'})} - {selectedEvent.start.toLocaleDateString() === selectedEvent.end.toLocaleDateString() ? selectedEvent.end.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : selectedEvent.end.toLocaleString([], {year: '2-digit', month: '2-digit', day: '2-digit', hour: '2-digit', minute:'2-digit'})}</p>
                                </div>

                        }
                        {selectedEvent.event.farms?.length > 0 ? <h3>Farms</h3> : <></>}
                        {selectedEvent.event.farms?.includes(farms.WH) ? <p>Windmill Hill</p> : <></>}
                        {selectedEvent.event.farms?.includes(farms.HC) ? <p>Hartcliffe</p> : <></>}
                        {selectedEvent.event.farms?.includes(farms.SW) ? <p>St Werburghs</p> : <></>}
                        {selectedEvent.event.animals?.length > 0 ? <h3>Animals</h3> : <></>}
                        {selectedEvent.event.animals?.map((animal) => (
                            <AnimalPopover key={animal._id} animalID={animal._id}/>
                        ))}
                        {selectedEvent.event.enclosures?.length > 0 &&
                        <div>
                            <h3>Enclosures</h3>
                            {selectedEvent.event.enclosures.map((enclosure, index) => (
                                <p key={index} className='noMarginTop'>{enclosure.name}</p>
                            ))}
                        </div>}
                        {selectedEvent.event.description !== "" ?
                        <div>
                            <h3>Description</h3>
                            {selectedEvent.event.description}
                        </div> : <></>}
                    </div>
                </>
                :
                <>
                <EventCreator initialEvent={selectedEvent?.event ?? null} modify={modifyEvent} setModify={setModifyEvent} setShowError={setShowErr} farms={farms} cityfarm={cityfarm} setEvent={(eventID)=>{cityfarm.getEvent(eventID, false).then((event) => {
                    if (event === null) {
                        setSelectedEvent(null);
                        return;
                    }

                    if (event instanceof EventRecurring) {
                        let instance = new EventInstance({start: new Date(event.firstStart), end: event.firstEnd === null ? null : new Date(event.firstEnd), event: event})
                        setSelectedEvent(instance)
                    } else if (event instanceof EventOnce) {
                        let instance = new EventInstance({start: new Date(event.start), end: event.end === null ? null : new Date(event.end), event: event})
                        setSelectedEvent(instance)
                    }
                }
                )}} style={{width: '100%'}}/></>}
        </div>
    </>)
}

export default EventDisplay