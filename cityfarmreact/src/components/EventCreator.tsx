import {Calendar as BigCalendar, dayjsLocalizer} from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import React, {useState, useEffect, useCallback, ChangeEvent} from 'react';
import dayjs from 'dayjs';
import "../pages/Calendar.css";
import Event from "./Event.jsx";
import AnimalPopover from "./AnimalPopover.jsx";
import Close from '@mui/icons-material/Close';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import {  DialogActions, DialogContent, DialogContentText, DialogTitle, ToggleButton, ToggleButtonGroup } from "@mui/material";
import { IconButton, Button, ButtonGroup, Checkbox, FormControlLabel, FormGroup, useTheme, Dialog, FormHelperText, Backdrop, Alert } from '@mui/material';
import AlertTitle from '@mui/material/AlertTitle';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import Delete from '@mui/icons-material/Delete';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import AssociateAnimal from './AssociateAnimal.jsx';
import axios from '../api/axiosConfig.js'
import AssociateEnclosure from './AssociateEnclosure.jsx';
import { getConfig } from '../api/getToken.js';
import { CityFarm } from '../api/cityfarm.ts';

export const EventCreator = ({farms, style, cityfarm, setEvent}: {farms: any, style: any, cityfarm: CityFarm, setEvent: (eventID: string) => void}) => {
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

    const [allEvents,setAllEvents] = useState([]);
    const [selectedEvent,setSelectedEvent] = useState("");
    const [visibleFarms, setVisibleFarms] = useState([farms.WH, farms.HC, farms.SW]);
    const [modifyEvent, setModifyEvent] = useState(false);
    const [showErr, setShowErr] = useState(false);
    const [inputErr, setInputErr] = useState({newTitle: true});
    const [recurring, setRecurring] = useState(false);

    const token = getConfig();

    useEffect(() => {
        setInputErr({...inputErr, newTitle: newEvent.title === ''});
        console.log(newEvent);
    }, [newEvent]);

    const setAddEventEnclosures = (enclosures) => {
        setNewEvent({...newEvent, enclosures: enclosures})
    }
    const setAddEventAnimals = (animalList) => {
        setNewEvent({...newEvent, animals: animalList})
    }
    
    const changeAllDay = (isAllDay) => {
        setNewEvent({...newEvent, allDay: isAllDay})
    }

    const changeRecurring = (isRecurring) => {
        setRecurring(isRecurring);
    }

    useEffect(() => {
        recurring ?
            setNewEvent({...newEvent, firstStart: newEvent.start, firstEnd: newEvent.end, delay: 'P1D', finalEnd: null, start: null, end: null})
            : newEvent.firstStart && setNewEvent({...newEvent, end: newEvent.firstEnd, start: newEvent.firstStart, firstStart: null, firstEnd: null, delay: null, finalEnd: null})
    }, [recurring])

    const [openAnimalsPopup, setOpenAnimalsPopup] = useState(false)
    const [openEnclosurePopup, setOpenEnclosurePopup] = useState(false);


    const functionopenPopup = (type) => { 
        if (type === "animals") {setOpenAnimalsPopup(true)} else {setOpenEnclosurePopup(true)}
    }
    const functionclosePopup = () => {
        setOpenAnimalsPopup(false)
        setOpenEnclosurePopup(false)
    }


    const handleAddEvent = async() => {
        if (Object.values(inputErr).filter((err) => err === true).length > 0) {
            return setShowErr(true);
        }

        try {
            const response = recurring ? await axios.post(`/events/create/recurring`, newEvent, token)
                      : await axios.post(`/events/create/once`, newEvent, token)

            setEvent(response.data._id);
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
    }

    function showingTime(isShown) {
        if (isShown){
            return(<>
                <FormHelperText>Start</FormHelperText>
                <DateTimePicker
                    value={recurring ? dayjs(newEvent.firstStart) : dayjs(newEvent.start)}
                    onChange={(e) => {
                        const dstring = e?.toISOString() ?? "0";
                        return recurring ?
                            setNewEvent({...newEvent, firstStart: dstring, firstEnd: newEvent.firstEnd < dstring ? dstring : newEvent.firstEnd})
                            : setNewEvent({...newEvent, start: dstring ?? newEvent.start, end: newEvent.end < dstring ?? newEvent.end ? dstring : newEvent.end})
                    }}
                    slotProps={{textField: {fullWidth: true, size: 'small'}}}
                />
                <FormHelperText>End</FormHelperText>
                <DateTimePicker
                    value={recurring ? dayjs(newEvent.firstEnd) : dayjs(newEvent.end)}
                    onChange={(e) => {
                        const dstring = e?.toISOString() ?? "0";
                        recurring ?
                            setNewEvent({...newEvent, firstEnd: dstring, firstStart: dstring < newEvent.firstStart ? dstring : newEvent.firstStart})
                            : setNewEvent({...newEvent, end: dstring, start: dstring < newEvent.start ? dstring : newEvent.start})
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
                        const dstring = e?.toISOString() ?? "0";
                        recurring ?
                            setNewEvent({...newEvent, firstStart: dstring, firstEnd: newEvent.firstEnd < dstring ? dstring : newEvent.firstEnd})
                            : setNewEvent({...newEvent, start: dstring, end: newEvent.end < dstring ? dstring : newEvent.end})
                    }}
                    slotProps={{textField: {fullWidth: true, size: 'small'}}}
                />
                <FormHelperText>End</FormHelperText>
                <DatePicker
                    value={recurring ? dayjs(newEvent.firstEnd) : dayjs(newEvent.end)}
                    onChange={(e) => {
                        const dstring = e?.toISOString() ?? "0";
                        recurring ?
                            setNewEvent({...newEvent, firstEnd: dstring, firstStart: dstring < newEvent.firstStart ? dstring : newEvent.firstStart})
                            : setNewEvent({...newEvent, end: dstring, start: dstring < newEvent.start ? dstring : newEvent.start})
                    }}
                    slotProps={{textField: {fullWidth: true, size: 'small'}}}
                />
            </>)
        }
    }

    return (
        <div style={{width: '400px', margin: '0 0 20px 0', padding: '10px', ...style}}>
            <h2 className='boxTitle'>Create New Event</h2>
            <div>
                <TextField
                    error={newEvent.title === ''}
                    size='small'
                    fullWidth
                    placeholder="Add Title"
                    label='Title'
                    value={newEvent.title}
                    onChange={(e)=>setNewEvent({...newEvent, title: e.target.value})}
                />
                {showingTime(!newEvent.allDay)}
            </div>

            <div className='smallMarginTop'>
                <FormControlLabel control={<Checkbox defaultChecked size='small'/>} label="All Day" onChange={() => changeAllDay(!newEvent.allDay)}/>
                <FormControlLabel control={<Checkbox size='small'/>} label="Recurring" onChange={() => changeRecurring(!recurring)} />
                <Button variant='contained' style={{float: "right"}} onClick={()=>handleAddEvent()} endIcon={<AddIcon/>}>Create</Button>
            </div>
            {recurring && (
            <div className='smallMarginTop'>
                <ToggleButtonGroup
                    fullWidth
                    orientation='horizontal'
                    value={newEvent.delay}
                    exclusive
                    onChange={(e) => setNewEvent({...newEvent, delay: (e.target as HTMLInputElement).value})}
                >
                    <ToggleButton value='P1D'>Daily</ToggleButton>
                    <ToggleButton value='P7D'>Weekly</ToggleButton>
                    <ToggleButton value='P28D'>Monthly</ToggleButton>
                    <ToggleButton value='P265D'>Yearly</ToggleButton>
                </ToggleButtonGroup>
            </div>)}
            <div className='smallMarginTop'>
                <h3>Farms</h3>
                <FormGroup>
                    <FormControlLabel control={<Checkbox color={farms.WH} size='small'/>} label="Windmill Hill" onChange={() => setNewEvent({...newEvent, farms: newEvent.farms.includes(farms.WH) ? newEvent.farms.filter((farm) => farm !== farms.WH) : newEvent.farms.concat(farms.WH)})}/>
                    <FormControlLabel control={<Checkbox color={farms.HC} size='small'/>} label="Hartcliffe" onChange={()=>setNewEvent({...newEvent, farms: newEvent.farms.includes(farms.HC) ? newEvent.farms.filter((farm) => farm !== farms.HC) : newEvent.farms.concat(farms.HC)})}/>
                    <FormControlLabel control={<Checkbox color={farms.SW} size='small'/>} label="St Werburghs" onChange={()=>setNewEvent({...newEvent, farms: newEvent.farms.includes(farms.SW) ? newEvent.farms.filter((farm) => farm !== farms.SW) : newEvent.farms.concat(farms.SW)})}/>
                </FormGroup>
            </div>
            <div>
                <h3>Description</h3>
                <TextField
                    fullWidth
                    size='small'
                    multiline
                    rows={3}
                    placeholder='Enter Description'
                    value={newEvent.description}
                    onChange={(e) => {setNewEvent({...newEvent, description: e.target.value})}}
                />
            </div>
        </div>
    )
}
