import {Calendar as BigCalendar, dateFnsLocalizer} from 'react-big-calendar';
import format from 'date-fns/format';
import parse from 'date-fns/parse';
import startOfWeek from 'date-fns/startOfWeek';
import getDay from 'date-fns/getDay';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import React, {useState} from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import clickRef from "react-big-calendar/dist/react-big-calendar";
import "../components/Calendar.css";
import Event from "../components/Event";

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
    },
    {
        title : "Bull in with cows",
        allDay: false,
        start: new  Date(2023,11,25, 8),
        end: new  Date(2023,11,28, 16),
    },
    {
        title : "School Visits",
        allDay: true,
        start: new  Date(2023,11,20),
        end: new  Date(2023, 11, 21, 23, 59),
    },
    {
        title : "Defra Inspection",
        allDay: true,
        start: new  Date(2023,11,29),
        end: new Date(2023, 11, 29),
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
    const changeAllDay = (isAllDay) =>{
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
                    <Event setSelectedEvent={setSelectedEvent} selectedEvent={selectedEvent}/>
                :
                    <div></div>
                }
                <div style={{width: "85%", margin: "50px 50px 0 0", padding: "10px 10px 10px 10px", boxShadow: "0 0 20px rgba(0, 0, 0, 0.15)"}}>
                <h2 style={{margin: "0 0 10px 0"}}>Add New Event</h2>
            <div>
                <input type="text" placeholder="Add Title" style={{width: "98%"}}
                       value={newEvent.title}
                       onChange={(e) => setNewEvent({...newEvent, title: e.target.value})}/>

                {showingTime(!newEvent.allDay)}


                <div style={{marginTop: "10px"}}>
                <input type = "checkbox" name="All Day"  value="True" checked={newEvent.allDay}
                       onChange={()=>changeAllDay(!newEvent.allDay)}/>
                All day
                <button style={{float: "right"}} onClick={handleAddEvent}>Add Event</button>
                </div>
            </div>
                </div>
            </div>
            </div>
        </div>
        </div>
    );}

export default Calendar;
