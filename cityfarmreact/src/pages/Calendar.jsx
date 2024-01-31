import {Calendar as BigCalendar, dateFnsLocalizer} from 'react-big-calendar';
import format from 'date-fns/format';
import parse from 'date-fns/parse';
import startOfWeek from 'date-fns/startOfWeek';
import getDay from 'date-fns/getDay';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import React, {useState} from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import "../components/Calendar.css";
import Event from "../components/Event";
import CreateEvent from "../components/CreateEvent";
import Animal from "../components/Animal";

const locales = {
    "en-GB" : require("date-fns/locale/en-GB")
}

const colours = {
    wh: "#FF0000",
    hc: "#6666FF",
    sw: "#3312FF",
    default: "#000000"
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
        start: new  Date(2023,11,1, 13),
        end: new  Date(2023,11,1, 14),
        wh: false,
        hc: false,
        sw: false,
        animals : [1]
    },
    {
        title : "Bull in with cows",
        allDay: false,
        start: new  Date(2023,11,25, 8),
        end: new  Date(2023,11,28, 16),
        wh: true,
        hc: false,
        sw: false,
        animals : [2]
    },
    {
        title : "School Visits",
        allDay: true,
        start: new  Date(2023,11,20),
        end: new  Date(2023, 11, 21, 23, 59),
        wh: false,
        hc: true,
        sw: true,
        animals : [2,1]
    },
    {
        title : "Defra Inspection",
        allDay: true,
        start: new  Date(2023,11,29),
        end: new Date(2023, 11, 29),
        wh: true,
        hc: true,
        sw: true,
        animals : []
    }
];

const Calendar = () => {
    const [newEvent,setNewEvent] = useState({
        title: "",
        allDay: true,
        start: new Date(2023,11,5,18,29),
        end:  new Date(2023,11,6,18,29),
        wh: false,
        hc: false,
        sw: false,
    })
    const [allEvents,setAllEvents] = useState(events)
    const [selectedEvent,setSelectedEvent] = useState("No event selected")
    const handleAddEvent = () => {
        setAllEvents([...allEvents, newEvent]); /*Adds the new event to the list of allEvents} */
    }
    
    const changeAllDay = (isAllDay) => {
        setNewEvent({...newEvent,allDay: isAllDay});
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
                                dateFormat="dd/MM/yy hh:mm aa">
                    </DatePicker>
                    <DatePicker placeholderText="End Date"
                                style={{}}
                                showTimeSelect
                                todayButton = "Today"
                                selected={newEvent.end} onChange={(e) => setNewEvent({...newEvent, end: e })}
                                dateFormat="dd/MM/yy hh:mm aa">
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
                                dateFormat="dd/MM/yy">
                    </DatePicker>
                    <DatePicker placeholderText="End Date"
                                style={{}}
                                selected={newEvent.end} onChange={(e) => setNewEvent({...newEvent, end: e })}
                                todayButton = "Today"
                                dateFormat="dd/MM/yy">
                    </DatePicker>
                </div></>
            )
        }
    }

    function eventSelected(event){
        setSelectedEvent(event)
    }


    return (

        <div className="CalendarPage" style={{height: "75%"}}>  
        <h1>Calendar</h1>
        <div style={{height: "100%"}}>
            <div style={{ display: "flex", height: "100%"}}>
            <div style={{width: "65%"}}><BigCalendar
                        localizer={localizer}
                         events={allEvents}
                         startAccessor="start"
                         endAccessor="end"
                         style={{height: "100%", margin:"20px 40px 0 0"}} 
                         showMultiDayTimes
                         onSelectEvent={eventSelected}

                         //Somehow change event colour to match the relevant farm

                         /*
                         eventPropGetter={(events) => {
                            const colour = events.wh ? colours.wh : (events.hc ? colours.hc : (events.sw ? colours.sw : colours.default))
                            return {style: {backgroundColor: {colour}}};
                        }}
                        */
            /></div>
            <div style={{width: "35%"}}>
                { selectedEvent !== "No event selected" ?
                <div style={{width: 358.5, padding: "10px 10px 10px 10px", boxShadow: "0 0 20px rgba(0, 0, 0, 0.15)"}}>
                    <h2 style={{margin: "0 0 10px 0"}}>Selected Event</h2>
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
                        <h3>Relevant Farms</h3>
                        {selectedEvent.wh ? <p>Windmill Hill</p> : <></>}
                        {selectedEvent.hc ? <p>Hartcliffe</p> : <></>}
                        {selectedEvent.sw ? <p>St Werberghs</p> : <></>}
                        <h3>Relevant Animals</h3>
                        {selectedEvent.animals.map((animalId) => (
                        <Animal key={animalId} animalID={animalId} />
                        ))}
                    </div>
                </div>
                :
                <></>
                }

                <div style={{width: "85%", width: 358.5, margin: "50px 50px 0 0", padding: "10px 10px 10px 10px", boxShadow: "0 0 20px rgba(0, 0, 0, 0.15)"}}>
                <h2 style={{margin: "0 0 10px 0"}}>Add New Event</h2>
                <div>
                <input type="text" placeholder="Add Title" style={{width: "98%"}}
                       value={newEvent.title}
                       onChange={(e) => setNewEvent({...newEvent, title: e.target.value})}/>

                {showingTime(!newEvent.allDay)}
                </div>
                <div style={{marginTop: "10px"}}>
                <input type = "checkbox" name="All Day"  value="True" checked={newEvent.allDay}
                       onChange={()=>changeAllDay(!newEvent.allDay)}/>
                All day
                <button style={{float: "right"}} onClick={handleAddEvent}>Add Event</button>
                </div>
                <div style={{marginTop: "10px"}}>
                Relevant Farms<br/>
                <input type="checkbox" name="Windmill Hill" value="False" checked={newEvent.wh}
                    onChange={()=>setNewEvent({...newEvent, wh: !newEvent.wh})}/>
                Windmill Hill<br/>

                <input type="checkbox" name="Hartcliffe" value="False" checked={newEvent.hc}
                    onChange={()=>setNewEvent({...newEvent, hc: !newEvent.hc})}/>
                Hartcliffe<br/>

                <input type="checkbox" name="St Werberghs" value="False" checked={newEvent.sw}
                    onChange={()=>setNewEvent({...newEvent, sw: !newEvent.sw})}/>
                St Werberghs
                </div>
                </div>
                <CreateEvent handleAddEvent={handleAddEvent} setEvent={setNewEvent}/>
            </div>
            </div>
            </div>
        </div>
    );}

export default Calendar;


