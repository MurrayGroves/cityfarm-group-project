import React, { useState, useEffect } from 'react';
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

import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';


interface EventCreatorProp {
    farms: any
    style: any
    cityfarm: CityFarm
    setEvent: (eventID: string) => void
    initialEvent?: Event | null
    modify?: boolean
    setModify?: (modify: boolean) => void
}

export const EventCreator: React.FC<EventCreatorProp> = ({ farms, style, cityfarm, setEvent, modify, setModify, initialEvent }) => {
    const [newEvent, setNewEvent] = useState<Event>(initialEvent ? initialEvent : new EventOnce({
        title: "",
        allDay: false,
        start: null,
        end: null,
        farms: [],
        animals: [],
        description: "",
        enclosures: []
    }))

    const [inputErr, setInputErr] = useState({ newTitle: true });
    const [recurring, setRecurring] = useState(initialEvent ? initialEvent instanceof EventRecurring : false);
    const [showErr, setShowErr] = useState(false);

    useEffect(() => {
        console.log("initialEvent", initialEvent);
        setNewEvent(initialEvent ? initialEvent : new EventOnce({
            title: "",
            allDay: false,
            start: null,
            end: null,
            farms: [],
            animals: [],
            description: "",
            enclosures: [],
        }))

        if (initialEvent) {
            setRecurring(initialEvent instanceof EventRecurring);
        }
    }, [modify, initialEvent])

    dayjs.extend(utc);
    dayjs.extend(timezone);

    const token = getConfig();

    useEffect(() => {
        setInputErr({ ...inputErr, newTitle: newEvent.title === '' });
        console.debug("Current New Event", newEvent);
    }, [newEvent]);

    const setAddEventEnclosures = (enclosures) => {
        let ev;
        if (newEvent instanceof EventRecurring) {
            ev = new EventRecurring({ ...newEvent, enclosures: enclosures })
        } else {
            ev = new EventOnce({ ...newEvent, enclosures: enclosures })
        }
        setNewEvent(ev)
    }
    const setAddEventAnimals = (animalList) => {
        let ev;
        if (newEvent instanceof EventRecurring) {
            ev = new EventRecurring({ ...newEvent, animals: animalList })
        } else {
            ev = new EventOnce({ ...newEvent, animals: animalList })
        }
        setNewEvent(ev)
    }

    const changeAllDay = (isAllDay) => {
        let ev;
        if (newEvent instanceof EventRecurring) {
            ev = new EventRecurring({ ...newEvent, allDay: isAllDay })
        } else {
            ev = new EventOnce({ ...newEvent, allDay: isAllDay })
        }
        setNewEvent(ev)
    }

    const toggleFarm = (farm: any) => {
        let ev;
        if (newEvent instanceof EventRecurring) {
            ev = new EventRecurring({ ...newEvent, farms: newEvent.farms.includes(farm) ? newEvent.farms.filter((f) => f !== farm) : newEvent.farms.concat(farm) })
        } else {
            ev = new EventOnce({ ...newEvent, farms: newEvent.farms.includes(farm) ? newEvent.farms.filter((f) => f !== farm) : newEvent.farms.concat(farm) })
        }
        setNewEvent(ev)
    }

    useEffect(() => {
        if (recurring && newEvent instanceof EventOnce) {
            setNewEvent(new EventRecurring({ ...newEvent, firstStart: newEvent.start, firstEnd: newEvent.end, finalEnd: new Date("2888-12-31T23:59:59.999Z"), delay: 'P1D' }));
        } else if (!recurring && newEvent instanceof EventRecurring) {
            setNewEvent(new EventOnce({ ...newEvent, start: newEvent.firstStart, end: newEvent.firstEnd }));
        }
    }, [recurring])

    const [openAnimalsPopup, setOpenAnimalsPopup] = useState(false)
    const [openEnclosurePopup, setOpenEnclosurePopup] = useState(false);


    const functionopenPopup = (type) => {
        if (type === "animals") { setOpenAnimalsPopup(true) } else { setOpenEnclosurePopup(true) }
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
            return { years: 0, months: 0, weeks: 0, days: 0 };
        }

        const periodString = period.replace('P', '');
        const yearIndex = periodString.indexOf('Y');
        const monthIndex = periodString.indexOf('M');
        const dayIndex = periodString.indexOf('D');

        const years = yearIndex !== -1 ? parseInt(periodString.substring(0, yearIndex)) : 0;
        const months = monthIndex !== -1 ? parseInt(periodString.substring(Math.max(yearIndex + 1, 0), monthIndex)) : 0;
        let days = dayIndex !== -1 ? parseInt(periodString.substring(Math.max(monthIndex + 1, yearIndex + 1, 0), dayIndex)) : 0;
        const weeks = Math.floor(days / 7);
        days = days % 7;

        console.debug(`Parsed ${period} as ${years} years, ${months} months, ${weeks} weeks, ${days} days`)
        return { years, months, weeks, days };
    }

    const [repeatDelay, setRepeatDelay] = useState<RepeatDelay>(initialEvent instanceof EventRecurring ? parsePeriod(initialEvent.delay) : { years: 0, months: 0, weeks: 0, days: 0 });

    useEffect(() => {
        if (!(newEvent instanceof EventRecurring)) return;

        let days = (repeatDelay.days ?? 0) + (repeatDelay.weeks ?? 0) * 7;
        let period = `P${repeatDelay.years ?? 0}Y${repeatDelay.months ?? 0}M${days}D`;
        let oldEvent = newEvent;
        oldEvent.delay = period;
        setNewEvent(oldEvent);
    }, [repeatDelay])



    const handleAddEvent = async () => {
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
        } catch (error) {
            if (error.response.status === 401) {
                window.location.href = "/login";
                return;
            } else {
                window.alert(error);
            }
        }

        setNewEvent(new EventOnce({
            title: "",
            allDay: true,
            start: null,
            end: null,
            farms: [],
            animals: [],
            description: "",
            enclosures: []
        }));
        setRecurring(false);
    }

    function showingTime(isShown) {
        const startHandler = (e) => {
            let dstring = "";
            try { dstring = (e ?? new Date()).toISOString() } catch (_) { dstring = (e ?? "").toString() };
            if (newEvent instanceof EventRecurring) {
                setNewEvent(new EventRecurring({ ...newEvent, firstStart: dstring }))
            } else if (newEvent instanceof EventOnce) {
                setNewEvent(new EventRecurring({ ...newEvent, start: dstring }))
            } else {
                throw new Error("Event is not of type EventOnce or EventRecurring")
            }
        }

        const endHandler = (e) => {
            let dstring = "";
            try { dstring = (e ?? new Date()).toISOString() } catch (_) { dstring = (e ?? "").toString() };
            if (newEvent instanceof EventRecurring) {
                setNewEvent(new EventRecurring({ ...newEvent, firstEnd: dstring }))
            } else if (newEvent instanceof EventOnce) {
                setNewEvent(new EventRecurring({ ...newEvent, end: dstring }))
            } else {
                throw new Error("Event is not of type EventOnce or EventRecurring")
            }
        }

        if (isShown) {
            return (<>
                <FormHelperText>Start</FormHelperText>
                <DateTimePicker
                    value={newEvent instanceof EventRecurring ? (newEvent.firstStart.getFullYear() === 1970 ? null : dayjs(newEvent.firstStart)) : ((newEvent as EventOnce).start.getFullYear() === 1970 ? null : dayjs((newEvent as EventOnce).start))}
                    onChange={startHandler}
                    slotProps={{ textField: { fullWidth: true, size: 'small' } }}
                    timezone="Europe/London"
                />
                <FormHelperText>End</FormHelperText>
                <DateTimePicker
                    value={newEvent instanceof EventRecurring ? (newEvent.firstEnd.getFullYear() !== 1970 ? dayjs(newEvent.firstEnd) : null) : ((newEvent as EventOnce).end.getFullYear() !== 1970 ? dayjs((newEvent as EventOnce).end) : null)}
                    onChange={endHandler}
                    slotProps={{ textField: { fullWidth: true, size: 'small' } }}
                    timezone="Europe/London"
                />
            </>)
        } else {
            console.debug("Value", newEvent instanceof EventRecurring ? "firstStart" : ((newEvent as EventOnce).start))
            return (<>
                <FormHelperText>Start</FormHelperText>
                <DatePicker
                    value={newEvent instanceof EventRecurring ? (newEvent.firstStart.getFullYear() === 1970 ? null : dayjs(newEvent.firstStart)) : ((newEvent as EventOnce).start.getFullYear() === 1970 ? null : dayjs((newEvent as EventOnce).start))}
                    onChange={startHandler}
                    slotProps={{ textField: { fullWidth: true, size: 'small' } }}
                    timezone="Europe/London"
                />
                <FormHelperText>End</FormHelperText>
                <DatePicker
                    value={newEvent instanceof EventRecurring ? (newEvent.firstEnd.getFullYear() !== 1970 ? dayjs(newEvent.firstEnd) : null) : ((newEvent as EventOnce).end.getFullYear() !== 1970 ? dayjs((newEvent as EventOnce).end) : null)}
                    onChange={endHandler}
                    slotProps={{ textField: { fullWidth: true, size: 'small' } }}
                    timezone="Europe/London"
                />
            </>)
        }
    }

    const handlePatchEvent = async() => {
        if (newEvent === null) {
            return;
        }

        let event: any = {...newEvent};
        event.animals = event.animals.map((animal) => animal.id);
        event.enclosures = event.enclosures.map((enclosure) => enclosure.id);
        console.log("patching event", newEvent);

        try {
            if (newEvent instanceof EventOnce) {
                await axios.patch(`/events/once/by_id/${newEvent.id}/update`, event, token);
            } else {
                await axios.patch(`/events/recurring/by_id/${newEvent.id}/update`, event, token);
            }
        } catch (error) {
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
        <div style={{ margin: '0', padding: '10px', ...style }}>
            <h2 className='boxTitle'>{!modify ? "Create New Event" : "Edit Event"}</h2>
            <div>
                <TextField
                    error={newEvent?.title === ''}
                    size='small'
                    fullWidth
                    placeholder="Add Title"
                    label='Title'
                    value={newEvent?.title ?? ""}
                    onChange={(e) => {
                        let ev;
                        if (newEvent instanceof EventRecurring) {
                            ev = new EventRecurring({ ...newEvent, title: e.target.value })
                        } else {
                            ev = new EventOnce({ ...newEvent, title: e.target.value })
                        }
                        setNewEvent(ev)
                    }}
                />
                {showingTime(!newEvent.allDay)}
            </div>

            <div className='smallMarginTop'>
                {
                    modify ? <ButtonGroup style={{ float: 'right' }}>
                        <Button variant='contained' color='warning' onClick={() => { setModify!(false) }}>Discard</Button>
                        <Button variant='contained' color='success' onClick={() => { handlePatchEvent() }}>Update</Button>
                    </ButtonGroup>
                        : <Button variant='contained' style={{ float: "right" }} onClick={() => handleAddEvent()} endIcon={<AddIcon />}>Create</Button>
                }
                <FormGroup>
                    <FormControlLabel control={<Checkbox checked={newEvent?.allDay ?? false} size='small' />} label="All Day" onChange={() => changeAllDay(!newEvent.allDay)} />
                </FormGroup>
            </div>
            <div className='smallMarginTop'>
                    <div style={{display: "flex", alignItems: 'center', width: '100%'}}>
                        <FormControlLabel style={{flex: '0.01', marginRight: '0', marginBottom: '20px'}} label="Repeat" control={<Checkbox checked={recurring ?? false} size='small'/>} onChange={() => setRecurring(!recurring)} />
                        <p style={{margin: '0 10px 20px 1%', marginBottom: '20px', flex: '0.5', visibility: recurring ? 'visible': 'hidden'}}>every</p>

                        <TextField type="number" onFocus={(e) => e.target.addEventListener("wheel", function (e) { e.preventDefault() }, { passive: false })}
                            helperText="Years" style={{ flex: '1', visibility: recurring ? 'visible' : 'hidden', marginRight: '1%' }}
                            onChange={(e) => setRepeatDelay({ ...repeatDelay, years: parseInt(e.target.value) })} value={repeatDelay.years ?? undefined}
                            inputProps={{
                                style: {
                                    padding: 5,
                                }
                            }}
                            size='small'
                        />
                        <TextField type="number" onFocus={(e) => e.target.addEventListener("wheel", function (e) { e.preventDefault() }, { passive: false })}
                            helperText="Months" style={{ flex: '1', visibility: recurring ? 'visible' : 'hidden', marginRight: '1%' }}
                            onChange={(e) => setRepeatDelay({ ...repeatDelay, months: parseInt(e.target.value) })} value={repeatDelay.months ?? undefined}
                            inputProps={{
                                style: {
                                    padding: 5
                                }
                            }}
                            size='small'
                        />
                        <TextField type="number" onFocus={(e) => e.target.addEventListener("wheel", function (e) { e.preventDefault() }, { passive: false })}
                            helperText="Weeks" style={{ flex: '1', visibility: recurring ? 'visible' : 'hidden', marginRight: '1%' }}
                            onChange={(e) => setRepeatDelay({ ...repeatDelay, weeks: parseInt(e.target.value) })} value={repeatDelay.weeks ?? undefined}
                            inputProps={{
                                style: {
                                    padding: 5
                                }
                            }}
                            size='small'
                        />
                        <TextField type="number" onFocus={(e) => e.target.addEventListener("wheel", function (e) { e.preventDefault() }, { passive: false })}
                            helperText="Days" style={{ flex: '1', visibility: recurring ? 'visible' : 'hidden' }}
                            onChange={(e) => setRepeatDelay({ ...repeatDelay, days: parseInt(e.target.value) })} value={repeatDelay.days ?? undefined}
                            inputProps={{
                                style: {
                                    padding: 5
                                }
                            }}
                            size='small'
                        />
                    </div>
            </div>
            <div className='smallMarginTop'>
                <h3>Farms</h3>
                <FormGroup>
                    <FormControlLabel control={<Checkbox color={farms.WH} checked={(newEvent?.farms ?? []).includes(farms.WH)} size='small' />} label="Windmill Hill" onChange={() => toggleFarm(farms.WH)} />
                    <FormControlLabel control={<Checkbox color={farms.HC} checked={(newEvent?.farms ?? []).includes(farms.HC)} size='small' />} label="Hartcliffe" onChange={() => toggleFarm(farms.HC)} />
                    <FormControlLabel control={<Checkbox color={farms.SW} checked={(newEvent?.farms ?? []).includes(farms.SW)} size='small' />} label="St Werburghs" onChange={() => toggleFarm(farms.SW)} />
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
                    onChange={(e) => {
                        let ev;
                        if (newEvent instanceof EventRecurring) {
                            ev = new EventRecurring({ ...newEvent, description: e.target.value })
                        } else {
                            ev = new EventOnce({ ...newEvent, description: e.target.value })
                        }
                        setNewEvent(ev)
                    }}
                />
            </div>
            <div>
                <span style={{ display: 'flex' }}><h3>Animals</h3><IconButton style={{ height: '40px', margin: '12px 0 0 5px' }} onClick={() => { functionopenPopup("animals") }}><AddIcon color='primary' /></IconButton></span>
                {/* idea: make this open the animal table page with a new column of checkboxes. Click on an associate animal(s) button would then pass a list of animal id to the calendar to the new event state. This could be re used in the modification of events.  */}
                {(newEvent?.animals ?? []).map((animal) => {
                    return (
                        <AnimalPopover key={animal.id} cityfarm={cityfarm} animalID={animal.id} />
                    )
                })}
                <div id="AssociateAnimal" style={{ textAlign: 'center' }}>
                    <Dialog fullWidth maxWidth='md' open={openAnimalsPopup} onClose={functionclosePopup}>
                        <DialogTitle>Add Animal</DialogTitle>
                        <DialogContent>
                            <AssociateAnimal setAnimals={setAddEventAnimals} cityfarm={cityfarm} animals={newEvent.animals} close={functionclosePopup}></AssociateAnimal>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>
            <div>
                <span style={{ display: 'flex' }}><h3>Enclosures</h3><IconButton style={{ height: '40px', margin: '12.5px 0 0 5px' }} onClick={() => { functionopenPopup("enclosures") }}><AddIcon color='primary' /></IconButton></span>
                {(newEvent?.enclosures ?? []).map((enclosure, index) => (
                    <EnclosurePopover cityfarm={cityfarm} key={index} enclosureID={enclosure.id} />
                ))}{/*Add a way to remove enclosures from events */}
                {/* idea: make this open the enlcosure  page with a new column of checkboxes. Click on an associate enlcosure(s) button would then pass a list of enclosure names to the calendar to be placed in a field*/}
                <div id="AssociateEnclosure" style={{ textAlign: 'center' }}>
                    <Dialog fullWidth maxWidth='md' open={openEnclosurePopup} onClose={functionclosePopup}>
                        <DialogTitle>Add Enclosure</DialogTitle>
                        <DialogContent>
                            <AssociateEnclosure enclosures={newEvent.enclosures} cityfarm={cityfarm} setEnclosures={setAddEventEnclosures} close={functionclosePopup}></AssociateEnclosure>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>
            <Backdrop style={{ zIndex: '1301', background: '#000000AA' }} open={showErr} onClick={() => setShowErr(false)}>
                <Alert severity='warning'>
                    Please ensure event title is not empty
                </Alert>
            </Backdrop>
        </div>
    )
}
