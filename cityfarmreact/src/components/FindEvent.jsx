import { useState, useEffect } from 'react';
import axios from '../api/axiosConfig';
import { getConfig } from '../api/getToken';
import { Paper } from '@mui/material';
import { EventPopover } from './EventPopover';

export const FindEvent = (props) => {
    const farms = props.farms;

    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [showing, setShowing] = useState(false);
    const [newEvent, setNewEvent] = useState({
        title: "",
        allDay: true,
        start: new Date(),
        end: new Date(),
        farms: [],
        animals: [],
        description: "",
        enclosures: []
    });

    useEffect(() => {
        let to = new Date();
        to.setFullYear(to.getFullYear() + 1);
        axios.get('/events', {params: {from: new Date().toISOString(), to: to.toISOString()}, ...getConfig()})
            .then((response) => {
                setEvents(response.data);
                setLoading(false);
            })
            .catch((error) => {
                setError(error);
                setLoading(false);
            });
    }, []);



    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error.message}</div>;
    }

    return (
        <Paper>
            <h1>Find Event</h1>
            <div>
                {events.map((event) => {
                    return (
                        <div key={event.event._id} onClick={() => {
                            setSelectedEvent(event);
                            setShowing(true);
                        }}>
                            <h2>{event.event.title}</h2>
                            <p>{event.event.description}</p>
                        </div>
                    )
                })}
            </div>
            {showing ? <EventPopover farms={farms} eventID={selectedEvent.event._id} /> : null}
        </Paper>
    )
}