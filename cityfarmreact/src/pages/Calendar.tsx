import {Calendar as BigCalendar, dayjsLocalizer} from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import React, {useState, useEffect, useCallback} from 'react';
import dayjs from 'dayjs';
import "./Calendar.css";
import AnimalPopover from "../components/AnimalPopover.jsx";
import Close from '@mui/icons-material/Close';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import {  DialogActions, DialogContent, DialogContentText, DialogTitle, Fab, ToggleButton, ToggleButtonGroup } from "@mui/material";
import { IconButton, Button, ButtonGroup, Checkbox, FormControlLabel, FormGroup, useTheme, Dialog, FormHelperText, Backdrop, Alert } from '@mui/material';
import AlertTitle from '@mui/material/AlertTitle';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import Delete from '@mui/icons-material/Delete';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import AssociateAnimal from '../components/AssociateAnimal.jsx';
import axios from '../api/axiosConfig.js'
import AssociateEnclosure from '../components/AssociateEnclosure.jsx';

import { getConfig } from '../api/getToken.js';
import { FilterAlt } from '@mui/icons-material';
import EventDisplay from '../components/EventDisplay.tsx';

import { CityFarm } from '../api/cityfarm.ts';
import { Event, EventInstance, EventOnce, EventRecurring } from '../api/events.ts';

export const eventsConversion=(events)=>{
    let changed: any = []
    for (let i=0;i<events.length;i++){
        changed.push(
            {
                _id: events[i].event._id,
                title: events[i].event.title,
                allDay: events[i].event.allDay,
                start: new  Date(events[i].start),
                end: new  Date(events[i].end),
                farms: events[i].event.farms,
                animals: events[i].event.animals,
                description: events[i].event.description,
                enclosures: events[i].event.enclosures
            }
        )
    }
    return changed
}

