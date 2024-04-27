import React, { useState, useEffect } from 'react';
import dayjs from 'dayjs';
import AnimalPopover from "./AnimalPopover.tsx";
import "./EventCreator.css";
import TextField from '@mui/material/TextField';
import { DialogContent, DialogTitle, createTheme } from "@mui/material";
import { IconButton, Button, ButtonGroup, Checkbox, FormControlLabel, FormGroup, useTheme, Dialog, FormHelperText, Backdrop, Alert } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import AssociateAnimal from './AssociateAnimal.tsx';
import axios from '../api/axiosConfig.js'
import AssociateEnclosure from './AssociateEnclosure.tsx';
import { getConfig } from '../api/getToken.js';
import { CityFarm } from '../api/cityfarm.ts';
import { ThemeProvider } from '@emotion/react';
import { Event, EventOnce, EventRecurring } from '../api/events.ts';
import EnclosurePopover from './EnclosurePopover.tsx';

interface EventCreatorProp {
    farms: any
    style: any
    cityfarm: CityFarm
    setEvent: (eventID: string) => void
    initialEvent?: Event | null
    modify?: boolean
    setModify?: (modify: boolean) => void
}

export const EventCreator: React.FC<EventCreatorProp> = ({farms, style, cityfarm, setEvent, modify, setModify, initialEvent}) => {
    const [newEvent,setNewEvent] = useState<Event>(initialEvent ? initialEvent : new EventOnce({
        title: "",
        allDay: true,
        start: new Date(),
        end: new Date(),
        farms: [],
        animals: [],
        description: "",
        enclosures: []
    }))

    const [inputErr, setInputErr] = useState({newTitle: true});
    const [recurring, setRecurring] = useState(initialEvent ? initialEvent instanceof EventRecurring : false);
    const [showErr, setShowErr] = useState(false);

    useEffect(() => {
        console.log("initialEvent", initialEvent);
        setNewEvent(initialEvent ? initialEvent: new EventOnce({
            title: "",
            allDay: true,
            start: new Date(),
            end: new Date(),
            farms: [],
            animals: [],
            description: "",
            enclosures: []
        }))
    }, [modify, initialEvent])

    const token = getConfig();

    useEffect(() => {
        setInputErr({...inputErr, newTitle: newEvent.title === ''});
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
        if (recurring && newEvent instanceof EventOnce) {
            setNewEvent(new EventRecurring({...newEvent, firstStart: newEvent.start, firstEnd: newEvent.end, finalEnd: null, delay: 'P1D'}));
        } else if (!recurring && newEvent instanceof EventRecurring) {
            setNewEvent(new EventOnce({...newEvent, start: newEvent.firstStart, end: newEvent.firstEnd}));
        }
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

    function parsePeriod(period: string): RepeatDelay {
        if (!period) {
            return {years: 0, months: 0, weeks: 0, days: 0};
        }

        const periodString = period.replace('P', '');
        const yearIndex = periodString.indexOf('Y');
        const monthIndex = periodString.indexOf('M');
        const dayIndex = periodString.indexOf('D');

        const years = yearIndex !== -1 ? parseInt(periodString.substring(0, yearIndex)) : 0;
        const months = monthIndex !== -1 ? parseInt(periodString.substring(Math.max(yearIndex+1, 0), monthIndex)) : 0;
        let days = dayIndex !== -1 ? parseInt(periodString.substring(Math.max(monthIndex+1, yearIndex+1, 0), dayIndex)) : 0;
        const weeks = Math.floor(days / 7);
        days = days % 7;

        console.log(`Parsed ${period} as ${years} years, ${months} months, ${weeks} weeks, ${days} days`)
        return {years, months, weeks, days};
    }

    const [repeatDelay, setRepeatDelay] = useState<RepeatDelay>(initialEvent instanceof EventRecurring ? parsePeriod(initialEvent.delay) : {years: 0, months: 0, weeks: 0, days: 0});

    useEffect(() => {
        if (!(newEvent instanceof EventRecurring)) return;

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

        console.log("new", newEvent);

        try {
            const response = recurring ? await axios.post(`/events/create/recurring`, {...newEvent as EventRecurring, animals: newEvent.animals.map(animal => animal.id), enclosures: newEvent.enclosures.map(enclosure => enclosure.id)}, token)
                      : await axios.post(`/events/create/once`, {...newEvent as EventOnce, animals: newEvent.animals.map(animal => animal.id), enclosures: newEvent.enclosures.map(enclosure => enclosure.id)}, token)

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
        
        setNewEvent(new Event({
            title: "",
            allDay: true,
            start: new Date(),
            end: new Date(),
            farms: [],
            animals: [],
            description: "",
            enclosures: []
        }));
    }

    function showingTime(isShown) {
        if (isShown){
            return(<>
                <FormHelperText>Start</FormHelperText>
                <DateTimePicker
                    value={newEvent instanceof EventRecurring ? dayjs(newEvent.firstStart) : dayjs((newEvent as EventOnce).start)}
                    onChange={(e) => {
                        let dstring = "";
                        try {dstring = (e ?? new Date()).toISOString()} catch (_) {dstring = (e ?? "").toString()};
                        return newEvent instanceof EventRecurring ?
                            setNewEvent(new EventRecurring({...newEvent, firstStart: dstring, firstEnd: newEvent.firstEnd < new Date(dstring) ? dstring : newEvent.firstEnd}))
                            : setNewEvent(new EventOnce({...newEvent, start: dstring ?? (newEvent as EventOnce).start, end: (newEvent as EventOnce).end < new Date(dstring) ?? (newEvent as EventOnce).end ? dstring : (newEvent as EventOnce).end}))
                    }}
                    slotProps={{textField: {fullWidth: true, size: 'small'}}}
                />
                <FormHelperText>End</FormHelperText>
                <DateTimePicker
                    value={newEvent instanceof EventRecurring ? dayjs(newEvent.firstEnd) : dayjs((newEvent as EventOnce).end)}
                    onChange={(e) => {
                        let dstring = "";
                        try {dstring = (e ?? new Date()).toISOString()} catch (_) {dstring = (e ?? "").toString()};
                        newEvent instanceof EventRecurring ?
                            setNewEvent(new EventRecurring({...newEvent, firstEnd: dstring, firstStart: new Date(dstring) < newEvent.firstStart ? dstring : newEvent.firstStart}))
                            : setNewEvent(new EventOnce({...newEvent, end: dstring, start: new Date(dstring) < (newEvent as EventOnce).start ? dstring : (newEvent as EventOnce).start}))
                    }}
                    slotProps={{textField: {fullWidth: true, size: 'small'}}}
                />
            </>)
        } else {
            return(<>  
                <FormHelperText>Start</FormHelperText>
                <DatePicker
                    value={newEvent instanceof EventRecurring ? dayjs(newEvent.firstStart) : dayjs((newEvent as EventOnce).start)}
                    onChange={(e) => {
                        console.log('date changed');
                        let dstring = "";
                        try {dstring = (e ?? new Date()).toISOString()} catch (_) {dstring = (e ?? "").toString()};
                        newEvent instanceof EventRecurring ?
                            setNewEvent(new EventRecurring({...newEvent, firstStart: dstring, firstEnd: newEvent.firstEnd < new Date(dstring) ? dstring : newEvent.firstEnd}))
                            : setNewEvent(new EventOnce({...newEvent, start: dstring, end: (newEvent as EventOnce).end < new Date(dstring) ? dstring : (newEvent as EventOnce).end}))
                    }}
                    slotProps={{textField: {fullWidth: true, size: 'small'}}}
                />
                <FormHelperText>End</FormHelperText>
                <DatePicker
                    value={newEvent instanceof EventRecurring ? dayjs(newEvent.firstEnd) : dayjs((newEvent as EventOnce).end)}
                    onChange={(e) => {
                        let dstring = "";
                        try {dstring = (e ?? new Date()).toISOString()} catch (_) {dstring = (e ?? "").toString()};
                        newEvent instanceof EventRecurring ?
                            setNewEvent(new EventRecurring({...newEvent, firstEnd: dstring, firstStart: new Date(dstring) < newEvent.firstStart ? dstring : newEvent.firstStart}))
                            : setNewEvent(new EventOnce({...newEvent, end: dstring, start: new Date(dstring) < (newEvent as EventOnce).start ? dstring : (newEvent as EventOnce).start}))
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

    const handlePatchEvent = async() => {
        if (newEvent === null) {
            return;
        }

        try {
            if (newEvent instanceof EventOnce) {
                await axios.patch(`/events/once/by_id/${newEvent.id}/update`, newEvent, token);
            } else {
                await axios.patch(`/events/recurring/by_id/${newEvent.id}/update`, newEvent, token);
            }
        } catch(error) {
            if (error.response.status === 401) {
                window.location.href = "/login";
                return;
            } else {
                window.alert(error);
            }
        }
        cityfarm.getEvents(false);
        setEvent(newEvent.id);
        setModify!(false);
    }

    return (
        <div style={{margin: '0', padding: '10px', ...style}}>
            <h2 className='boxTitle'>{!modify ? "Create New Event" : "Edit Event"}</h2>
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
                {
                    modify ?    <ButtonGroup style={{float: 'right'}}>
                                    <Button variant='contained' color='warning' onClick={()=>{setModify!(false)}}>Discard</Button>
                                    <Button variant='contained' color='success' onClick={()=>{handlePatchEvent()}}>Update</Button>
                                </ButtonGroup>
                            :   <Button variant='contained' style={{float: "right"}} onClick={()=>handleAddEvent()} endIcon={<AddIcon/>}>Create</Button>
                }
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
                    <FormControlLabel control={<Checkbox color={farms.WH} checked={newEvent.farms.includes(farms.WH)} size='small'/>} label="Windmill Hill" onChange={() => setNewEvent({...newEvent, farms: newEvent.farms.includes(farms.WH) ? newEvent.farms.filter((farm) => farm !== farms.WH) : newEvent.farms.concat(farms.WH)})}/>
                    <FormControlLabel control={<Checkbox color={farms.HC} checked={newEvent.farms.includes(farms.HC)} size='small'/>} label="Hartcliffe" onChange={()=>setNewEvent({...newEvent, farms: newEvent.farms.includes(farms.HC) ? newEvent.farms.filter((farm) => farm !== farms.HC) : newEvent.farms.concat(farms.HC)})}/>
                    <FormControlLabel control={<Checkbox color={farms.SW} checked={newEvent.farms.includes(farms.SW)} size='small'/>} label="St Werburghs" onChange={()=>setNewEvent({...newEvent, farms: newEvent.farms.includes(farms.SW) ? newEvent.farms.filter((farm) => farm !== farms.SW) : newEvent.farms.concat(farms.SW)})}/>
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
                {newEvent.animals.map((animal) => {
                    return (
                        <AnimalPopover key={animal.id} cityfarm={cityfarm} animalID={animal.id} />
                    )
                })}
                <div id="AssociateAnimal" style={{textAlign:'center'}}>
                    <Dialog fullWidth maxWidth='md' open={openAnimalsPopup} onClose={functionclosePopup}>
                        <DialogTitle>Add Animal</DialogTitle>
                        <DialogContent>
                            <AssociateAnimal setAnimals={setAddEventAnimals} cityfarm={cityfarm} animals={newEvent.animals} close={functionclosePopup}></AssociateAnimal>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>
            <div>
                <span style={{display: 'flex'}}><h3>Enclosures</h3><IconButton style={{height: '40px', margin: '12.5px 0 0 5px'}} onClick={() => {functionopenPopup("enclosures")}}><AddIcon color='primary'/></IconButton></span>
                {newEvent.enclosures.map((enclosure, index) => (
                    <EnclosurePopover key={index} cityfarm={cityfarm} enclosureID={enclosure.id}/>
                ))}{/*Add a way to remove enclosures from events */}
                {/* idea: make this open the enlcosure  page with a new column of checkboxes. Click on an associate enlcosure(s) button would then pass a list of enclosure names to the calendar to be placed in a field*/}
                <div id="AssociateEnclosure" style={{textAlign:'center'}}>
                    <Dialog fullWidth maxWidth='md' open={openEnclosurePopup} onClose={functionclosePopup}>
                        <DialogTitle>Add Enclosure</DialogTitle>
                        <DialogContent>
                            <AssociateEnclosure enclosures={newEvent.enclosures} cityfarm={cityfarm} setEnclosures={setAddEventEnclosures} close={functionclosePopup}></AssociateEnclosure>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>
            <Backdrop style={{zIndex: '1301', background: '#000000AA'}} open={showErr} onClick={() => setShowErr(false)}>
            <Alert severity='warning'>
                Please ensure event title is not empty
            </Alert>
            </Backdrop>
        </div>
    )
}
