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

const locales = {
    "en-GB" : require("date-fns/locale/en-GB")
}

const WH = 0, HC = 1, SW = 2; 

const colours = {
    WH: "#333388",
    HC: "#FF0000",
    SW: "#3312FF",
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
        animals: [1]
    },
    {
        title : "Bull in with cows",
        allDay: false,
        start: new  Date(2024,1,5, 8),
        end: new  Date(2024,1,8, 16),
        farms: [WH],
        animals: [2]
    },
    {
        title : "School Visits",
        allDay: true,
        start: new  Date(2024,1,9, 8),
        end: new  Date(2024,1,9, 23, 59),
        farms: [HC, SW],
        animals: [2,1]
    },
    {
        title : "Defra Inspection",
        allDay: true,
        start: new  Date(2024,1,20  ),
        end: new Date(2024,1,20),
        farms: [WH, HC, SW],
        animals: []
    }
];

const Calendar = () => {
    const [newEvent,setNewEvent] = useState({
        title: "",
        allDay: true,
        start: new Date(2023,11,5,18,29),
        end: new Date(2023,11,6,18,29),
        farms: [],
        animals: []
    })

    const [allEvents,setAllEvents] = useState(events);
    const [selectedEvent,setSelectedEvent] = useState("No event selected");
    const [visibleFarms, setVisibleFarms] = useState([WH, HC, SW]);

    const handleAddEvent = () => {
        setAllEvents([...allEvents, newEvent]); /*Adds the new event to the list of allEvents} */
        console.log(allEvents, newEvent);
    }
    
    const changeAllDay = (isAllDay) => {
        setNewEvent({...newEvent, allDay: isAllDay});
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
            backgroundImage: `linear-gradient(-45deg, ${colour1}, ${colour1} ${100/event.farms.length - offset}%, ${colour2} ${100/event.farms.length + offset}%, ${colour2} ${200/event.farms.length - offset}%, ${colours.SW} ${200/event.farms.length + offset}%, ${colours.SW})`,
            color: 'white',
        };
        return {
            style: style
        };
    }

    function showingTime(isShown) {
        if (isShown){
            return(<>
                <div style={{zIndex : 1, position: "relative", width: "100%"}}>
                    <DatePicker placeholderText="Start Date"
                                style={{}}
                                showTimeSelect
                                todayButton = "Today"
                                selected={newEvent.start} onChange={(e) => setNewEvent({...newEvent, start: e})}
                                dateFormat="dd/MM/yy hh:mm aa"
                                startDate={Date.now}>
                    </DatePicker>
                    <DatePicker placeholderText="End Date"
                                style={{}}
                                showTimeSelect
                                todayButton = "Today"
                                selected={newEvent.end} onChange={(e) => setNewEvent({...newEvent, end: e })}
                                dateFormat="dd/MM/yy hh:mm aa"
                                startDate={Date.now}>
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
                        {selectedEvent.farms.length !== 0 ?
                        <h3>Relevant Farms</h3> : <></>}
                        {selectedEvent.farms.includes(WH) ? <p>Windmill Hill</p> : <></>}
                        {selectedEvent.farms.includes(HC) ? <p>Hartcliffe</p> : <></>}
                        {selectedEvent.farms.includes(SW) ? <p>St Werberghs</p> : <></>}
                        <h3>Relevant Animals</h3>
                        {selectedEvent.animals.map((animalId) => (
                        <Animal key={animalId} animalID={animalId}/>
                        ))}
                    </div>
                </div>
                :
                <></>
                }

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

                {showingTime(!newEvent.allDay)}

                </div>
                <div style={{marginTop: "10px"}}>
                <input type = "checkbox" name="All Day"  value="True" checked={newEvent.allDay}
                       onChange={()=>changeAllDay(!newEvent.allDay)}/>
                All day
                <button style={{float: "right"}} onClick={()=>handleAddEvent()}>Add Event</button>
                </div>
                <div style={{marginTop: "10px"}}>
                Relevant Farms<br/>
                <input type="checkbox" name="Windmill Hill" value="False" onChange={()=>setNewEvent({...newEvent, farms: newEvent.farms.includes(WH) ? newEvent.farms.filter((farm) => farm !== WH) : newEvent.farms.concat(WH)})}/>
                Windmill Hill<br/>

                <input type="checkbox" name="Hartcliffe" value="False" onChange={()=>setNewEvent({...newEvent, farms: newEvent.farms.includes(HC) ? newEvent.farms.filter((farm) => farm !== HC) : newEvent.farms.concat(HC)})}/>
                Hartcliffe<br/>

                <input type="checkbox" name="St Werberghs" value="False" onChange={()=>setNewEvent({...newEvent, farms: newEvent.farms.includes(SW) ? newEvent.farms.filter((farm) => farm !== SW) : newEvent.farms.concat(SW)})}/>
                St Werberghs
                </div>
            </div>
            </div>
            </div>
        </div>
        </div>
    );
}

export default Calendar;