const Calendar = ({farms, device, cityfarm}: {farms: any, device: any, cityfarm: CityFarm}) => {
  
    const token = getConfig();
    const theme: any = useTheme().palette;

    const [newEvent,setNewEvent] = useState<any>({
        title: "",
        allDay: true,
        start: new Date(),
        end: new Date(),
        farms: [],
        animals: [],
        description: "",
        enclosures: []
    })
    const [modifiedEvent,setModifiedEvent] = useState<Event | null>(null)

    const [allEvents,setAllEvents] = useState<EventInstance[]>([]);
    const [selectedEvent,setSelectedEvent] = useState<EventInstance | null>(null);
    const [visibleFarms, setVisibleFarms] = useState([farms.WH, farms.HC, farms.SW]);
    const [modifyEvent, setModifyEvent] = useState(false);
    const [showErr, setShowErr] = useState(false);
    const [inputErr, setInputErr] = useState({newTitle: true});
    const [recurring, setRecurring] = useState(false);

    useEffect(() => {
        setInputErr({...inputErr, newTitle: newEvent.title === ''});
    }, [newEvent]);

    useEffect(() =>{
        selectedEvent && setModifiedEvent({...selectedEvent.event, animals: selectedEvent.event.animals.map(animal => animal._id), enclosures: selectedEvent.event.enclosures.map(enclosure => enclosure._id)});
    },[selectedEvent]);

    const setModifiedEventAnimals = (animalList) => {
        if (modifiedEvent === null) {
            return;
        }
        setModifiedEvent({...modifiedEvent, animals: animalList})
    }
    const setModifiedEventEnclosures = (enclosures) => {
        if (modifiedEvent === null) {
            return;
        }
        setModifiedEvent({...modifiedEvent, enclosures: enclosures})
    }
    const setAddEventEnclosures = (enclosures) => {
        setNewEvent({...newEvent, enclosures: enclosures})
    }
    const setAddEventAnimals = (animalList) => {
        setNewEvent({...newEvent, animals: animalList})
    }
    
    const changeAllDay = (isAllDay, type) => {
        if (type === 'add') {
            setNewEvent({...newEvent, allDay: isAllDay});
        } else if (type === 'modify' && modifiedEvent !== null) {
            setModifiedEvent({...modifiedEvent, allDay: isAllDay});
        }
    }

    const changeRecurring = (isRecurring, type) => {
        type === "add" && setRecurring(isRecurring);
    }

    useEffect(() => {
        recurring ?
            setNewEvent({...newEvent, firstStart: newEvent.start, firstEnd: newEvent.end, delay: 'P1D', finalEnd: null, start: null, end: null})
            : newEvent.firstStart && setNewEvent({...newEvent, end: newEvent.firstEnd, start: newEvent.firstStart, firstStart: null, firstEnd: null, delay: null, finalEnd: null})
    }, [recurring])


    useEffect(() => {
        (async () => {
            console.log("Refetching events");
            try {
                const start = new Date()
                start.setMonth(start.getMonth()-1)
                const end =  new Date()
                end.setMonth(end.getMonth()+1)

                const resp = await cityfarm.getEventsBetween(true, start, end);
                console.log("Resp", resp);
                setAllEvents(resp);
            } catch (error) {
                if (error?.response?.status === 401) {
                    window.location.href = "/login";
                    return;
                } else {
                    console.error(error);
                    window.alert(error);
                }
            }
        })();
    },[cityfarm.events_cache]);


    const handleDelEvent = async() => {
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
        await cityfarm.getEvents(false);
    }

    const handlePatchEvent = async() => {
        if (modifiedEvent === null) {
            return;
        }

        try {
            await axios.patch(`/events/by_id/${modifiedEvent.id}/update`, modifiedEvent, token);
        } catch(error) {
            if (error.response.status === 401) {
                window.location.href = "/login";
                return;
            } else {
                window.alert(error);
            }
        }
        cityfarm.getEvents(false);
    }

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
            backgroundColor: theme.grey.main,
            backgroundImage: `linear-gradient(135deg, ${colour1}, ${colour1} ${100/event.farms.length - offset}%, ${colour2} ${100/event.farms.length + offset}%, ${colour2} ${200/event.farms.length - offset}%, ${theme.SW.main} ${200/event.farms.length + offset}%, ${theme.SW.main})`,
            color: 'white',
            borderRadius: '5px'
        };
        return {
            style: style
        };
    }

    function setEventStart(e: dayjs.Dayjs | null) {
        if (e === null || modifiedEvent === null) {
            return;
        }
        if (modifiedEvent instanceof EventRecurring) {
            let delta = modifiedEvent.firstEnd.getTime() - modifiedEvent.firstStart.getTime();

            let myEvent = (modifiedEvent as EventRecurring);
            myEvent.firstStart = new Date(e.toISOString());

            // If the new start time is after the end time, move the end time to be the same distance from the new start time as the old end time was from the old start time
            // E.g. if the event was 10:00 - 11:00 and you move the start time to 11:00, the end time will be moved to 12:00
            if (myEvent.firstEnd < myEvent.firstStart) {
                myEvent.firstEnd = new Date(myEvent.firstStart.getTime() + delta);
            }

            setModifiedEvent(myEvent);
        } else {
            let myEvent = (modifiedEvent as EventOnce);

            let delta = myEvent.end.getTime() - myEvent.start.getTime();

            myEvent.start = new Date(e.toISOString());

            // If the new start time is after the end time, move the end time to be the same distance from the new start time as the old end time was from the old start time
            // E.g. if the event was 10:00 - 11:00 and you move the start time to 11:00, the end time will be moved to 12:00
            if (myEvent.end < myEvent.start) {
                myEvent.end = new Date(myEvent.start.getTime() + delta);
            }

            setModifiedEvent(myEvent);
        }
    }

    function setEventEnd(e: dayjs.Dayjs | null) {
        if (e === null || modifiedEvent === null) {
            return;
        }
        if (modifiedEvent instanceof EventRecurring) {
            let delta = modifiedEvent.firstEnd.getTime() - modifiedEvent.firstStart.getTime();

            let myEvent = (modifiedEvent as EventRecurring);
            myEvent.firstEnd = new Date(e.toISOString());

            // If the new end time is before the start time, move the start time to be the same distance from the new end time as the old start time was from the old end time
            // E.g. if the event was 10:00 - 11:00 and you move the end time to 11:00, the start time will be moved to 12:00
            if (myEvent.firstEnd < myEvent.firstStart) {
                myEvent.firstStart = new Date(myEvent.firstEnd.getTime() - delta);
            }

            setModifiedEvent(myEvent);
        } else {
            let myEvent = (modifiedEvent as EventOnce);

            let delta = myEvent.end.getTime() - myEvent.start.getTime();

            myEvent.end = new Date(e.toISOString());

            // If the new end time is before the start time, move the start time to be the same distance from the new end time as the old start time was from the old end time
            // E.g. if the event was 10:00 - 11:00 and you move the end time to 11:00, the start time will be moved to 12:00
            if (myEvent.end < myEvent.start) {
                myEvent.start = new Date(myEvent.start.getTime() - delta);
            }

            setModifiedEvent(myEvent);
        }
    }

    function showingTime(isShown) {
        if (modifiedEvent === null) {
            return <></>;
        }

        if (isShown) {
            return(<>
                <FormHelperText>Start</FormHelperText>
                <DateTimePicker value={modifiedEvent instanceof EventRecurring ? dayjs(modifiedEvent.firstStart) : dayjs((modifiedEvent as EventOnce).start)} onChange={setEventStart} slotProps={{textField: {fullWidth: true, size: 'small'}}}/>
                <FormHelperText>End</FormHelperText>
                <DateTimePicker value={modifiedEvent instanceof EventRecurring ? dayjs(modifiedEvent.firstEnd) : dayjs((modifiedEvent as EventOnce).end)} onChange={setEventEnd} slotProps={{textField: {fullWidth: true, size: 'small'}}}/>
            </>)
        } else {
            return(<>
                <FormHelperText>Start</FormHelperText>
                <DatePicker value={modifiedEvent instanceof EventRecurring ? dayjs(modifiedEvent.firstStart) : dayjs((modifiedEvent as EventOnce).start)} onChange={setEventStart} slotProps={{textField: {fullWidth: true, size: 'small'}}}/>
                <FormHelperText>End</FormHelperText>
                <DatePicker value={modifiedEvent instanceof EventRecurring ? dayjs(modifiedEvent.firstEnd) : dayjs((modifiedEvent as EventOnce).end)} onChange={setEventEnd} slotProps={{textField: {fullWidth: true, size: 'small'}}}/>
            </>)
        }
    }
    const [anchor, setAnchor] = React.useState(null);
    const [openAnimalsPopup, setOpenAnimalsPopup] = useState(false)
    const [openEnclosurePopup, setOpenEnclosurePopup] = useState(false);

    const functionopenPopup = (type) => { 
         if (type === "animals") {setOpenAnimalsPopup(true)} else {setOpenEnclosurePopup(true)}
    }
    const functionclosePopup = () => {
        setOpenAnimalsPopup(false)
        setOpenEnclosurePopup(false)
    }

    const onRangeChange = useCallback(async (range) => {
        if (range.start !== undefined){ //month or agenda case start and end are the times displayed on the calendar
            try {
                const start = range.start.toISOString()
                const end = range.end.toISOString()

                const response = await axios.get(`/events`, {params: {from: start, to: end}, ...token});
                setAllEvents(eventsConversion(response.data));
            } catch (error) {
                window.alert(error);

            }
        } else {
            if (range[1] !== undefined){ //week case has an array of 7 times
                try {
                    const start = range[0].toISOString()
                    const end = range[range.length - 1].toISOString()
                    const response = await axios.get(`/events`, {params: {from: start, to: end}, ...token});

                    setAllEvents(eventsConversion(response.data));
                } catch (error){
                    window.alert(error);
                }
            }
            else { // day case has a single element of the start time
                try {
                    const start = range[0]
                    const end = start
                    end.setDate(start.getDate() + 1)

                    const response = await axios.get(`/events`, {params: {from: start.toISOString(), to: end.toISOString()}, ...token});

                    setAllEvents(eventsConversion(response.data));
                } catch (error) {
                    window.alert(error)
                }
            }
        }
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
                <BigCalendar
                    culture='en-gb'
                    localizer={dayjsLocalizer(dayjs)}
                    events={allEvents.map((event: EventInstance) => {
                        console.log("instance", event)
                        console.log("start type", typeof event.start)
                        const newEvent = {
                            title: event.event.title,
                            start: event.start,
                            end: event.end,
                            event: event.event,
                            allDay: event.event.allDay,
                        };

                        console.log("new", newEvent);
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
                <BigCalendar
                    culture='en-gb'
                    localizer={dayjsLocalizer(dayjs)}
                    events={allEvents.map(event => {
                        return {
                            title: event.event.title,
                            start: event.start,
                            end: event.end,
                            event: event.event,
                        }
                    })}
                    startAccessor="start"
                    endAccessor="end"
                    style={{width: '100%', '--day': dayColour, '--off-range': offRangeColour, '--today': todayColour, '--text': textColour, '--header': headerColour}}
                    showMultiDayTimes
                    onSelectEvent={setSelectedEvent}
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
                        modifiedEvent={modifiedEvent} modifyEvent={modifyEvent} setModifiedEvent={setModifiedEvent} setModifiedEventAnimals={setModifiedEventAnimals} setModifiedEventEnclosures={setModifiedEventEnclosures} setModifyEvent={setModifyEvent}
                        createEvent={createEvent}
                        handleDelEvent={handleDelEvent} handlePatchEvent={handlePatchEvent}
                        showingTime={showingTime} functionopenPopup={functionopenPopup} functionclosePopup={functionclosePopup}
                        openAnimalsPopup={openAnimalsPopup} openEnclosurePopup={openEnclosurePopup}
                        changeAllDay={changeAllDay}
                        farms={farms} cityfarm={cityfarm}
                    />
                </DialogContent>
            </Dialog>
            :
            <Paper elevation={3} style={{padding: '10px', flex: 1, overflowY: 'auto'}}>
                <EventDisplay
                    selectedEvent={selectedEvent} setSelectedEvent={setSelectedEvent}
                    modifiedEvent={modifiedEvent} modifyEvent={modifyEvent} setModifiedEvent={setModifiedEvent} setModifiedEventAnimals={setModifiedEventAnimals} setModifiedEventEnclosures={setModifiedEventEnclosures} setModifyEvent={setModifyEvent}
                    createEvent={true}
                    handleDelEvent={handleDelEvent} handlePatchEvent={handlePatchEvent}
                    showingTime={showingTime} functionopenPopup={functionopenPopup} functionclosePopup={functionclosePopup}
                    openAnimalsPopup={openAnimalsPopup} openEnclosurePopup={openEnclosurePopup}
                    changeAllDay={changeAllDay}
                    farms={farms} cityfarm={cityfarm}
                />
            </Paper>}
        </div>
        {device !== 'desktopLarge' && <Fab style={{position: 'absolute', bottom: '15px', right: '15px'}} color='primary' onClick={() => setCreateEvent(true)}><AddIcon/></Fab>}
        <Backdrop style={{zIndex: '1301', background: '#000000AA'}} open={showErr} onClick={() => setShowErr(false)}>
            <Alert severity='warning'>
                Please ensure event title is not empty
            </Alert>
        </Backdrop>
    </>);
}

export default Calendar;



