import {Calendar as BigCalendar, dateFnsLocalizer} from 'react-big-calendar';
import format from 'date-fns/format';
import parse from 'date-fns/parse';
import startOfWeek from 'date-fns/startOfWeek';
import getDay from 'date-fns/getDay';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import React, {useState} from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
//import EventView from "./EventView";
import clickRef from "react-big-calendar/dist/react-big-calendar";

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
        title : "Big Meeting",
        allDay: true,
        start: new  Date(2023,12,1),
        end: new  Date(2023,12,14),
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
        end: new  Date(2024,1,3,6,18,29)
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
    const handleAddEvent = () => {
        setAllEvents([...allEvents, newEvent]); /*Adds the new event to the list of allEvents} */

    }
    const changeAllDay = (isAllDay) =>{
        setNewEvent({...newEvent,allDay: isAllDay});
    }
    function showingTime(isShown) {
        if (isShown){
            return(

                <div style={{zIndex : 999 ,position :"relative"}}>
                    <DatePicker placeholderText="Start Date" style={{marginRight: "10px"}}
                                showTimeSelect
                                todayButton = "Today"
                                selected={newEvent.start} onChange={(e) => setNewEvent({...newEvent,
                        start: e})}
                                dateFormat="MM/dd/yy h:mm aa">
                    </DatePicker>
                    <DatePicker placeholderText="End Date" style={{marginRight: "10px"}}
                                showTimeSelect
                                todayButton = "Today"
                                selected={newEvent.end} onChange={(e) => setNewEvent({...newEvent, end: e })}
                                dateFormat="MM/dd/yy h:mm aa">
                    </DatePicker>
                </div>
            )
        }
        else{
            return(
                <div style={{zIndex : 999 ,position :"relative"}}>
                    <DatePicker placeholderText="Start Date" style={{marginRight: "10px"}}
                                selected={newEvent.start} onChange={(e) => setNewEvent({...newEvent, start: e})}
                                todayButton = "Today"
                                dateFormat="MM/dd/yy">
                    </DatePicker>
                    <DatePicker placeholderText="End Date" style={{marginRight: "10px"}}
                                selected={newEvent.end} onChange={(e) => setNewEvent({...newEvent, end: e })}
                                todayButton = "Today"
                                dateFormat="MM/dd/yy">
                    </DatePicker>
                    deselect all day to see timing options
                </div>
            )
        }
    }
    function eventSelected(event){
        window.clearTimeout(clickRef?.current)
        clickRef.current = window.setTimeout(() => {
            window.alert(event.title +"\n"+event.start+"->"+event.end)
        }, 250)
    }
    return (
        <div className="calendar">
            <h1>Calendar</h1>
            <h2>Add New Event</h2>
            <div>
                <input type="text" placeholder="Add Title" style={{width: "20%", marginRight: "10px"}}
                       value={newEvent.title}
                       onChange={(e) => setNewEvent({...newEvent, title: e.target.value})}/>



                {showingTime(!newEvent.allDay)}


                <input type = "checkbox" name="All Day"  value="True" checked={newEvent.allDay}
                       onChange={()=>changeAllDay(!newEvent.allDay)}/>
                All day
                <button style={{marginTop: "10px"}} onClick={handleAddEvent}>Add Event</button>
            </div>
            <BigCalendar localizer={localizer}
                         events={allEvents}
                         startAccessor="start"
                         endAccessor="end"
                         style={{height: 500, margin:"50px"}}
                         showMultiDayTimes
                         onSelectEvent={eventSelected}
            />
        </div>);
}

export default Calendar;