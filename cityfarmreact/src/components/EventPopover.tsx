import React, { useState, useEffect } from 'react';

import axios from '../api/axiosConfig.js';
import { getConfig } from '../api/getToken.js';

import { Paper, Popover } from '@mui/material';

import AnimalPopover from './AnimalPopover.tsx';
import { Event } from '../api/events.ts';
import Enclosure from './EnclosurePopover.tsx';

export const EventPopover = (props) => {
    const farms = props.farms;

    const [event, setEvent] = useState<Event>(new Event({title: 'Loading...'}));
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        axios.get(`/events/by_id/${props.eventID}`, getConfig())
            .then((response) => {
                setEvent(new Event(response.data));
                setLoading(false);
            })
            .catch((error) => {
                setError(error);
                setLoading(false);
            });
    }, [props.eventID]);


    if (error) {
        return <Paper>Error: {error.message}</Paper>;
    }

    const open = Boolean(props.anchorEl);

    return (
        <Popover
            id="mouse-over-popover"
            style={{pointerEvents: 'none', minWidth: '500px'}}
            anchorEl={props.anchorEl}
            open={open}
            anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
            }}
            disableRestoreFocus
        >
            {loading ? <Paper>Loading...</Paper> :
                    <div className='event' style={{margin: '10%', width: '12vw'}}>
                        <h2 className='noMarginTop'>{event.title}</h2>
                        {
                            event.allDay ?
                                <div>
                                    <p>{new Date(event.start).toLocaleDateString()} {event.end == null ? <></> : new Date(event.end).toLocaleDateString() === new Date(event.start).toLocaleDateString() ? <></> : " - " + new Date(event.end).toLocaleDateString()}</p>
                                </div>
                                :
                                <div>
                                    <p>{new Date(event.start).toLocaleString([], {year: '2-digit', month: '2-digit', day: '2-digit', hour: '2-digit', minute:'2-digit'})} - {new Date(event.start).toLocaleDateString() === new Date(event.end).toLocaleDateString() ? new Date(event.end).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : new Date(event.end).toLocaleString([], {year: '2-digit', month: '2-digit', day: '2-digit', hour: '2-digit', minute:'2-digit'})}</p>
                                </div>

                        }
                        {event.farms.length > 0 ? <h3>Farms</h3> : <></>}
                        {event.farms.includes(farms.WH) ? <p>Windmill Hill</p> : <></>}
                        {event.farms.includes(farms.HC) ? <p>Hartcliffe</p> : <></>}
                        {event.farms.includes(farms.SW) ? <p>St Werburghs</p> : <></>}
                        {event.animals.length > 0 ? <h3>Animals</h3> : <></>}
                        {event.animals.map((animal, index) => (
                            <AnimalPopover key={index} cityfarm={props.cityfarm} animalID={animal.id}/>
                        ))}
                        {event.enclosures.length > 0 &&
                        <div>
                            <h3>Enclosures</h3>
                            {event.enclosures.map((enclosure, index) => (
                                <Enclosure key={index} enclosureID={enclosure._id} />
                            ))}
                        </div>}
                        {event.description !== "" ?
                        <div>
                            <h3>Description</h3>
                            {event.description}
                        </div> : <></>}
                    </div>
    }</Popover>
    )
}