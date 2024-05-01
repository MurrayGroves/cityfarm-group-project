import React from 'react';
import "../pages/Calendar.css";
import AnimalPopover from "./AnimalPopover.tsx";
import { Close, Edit as EditIcon, Delete } from '@mui/icons-material';
import { IconButton } from '@mui/material';
import { EventCreator } from './EventCreator.tsx';
import { EventInstance, Event, EventRecurring, EventOnce } from '../api/events.ts';
import { CityFarm } from '../api/cityfarm.ts';
import EnclosurePopover from './EnclosurePopover.tsx';


const EventDisplay = ({
    selectedEvent, setSelectedEvent, modifyEvent, setModifyEvent,
    handleDelEvent, farms, cityfarm }:
    {selectedEvent: EventInstance | null, setSelectedEvent: (eventInstance: EventInstance | null) => void, modifyEvent: boolean, setModifiedEvent: (event: Event | null) => void,
        setModifyEvent: (modify: boolean)=>void,
        handleDelEvent: () => void, farms: any, cityfarm: CityFarm
    }) => {
    

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
                            <AnimalPopover key={animal.id} cityfarm={cityfarm} animalID={animal.id}/>
                        ))}
                        {selectedEvent.event.enclosures?.length > 0 &&
                        <div>
                            <h3>Enclosures</h3>
                            {selectedEvent.event.enclosures.map((enclosure, index) => {
                                return (
                                    <EnclosurePopover cityfarm={cityfarm} key={index} enclosureID={enclosure.id}/>
                                )
                            })}
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
                <EventCreator initialEvent={selectedEvent?.event ?? null} modify={modifyEvent} setModify={setModifyEvent} farms={farms} cityfarm={cityfarm} setEvent={(eventID)=>{cityfarm.getEvent(eventID, false).then((event) => {
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