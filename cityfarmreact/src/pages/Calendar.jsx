import {Calendar as BigCalendar, dateFnsLocalizer} from 'react-big-calendar';
import format from 'date-fns/format';
import parse from 'date-fns/parse';
import startOfWeek from 'date-fns/startOfWeek';
import getDay from 'date-fns/getDay';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import React, {useState, useEffect, useMemo} from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import "../components/Calendar.css";
import Event from "../components/Event";
import CreateEvent from "../components/CreateEvent";
import Animal from "../components/Animal";
import CloseIcon from "../components/close-512.webp";
import { Button } from '@mui/material';

const locales = {
    "en-GB" : require("date-fns/locale/en-GB")
}

const WH = 0, HC = 1, SW = 2;

const colours = {
    WH: "#035afc",
    HC: "#FF0012",
    SW: "#E3D026",
    default: "#888888"
}

const localizer = dateFnsLocalizer({
    format,
    parse,
    startOfWeek,
    getDay,
    locales,
    firstOfWeek: 1,
    instance: new Date(),
});

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
        animals: ["05eea36a-1098-4392-913b-25e6508df54c"],
        description: "move animals from one pen to another.",
        enclosures: ["Pig pen 1"]
    },
    {
        title : "School Visits",
        allDay: true,
        start: new  Date(2024,1,9, 8),
        end: new  Date(2024,1,9, 23, 59),
        farms: [HC, SW],
        animals: ["05eea36a-1098-4392-913b-25e6508df54c","4735ad94-8a16-4845-870d-513d9947b262"],
        description: "",
        enclosures: []
    },
    {
        title : "Defra Inspection",
        allDay: true,
        start: new  Date(2024,1,20  ),
        end: new Date(2024,1,20),
        farms: [WH, HC, SW],
        animals: [],
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
        setModifiedEvent({title: selectedEvent.title, animals: selectedEvent.animals, allDay: selectedEvent.allDay, start: selectedEvent.start, end: selectedEvent.end, farms: selectedEvent.farms, description: selectedEvent.description, enclosures: selectedEvent.enclosures})
    },[selectedEvent]);
    const removeAnimal = (animalID, type) => {
        if (type == "add"){

        }
        else {

            setModifiedEvent({...modifiedEvent, animals: modifiedEvent.animals.filter((animal) => animal !== animalID)})}
        }
    const handleAddEvent = () => {
        setAllEvents([...allEvents, newEvent]); /*Adds the new event to the list of allEvents} */
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
        const offset = 2;
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
        };
        return {
            style: style
        };
    }

    function showingTime(isShown, type) {
        if (type == "add"){
        if (isShown){
            return(<>
                <div style={{zIndex : 1, position: "relative", width: "100%"}}>
                    <DatePicker placeholderText="Start Date"
                                style={{}}
                                showTimeSelect
                                todayButton = "Today"
                                selected={newEvent.start} onChange={(e) => setNewEvent({...newEvent, start: e})}
                                dateFormat="dd/MM/yy hh:mm aa"
                                >
                    </DatePicker>
                    <DatePicker placeholderText="End Date"
                                style={{}}
                                showTimeSelect
                                todayButton = "Today"
                                selected={newEvent.end} onChange={(e) => setNewEvent({...newEvent, end: e })}
                                dateFormat="dd/MM/yy hh:mm aa"
                                >
                    </DatePicker>
                </div></>
            )
        }
        else{
            return(<>
                <div style={{zIndex : 1, position: "relative", width: "100%"}}>
                    <DatePicker placeholderText="Start Date"
                                style={{}}
                                selected={newEvent.start} onChange={(e) => setNewEvent({...newEvent, start: e})}
                                todayButton = "Today"
                                dateFormat="dd/MM/yy"
                                startDate={Date.now}>
                    </DatePicker>
                    <DatePicker placeholderText="End Date"
                                style={{}}
                                selected={newEvent.end} onChange={(e) => setNewEvent({...newEvent, end: e })}
                                todayButton = "Today"
                                dateFormat="dd/MM/yy"
                                startDate={Date.now}>
                    </DatePicker>
                </div></>
            )
        }
    }
    else {
        if (isShown){
            return(<>
                <div style={{zIndex : 1, position: "relative", width: "100%"}}>
                    <DatePicker placeholderText="Start Date"
                                style={{}}
                                showTimeSelect
                                todayButton = "Today"
                                selected={modifiedEvent.start} onChange={(e) => setModifiedEvent({...modifiedEvent, start: e})}
                                dateFormat="dd/MM/yy hh:mm aa"
                                startDate={selectedEvent.start}>
                    </DatePicker>
                    <DatePicker placeholderText="End Date"
                                style={{}}
                                showTimeSelect
                                todayButton = "Today"
                                selected={modifiedEvent.end} onChange={(e) => setModifiedEvent({...modifiedEvent, end: e })}
                                dateFormat="dd/MM/yy hh:mm aa"
                                startDate={selectedEvent.end}>
                    </DatePicker>
                </div></>
            )
        }
        else{
            return(<>
                <div style={{zIndex : 1, position: "relative", width: "100%"}}>
                    <DatePicker placeholderText="Start Date"
                                style={{}}
                                selected={modifiedEvent.start} onChange={(e) => setModifiedEvent({...modifiedEvent, start: e})}
                                todayButton = "Today"
                                dateFormat="dd/MM/yy"
                                startDate={selectedEvent.start}>
                    </DatePicker>
                    <DatePicker placeholderText="End Date"
                                style={{}}
                                selected={modifiedEvent.end} onChange={(e) => setModifiedEvent({...modifiedEvent, end: e })}
                                todayButton = "Today"
                                dateFormat="dd/MM/yy"
                                startDate={selectedEvent.end}>
                    </DatePicker>
                </div></>
            )
        }
    }
    }

    return (
        <div className="CalendarPage" style={{height: "75%"}}>
        <h1>Calendar</h1>
        <div style={{height: "100%"}}>
            <div style={{ display: "flex", justifyContent: "center", height: "100%"}}>
            <div style={{width: "calc(100% - 440px"}}>
                <BigCalendar
                    localizer={localizer}
                    events={allEvents}
                    startAccessor="start"
                    endAccessor="end"
                    style={{height: "100%", margin:"20px 40px 0 0"}}
                    showMultiDayTimes
                    onSelectEvent={setSelectedEvent}
                    eventPropGetter={eventStyleGetter}
                />
            </div>
            <div style={{width: "440px"}}>
                <div className='componentBox'>
                    <h2 className='boxTitle'>Selected Farms</h2>
                    <input type="checkbox" defaultChecked='true' onChange={() => updateVisibleFarms(WH)}/><span style={{marginRight: "10px"}}>Windmill Hill</span>
                    <input type="checkbox" defaultChecked='true' onChange={() => updateVisibleFarms(HC)}/><span style={{marginRight: "10px"}}>Hartcliffe</span>
                    <input type="checkbox" defaultChecked='true' onChange={() => updateVisibleFarms(SW)}/><span style={{marginRight: "10px"}}>St Werburghs</span>
                </div>

                {/*<Event selectedEvent={selectedEvent} setSelectedEvent={setSelectedEvent}/>*/}

                { selectedEvent !== "No event selected" ?
                <div className='componentBox'>
                    <div style={{display: "flex", justifyContent: "space-between"}}>
                    <h2 className='boxTitle'>Selected Event</h2>
                    <button className='closeButton' onClick={() => setSelectedEvent("No event selected")}><img src={CloseIcon}/></button>
                    </div>
                    {!modifyEvent ?  
                    <div>
                        <h3>{selectedEvent.title}</h3>
                        {
                            selectedEvent.allDay ?
                                <div>
                                    <p>{selectedEvent.start.toLocaleDateString()} {selectedEvent.end == null ? <p></p>:selectedEvent.end.toLocaleDateString()===selectedEvent.start.toLocaleDateString() ? <p></p>: " - " + selectedEvent.end.toLocaleDateString()}</p>
                                </div>
                                :
                                <div>
                                    <p>{selectedEvent.start.toLocaleString([], {year: '2-digit', month: '2-digit', day: '2-digit', hour: '2-digit', minute:'2-digit'})} - {selectedEvent.start.toLocaleDateString() === selectedEvent.end.toLocaleDateString() ? selectedEvent.end.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}): selectedEvent.end.toLocaleString([], {year: '2-digit', month: '2-digit', day: '2-digit', hour: '2-digit', minute:'2-digit'})}</p>
                                </div>
                        
                        }
                        {selectedEvent.farms.length !== 0 ? <h3>Relevant Farms</h3> : <></>}
                        {selectedEvent.farms.includes(WH) ? <p>Windmill Hill</p> : <></>}
                        {selectedEvent.farms.includes(HC) ? <p>Hartcliffe</p> : <></>}
                        {selectedEvent.farms.includes(SW) ? <p>St Werberghs</p> : <></>}
                        {selectedEvent.animals.length !== 0 ? <h3>Relevant Animals</h3> : <></>}
                        {selectedEvent.animals.map((animalID) => (
                            <p><Animal key={animalID} animalID={animalID} /></p>
                        ))}
                        {selectedEvent.enclosures.length !== 0 ? <div>
                            <h3>Relevant Enclosures</h3>
                            {selectedEvent.enclosures.map((enclosureName) => (
                                <p>{enclosureName}</p>
                            ))}
                        </div> : <></>}
                        {selectedEvent.description !== "" ? 
                        <div>
                            <h3>Description</h3>
                            {selectedEvent.description}
                        </div> : <></>}
                        <button className='modifyButton' onClick={() => {setModifyEvent(true)}}>Modify Event</button>
                    </div>
                    : <div className='modifyEvent'>
                        <input type="text" placeholder={selectedEvent.title} value={modifiedEvent.title} onChange={(e) => {setModifiedEvent({...modifiedEvent, title: e.target.value})}}/>
                        {showingTime(!modifiedEvent.allDay,"modify")}
                        <div style={{marginTop: "10px"}}>
                        <input type = "checkbox" name="All Day"  value="True" checked={modifiedEvent.allDay}
                        onChange={(e) => {changeAllDay(!modifiedEvent.allDay, "modify")}}/>
                        All day
                        </div>
                        
                        <button style={{float: "right"}} onClick={() => {}}>Update Event</button> {/*  UpdateEvent function call for api changes. Maybe a delete and an add with the updated event*/}
                        <button style={{float: "right"}} onClick={() => {setModifyEvent(false)}}>Discard Changes</button>
                        <div style={{marginTop: "10px"}}>
                        <h3>Relevant Farms</h3><br/>
                        <input type="checkbox" name="Windmill Hill" value="False" onChange={()=>setModifiedEvent({...modifiedEvent, farms: modifiedEvent.farms.includes(WH) ? modifiedEvent.farms.filter((farm) => farm !== WH) : modifiedEvent.farms.concat(WH)})}/>
                        Windmill Hill<br/>

                        <input type="checkbox" name="Hartcliffe" value="False" onChange={()=>setModifiedEvent({...modifiedEvent, farms: modifiedEvent.farms.includes(HC) ? modifiedEvent.farms.filter((farm) => farm !== HC) : modifiedEvent.farms.concat(HC)})}/>
                        Hartcliffe<br/>

                        <input type="checkbox" name="St Werberghs" value="False" onChange={()=>setModifiedEvent({...modifiedEvent, farms: modifiedEvent.farms.includes(SW) ? modifiedEvent.farms.filter((farm) => farm !== SW) : modifiedEvent.farms.concat(SW)})}/>
                        St Werberghs
                        </div>
                        <h3>Relevant Animals</h3>
                        {modifiedEvent.animals.map((animalID) => (
                            <p><Animal key={animalID} animalID={animalID} /></p> 
                        ))}{/*Add a way to remove animals from events */}
                        <button>Add Animal</button> {/* Apply changes to do with associating animals here */}
                        <div>
                            <h3>Relevant Enclosures</h3>
                            {modifiedEvent.enclosures.map((enclosureName) => (
                                <p>{enclosureName}</p>
                            ))}{/*Add a way to remove enclosures from events */}
                            <button>Add Enclosure</button> {/* idea: make this open the enlcosure  page with a new column of checkboxes. Click on an associate enlcosure(s) button would then pass a list of enclosure names to the calendar to be placed in a field*/}
                        </div>
                        <div>
                            <span>Description:</span>
                            <textarea style={{minHeight: "52px", minWidth: "386px"}} type="text" placeholder="enter description here:" value={modifiedEvent.description} onChange={(e) => {setModifiedEvent({...modifiedEvent, description: e.target.value})}}></textarea>
                        </div>
                        
                    </div>
                    }
                </div>
                :
                <></>}

                {/*<CreateEvent setEvent={setNewEvent} handleAddEvent={handleAddEvent}/>*/}

                <div className='componentBox'>
                <h2 className='boxTitle'>Add New Event</h2>
                <div style={{marginRight: '10px'}}>
                <input
                    style={{width: '100%'}}
                    type="text"
                    placeholder="Add Title"
                    value={newEvent.title}
                    onChange={(e)=>setNewEvent({...newEvent, title: e.target.value})}
                />

                {showingTime(!newEvent.allDay,"add")}
                </div>

                <div style={{marginTop: "10px"}}>
                <input type = "checkbox" name="All Day"  value="True" checked={newEvent.allDay}
                       onChange={()=>changeAllDay(!newEvent.allDay,"add")}/>
                All day
                <button style={{float: "right"}} onClick={()=>handleAddEvent()}>Add Event</button>
                </div>

                <div style={{marginTop: "10px"}}>
                <h3>Relevant Farms</h3><br/>
                <input type="checkbox" name="Windmill Hill" value="False" onChange={()=>setNewEvent({...newEvent, farms: newEvent.farms.includes(WH) ? newEvent.farms.filter((farm) => farm !== WH) : newEvent.farms.concat(WH)})}/>
                Windmill Hill<br/>

                <input type="checkbox" name="Hartcliffe" value="False" onChange={()=>setNewEvent({...newEvent, farms: newEvent.farms.includes(HC) ? newEvent.farms.filter((farm) => farm !== HC) : newEvent.farms.concat(HC)})}/>
                Hartcliffe<br/>

                <input type="checkbox" name="St Werberghs" value="False" onChange={()=>setNewEvent({...newEvent, farms: newEvent.farms.includes(SW) ? newEvent.farms.filter((farm) => farm !== SW) : newEvent.farms.concat(SW)})}/>
                St Werberghs
                </div>
                <div>
                    <h3>Relevant Animals</h3>
                    {newEvent.animals.map((animalID) => (
                        <p><Animal key={animalID} animalID={animalID} /></p>
                    ))}
                    <button>Add Animal</button> {/* idea: make this open the animal table page with a new column of checkboxes. Click on an associate animal(s) button would then pass a list of animal id to the calendar to the new event state. This could be re used in the modification of events.  */}
                </div>
                <div>
                    <h3>Relevant Enclosures</h3>
                    {newEvent.enclosures.map((enclosureName) => (
                        <p>{enclosureName}</p>
                    ))}{/*Add a way to remove enclosures from events */}
                    <button>Add Enclosure</button> {/* idea: make this open the enlcosure  page with a new column of checkboxes. Click on an associate enlcosure(s) button would then pass a list of enclosure names to the calendar to be placed in a field*/}
                </div>
                <div>
                    <span>Description:</span>
                    <textarea style={{minHeight: "52px", minWidth: "386px"}} type="text" placeholder="enter description here:" value={newEvent.description} onChange={(e) => {setNewEvent({...newEvent, description: e.target.value})}}></textarea>
                </div>
            </div>
            </div>
            </div>
        </div>
        </div>
    );
}

export default Calendar;
