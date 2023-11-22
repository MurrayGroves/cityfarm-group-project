import {Calendar, dateFnsLocalizer} from 'react-big-calendar';
import format from 'date-fns/format';
import parse from 'date-fns/parse';
import startOfWeek from 'date-fns/startOfWeek';
import getDay from 'date-fns/getDay';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import React, {useState} from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const locales = {
    "en-GB" : require("date-fns/locale/en-GB")
}

const localizer = dateFnsLocalizer(
    format, parse, startOfWeek, getDay, locales
);

const events = [ /*These are example events.*/
    {
        title : "Big Meeting",
        allDay: true,
        start: new  Date(2023,12,1),
        end: new  Date(2023,12,14)
    },
    {
        title : "Vacation",
        allDay: true,
        start: new  Date(2023,11,25),
        end: new  Date(2023,11,28)
    },
    {
        title : "Conference",
        allDay: true,
        start: new  Date(2023,11,29),
        end: new  Date(2024,1,3)
    }
];

const calendar = () => {
    const [newEvent,setNewEvent] = null //useState({title:"",start:"",end:""})
    const [allEvents,setAllEvents] = null //useState(events)
    const handleAddEvent = () => {
        setAllEvents([...allEvents, newEvent]); /*Adds the new event to the list of allEvents} */
    }
    return (
        <div className="calendar">
            <h1>Calendar</h1>
            <h2>Add New Event</h2>
            <div>
                <input type="text" placeholder="Add Title" style={{width: "20%", marginRight: "10px"}}>
                    value={newEvent.title}
                    onChange={(e) => setNewEvent({...newEvent, title: e.target.value})}
                </input>
                <DatePicker placeholderText="Start Date" style={{marginRight: "10px"}}
                selected={newEvent.start} onChange={(e) => setNewEvent({...newEvent, start: e})}/>
                <DatePicker placeholderText="End Date" style={{marginRight: "10px"}}
                 selected={newEvent.end} onChange={(e) => setNewEvent({...newEvent, end: e})}/>
                <button style={{marginTop: "10px"}} onClick={handleAddEvent}>Add Event</button>
            </div>
            <Calendar localizer={localizer}
                      events={allEvents}
                      startAccessor="start"
                      endAccessor="end"
                      style={{height: 500, margin:"50px"}}
            />
        </div>);
}

export default calendar;