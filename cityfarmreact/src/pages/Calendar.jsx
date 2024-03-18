import {Calendar as BigCalendar, dayjsLocalizer} from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import React, {useState, useEffect, useCallback} from 'react';
import dayjs from 'dayjs';
import "./Calendar.css";
import Event from "../components/Event";
import CreateEvent from "../components/CreateEvent";
import AnimalPopover from "../components/AnimalPopover";
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
import AssociateAnimal from '../components/AssociateAnimal';
import axios from '../api/axiosConfig'
import AssociateEnclosure from '../components/AssociateEnclosure';

import { getConfig } from '../api/getToken';

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

const Calendar = ({farms}) => {
  
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
        console.log(newEvent);
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
  
    const [openEnclosurePopup, setOpenEnclosurePopup] = useState(false);

    let dayColour = theme.mode === 'dark' ? '#121212': '#fff'
    let offRangeColour = theme.mode === 'dark' ? '#ffffff08' : '#f0f0f0';
    let todayColour = theme.mode === 'dark' ? theme.primary.veryDark : theme.primary.light;
    let textColour = theme.mode === 'dark' ? 'white' : 'black';
    let headerColour = theme.mode === 'dark' ? theme.primary.veryDark : theme.primary.light;

    return (<>
        <div style={{display: 'flex', justifyContent: 'space-between'}}>
            <h1>Calendar</h1>
            <Paper elevation={3} style={{height: '48px', marginTop: '21.44px', padding: '6px 0 0 10px', width: '400px'}}>
                <FormGroup row>
                    <FormControlLabel control={<Checkbox defaultChecked color={farms.WH} size='small'/>} label="Windmill Hill" onChange={() => updateVisibleFarms(farms.WH)}/>
                    <FormControlLabel control={<Checkbox defaultChecked color={farms.HC} size='small'/>} label="Hartcliffe" onChange={() => updateVisibleFarms(farms.HC)}/>
                    <FormControlLabel control={<Checkbox defaultChecked color={farms.SW} size='small'/>} label="St Werburghs" onChange={() => updateVisibleFarms(farms.SW)}/>
                </FormGroup>
            </Paper>
        </div>
        <div style={{ display: "flex", justifyContent: "left", height: "calc(100% - 91px)"}}>
            <Paper elevation={3} style={{height: '100%', width: "calc(100% - 420px)", padding: '15px', marginRight: '20px'}}>
                <BigCalendar
                    culture='en-gb'
                    localizer={dayjsLocalizer(dayjs)}
                    events={allEvents}
                    startAccessor="start"
                    endAccessor="end"
                    style={{'--day': dayColour, '--off-range': offRangeColour, '--today': todayColour, '--text': textColour, '--header': headerColour}}
                    showMultiDayTimes
                    onSelectEvent={setSelectedEvent}
                    eventPropGetter={eventStyleGetter}
                    onRangeChange={onRangeChange}
                />
            </Paper>
            <div style={{width: "400px"}}>
                { selectedEvent !== "" ?
                <Paper elevation={3} style={{position: 'relative', width: '400px', margin: '0 0 20px 0', padding: '10px'}}>
                    <div style={{display: "flex", justifyContent: "space-between"}}>
                        <h2 className='boxTitle'>Selected Event</h2>
                        <span>
                            {!modifyEvent && <IconButton onClick={()=>{setModifyEvent(true)}}><EditIcon/></IconButton>}
                            <IconButton onClick={() => handleDelEvent()}><Delete/></IconButton>
                            <IconButton onClick={() => {setModifyEvent(false); setSelectedEvent("")}}><Close/></IconButton>
                        </span>
                    </div>
                    {!modifyEvent ?
                    <div className='selectedEvent'>
                        <h2 className='noMarginTop'>{selectedEvent.title}</h2>
                        {
                            selectedEvent.allDay ?
                                <div>
                                    <p>{selectedEvent.start.toLocaleDateString()} {selectedEvent.end == null ? <></> : selectedEvent.end.toLocaleDateString() === selectedEvent.start.toLocaleDateString() ? <></> : " - " + selectedEvent.end.toLocaleDateString()}</p>
                                </div>
                                :
                                <div>
                                    <p>{selectedEvent.start.toLocaleString([], {year: '2-digit', month: '2-digit', day: '2-digit', hour: '2-digit', minute:'2-digit'})} - {selectedEvent.start.toLocaleDateString() === selectedEvent.end.toLocaleDateString() ? selectedEvent.end.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : selectedEvent.end.toLocaleString([], {year: '2-digit', month: '2-digit', day: '2-digit', hour: '2-digit', minute:'2-digit'})}</p>
                                </div>

                        }
                        {selectedEvent.farms.length > 0 ? <h3>Farms</h3> : <></>}
                        {selectedEvent.farms.includes(farms.WH) ? <p>Windmill Hill</p> : <></>}
                        {selectedEvent.farms.includes(farms.HC) ? <p>Hartcliffe</p> : <></>}
                        {selectedEvent.farms.includes(farms.SW) ? <p>St Werburghs</p> : <></>}
                        {selectedEvent.animals.length > 0 ? <h3>Animals</h3> : <></>}
                        {selectedEvent.animals.map((animal) => (
                            <AnimalPopover key={animal._id} animalID={animal._id}/>
                        ))}
                        {selectedEvent.enclosures.length > 0 &&
                        <div>
                            <h3>Enclosures</h3>
                            {selectedEvent.enclosures.map((enclosure, index) => (
                                <p key={index} className='noMarginTop'>{enclosure.name}</p>
                            ))}
                        </div>}
                        {selectedEvent.description !== "" ?
                        <div>
                            <h3>Description</h3>
                            {selectedEvent.description}
                        </div> : <></>}
                    </div>
                    :
                    <div className='modifyEvent'>
                        <TextField
                            error={modifiedEvent.title === ''}
                            fullWidth
                            size='small'
                            placeholder={selectedEvent.title}
                            label='Title'
                            value={modifiedEvent.title}
                            onChange={(e)=>setModifiedEvent({...modifiedEvent, title: e.target.value})}
                        />
                        {showingTime(!modifiedEvent.allDay,"modify")}
                        <div style={{marginTop: "10px"}}>
                            <FormControlLabel control={<Checkbox defaultChecked={selectedEvent.allDay} size='small'/>} label="All Day" onChange={(e) => {changeAllDay(!modifiedEvent.allDay, "modify")}}/>
                            <ButtonGroup style={{float: 'right'}}>
                                <Button variant='contained' color='warning' onClick={()=>{setModifyEvent(false)}}>Discard</Button>
                                <Button variant='contained' color='success' onClick={()=>{handlePatchEvent()}}>Update</Button>
                            </ButtonGroup>
                        </div>
                        <div>
                            <h3>Farms</h3>
                            <FormGroup>
                                <FormControlLabel control={<Checkbox checked={modifiedEvent.farms.includes(farms.WH)} color={farms.WH} size='small'/>} label="Windmill Hill" onChange={() => setModifiedEvent({...modifiedEvent, farms: modifiedEvent.farms.includes(farms.WH) ? modifiedEvent.farms.filter((farm) => farm !== farms.WH) : modifiedEvent.farms.concat(farms.WH)})}/>
                                <FormControlLabel control={<Checkbox checked={modifiedEvent.farms.includes(farms.HC)} color={farms.HC} size='small'/>} label="Hartcliffe" onChange={() => setModifiedEvent({...modifiedEvent, farms: modifiedEvent.farms.includes(farms.HC) ? modifiedEvent.farms.filter((farm) => farm !== farms.HC) : modifiedEvent.farms.concat(farms.HC)})}/>
                                <FormControlLabel control={<Checkbox checked={modifiedEvent.farms.includes(farms.SW)} color={farms.SW} size='small'/>} label="St Werburghs" onChange={() => setModifiedEvent({...modifiedEvent, farms: modifiedEvent.farms.includes(farms.SW) ? modifiedEvent.farms.filter((farm) => farm !== farms.SW) : modifiedEvent.farms.concat(farms.SW)})}/>
                            </FormGroup>
                        </div>
                        <div>
                            <span style={{display: 'flex'}}><h3>Animals</h3><IconButton style={{height: '40px', margin: '12.5px 0 0 5px'}} onClick={() => {functionopenPopup("animals")}}><AddIcon color='primary'/></IconButton></span>
                            {modifiedEvent.animals.map((animal) => {
                                return (<AnimalPopover key={animal} animalID={animal} />)}
                            )}{/*Add a way to remove animals from events */}
                            <div id="AssociateAnimal" style={{textAlign:'center'}}>
                                <Dialog open={openAnimalsPopup} onClose={functionclosePopup}>
                                    <DialogTitle>Add Animal</DialogTitle>
                                    <DialogContent>
                                        <AssociateAnimal setAnimals={setModifiedEventAnimals} animals={modifiedEvent.animals} close={functionclosePopup}></AssociateAnimal>
                                    </DialogContent>
                                </Dialog>
                            </div>
                        </div>
                        <div>
                            <span style={{display: 'flex'}}><h3>Enclosures</h3><IconButton style={{height: '40px', margin: '12.5px 0 0 5px'}} onClick={() => {functionopenPopup("enclosures")}}><AddIcon color='primary'/></IconButton></span>
                            {modifiedEvent.enclosures.map((enclosure, index) => (
                                <p key={index}>{enclosure}</p>
                            ))}{/*Add a way to remove enclosures from events */}
                            {/* idea: make this open the enlcosure  page with a new column of checkboxes. Click on an associate enlcosure(s) button would then pass a list of enclosure names to the calendar to be placed in a field*/}
                            <div id="AssociateEnclosure" style={{textAlign:'center'}}>
                                <Dialog open={openEnclosurePopup} onClose={functionclosePopup}>
                                    <DialogTitle>Add Enclosure</DialogTitle>
                                    <DialogContent>
                                        <AssociateEnclosure enclosures={modifiedEvent.enclosures} setEnclosures={setModifiedEventEnclosures} close={functionclosePopup}></AssociateEnclosure>
                                    </DialogContent>
                                </Dialog>
                            </div>
                        </div>
                        <div>
                            <h3>Description</h3>
                            <TextField
                                fullWidth
                                size='small'
                                multiline
                                rows={3}
                                placeholder='Enter Description'
                                value={modifiedEvent.description}
                                onChange={(e) => {setModifiedEvent({...modifiedEvent, description: e.target.value})}}
                            />
                        </div>
                    </div>}
                </Paper>
                :
                <Paper elevation={3} style={{width: '400px', margin: '0 0 20px 0', padding: '10px'}}>
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
                        {showingTime(!newEvent.allDay,"add")}
                    </div>

                    <div className='smallMarginTop'>
                        <FormControlLabel control={<Checkbox defaultChecked size='small'/>} label="All Day" onChange={() => changeAllDay(!newEvent.allDay, "add")}/>
                        <FormControlLabel control={<Checkbox size='small'/>} label="Recurring" onChange={() => changeRecurring(!recurring, "add")} />
                        <Button variant='contained' style={{float: "right"}} onClick={()=>handleAddEvent()} endIcon={<AddIcon/>}>Create</Button>
                    </div>
                    {recurring && (
                    <div className='smallMarginTop'>
                        <ToggleButtonGroup
                            fullWidth
                            orientation='horizontal'
                            value={newEvent.delay}
                            exclusive
                            onChange={(e) => setNewEvent({...newEvent, delay: e.target.value})}
                        >
                            <ToggleButton value='P1D'>Daily</ToggleButton>
                            <ToggleButton value='P7D'>Weekly</ToggleButton>
                            <ToggleButton value='P30D'>Monthly</ToggleButton>
                            <ToggleButton value='P365D'>Yearly</ToggleButton>
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
                        <span style={{display: 'flex'}}><h3>Animals</h3><IconButton style={{height: '40px', margin: '12px 0 0 5px'}} onClick={() => {functionopenPopup("animals")}}><AddIcon color='primary'/></IconButton></span>
                        {/* idea: make this open the animal table page with a new column of checkboxes. Click on an associate animal(s) button would then pass a list of animal id to the calendar to the new event state. This could be re used in the modification of events.  */}
                        {newEvent.animals.map((animalID) => (
                            <AnimalPopover key={animalID} animalID={animalID} />
                        ))}
                        <div id="AssociateAnimal" style={{textAlign:'center'}}>
                            <Dialog open={openAnimalsPopup} onClose={functionclosePopup}>
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
                            <Dialog open={openEnclosurePopup} onClose={functionclosePopup}>
                                <DialogTitle>Add Enclosure</DialogTitle>
                                <DialogContent>
                                    <AssociateEnclosure enclosures={newEvent.enclosures} setEnclosures={setAddEventEnclosures} close={functionclosePopup}></AssociateEnclosure>
                                </DialogContent>
                            </Dialog>
                        </div>
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
                </Paper>}
            </div>
        </div>
        <Backdrop style={{zIndex: '4', background: '#000000AA'}} open={showErr} onClick={() => setShowErr(false)}>
            <Alert severity='warning'>
                Please ensure event title is not empty
            </Alert>
        </Backdrop>
    </>);
}

export default Calendar;



