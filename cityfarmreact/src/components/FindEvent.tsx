import { useState, useEffect, Fragment } from 'react';
import { List, ListItem, Divider, ListItemButton, ListItemIcon, ListItemText, Checkbox, TextField, CircularProgress } from '@mui/material';
import { EventPopover } from './EventPopover.tsx';
import { Event } from '../api/events';
import React from 'react';
import { CachePolicy, CityFarm } from '../api/cityfarm.ts';

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
        (async () => {
            setEvents(await cityfarm.getEvents(CachePolicy.CACHE_ONLY));
            setLoading(false);
        })();
    }, [cityfarm.getEvents(CachePolicy.CACHE_ONLY)]);

    useEffect(() => {
        (async () => {
            await cityfarm.getEvents(CachePolicy.NO_CACHE);
        })()
    }, [])

    useEffect(() => {
        (async () => {
            if (search === '') {
                setSearchResults(events);
            } else {
                setSearchResults(events.filter((event) => event.title.toLowerCase().includes(search.toLowerCase())));
            }
        })()
    }, [search, events]);


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
            {searchResults.map((event, index) => (
                    <Fragment key={index}>
                    <ListItem alignItems="flex-start" style={{'width': '40%', textAlign: 'left'}}
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
                        <ListItemText onClick={()=>setSelectedEvent(event)} style={{flex: '1'}} primary={event.title} secondary={event.description} />
                    </ListItem>
                    {index === searchResults.length -1 ? <></> : <Divider component="li"/>}</Fragment>
                )
            )}
            {showing && mousedEvent && <EventPopover anchorEl={anchorEl} cityfarm={cityfarm} farms={farms} eventID={mousedEvent.id} />}
            </List>
        </div>
    )
}