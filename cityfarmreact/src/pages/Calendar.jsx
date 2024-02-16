import {Calendar as BigCalendar, dateFnsLocalizer, dayjsLocalizer} from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import React, {useState, useEffect, useMemo} from 'react';
import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import "./Calendar.css";
import Event from "../components/Event";
import CreateEvent from "../components/CreateEvent";
import Animal from "../components/Animal";
import CloseIcon from "../components/close-512.webp";
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import { Button, ButtonGroup, Checkbox, FormControlLabel, FormGroup } from '@mui/material';

import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';

const WH = 0, HC = 1, SW = 2;
const colours = {
    WH: "#035afc",
    HC: "#FF0012",
    SW: "#E3D026",
    default: "#888888"
}

const events = [ /*These are example events.*/
    {
        title : "Boss Meeting",
        allDay: false,
        start: new  Date(2024,1,1, 13),
        end: new  Date(2024,1,1, 14),
        farms: [],
        animals: ["174447d3-bedb-4311-a16c-1771aa82d173"],
        description: "Bring notes",
        enclosures: ["Pig pen 2", "Pig pen 1"]
    },
    {
        title : "Bull in with cows",
        allDay: false,
        start: new  Date(2024,1,5, 8),
        end: new  Date(2024,1,8, 16),
        farms: [WH],
        animals: ["ae7ee5e6-0d26-4b52-b94e-b3da9b434b2e"],
        description: "move animals from one pen to another.",
        enclosures: ["Pig pen 1"]
    },
    {
        title : "School Visits",
        allDay: true,
        start: new  Date(2024,1,9, 8),
        end: new  Date(2024,1,9, 23, 59),
        farms: [HC, SW],
        animals: ["05eea36a-1098-4392-913b-25e6508df54c","ae7ee5e6-0d26-4b52-b94e-b3da9b434b2e"],
        description: "",
        enclosures: []
    },
    {
        title : "Defra Inspection",
        allDay: true,
        start: new  Date(2024,1,20  ),
        end: new Date(2024,1,20),
        farms: [WH, HC, SW],
        animals: ["a157482d-21aa-4461-968b-f3f873605057"],
        description: "",
        enclosures: []
    }
];

