import {Calendar as BigCalendar, dateFnsLocalizer} from 'react-big-calendar';
import format from 'date-fns/format';
import parse from 'date-fns/parse';
import startOfWeek from 'date-fns/startOfWeek';
import getDay from 'date-fns/getDay';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import React, {useState} from 'react';
import 'react-datepicker/dist/react-datepicker.css';
import clickRef from "react-big-calendar/dist/react-big-calendar";
import "../components/Calendar.css";
import Event from "../components/Event";
import CreateEvent from "../components/CreateEvent";
import Animal from "../components/Animal";

const locales = {
    "en-GB" : require("date-fns/locale/en-GB")
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
        animals : [1]
    },
    {
        title : "Bull in with cows",
        allDay: false,
        start: new  Date(2023,11,25, 8),
        end: new  Date(2023,11,28, 16),
        animals : [2]
    },
    {
        title : "School Visits",
        allDay: true,
        start: new  Date(2023,11,20),
        end: new  Date(2023, 11, 21, 23, 59),
        animals : [2,1]
    },
    {
        title : "Defra Inspection",
        allDay: true,
        start: new  Date(2023,11,29),
        end: new Date(2023, 11, 29),
        animals : []
    }
];

const Calendar = () => {
    const [newEvent,setNewEvent] = useState({
        title : "",
        allDay: true,
        start: new Date(2023,11,5,18,29),
        end:  new Date(2023,11,6,18,29)
    })
    const [allEvents,setAllEvents] = useState(events)
    const [selectedEvent,setSelectedEvent] = useState("No event selected")
    const handleAddEvent = () => {
        setAllEvents([...allEvents, newEvent]); /*Adds the new event to the list of allEvents} */
    }

    function eventSelected(event){
        setSelectedEvent(event)
    }


    return (

        <div className="CalendarPage" style={{height: "75%"}}>  
        <h1>Calendar</h1>
        <div style={{height: "100%"}}>
            <div style={{ display: "flex", height: "100%"}}>
            <div style={{width: "65%"}}><BigCalendar localizer={localizer}
                         events={allEvents}
                         startAccessor="start"
                         endAccessor="end"
                         style={{height: "100%", margin:"20px 40px 0 0"}} 
                         showMultiDayTimes
                         onSelectEvent={eventSelected}
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
                        </div>

                    {selectedEvent.animals.map((animalId) => (
                        <Animal key={animalId} animalID={animalId} />
                    ))}

                </div>
                :
                <div></div>
                }
                <CreateEvent handleAddEvent={handleAddEvent} setEvent={setNewEvent}/>
            </div>
            </div>
        </div>
        </div>
    );}

export default Calendar;


