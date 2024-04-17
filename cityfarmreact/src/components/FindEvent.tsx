import { useState, useEffect } from 'react';
import axios from '../api/axiosConfig';
import { getConfig } from '../api/getToken';
import { List, ListItem, Divider, ListItemButton, ListItemIcon, ListItemText, Checkbox, TextField, CircularProgress } from '@mui/material';
import { EventPopover } from './EventPopover';
import { Event } from '../api/events';
import React from 'react';
import { CityFarm } from '../api/cityfarm';

export const FindEvent = ({style, cityfarm, farms, setEvent}: {style: any, cityfarm: CityFarm, farms: any, setEvent: (string) => void}) => {
    const [events, setEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
    const [showing, setShowing] = useState(false);
    const [anchorEl, setAnchorEl] = useState<EventTarget | null>(null);
    const [mousedEvent, setMousedEvent] = useState<Event | null>(null);
    const [search, setSearch] = useState('');
    const [searchResults, setSearchResults] = useState<Event[]>([]);

    useEffect(() => {
        async function getEvents() {
            const response = await cityfarm.getEvents(true, (events) => {
                setEvents(events);
                setSearchResults(events);
                setLoading(false);
            });
            setEvents(response);
            setSearchResults(response);
            setLoading(false);
        }
        getEvents();
    }, []);

    useEffect(() => {
        if (search === '') {
            setSearchResults(events);
        } else {
            setSearchResults(events.filter((event) => event.title.toLowerCase().includes(search.toLowerCase())));
        }
    }, [search]);


    useEffect(() => {
        if (selectedEvent === null) {
            return;
        }
        setEvent(selectedEvent.id);
    }, [selectedEvent]);

    if (loading) {
        return <div style={{height: '80%'}}><CircularProgress style={{position: 'relative', top: '45%', left: '45%', width: '10%', height: '10%'}}/></div>;
    }

    return (
        <div style={style}>
            <TextField label="Search" sx={{marginLeft: '4%'}} size="small" value={search} onChange={(e) => setSearch(e.target.value)}/>
            <List sx={{height: '1%'}}>
            {searchResults.map((event, index) => {
                return (
                    <>
                    <ListItem alignItems="flex-start" style={{'width': '40%', textAlign: 'left'}} key={event.id}
                    onMouseEnter={(e) => {
                        console.log("Event", event)
                        setMousedEvent(event);
                        setShowing(true);
                        setAnchorEl(e.currentTarget);
                    }}
                    onMouseLeave={() => {
                        setShowing(false);
                        setAnchorEl(null);
                    }}
                    >
                        <ListItemButton onClick={()=>setSelectedEvent(event)} dense style={{flex: '0.1'}}>
                            <ListItemIcon>
                                <Checkbox
                                edge="start"
                                checked={selectedEvent === event}
                                />
                            </ListItemIcon>
                        </ListItemButton>
                        <ListItemText onClick={()=>setSelectedEvent(event)} style={{flex: '1'}} primary={event.title} secondary={new Date(event.start).toLocaleDateString()} />
                    </ListItem>
                    {index === searchResults.length -1 ? <></> :<Divider component="li"/>}</>
                )
            })}
            {showing && mousedEvent ? <EventPopover anchorEl={anchorEl} cityfarm={cityfarm} farms={farms} eventID={mousedEvent.id} /> : null}
            </List>
        </div>
    )
}