const Calendar = () => {
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

    const [allEvents,setAllEvents] = useState(events);
    const [selectedEvent,setSelectedEvent] = useState("No event selected");
    const [visibleFarms, setVisibleFarms] = useState([WH, HC, SW]);
    const [modifyEvent, setModifyEvent] = useState(false);

    useEffect(() =>{
        setModifiedEvent(selectedEvent);
    },[selectedEvent]);

    const removeAnimal = (animalID, type) => {
        if (type == "add"){

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
        {type == "add" ? setNewEvent({...newEvent, allDay: isAllDay}) : setModifiedEvent({...modifiedEvent, allDay: isAllDay})}
    }

    const updateVisibleFarms = (selected) => {
        visibleFarms.includes(selected) ? setVisibleFarms(visibleFarms.filter(farm => farm !== selected)) : setVisibleFarms([...visibleFarms, selected]);
    }

    const eventStyleGetter = (event) => {
        var colour1 = event.farms.includes(WH) ? colours.WH : (event.farms.includes(HC) ? colours.HC : colours.SW);
        var colour2 = event.farms.includes(HC) ? (event.farms.includes(WH) ? colours.HC : (event.farms.includes(SW) ? colours.SW : colours.SW)) : colours.SW;
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
            backgroundColor: colours.default,
            backgroundImage: `linear-gradient(135deg, ${colour1}, ${colour1} ${100/event.farms.length - offset}%, ${colour2} ${100/event.farms.length + offset}%, ${colour2} ${200/event.farms.length - offset}%, ${colours.SW} ${200/event.farms.length + offset}%, ${colours.SW})`,
            color: 'white',
            borderRadius: '5px'
        };
        return {
            style: style
        };
    }

    function showingTime(isShown, type) {
        if (type == "add") {
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
                />
            </div>
            <div style={{width: "400px"}}>
                <Paper elevation={3} style={{width: '400px', margin: '0 0 20px 0', padding: '10px'}}>
                    <h2 className='boxTitle'>Selected Farms</h2>
                    <FormGroup>
                        <FormControlLabel control={<Checkbox defaultChecked color='WH' size='small'/>} label="Windmill Hill" onChange={() => updateVisibleFarms(WH)}/>
                        <FormControlLabel control={<Checkbox defaultChecked color='HC' size='small'/>} label="Hartecliffe" onChange={() => updateVisibleFarms(HC)}/>
                        <FormControlLabel control={<Checkbox defaultChecked color='SW' size='small'/>} label="St Werburghs" onChange={() => updateVisibleFarms(SW)}/>
                    </FormGroup>
                </Paper>

                {/*<Event selectedEvent={selectedEvent} setSelectedEvent={setSelectedEvent}/>*/}

                { selectedEvent !== "No event selected" ?
                <Paper elevation={3} style={{position: 'relative', width: '400px', margin: '0 0 20px 0', padding: '10px'}}>
                    <div style={{display: "flex", justifyContent: "space-between"}}>
                        <h2 className='boxTitle'>Selected Event</h2>
                        <button className='closeButton' onClick={() => {setModifyEvent(false); setSelectedEvent("No event selected")}}><img src={CloseIcon}/></button>
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
                        {selectedEvent.farms.includes(WH) ? <p>Windmill Hill</p> : <></>}
                        {selectedEvent.farms.includes(HC) ? <p>Hartcliffe</p> : <></>}
                        {selectedEvent.farms.includes(SW) ? <p>St Werberghs</p> : <></>}
                        {selectedEvent.animals.length !== 0 ? <h3>Animals</h3> : <></>}
                        {selectedEvent.animals.map((animalID) => (
                            <Animal key={animalID} animalID={animalID}/>
                        ))}
                        {selectedEvent.enclosures.length !== 0 ? <div>
                            <h3>Enclosures</h3>
                            {selectedEvent.enclosures.map((enclosureName) => (
                                <p>{enclosureName}</p>
                            ))}
                        </div> : <></>}
                        {selectedEvent.description !== "" ? 
                        <div>
                            <h3>Description</h3>
                            {selectedEvent.description}
                        </div> : <></>}
                    </div>
                    : <div className='modifyEvent'>
                        <TextField
                            style={{width: '100%'}}
                            placeholder={selectedEvent.title}
                            label='Title'
                            size='small'
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
                            <FormControlLabel control={<Checkbox defaultChecked={selectedEvent.farms.includes(WH)} color='WH' size='small'/>} label="Windmill Hill" onChange={() => setModifiedEvent({...modifiedEvent, farms: modifiedEvent.farms.includes(WH) ? modifiedEvent.farms.filter((farm) => farm !== WH) : modifiedEvent.farms.concat(WH)})}/>
                            <FormControlLabel control={<Checkbox defaultChecked={selectedEvent.farms.includes(HC)} color='HC' size='small'/>} label="Hartcliffe" onChange={()=>setModifiedEvent({...modifiedEvent, farms: modifiedEvent.farms.includes(HC) ? modifiedEvent.farms.filter((farm) => farm !== HC) : modifiedEvent.farms.concat(HC)})}/>
                            <FormControlLabel control={<Checkbox defaultChecked={selectedEvent.farms.includes(SW)} color='SW' size='small'/>} label="St Werburghs" onChange={()=>setModifiedEvent({...modifiedEvent, farms: modifiedEvent.farms.includes(SW) ? modifiedEvent.farms.filter((farm) => farm !== SW) : modifiedEvent.farms.concat(SW)})}/>
                        </FormGroup>
                        </div>
                        <h3>Animals</h3>
                        {modifiedEvent.animals.map((animalID) => (
                            <p><Animal key={animalID} animalID={animalID} /></p> 
                        ))}{/*Add a way to remove animals from events */}
                        <Button variant='outlined' color='tertiary'>Add Animal</Button> {/* Apply changes to do with associating animals here */}
                        <div>
                            <h3>Enclosures</h3>
                            {modifiedEvent.enclosures.map((enclosureName) => (
                                <p>{enclosureName}</p>
                            ))}{/*Add a way to remove enclosures from events */}
                            <Button variant='outlined' color='tertiary'>Add Enclosure</Button> {/* idea: make this open the enlcosure  page with a new column of checkboxes. Click on an associate enlcosure(s) button would then pass a list of enclosure names to the calendar to be placed in a field*/}
                        </div>
                        <div>
                            <span>Description:</span>
                            <textarea style={{minHeight: "52px", minWidth: "386px"}} type="text" placeholder="enter description here:" value={modifiedEvent.description} onChange={(e) => {setModifiedEvent({...modifiedEvent, description: e.target.value})}}></textarea>
                        </div>
                        
                    </div>
                    }
                </Paper>
                :
                <></>}

                {/*<CreateEvent setEvent={setNewEvent} handleAddEvent={handleAddEvent}/>*/}

                <Paper elevation={3} style={{width: '400px', margin: '0 0 20px 0', padding: '10px'}}>
                <h2 className='boxTitle'>Add New Event</h2>
                <div>
                <TextField
                    style={{width: '100%'}}
                    placeholder="Add Title"
                    label='Title'
                    size='small'
                    value={newEvent.title}
                    onChange={(e)=>setNewEvent({...newEvent, title: e.target.value})}
                />
                {showingTime(!newEvent.allDay,"add")}
                </div>

                <div style={{marginTop: "10px"}}>
                <FormControlLabel control={<Checkbox defaultChecked color='tertiary' size='small'/>} label="All Day" onChange={() => changeAllDay(!newEvent.allDay, "add")}/>
                <Button variant='outlined' color='tertiary' style={{float: "right"}} onClick={()=>handleAddEvent()}>Add Event</Button>
                </div>

                <div style={{marginTop: "10px"}}>
                <h3>Farms</h3>
                <FormGroup>
                    <FormControlLabel control={<Checkbox color='WH' size='small'/>} label="Windmill Hill" onChange={() => setNewEvent({...newEvent, farms: newEvent.farms.includes(WH) ? newEvent.farms.filter((farm) => farm !== WH) : newEvent.farms.concat(WH)})}/>
                    <FormControlLabel control={<Checkbox color='HC' size='small'/>} label="Hartcliffe" onChange={()=>setNewEvent({...newEvent, farms: newEvent.farms.includes(HC) ? newEvent.farms.filter((farm) => farm !== HC) : newEvent.farms.concat(HC)})}/>
                    <FormControlLabel control={<Checkbox color='SW' size='small'/>} label="St Werburghs" onChange={()=>setNewEvent({...newEvent, farms: newEvent.farms.includes(SW) ? newEvent.farms.filter((farm) => farm !== SW) : newEvent.farms.concat(SW)})}/>
                </FormGroup>
                </div>
                <div>
                    <h3>Animals</h3>
                    {newEvent.animals.map((animalID) => (
                        <p><Animal key={animalID} animalID={animalID} /></p>
                    ))}
                    <Button variant='outlined' color='tertiary'>Add Animal</Button> {/* idea: make this open the animal table page with a new column of checkboxes. Click on an associate animal(s) button would then pass a list of animal id to the calendar to the new event state. This could be re used in the modification of events.  */}
                </div>
                <div>
                    <h3>Enclosures</h3>
                    {newEvent.enclosures.map((enclosureName) => (
                        <p>{enclosureName}</p>
                    ))}{/*Add a way to remove enclosures from events */}
                    <Button variant='outlined' color='tertiary'>Add Enclosure</Button> {/* idea: make this open the enlcosure  page with a new column of checkboxes. Click on an associate enlcosure(s) button would then pass a list of enclosure names to the calendar to be placed in a field*/}
                </div>
                <div>
                    <h3>Description</h3>
                    <textarea style={{minHeight: "52px", minWidth: "386px"}} type="text" placeholder="Enter description:" value={newEvent.description} onChange={(e) => {setNewEvent({...newEvent, description: e.target.value})}}></textarea>
                </div>
            </Paper>
            </div>
            </div>
        </div>
        </div>
    );
}

export default Calendar;
