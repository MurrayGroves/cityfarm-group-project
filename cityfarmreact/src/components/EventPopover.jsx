import React, { useState, useEffect } from 'react';

import axios from '../api/axiosConfig';
import { getConfig } from '../api/getToken';

import { Paper } from '@mui/material';

import AnimalPopover from './AnimalPopover';

export const EventPopover = (props) => {
    const farms = props.farms;

    const [event, setEvent] = useState({event: {title: 'Loading...'}});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        axios.get(`/events/by_id/${props.eventID}`, getConfig())
            .then((response) => {
                setEvent(response.data);
                setLoading(false);
            })
            .catch((error) => {
                setError(error);
                setLoading(false);
            });
    }, [props.eventID]);

    if (loading) {
        return <Paper>Loading...</Paper>;
    }

    if (error) {
        return <Paper>Error: {error.message}</Paper>;
    }

    return (
        <Paper>
            <Paper elevation={3} style={{position: 'relative', width: '400px', margin: '0 0 20px 0', padding: '10px'}}>
                    <div className='event'>
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
                        {event.animals.map((animal) => (
                            <AnimalPopover key={animal._id} animalID={animal._id}/>
                        ))}
                        {event.enclosures.length > 0 &&
                        <div>
                            <h3>Enclosures</h3>
                            {event.enclosures.map((enclosure, index) => (
                                <p key={index} className='noMarginTop'>{enclosure.name}</p>
                            ))}
                        </div>}
                        {event.description !== "" ?
                        <div>
                            <h3>Description</h3>
                            {event.description}
                        </div> : <></>}
                    </div>
                </Paper>
        </Paper>
    )
}