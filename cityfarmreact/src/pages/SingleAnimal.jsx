import * as React from 'react';
import './SingleAnimal.css';
import { useParams } from 'react-router-dom';
import Typography from '@mui/material/Typography';
import axios from '../api/axiosConfig';
import { useState, useEffect } from 'react';
import AnimalPopover from '../components/AnimalPopover';
import CloseIcon from '../assets/close-512-light.webp';
import Paper from '@mui/material/Paper';
import SelectedEvent from '../components/SelectedEvent';

import { getConfig } from '../api/getToken';

const SingleAnimal = (props) => {
    const farms = props.farms;

    const { animalID } = useParams();
    const [relEvents, setRelEvents] = useState([]);
    const [chosenAnimal, setChosenAnimal] = useState({
        name: 'Loading...',
        type: 'Loading...',
    });
    const [selectedEvent, setSelectedEvent] = useState('No event selected');

    const token = getConfig();

    function readableFarm(farm) {
        switch (farm) {
            case 'WH':
                return 'Windmill Hill';
            case 'HC':
                return 'Hartcliffe';
            case 'SW':
                return 'St Werburghs';
            case '':
                return 'None';
            default:
                return 'Loading...';
        }
    }

    useEffect(() => {
        (async () => {
            try {
                const response = await axios.get(`/animals/by_id/${animalID}`, token);
                setChosenAnimal(response.data);

                const events = await axios.get(`/events/by_animal/${animalID}`, token);
                setRelEvents(eventsConversion(events.data));
            } catch (error) {
                if (error.response.status === 401) {
                    window.location.href = '/login';
                    return;
                } else {
                    window.alert(error);
                }
            }
        })();
    }, [animalID]);

    const eventsConversion = (events) => {
        let changed = [];
        for (let i = 0; i < events.length; i++) {
            changed.push({
                title: events[i].title,
                allDay: events[i].allDay,
                start: new Date(events[i].start),
                end: new Date(events[i].end),
                farms: events[i].farms,
                animals: events[i].animals,
                description: events[i].description,
                enclosures: events[i].enclosures,
            });
        }
        return changed;
    };

    const handleEventClick = (event) => {
        setSelectedEvent(event);
    };

    return (
        <>
            <h1>{chosenAnimal.name}</h1>
            Sex:{' '}
            {chosenAnimal.sex === undefined
                ? 'Loading...'
                : chosenAnimal.sex === 'f'
                  ? 'Female'
                  : chosenAnimal.sex === 'm'
                    ? 'Male'
                    : 'Castrated'}
            <br />
            Species: {chosenAnimal.type.charAt(0).toUpperCase() + chosenAnimal.type.slice(1)}
            <br />
            <span style={{ display: 'flex' }}>
                <span style={{ marginRight: '0.5em' }}>Father:</span>
                {chosenAnimal.father ? (
                    <AnimalPopover key={chosenAnimal.father} animalID={chosenAnimal.father} />
                ) : (
                    'Unregistered'
                )}
            </span>
            <span style={{ display: 'flex' }}>
                <span style={{ marginRight: '0.5em' }}>Mother:</span>
                {chosenAnimal.mother ? (
                    <AnimalPopover key={chosenAnimal.mother} animalID={chosenAnimal.mother} />
                ) : (
                    'Unregistered'
                )}
            </span>
            Farm: {readableFarm(chosenAnimal.farm)}
            <div>
                {relEvents.length !== 0 ? <h2>Linked Events</h2> : <></>}
                {relEvents.map((event, index) => {
                    return (
                        <div key={index}>
                            {/* Display relevant event information very similar to event view*/}
                            <h3 onClick={() => handleEventClick(event)}>{event.title}</h3>
                            {event.allDay ? (
                                <div>
                                    <p>
                                        {event.start.toLocaleDateString()}{' '}
                                        {event.end == null ? (
                                            <></>
                                        ) : event.end.toLocaleDateString() === event.start.toLocaleDateString() ? (
                                            <></>
                                        ) : (
                                            ' - ' + event.end.toLocaleDateString()
                                        )}
                                    </p>
                                </div>
                            ) : (
                                <div>
                                    <p>
                                        {event.start.toLocaleString([], {
                                            year: '2-digit',
                                            month: '2-digit',
                                            day: '2-digit',
                                            hour: '2-digit',
                                            minute: '2-digit',
                                        })}{' '}
                                        -{' '}
                                        {event.start.toLocaleDateString() === event.end.toLocaleDateString()
                                            ? event.end.toLocaleTimeString([], {
                                                  hour: '2-digit',
                                                  minute: '2-digit',
                                              })
                                            : event.end.toLocaleString([], {
                                                  year: '2-digit',
                                                  month: '2-digit',
                                                  day: '2-digit',
                                                  hour: '2-digit',
                                                  minute: '2-digit',
                                              })}
                                    </p>
                                </div>
                            )}
                            {event.farms.length !== 0 ? <h4>Farms: </h4> : <></>}
                            {event.farms.includes(farms.WH) ? <p>Windmill Hill </p> : <></>}
                            {event.farms.includes(farms.HC) ? <p>Hartcliffe </p> : <></>}
                            {event.farms.includes(farms.SW) ? <p>St Werburghs</p> : <></>}
                        </div>
                    );
                })}
            </div>
            {selectedEvent !== 'No event selected' && (
                <Paper elevation={3} className="selectedBox">
                    <SelectedEvent event={selectedEvent} setEvent={setSelectedEvent} farms={farms} />
                </Paper>
            )}
        </>
    );
};

export default SingleAnimal;
