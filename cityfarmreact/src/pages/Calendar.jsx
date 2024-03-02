import {Calendar as BigCalendar, dayjsLocalizer} from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import React, {useState, useEffect, useCallback} from 'react';
import dayjs from 'dayjs';
import "./Calendar.css";
import Event from "../components/Event";
import CreateEvent from "../components/CreateEvent";
import AnimalPopover from "../components/AnimalPopover";
import CloseIconLight from "../assets/close-512-light.webp";
import CloseIconDark from "../assets/close-512-dark.webp";
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import { IconButton, Button, ButtonGroup, Checkbox, FormControlLabel, FormGroup, useTheme } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import axios from '../api/axiosConfig'

import { getConfig } from '../api/getToken';

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
    const [selectedEvent,setSelectedEvent] = useState("No event selected");
    const [visibleFarms, setVisibleFarms] = useState([farms.WH, farms.HC, farms.SW]);
    const [modifyEvent, setModifyEvent] = useState(false);

    useEffect(() =>{
        setModifiedEvent(selectedEvent);
    },[selectedEvent]);

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
                window.alert(error);
            }
        })();
    },[]);

    const removeAnimal = (animalID, type) => {
        if (type === "add"){

        }
        else {
            setModifiedEvent({...modifiedEvent, animals: modifiedEvent.animals.filter((animal) => animal !== animalID)})
        }
    }

    const handleAddEvent = () => {
        setAllEvents([...allEvents, newEvent]); /*Adds the new event to the list of allEvents} */
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
        console.log(allEvents, newEvent);
    }
    
    const changeAllDay = (isAllDay, type) => {
        type === "add" ? setNewEvent({...newEvent, allDay: isAllDay}) : setModifiedEvent({...modifiedEvent, allDay: isAllDay})
    }

    const updateVisibleFarms = (selected) => {
        visibleFarms.includes(selected) ? setVisibleFarms(visibleFarms.filter(farm => farm !== selected)) : setVisibleFarms([...visibleFarms, selected]);
    }

    const eventStyleGetter = (event) => {
        //console.log(event)
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
                    <DateTimePicker value={dayjs(newEvent.start)} onChange={(e) => {setNewEvent({...newEvent, start: e.$d})}} slotProps={{textField: {fullWidth: true}}}/>
                    <DateTimePicker value={dayjs(newEvent.end)} onChange={(e) => {setNewEvent({...newEvent, end: e.$d})}} slotProps={{textField: {fullWidth: true}}}/>
                </>)
            } else {
                return(<>
                    <DatePicker value={dayjs(newEvent.start)} onChange={(e) => {setNewEvent({...newEvent, start: e.$d})}} slotProps={{textField: {fullWidth: true}}}/>
                    <DatePicker value={dayjs(newEvent.end)} onChange={(e) => {setNewEvent({...newEvent, end: e.$d})}} slotProps={{textField: {fullWidth: true}}}/>
                </>)
            }
        } else {
            if (isShown) {
                return(<>
                    <DateTimePicker value={dayjs(modifiedEvent.start)} placeholder={selectedEvent.start} onChange={(e) => {setModifiedEvent({...modifiedEvent, start: e.$d})}} slotProps={{textField: {fullWidth: true}}}/>
                    <DateTimePicker value={dayjs(modifiedEvent.end)} placeholder={selectedEvent.end} onChange={(e) => {setModifiedEvent({...modifiedEvent, end: e.$d})}} slotProps={{textField: {fullWidth: true}}}/>
                </>)
            } else {
                return(<>
                    <DatePicker value={dayjs(modifiedEvent.start)} placeholder={selectedEvent.start} onChange={(e) => {setModifiedEvent({...modifiedEvent, start: e.$d})}} slotProps={{textField: {fullWidth: true}}}/>
                    <DatePicker value={dayjs(modifiedEvent.end)} placeholder={selectedEvent.end} onChange={(e) => {setModifiedEvent({...modifiedEvent, end: e.$d})}} slotProps={{textField: {fullWidth: true}}}/>
                </>)
            }
        }
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
            else{ // day case has a single element of the start time
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

    const eventsConversion=(events)=>{
        let changed=[]
        for (let i=0;i<events.length;i++){
            changed.push(
                {
                    title : events[i].event.title,
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
        console.log(changed)
        return changed
    }

    return (
        <div className="CalendarPage" style={{height: "85%"}}>
        <h1>Calendar</h1>
        <div style={{height: "100%"}}>
            <div style={{ display: "flex", justifyContent: "left", height: "100%"}}>
            <div style={{width: "calc(100% - 400px"}}>
                <BigCalendar
                    culture='en-gb'
                    localizer={dayjsLocalizer(dayjs)}
                    events={allEvents}
                    startAccessor="start"
                    endAccessor="end"
                    style={{height: "100%", margin:"20px 20px 0 0"}}
                    showMultiDayTimes
                    onSelectEvent={setSelectedEvent}
                    eventPropGetter={eventStyleGetter}
                    onRangeChange={onRangeChange}
                />
            </div>
            <div style={{width: "400px"}}>
                <Paper elevation={3} style={{width: '400px', margin: '0 0 20px 0', padding: '10px'}}>
                    <h2 className='boxTitle'>Selected Farms</h2>
                    <FormGroup>
                        <FormControlLabel control={<Checkbox defaultChecked color={farms.WH} size='small'/>} label="Windmill Hill" onChange={() => updateVisibleFarms(farms.WH)}/>
                        <FormControlLabel control={<Checkbox defaultChecked color={farms.HC} size='small'/>} label="Hartecliffe" onChange={() => updateVisibleFarms(farms.HC)}/>
                        <FormControlLabel control={<Checkbox defaultChecked color={farms.SW} size='small'/>} label="St Werburghs" onChange={() => updateVisibleFarms(farms.SW)}/>
                    </FormGroup>
                </Paper>

                {/*<Event selectedEvent={selectedEvent} setSelectedEvent={setSelectedEvent}/>*/}

                { selectedEvent !== "No event selected" ?
                <Paper elevation={3} style={{position: 'relative', width: '400px', margin: '0 0 20px 0', padding: '10px'}}>
                    <div style={{display: "flex", justifyContent: "space-between"}}>
                        <h2 className='boxTitle'>Selected Event</h2>
                        <IconButton className='closeButton' onClick={() => {setModifyEvent(false); setSelectedEvent("No event selected")}}><img src={theme.mode === 'light' ? CloseIconLight : CloseIconDark} alt='close button'/></IconButton>
                    </div>
                    {!modifyEvent ?
                    <div>
                        <h2>{selectedEvent.title}</h2>
                        <Button style={{float: 'right', position: 'relative', bottom: '36px'}} color='tertiary' variant='outlined' onClick={()=>{setModifyEvent(true)}}>Edit</Button>
                        {
                            selectedEvent.allDay ?
                                <div>
                                    <p>{selectedEvent.start.toLocaleDateString()} {selectedEvent.end == null ? <></> : selectedEvent.end.toLocaleDateString() === selectedEvent.start.toLocaleDateString() ? <></> : " - " + selectedEvent.end.toLocaleDateString()}</p>
                                </div>
                                :
                                <div>
                                    <p>{selectedEvent.start.toLocaleString([], {year: '2-digit', month: '2-digit', day: '2-digit', hour: '2-digit', minute:'2-digit'})} - {selectedEvent.start.toLocaleDateString() === selectedEvent.end.toLocaleDateString() ? selectedEvent.end.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}): selectedEvent.end.toLocaleString([], {year: '2-digit', month: '2-digit', day: '2-digit', hour: '2-digit', minute:'2-digit'})}</p>
                                </div>
                        
                        }
                        {selectedEvent.farms.length !== 0 ? <h3>Farms</h3> : <></>}
                        {selectedEvent.farms.includes(farms.WH) ? <p>Windmill Hill</p> : <></>}
                        {selectedEvent.farms.includes(farms.HC) ? <p>Hartcliffe</p> : <></>}
                        {selectedEvent.farms.includes(farms.SW) ? <p>St Werberghs</p> : <></>}
                        {selectedEvent.animals.length !== 0 ? <h3>Animals</h3> : <></>}
                        {selectedEvent.animals.map((animalID) => (
                            <AnimalPopover key={animalID._id} animalID={animalID._id}/>
                        ))}
                        {selectedEvent.enclosures.length !== 0 &&
                        <div>
                            <h3>Enclosures</h3>
                            {selectedEvent.enclosures.map((enclosureName, index) => (
                                <p key={index}>{enclosureName}</p>
                            ))}
                        </div>}
                        {selectedEvent.description !== "" ?
                        <div>
                            <h3>Description</h3>
                            {selectedEvent.description}
                        </div> : <></>}
                    </div>
                    : <div className='modifyEvent'>
                        <TextField
                            fullWidth
                            placeholder={selectedEvent.title}
                            label='Title'
                            value={modifiedEvent.title}
                            onChange={(e)=>setModifiedEvent({...modifiedEvent, title: e.target.value})}
                        />
                        {showingTime(!modifiedEvent.allDay,"modify")}
                        <div style={{marginTop: "10px"}}>
                            <FormControlLabel control={<Checkbox defaultChecked={selectedEvent.allDay} color='tertiary' size='small'/>} label="All Day" onChange={(e) => {changeAllDay(!modifiedEvent.allDay, "modify")}}/>
                            <ButtonGroup style={{float: 'right'}}>
                                <Button variant='contained' color='warning' onClick={()=>{setModifyEvent(false)}}>Discard</Button>
                                <Button variant='contained' color='success' onClick={()=>{}}>Update</Button>
                            </ButtonGroup>
                        </div>
                        <div>
                        <h3>Farms</h3>
                        <FormGroup>
                            <FormControlLabel control={<Checkbox defaultChecked={selectedEvent.farms.includes(farms.WH)} color={farms.HC} size='small'/>} label="Windmill Hill" onChange={() => setModifiedEvent({...modifiedEvent, farms: modifiedEvent.farms.includes(farms.WH) ? modifiedEvent.farms.filter((farm) => farm !== farms.WH) : modifiedEvent.farms.concat(farms.WH)})}/>
                            <FormControlLabel control={<Checkbox defaultChecked={selectedEvent.farms.includes(farms.HC)} color={farms.HC} size='small'/>} label="Hartcliffe" onChange={()=>setModifiedEvent({...modifiedEvent, farms: modifiedEvent.farms.includes(farms.HC) ? modifiedEvent.farms.filter((farm) => farm !== farms.HC) : modifiedEvent.farms.concat(farms.HC)})}/>
                            <FormControlLabel control={<Checkbox defaultChecked={selectedEvent.farms.includes(farms.SW)} color={farms.SW} size='small'/>} label="St Werburghs" onChange={()=>setModifiedEvent({...modifiedEvent, farms: modifiedEvent.farms.includes(farms.SW) ? modifiedEvent.farms.filter((farm) => farm !== farms.SW) : modifiedEvent.farms.concat(farms.SW)})}/>
                        </FormGroup>
                        </div>
                        <h3>Animals</h3>
                        {modifiedEvent.animals.map((animalID) => (
                            <p><AnimalPopover key={animalID} animalID={animalID} /></p>
                        ))}{/*Add a way to remove animals from events */}
                        <Button variant='outlined' color='tertiary'>Add Animal</Button> {/* Apply changes to do with associating animals here */}
                        <div>
                            <h3>Enclosures</h3>
                            {modifiedEvent.enclosures.map((enclosureName, index) => (
                                <p key={index}>{enclosureName}</p>
                            ))}{/*Add a way to remove enclosures from events */}
                            <Button variant='outlined' color='tertiary'>Add Enclosure</Button> {/* idea: make this open the enlcosure  page with a new column of checkboxes. Click on an associate enlcosure(s) button would then pass a list of enclosure names to the calendar to be placed in a field*/}
                        </div>
                        <div>
                            <span>Description:</span>
                            <TextField label='Description'/>
                            <textarea style={{minHeight: "52px", minWidth: "386px"}} type="text" placeholder="enter description here:" value={modifiedEvent.description} onChange={(e) => {setModifiedEvent({...modifiedEvent, description: e.target.value})}}></textarea>
                        </div>

                    </div>
                    }
                </Paper>
                :
                <></>}

                {/*<CreateEvent setEvent={setNewEvent} handleAddEvent={handleAddEvent}/>*/}

                <Paper elevation={3} style={{width: '400px', margin: '0 0 20px 0', padding: '10px'}}>
                <h2 className='boxTitle'>Create New Event</h2>
                <div>
                <TextField
                    fullWidth
                    placeholder="Add Title"
                    label='Title'
                    value={newEvent.title}
                    onChange={(e)=>setNewEvent({...newEvent, title: e.target.value})}
                />
                {showingTime(!newEvent.allDay,"add")}
                </div>

                <div style={{marginTop: "10px"}}>
                <FormControlLabel control={<Checkbox defaultChecked color='tertiary' size='small'/>} label="All Day" onChange={() => changeAllDay(!newEvent.allDay, "add")}/>
                <Button variant='outlined' color='tertiary' style={{float: "right"}} onClick={()=>handleAddEvent()}>Create</Button>
                </div>

                <div style={{marginTop: "10px"}}>
                <h3>Farms</h3>
                <FormGroup>
                    <FormControlLabel control={<Checkbox color={farms.WH} size='small'/>} label="Windmill Hill" onChange={() => setNewEvent({...newEvent, farms: newEvent.farms.includes(farms.WH) ? newEvent.farms.filter((farm) => farm !== farms.WH) : newEvent.farms.concat(farms.WH)})}/>
                    <FormControlLabel control={<Checkbox color={farms.HC} size='small'/>} label="Hartcliffe" onChange={()=>setNewEvent({...newEvent, farms: newEvent.farms.includes(farms.HC) ? newEvent.farms.filter((farm) => farm !== farms.HC) : newEvent.farms.concat(farms.HC)})}/>
                    <FormControlLabel control={<Checkbox color={farms.SW} size='small'/>} label="St Werburghs" onChange={()=>setNewEvent({...newEvent, farms: newEvent.farms.includes(farms.SW) ? newEvent.farms.filter((farm) => farm !== farms.SW) : newEvent.farms.concat(farms.SW)})}/>
                </FormGroup>
                </div>
                <div>
                    <h3>Animals</h3>
                    {newEvent.animals.map((animalID) => (
                        <p><AnimalPopover key={animalID} animalID={animalID} /></p>
                    ))}
                    <Button variant='outlined' color='tertiary'>Add Animal</Button> {/* idea: make this open the animal table page with a new column of checkboxes. Click on an associate animal(s) button would then pass a list of animal id to the calendar to the new event state. This could be re used in the modification of events.  */}
                </div>
                <div>
                    <h3>Enclosures</h3>
                    {newEvent.enclosures.map((enclosureName, index) => (
                        <p key={index}>{enclosureName}</p>
                    ))}{/*Add a way to remove enclosures from events */}
                    <Button variant='outlined' color='tertiary'>Add Enclosure</Button> {/* idea: make this open the enlcosure  page with a new column of checkboxes. Click on an associate enlcosure(s) button would then pass a list of enclosure names to the calendar to be placed in a field*/}
                </div>
                <div>
                    <h3>Description</h3>
                    <TextField
                        fullWidth
                        multiline
                        rows={2}
                        placeholder='Enter Description'
                        value={newEvent.description}
                        onChange={(e) => {setNewEvent({...newEvent, description: e.target.value})}}
                    />
                </div>
            </Paper>
            </div>
            </div>
        </div>
        </div>
    );
}

export default Calendar;

