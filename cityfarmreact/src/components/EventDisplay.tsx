import React, { memo, useEffect, useState } from 'react';
import "../pages/Calendar.css";
import AnimalPopover from "./AnimalPopover.tsx";
import { Close, Edit as EditIcon, Delete } from '@mui/icons-material';
import { IconButton } from '@mui/material';
import { EventCreator } from './EventCreator.tsx';
import { EventInstance, Event, EventRecurring, EventOnce } from '../api/events.ts';
import { CachePolicy, CityFarm } from '../api/cityfarm.ts';
import EnclosurePopover from './EnclosurePopover.tsx';
import { Enclosure } from '../api/enclosures.ts';
import { Animal } from '../api/animals.ts';
import { EventDate } from './EventPopover.tsx';


const EventDisplay = memo(({
    selectedEvent, setSelectedEvent, modifyEvent, setModifyEvent,
    handleDelEvent, farms, cityfarm }:
    {selectedEvent: EventInstance | null, setSelectedEvent: (eventInstance: EventInstance | null) => void, modifyEvent: boolean, setModifiedEvent: (event: Event | null) => void,
        setModifyEvent: (modify: boolean)=>void,
        handleDelEvent: () => void, farms: any, cityfarm: CityFarm
    }) => {

    const [loading, setLoading] = useState(true);
    const [enclosures, setEnclosures] = useState<Enclosure[]>([]);
    const [animals, setAnimals] = useState<Animal[]>([]);
    

    useEffect(() => {
        (async () => {
            if (selectedEvent === null) {
                return;
            }

            if (selectedEvent.event.animals.length === 0) {
                return;
            }

            console.log("prefetching")
            setAnimals(await cityfarm.getAnimalsByIds(selectedEvent.event.animals, CachePolicy.NO_CACHE, null));
            setEnclosures(await cityfarm.getEnclosuresByIds(selectedEvent.event.enclosures, CachePolicy.NO_CACHE, null));
            setLoading(false);
        })();
    }, [selectedEvent?.event.animals])

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
                        <EventDate event={selectedEvent.event} instance={selectedEvent}/>
                        {selectedEvent.event.farms?.length > 0 ? <h3>Farms</h3> : <></>}
                        {selectedEvent.event.farms?.includes(farms.WH) ? <p>Windmill Hill</p> : <></>}
                        {selectedEvent.event.farms?.includes(farms.HC) ? <p>Hartcliffe</p> : <></>}
                        {selectedEvent.event.farms?.includes(farms.SW) ? <p>St Werburghs</p> : <></>}
                        {selectedEvent.event.animals?.length > 0 ? <h3>Animals</h3> : <></>}
                        {selectedEvent.event.animals?.map((animal) => (
                            loading ? <p key={animal}></p> : <AnimalPopover object={animals.find(x => x.id == animal) ?? null} key={animal} cityfarm={cityfarm} animalID={animal}/>
                        ))}
                        {selectedEvent.event.enclosures?.length > 0 &&
                        <div>
                            <h3>Enclosures</h3>
                            {selectedEvent.event.enclosures.map((enclosure, index) => {
                                return (
                                    loading ? <p key={enclosure}></p> : <EnclosurePopover object={enclosures.find(x => x.id == enclosure) ?? null} cityfarm={cityfarm} key={index} enclosureID={enclosure}/>
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
                <EventCreator initialEvent={selectedEvent?.event ?? null} modify={modifyEvent} setModify={setModifyEvent} farms={farms} cityfarm={cityfarm} setEvent={(eventID)=>{cityfarm.getEvent(eventID, CachePolicy.NO_CACHE).then((event) => {
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
}, (prevProps, nextProps) => {
    return prevProps.selectedEvent === nextProps.selectedEvent && prevProps.modifyEvent === nextProps.modifyEvent
});

export default EventDisplay