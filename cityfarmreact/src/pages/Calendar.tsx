import {Calendar as BigCalendar, dayjsLocalizer} from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import React, {useState, useEffect, useCallback, memo} from 'react';
import dayjs from 'dayjs';
import "./Calendar.css";
import Paper from '@mui/material/Paper';
import {  DialogContent, Fab, } from "@mui/material";
import { Button, Checkbox, FormControlLabel, FormGroup, useTheme, Dialog, FormHelperText, Backdrop, Alert } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import axios from '../api/axiosConfig.js'

import { getConfig } from '../api/getToken.js';
import { FilterAlt } from '@mui/icons-material';
import EventDisplay from '../components/EventDisplay.tsx';

import { CachePolicy, CityFarm } from '../api/cityfarm.ts';
import { Event, EventInstance, EventOnce, EventRecurring } from '../api/events.ts';

import lodash from "lodash"

const BigCalendarMemo = memo(BigCalendar, (prevProps, nextProps) => {
    return lodash.isEqual(prevProps.events, nextProps.events);
});

const CalendarUnMemo = ({farms, device, cityfarm, localizer}: {farms: any, device: any, cityfarm: CityFarm, localizer: any}) => {
    const token = getConfig();
    const theme: any = useTheme().palette;

    const [modifiedEvent,setModifiedEvent] = useState<Event | null>(null)

    const [allEvents,setAllEvents] = useState<EventInstance[]>([]);
    const [selectedEvent,setSelectedEvent] = useState<EventInstance | null>(null);
    const [visibleFarms, setVisibleFarms] = useState([farms.WH, farms.HC, farms.SW]);
    const [modifyEvent, setModifyEvent] = useState(false);
    const [range, setRange] = useState<any>({start: (() => {
        let date = new Date();
        date.setMonth(date.getMonth() - 1);
        return date;
    })(), end: (() => {
        let date = new Date();
        date.setMonth(date.getMonth() + 1);
        return date;
    })()});

    useEffect(() =>{
        selectedEvent && setModifiedEvent({...selectedEvent.event, animals: selectedEvent.event.animals, enclosures: selectedEvent.event.enclosures});
    },[selectedEvent]);

    useEffect(() => {
        console.log("Events cache changed");
        (async () => {
            console.log("Refetching events");
            console.log("Range", range);
            if (range.start !== undefined){ //month or agenda case start and end are the times displayed on the calendar
                try {
                    const start = range.start
                    const end = range.end
                    const resp = (await cityfarm.getEventsBetween(CachePolicy.USE_CACHE, start, end, (events => {
                        events = events.filter(event => event.event.farms.some(farm => visibleFarms.includes(farm)));
                        if (!lodash.isEqual(events, allEvents)) {
                            setAllEvents(events);
                        }
                    }))).filter(event => event.event.farms.some(farm => visibleFarms.includes(farm)));;
                    if (!lodash.isEqual(resp, allEvents)) {
                        setAllEvents(resp);
                    }
                } catch (error) {
                    console.error(error);
    
                }
            } else {
                if (range[1] !== undefined){ //week case has an array of 7 times
                    try {
                        const start = range[0]
                        const end = range[range.length - 1]
    
                        const resp = (await cityfarm.getEventsBetween(CachePolicy.USE_CACHE, start, end, (events => {
                            events = events.filter(event => event.event.farms.some(farm => visibleFarms.includes(farm)));
                            if (!lodash.isEqual(events, allEvents)) {
                                setAllEvents(events);
                            }
                        }))).filter(event => event.event.farms.some(farm => visibleFarms.includes(farm)));;
                        if (!lodash.isEqual(resp, allEvents)) {
                            setAllEvents(resp);
                        }
                    } catch (error){
                        console.error(error);
                    }
                }
                else { // day case has a single element of the start time
                    try {
                        const start = range[0]
                        const end = start
                        end.setDate(start.getDate() + 1)
    
                        const resp = (await cityfarm.getEventsBetween(CachePolicy.USE_CACHE, start, end, (events => {
                            events = events.filter(event => event.event.farms.some(farm => visibleFarms.includes(farm)));
                            if (!lodash.isEqual(events, allEvents)) {
                                setAllEvents(events);
                            }
                        }))).filter(event => event.event.farms.some(farm => visibleFarms.includes(farm)));
                        if (!lodash.isEqual(resp, allEvents)) {
                            setAllEvents(resp);
                        }
                    } catch (error) {
                        console.error(error)
                    }
                }
            }
        })();
    },[JSON.stringify(cityfarm.event_instance_cache), JSON.stringify(cityfarm.events_cache), range, modifyEvent, visibleFarms]);


    const handleDelEvent = useCallback(async() => {
        if (selectedEvent === null) {
            console.error("Delete event fired but no event selected")
            return;
        }

        let id = selectedEvent.event.id;
        try {
            await axios.delete(`/events/by_id/${id}`, token);
        } catch(error) {
            if (error.response.status === 401) {
                window.location.href = "/login";
                return;
            } else {
                window.alert(error);
            }
        }
        setSelectedEvent(null);
        await cityfarm.getEvents(CachePolicy.NO_CACHE);
    }, [selectedEvent]);

    const updateVisibleFarms = (selected) => {
        visibleFarms.includes(selected) ? setVisibleFarms(visibleFarms.filter(farm => farm !== selected)) : setVisibleFarms([...visibleFarms, selected]);
    }

    const eventStyleGetter = (eventInstance) => {
        const event = eventInstance.event;
        var colour1 = event.farms.includes(farms.WH) ? theme.WH.main : (event.farms.includes(farms.HC) ? theme.HC.main : theme.SW.main);
        var colour2 = event.farms.includes(farms.HC) ? (event.farms.includes(farms.WH) ? theme.HC.main : (event.farms.includes(farms.SW) ? theme.SW.main : theme.SW.main)) : theme.SW.main;
        const offset = 0;
        var visible = true;
        if (event.farms.length > 0) {
            visible = false;
            for (let i = 0; i < event.farms.length; i++) {
                let v = visibleFarms.includes(event.farms[i]);
                if(v){visible = true};
            }
        }
        var style = {
            display: visible ? 'block' : 'none',
            backgroundColor: theme.default.main,
            backgroundImage: `linear-gradient(135deg, ${colour1}, ${colour1} ${100/event.farms.length - offset}%, ${colour2} ${100/event.farms.length + offset}%, ${colour2} ${200/event.farms.length - offset}%, ${theme.SW.main} ${200/event.farms.length + offset}%, ${theme.SW.main})`,
            color: 'white',
            borderRadius: '5px'
        };
        return {
            style: style
        };
    }

    const onRangeChange = useCallback(async (newRange) => {
        console.log("Range changed", range);
        setRange(newRange);
    }, [])
  
    const [createEvent, setCreateEvent] = useState(false);
    const [filter, setFilter] = useState(false);

    let dayColour = theme.mode === 'dark' ? '#121212': '#fff'
    let offRangeColour = theme.mode === 'dark' ? '#ffffff08' : '#f0f0f0';
    let todayColour = theme.mode === 'dark' ? theme.primary.veryDark : theme.primary.light;
    let textColour = theme.mode === 'dark' ? 'white' : 'black';
    let headerColour = theme.mode === 'dark' ? theme.primary.veryDark : theme.primary.light;

    return (<>
        <div style={{display: 'flex', justifyContent: 'space-between'}}>
            <h1>Calendar</h1>
            {/* wrap filters in dialog and button when on mobile */}
            {device === 'mobile' ? <>
            <Button variant='contained' sx={{height: '40px', mt: '24px'}} onClick={() => setFilter(true)} endIcon={<FilterAlt/>}>Filter</Button>
            <Dialog open={filter} onClose={() => setFilter(false)}>
                <DialogContent>
                    <FormGroup>
                        <FormControlLabel control={<Checkbox checked={visibleFarms.includes(farms.WH)} color={farms.WH} size='small'/>} label="Windmill Hill" onChange={() => updateVisibleFarms(farms.WH)}/>
                        <FormControlLabel control={<Checkbox checked={visibleFarms.includes(farms.HC)} color={farms.HC} size='small'/>} label="Hartcliffe" onChange={() => updateVisibleFarms(farms.HC)}/>
                        <FormControlLabel control={<Checkbox checked={visibleFarms.includes(farms.SW)} color={farms.SW} size='small'/>} label="St Werburghs" onChange={() => updateVisibleFarms(farms.SW)}/>
                    </FormGroup>
                </DialogContent>
            </Dialog></>
            :
            <Paper elevation={3} style={{height: '48px', marginTop: '21.44px', padding: '6px 0 0 10px', width: '400px'}}>
                <FormGroup row>
                    <FormControlLabel control={<Checkbox checked={visibleFarms.includes(farms.WH)} color={farms.WH} size='small'/>} label="Windmill Hill" onChange={() => updateVisibleFarms(farms.WH)}/>
                    <FormControlLabel control={<Checkbox checked={visibleFarms.includes(farms.HC)} color={farms.HC} size='small'/>} label="Hartcliffe" onChange={() => updateVisibleFarms(farms.HC)}/>
                    <FormControlLabel control={<Checkbox checked={visibleFarms.includes(farms.SW)} color={farms.SW} size='small'/>} label="St Werburghs" onChange={() => updateVisibleFarms(farms.SW)}/>
                </FormGroup>
            </Paper>}
        </div>
        <div style={{ display: "flex", justifyContent: "left", height: "calc(100% - 91px)"}}>
            {/* if screen is large, make room for selected / create event on the right */}
            {device === 'desktopLarge' ?
            <Paper elevation={3} style={{height: '100%', width: "calc(100% - 420px)", padding: '15px', marginRight: '20px'}}>
                <BigCalendarMemo
                    culture='en-gb'
                    localizer={localizer}
                    events={allEvents.map((event: EventInstance) => {
                        const newEvent = {
                            title: event.event.title,
                            start: event.start,
                            end: event.end,
                            event: event.event,
                            allDay: event.event.allDay,
                        };
                        return newEvent
                    })}

                    style={{width: '100%', '--day': dayColour, '--off-range': offRangeColour, '--today': todayColour, '--text': textColour, '--header': headerColour}}
                    showMultiDayTimes
                    onSelectEvent={(bigCalendarEvent: EventInstance) => {
                        setSelectedEvent(bigCalendarEvent);
                    }}
                    eventPropGetter={eventStyleGetter}
                    onRangeChange={onRangeChange}
                />
            </Paper>
            :
            <Paper elevation={3} style={{height: '100%', width: '100%', padding: '15px'}}>
                <BigCalendarMemo
                    culture='en-gb'
                    localizer={localizer}
                    events={allEvents.map((event: EventInstance) => {
                        const newEvent = {
                            title: event.event.title,
                            start: event.start,
                            end: event.end,
                            event: event.event,
                            allDay: event.event.allDay,
                        };
                        return newEvent
                    })}

                    style={{width: '100%', '--day': dayColour, '--off-range': offRangeColour, '--today': todayColour, '--text': textColour, '--header': headerColour}}
                    showMultiDayTimes
                    onSelectEvent={(bigCalendarEvent: EventInstance) => {
                        setSelectedEvent(bigCalendarEvent);
                    }}
                    eventPropGetter={eventStyleGetter}
                    onRangeChange={onRangeChange}
                />
            </Paper>}

            {/* wrap selected event / create event in a dialog when screen is small */}
            {device !== 'desktopLarge' ?
            <Dialog fullWidth maxWidth='xs' open={selectedEvent !== null || createEvent} onClose={() => {setSelectedEvent(null); setCreateEvent(false); setModifyEvent(false);}}>
                <DialogContent>
                    <EventDisplay
                        selectedEvent={selectedEvent} setSelectedEvent={setSelectedEvent}
                        modifyEvent={modifyEvent} setModifiedEvent={setModifiedEvent} setModifyEvent={setModifyEvent}
                        handleDelEvent={handleDelEvent}
                        farms={farms} cityfarm={cityfarm}
                    />
                </DialogContent>
            </Dialog>
            :
            <Paper elevation={3} style={{padding: '10px', flex: 1, overflowY: 'auto'}}>
                <EventDisplay
                    selectedEvent={selectedEvent} setSelectedEvent={setSelectedEvent}
                    modifyEvent={modifyEvent} setModifiedEvent={setModifiedEvent} setModifyEvent={setModifyEvent}
                    handleDelEvent={handleDelEvent}
                    farms={farms} cityfarm={cityfarm}
                />
            </Paper>}
        </div>
        {device !== 'desktopLarge' && <Fab style={{position: 'absolute', bottom: '15px', right: '15px'}} color='primary' onClick={() => setCreateEvent(true)}><AddIcon/></Fab>}
    </>);
}

const Calendar = memo(CalendarUnMemo, (prevProps, nextProps) => {
    return prevProps.device === nextProps.device;
});

export default Calendar;



