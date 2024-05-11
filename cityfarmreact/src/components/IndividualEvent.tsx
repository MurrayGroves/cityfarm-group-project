import { useEffect, useState } from "react";
import { CityFarm } from "../api/cityfarm";
import { IconButton, Paper } from "@mui/material";
import { Edit as EditIcon } from '@mui/icons-material';
import React from "react";

import { Event, EventRecurring } from '../api/events.ts';
import AnimalPopover from "./AnimalPopover.tsx";
import { EventCreator } from "./EventCreator.tsx";
import EnclosurePopover from "./EnclosurePopover.tsx";
import { EventDate } from "./EventPopover.tsx";

export const IndividualEvent = (
    { eventID, cityfarm, farms, object }
        :
    {
        eventID: string;
        cityfarm: CityFarm;
        farms: any;
        object: Event | null;
    }
) => {
    const [event, setEvent] = useState<Event | null>(null);
    const [modifyEvent, setModifyEvent] = useState(false);
    const [reload, setReload] = useState(false);

    useEffect(() => {
        if (object && event === null) {
            setEvent(object);
            return;
        }

        (async () => {
            const resp = await cityfarm.getEvent(eventID, true, (event) => {
                setEvent(event);
            })

            setEvent(resp);
        })()
    }, [eventID, reload]);

    if (event === null) {
        return <Paper>
            <h1>Loading...</h1>
        </Paper>
    }


    return <Paper elevation={3} style={{overflow: 'auto', padding: '2%'}}>
            { !modifyEvent ?
                <>
                    <div className='event'>
                        <div style={{display: "flex", justifyContent: "space-between"}}>
                            <h2 className='boxTitle'>{event.title}</h2>
                            <span style={{display: 'flex', justifyContent: 'right'}}>
                                {!modifyEvent && <IconButton sx={{height: '40px'}} onClick={()=>{setModifyEvent(true)}}><EditIcon/></IconButton>}
                            </span>
                        </div>

                        <EventDate event={event} />
                        {event.farms?.length > 0 ? <h3>Farms</h3> : <></>}
                        {event.farms?.includes(farms.WH) ? <p>Windmill Hill</p> : <></>}
                        {event.farms?.includes(farms.HC) ? <p>Hartcliffe</p> : <></>}
                        {event.farms?.includes(farms.SW) ? <p>St Werburghs</p> : <></>}
                        {event.animals?.length > 0 ? <h3>Animals</h3> : <></>}
                        {event.animals?.map((animal) => (
                            <AnimalPopover key={animal.id} cityfarm={cityfarm} animalID={animal.id}/>
                        ))}
                        {event.enclosures?.length > 0 &&
                        <div>
                            <h3>Enclosures</h3>
                            {event.enclosures.map((enclosure, index) => {
                                return (
                                    <EnclosurePopover cityfarm={cityfarm} key={index} enclosureID={enclosure.id}/>
                                )
                            })}
                        </div>}
                        {event.description !== "" ?
                        <div>
                            <h3>Description</h3>
                            {event.description}
                        </div> : <></>}
                    </div>
                </>
                :
                <>
                <EventCreator initialEvent={event} modify={modifyEvent} setModify={setModifyEvent} farms={farms} cityfarm={cityfarm} setEvent={(_) => setReload(!reload)} style={{width: '100%'}}/></>}
    </Paper>
}