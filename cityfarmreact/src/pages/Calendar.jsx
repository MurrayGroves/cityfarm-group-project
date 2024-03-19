import {Calendar as BigCalendar, dayjsLocalizer} from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import React, {useState, useEffect, useCallback} from 'react';
import dayjs from 'dayjs';
import "./Calendar.css";
import AnimalPopover from "../components/AnimalPopover";
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
import AssociateAnimal from '../components/AssociateAnimal';
import axios from '../api/axiosConfig'
import AssociateEnclosure from '../components/AssociateEnclosure';

import { getConfig } from '../api/getToken';
import { FilterAlt } from '@mui/icons-material';
import EventDisplay from '../components/EventDisplay';

export const eventsConversion=(events)=>{
    let changed=[]
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

const Calendar = ({farms, device}) => {
  
    const token = getConfig();
    const theme = useTheme().palette;

    const [newEvent,setNewEvent] = useState({
        title: "",
        allDay: true,
        start: new Date(),
        end: new Date(),
        farms: [],
        animals: [],
        description: "",
        enclosures: []
    })
    const [modifiedEvent,setModifiedEvent] = useState({
        title: "",
        allDay: true,
        start: new Date(),
        end: new Date(),
        farms: [],
        animals: [],
        description: "",
        enclosures: []
    })

    const [allEvents,setAllEvents] = useState([]);
    const [selectedEvent,setSelectedEvent] = useState("");
    const [visibleFarms, setVisibleFarms] = useState([farms.WH, farms.HC, farms.SW]);
    const [modifyEvent, setModifyEvent] = useState(false);
    const [showErr, setShowErr] = useState(false);
    const [inputErr, setInputErr] = useState({newTitle: true});
    const [recurring, setRecurring] = useState(false);

    useEffect(() => {
        setInputErr({...inputErr, newTitle: newEvent.title === ''});
    }, [newEvent]);

    useEffect(() =>{
        selectedEvent && setModifiedEvent({...selectedEvent, animals: selectedEvent.animals.map(animal => animal._id), enclosures: selectedEvent.enclosures.map(enclosure => enclosure._id)});
    },[selectedEvent]);

    const setModifiedEventAnimals = (animalList) => {
        setModifiedEvent({...modifiedEvent, animals: animalList})
    }
    const setModifiedEventEnclosures = (enclosures) => {
        setModifiedEvent({...modifiedEvent, enclosures: enclosures})
    }
    const setAddEventEnclosures = (enclosures) => {
        setNewEvent({...newEvent, enclosures: enclosures})
    }
    const setAddEventAnimals = (animalList) => {
        setNewEvent({...newEvent, animals: animalList})
    }
    
    const changeAllDay = (isAllDay, type) => {
        type === "add" ? setNewEvent({...newEvent, allDay: isAllDay}) : setModifiedEvent({...modifiedEvent, allDay: isAllDay})
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
            try {
                const start = new Date()
                start.setMonth(start.getMonth()-1)
                const end =  new Date()
                end.setMonth(end.getMonth()+1)

                const response = await axios.get(`/events`, {params: {from: start.toISOString(), to: end.toISOString()}, ...token});
                setAllEvents(eventsConversion(response.data));
            } catch (error) {
                if (error.response.status === 401) {
                    window.location.href = "/login";
                    return;
                } else {
                    window.alert(error);
                }
            }
        })();
    },[]);

    const handleAddEvent = async() => {
        if (Object.values(inputErr).filter((err) => err === true).length > 0) {
            return setShowErr(true);
        }

        try {
            recurring ? await axios.post(`/events/create/recurring`, newEvent, token)
                      : await axios.post(`/events/create/once`, newEvent, token)
        } catch(error) {
            if (error.response.status === 401) {
                window.location.href = "/login";
                return;
            } else {
                window.alert(error);
            }
        }
        
        setNewEvent({
            title: "",
            allDay: true,
            start: new Date(),
            end: new Date(),
            farms: [],
            animals: [],
            description: "",
            enclosures: []
        });
        
        window.location.reload(false);
    }

    const handleDelEvent = async() => {
        let id = selectedEvent._id;
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
        window.location.reload(false);
    }

    const handlePatchEvent = async() => {
        try {
            const response = await axios.patch(`/events/by_id/${modifiedEvent._id}/update`, modifiedEvent, token);
        } catch(error) {
            if (error.response.status === 401) {
                window.location.href = "/login";
                return;
            } else {
                window.alert(error);
            }
        }
        window.location.reload(false);
    }

    const updateVisibleFarms = (selected) => {
        visibleFarms.includes(selected) ? setVisibleFarms(visibleFarms.filter(farm => farm !== selected)) : setVisibleFarms([...visibleFarms, selected]);
    }

    const eventStyleGetter = (event) => {
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

    function showingTime(isShown, type) {
        if (type === "add") {
            if (isShown){
                return(<>
                    <FormHelperText>Start</FormHelperText>
                    <DateTimePicker
                        value={recurring ? dayjs(newEvent.firstStart) : dayjs(newEvent.start)}
                        onChange={(e) => {
                            recurring ?
                                setNewEvent({...newEvent, firstStart: e.$d, firstEnd: newEvent.firstEnd < e.$d ? e.$d : newEvent.firstEnd})
                                : setNewEvent({...newEvent, start: e.$d, end: newEvent.end < e.$d ? e.$d : newEvent.end})
                        }}
                        slotProps={{textField: {fullWidth: true, size: 'small'}}}
                    />
                    <FormHelperText>End</FormHelperText>
                    <DateTimePicker
                        value={recurring ? dayjs(newEvent.firstEnd) : dayjs(newEvent.end)}
                        onChange={(e) => {
                            recurring ?
                                setNewEvent({...newEvent, firstEnd: e.$d, firstStart: e.$d < newEvent.firstStart ? e.$d : newEvent.firstStart})
                                : setNewEvent({...newEvent, end: e.$d, start: e.$d < newEvent.start ? e.$d : newEvent.start})
                        }}
                        slotProps={{textField: {fullWidth: true, size: 'small'}}}
                    />
                </>)
            } else {
                return(<>
                    <FormHelperText>Start</FormHelperText>
                    <DatePicker
                        value={recurring ? dayjs(newEvent.firstStart) : dayjs(newEvent.start)}
                        onChange={(e) => {
                            console.log('date changed');
                            recurring ?
                                setNewEvent({...newEvent, firstStart: e.$d, firstEnd: newEvent.firstEnd < e.$d ? e.$d : newEvent.firstEnd})
                                : setNewEvent({...newEvent, start: e.$d, end: newEvent.end < e.$d ? e.$d : newEvent.end})
                        }}
                        slotProps={{textField: {fullWidth: true, size: 'small'}}}
                    />
                    <FormHelperText>End</FormHelperText>
                    <DatePicker
                        value={recurring ? dayjs(newEvent.firstEnd) : dayjs(newEvent.end)}
                        onChange={(e) => {
                            recurring ?
                                setNewEvent({...newEvent, firstEnd: e.$d, firstStart: e.$d < newEvent.firstStart ? e.$d : newEvent.firstStart})
                                : setNewEvent({...newEvent, end: e.$d, start: e.$d < newEvent.start ? e.$d : newEvent.start})
                        }}
                        slotProps={{textField: {fullWidth: true, size: 'small'}}}
                    />
                </>)
            }
        } else {
            if (isShown) {
                return(<>
                    <FormHelperText>Start</FormHelperText>
                    <DateTimePicker value={recurring ? dayjs(modifiedEvent.firstStart) : dayjs(modifiedEvent.start)} placeholder={selectedEvent.start} onChange={(e) => {setModifiedEvent({...modifiedEvent, start: e.$d, end: modifiedEvent.end < e.$d ? e.$d : modifiedEvent.end})}} slotProps={{textField: {fullWidth: true, size: 'small'}}}/>
                    <FormHelperText>End</FormHelperText>
                    <DateTimePicker value={recurring ? dayjs(modifiedEvent.firstEnd) : dayjs(modifiedEvent.end)} placeholder={selectedEvent.end} onChange={(e) => {setModifiedEvent({...modifiedEvent, end: e.$d, start: e.$d < modifiedEvent.start ? e.$d : modifiedEvent.start})}} slotProps={{textField: {fullWidth: true, size: 'small'}}}/>
                </>)
            } else {
                return(<>
                    <FormHelperText>Start</FormHelperText>
                    <DatePicker value={recurring ? dayjs(modifiedEvent.firstStart) : dayjs(modifiedEvent.start)} placeholder={selectedEvent.start} onChange={(e) => {setModifiedEvent({...modifiedEvent, start: e.$d, end: modifiedEvent.end < e.$d ? e.$d : modifiedEvent.end})}} slotProps={{textField: {fullWidth: true, size: 'small'}}}/>
                    <FormHelperText>End</FormHelperText>
                    <DatePicker value={recurring ? dayjs(modifiedEvent.firstEnd) : dayjs(modifiedEvent.end)} placeholder={selectedEvent.end} onChange={(e) => {setModifiedEvent({...modifiedEvent, end: e.$d, start: e.$d < modifiedEvent.start ? e.$d : modifiedEvent.start})}} slotProps={{textField: {fullWidth: true, size: 'small'}}}/>
                </>)
            }
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
            <Button variant='contained' sx={{height: '40px', mt: '24px'}} label='Filter' onClick={() => setFilter(true)} endIcon={<FilterAlt/>}>Filter</Button>
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
                    events={allEvents}
                    startAccessor="start"
                    endAccessor="end"
                    style={{width: '100%', '--day': dayColour, '--off-range': offRangeColour, '--today': todayColour, '--text': textColour, '--header': headerColour}}
                    showMultiDayTimes
                    onSelectEvent={setSelectedEvent}
                    eventPropGetter={eventStyleGetter}
                    onRangeChange={onRangeChange}
                />
            </Paper>
            :
            <Paper elevation={3} style={{height: '100%', width: '100%', padding: '15px'}}>
                <BigCalendar
                    culture='en-gb'
                    localizer={dayjsLocalizer(dayjs)}
                    events={allEvents}
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
            <Dialog open={selectedEvent !== '' || createEvent} onClose={() => {setSelectedEvent(''); setCreateEvent(false); setModifyEvent(false);}}>
                <DialogContent>
                    <EventDisplay 
                        selectedEvent={selectedEvent} setSelectedEvent={setSelectedEvent}
                        modifiedEvent={modifiedEvent} modifyEvent={modifyEvent} setModifiedEvent={setModifiedEvent} setModifiedEventAnimals={setModifiedEventAnimals} setModifiedEventEnclosures={setModifiedEventEnclosures} setModifyEvent={setModifyEvent}
                        newEvent={newEvent} setNewEvent={setNewEvent} setAddEventAnimals={setAddEventAnimals} setAddEventEnclosures={setAddEventEnclosures}
                        handleAddEvent={handleAddEvent} handleDelEvent={handleDelEvent} handlePatchEvent={handlePatchEvent}
                        showingTime={showingTime} functionopenPopup={functionopenPopup} functionclosePopup={functionclosePopup}
                        openAnimalsPopup={openAnimalsPopup} openEnclosurePopup={openEnclosurePopup}
                        recurring={recurring} changeRecurring={changeRecurring} changeAllDay={changeAllDay}
                        farms={farms} device={device}
                    />
                </DialogContent>
            </Dialog>
            :
            <Paper elevation={3} style={{padding: '10px'}}>
                <EventDisplay 
                    selectedEvent={selectedEvent} setSelectedEvent={setSelectedEvent}
                    modifiedEvent={modifiedEvent} modifyEvent={modifyEvent} setModifiedEvent={setModifiedEvent} setModifiedEventAnimals={setModifiedEventAnimals} setModifiedEventEnclosures={setModifiedEventEnclosures} setModifyEvent={setModifyEvent}
                    newEvent={newEvent} setNewEvent={setNewEvent} setAddEventAnimals={setAddEventAnimals} setAddEventEnclosures={setAddEventEnclosures}
                    handleAddEvent={handleAddEvent} handleDelEvent={handleDelEvent} handlePatchEvent={handlePatchEvent}
                    showingTime={showingTime} functionopenPopup={functionopenPopup} functionclosePopup={functionclosePopup}
                    openAnimalsPopup={openAnimalsPopup} openEnclosurePopup={openEnclosurePopup}
                    recurring={recurring} changeRecurring={changeRecurring} changeAllDay={changeAllDay}
                    farms={farms} device={device}
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



