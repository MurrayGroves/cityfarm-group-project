import { useState, useEffect } from 'react';
import axios from '../api/axiosConfig';
import { getConfig } from '../api/getToken';
import { Paper, List, ListItem, Divider, ListItemButton, ListItemIcon, ListItemText, Checkbox } from '@mui/material';
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
    const [anchorEl, setAnchorEl] = useState(null);
    const [mousedEvent, setMousedEvent] = useState(null);

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

    console.log("Re-rendering")

    return (
        <Paper>
            <List>
            {events.map((event) => {
                return (
                    <>
                    <ListItem alignItems="flex-start" style={{'width': '40%', textAlign: 'left'}} key={event.event._id}
                    onMouseEnter={(e) => {
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
                        <ListItemText style={{flex: '1'}} primary={event.event.title} secondary={new Date(event.event.start).toLocaleDateString()} />
                    </ListItem>
                    <Divider component="li"/></>
                )
            })}
            {showing ? <EventPopover anchorEl={anchorEl} farms={farms} eventID={mousedEvent.event._id} /> : null}
            </List>
        </Paper>
    )
}