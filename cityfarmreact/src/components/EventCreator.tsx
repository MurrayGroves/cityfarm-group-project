import {Calendar as BigCalendar, dayjsLocalizer} from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import React, {useState, useEffect, useCallback, ChangeEvent} from 'react';
import dayjs from 'dayjs';
import "../pages/Calendar.css";
import "./EventCreator.css";

import Event from "./Event.jsx";
import AnimalPopover from "./AnimalPopover.jsx";
import Close from '@mui/icons-material/Close';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import {  DialogActions, DialogContent, DialogContentText, DialogTitle, ToggleButton, ToggleButtonGroup, createTheme } from "@mui/material";
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
import { Theme, ThemeProvider } from '@emotion/react';

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

    interface RepeatDelay {
        years: number | null,
        months: number | null,
        weeks: number | null,
        days: number | null,
    }

    const [repeatDelay, setRepeatDelay] = useState<RepeatDelay>({years: 0, months: 0, weeks: 0, days: 0});

    useEffect(() => {
        let days = (repeatDelay.days ?? 0) + (repeatDelay.weeks ?? 0) * 7;
        let period = `P${repeatDelay.years ?? 0}Y${repeatDelay.months ?? 0}M${days}D`;
        let oldEvent = newEvent;
        oldEvent.delay = period;
        setNewEvent(oldEvent);
    }, [repeatDelay])



    const handleAddEvent = async() => {
        if (Object.values(inputErr).filter((err) => err === true).length > 0) {
            return setShowErr(true);
        }

        try {
            const response = recurring ? await axios.post(`/events/create/recurring`, newEvent, token)
                      : await axios.post(`/events/create/once`, newEvent, token)

            setEvent(response.data._id);
            // Update internal events cache
            await cityfarm.getEvents(false);
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

    const textFieldTheme = () => createTheme({
        components: {
            MuiFormHelperText: {
                styleOverrides: {
                    root: {
                        marginLeft: '5%',
                    }
                }
            },
        }
    })

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
                <Button variant='contained' style={{float: "right"}} onClick={()=>handleAddEvent()} endIcon={<AddIcon/>}>Create</Button>
                <FormGroup>
                    <FormControlLabel control={<Checkbox checked={newEvent.allDay} size='small'/>} label="All Day" onChange={() => changeAllDay(!newEvent.allDay)}/>
                </FormGroup>
            </div>
            <div className='smallMarginTop'>
                <ThemeProvider theme={textFieldTheme()}>
                    <div style={{display: "flex", alignItems: 'center', width: '100%'}}>
                        <FormControlLabel style={{flex: '0.01', marginRight: '0'}} label="Repeats" control={<Checkbox checked={recurring} size='small'/>} onChange={() => changeRecurring(!recurring)} />
                        <p style={{margin: '1%', flex: '0.5', visibility: recurring ? 'visible': 'hidden'}}>every</p>

                        <TextField type="number" onFocus={(e) => e.target.addEventListener("wheel", function (e) { e.preventDefault() }, { passive: false })}
                            helperText="Years" style={{flex: '1', visibility: recurring ? 'visible': 'hidden', marginRight:'1%'}}
                            onChange={(e) => setRepeatDelay({...repeatDelay, years: parseInt(e.target.value)})} value={repeatDelay.years?? undefined}
                            inputProps={{
                                style: {
                                padding: 5,
                                }
                            }}
                            size='small'
                        />
                        <TextField type="number" onFocus={(e) => e.target.addEventListener("wheel", function (e) { e.preventDefault() }, { passive: false })}
                            helperText="Months" style={{flex: '1', visibility: recurring ? 'visible': 'hidden', marginRight:'1%'}}
                            onChange={(e) => setRepeatDelay({...repeatDelay, months: parseInt(e.target.value)})} value={repeatDelay.months?? undefined}
                            inputProps={{
                                style: {
                                padding: 5
                                }
                            }}
                            size='small'
                        />
                        <TextField type="number" onFocus={(e) => e.target.addEventListener("wheel", function (e) { e.preventDefault() }, { passive: false })}
                            helperText="Weeks" style={{flex: '1', visibility: recurring ? 'visible': 'hidden', marginRight:'1%'}}
                            onChange={(e) => setRepeatDelay({...repeatDelay, weeks: parseInt(e.target.value)})} value={repeatDelay.weeks?? undefined}
                            inputProps={{
                                style: {
                                padding: 5
                                }
                            }}
                            size='small'
                        />
                        <TextField type="number" onFocus={(e) => e.target.addEventListener("wheel", function (e) { e.preventDefault() }, { passive: false })}
                            helperText="Days" style={{flex: '1', visibility: recurring ? 'visible': 'hidden'}}
                            onChange={(e) => setRepeatDelay({...repeatDelay, days: parseInt(e.target.value)})} value={repeatDelay.days?? undefined}
                            inputProps={{
                                style: {
                                padding: 5
                                }
                            }}
                            size='small'
                        />
                    </div>
                </ThemeProvider>
            </div>
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
            <div>
                <span style={{display: 'flex'}}><h3>Animals</h3><IconButton style={{height: '40px', margin: '12px 0 0 5px'}} onClick={() => {functionopenPopup("animals")}}><AddIcon color='primary'/></IconButton></span>
                {/* idea: make this open the animal table page with a new column of checkboxes. Click on an associate animal(s) button would then pass a list of animal id to the calendar to the new event state. This could be re used in the modification of events.  */}
                {newEvent.animals.map((animalID) => (
                    <AnimalPopover key={animalID} animalID={animalID} />
                ))}
                <div id="AssociateAnimal" style={{textAlign:'center'}}>
                    <Dialog fullWidth maxWidth='md' open={openAnimalsPopup} onClose={functionclosePopup}>
                        <DialogTitle>Add Animal</DialogTitle>
                        <DialogContent>
                            <AssociateAnimal setAnimals={setAddEventAnimals} animals={newEvent.animals} close={functionclosePopup}></AssociateAnimal>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>
            <div>
                <span style={{display: 'flex'}}><h3>Enclosures</h3><IconButton style={{height: '40px', margin: '12.5px 0 0 5px'}} onClick={() => {functionopenPopup("enclosures")}}><AddIcon color='primary'/></IconButton></span>
                {newEvent.enclosures.map((enclosureName, index) => (
                    <p key={index}>{enclosureName}</p>
                ))}{/*Add a way to remove enclosures from events */}
                {/* idea: make this open the enlcosure  page with a new column of checkboxes. Click on an associate enlcosure(s) button would then pass a list of enclosure names to the calendar to be placed in a field*/}
                <div id="AssociateEnclosure" style={{textAlign:'center'}}>
                    <Dialog fullWidth maxWidth='md' open={openEnclosurePopup} onClose={functionclosePopup}>
                        <DialogTitle>Add Enclosure</DialogTitle>
                        <DialogContent>
                            <AssociateEnclosure enclosures={newEvent.enclosures} setEnclosures={setAddEventEnclosures} close={functionclosePopup}></AssociateEnclosure>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>
        </div>
    )
}
