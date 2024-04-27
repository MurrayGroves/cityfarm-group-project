import { getConfig } from '../api/getToken';
import axios from "../api/axiosConfig";

import React, {useEffect, useState} from 'react';
import { Event } from '../api/events.ts';
import { EventPopover } from './EventPopover.tsx';

export const EventText = ({eventID, farms}) => {
    const [event, setEvent] = useState<Event>(new Event({title: 'Loading...'}));
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<Error | null>(null);
    const [anchorEl, setAnchorEl] = useState<any>(null);

    useEffect(() => {
        console.log("EventText: eventID: ", eventID);
        axios.get(`/events/by_id/${eventID}`, getConfig())
            .then((response) => {
                setEvent(new Event(response.data));
                setLoading(false);
            })
            .catch((error) => {
                setError(error);
                setLoading(false);
            });
    }, [eventID]);

    if (error) {
        return <p>Error: {error.message}</p>;
    }

    if (loading) {
        return <p>Loading...</p>;
    }

    return (
        <div className='event' style={{margin: '0%', width: '12vw', display: 'flex', alignItems: 'left'}} onMouseEnter={(e) => setAnchorEl(e.target)} onMouseLeave={() => setAnchorEl(null)}>
            <EventPopover eventID={event.id} farms={farms} anchorEl={anchorEl}/>
            <p className='noMarginTop'><b>{event.title}</b></p>
            {
                event.allDay ?
                    <div>
                        <p style={{fontSize: '0.8em'}}>{new Date(event.start).toLocaleDateString()} {event.end == null ? <></> : new Date(event.end).toLocaleDateString() === new Date(event.start).toLocaleDateString() ? <></> : " - " + new Date(event.end).toLocaleDateString()}</p>
                    </div>
                    :
                    <div>
                        <p>{new Date(event.start).toLocaleDateString()} {event.end == null ? <></> : " - " + new Date(event.end).toLocaleDateString()} {new Date(event.start).toLocaleTimeString()} {event.end == null ? <></> : " - " + new Date(event.end).toLocaleTimeString()}</p>
                    </div>
            }
            <p>{event.description}</p>
        </div>
    )
}