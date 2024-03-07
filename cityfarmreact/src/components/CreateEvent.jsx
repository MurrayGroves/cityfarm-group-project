import { useState } from 'react';
import DatePicker from 'react-datepicker';

const CreateEvent = (props) => {
    const [newEvent, setNewEvent] = useState({
        title: '',
        allDay: true,
        start: new Date(2023, 11, 5, 18, 29),
        end: new Date(2023, 11, 6, 18, 29),
        wh: false,
        hc: false,
        sw: false,
        animals: [],
    });
    const changeAllDay = (isAllDay) => {
        setNewEvent({ ...newEvent, allDay: isAllDay });
    };
    function showingTime(isShown) {
        if (isShown) {
            return (
                <>
                    <div
                        style={{
                            zIndex: 1,
                            position: 'relative',
                            width: '100%',
                        }}
                    >
                        <DatePicker
                            placeholderText="Start Date"
                            style={{}}
                            showTimeSelect
                            todayButton="Today"
                            selected={newEvent.start}
                            onChange={(e) => setNewEvent({ ...newEvent, start: e })}
                            dateFormat="dd/MM/yy hh:mm aa"
                        ></DatePicker>
                        <DatePicker
                            placeholderText="End Date"
                            style={{}}
                            showTimeSelect
                            todayButton="Today"
                            selected={newEvent.end}
                            onChange={(e) => setNewEvent({ ...newEvent, end: e })}
                            dateFormat="dd/MM/yy hh:mm aa"
                        ></DatePicker>
                    </div>
                </>
            );
        } else {
            return (
                <>
                    <div
                        style={{
                            zIndex: 1,
                            position: 'relative',
                            width: '100%',
                        }}
                    >
                        <DatePicker
                            placeholderText="Start Date"
                            style={{}}
                            selected={newEvent.start}
                            onChange={(e) => setNewEvent({ ...newEvent, start: e })}
                            todayButton="Today"
                            dateFormat="dd/MM/yy"
                        ></DatePicker>
                        <DatePicker
                            placeholderText="End Date"
                            style={{}}
                            selected={newEvent.end}
                            onChange={(e) => setNewEvent({ ...newEvent, end: e })}
                            todayButton="Today"
                            dateFormat="dd/MM/yy"
                        ></DatePicker>
                    </div>
                </>
            );
        }
    }

    function addEvent() {
        /* updates the newEvent in the Calendar and then calls a function to add the event to the database */
        props.setEvent(newEvent);
        props.handleAddEvent();
    }

    return (
        <div
            style={{
                width: '85%',
                margin: '50px 50px 0 0',
                padding: '10px 10px 10px 10px',
                boxShadow: '0 0 20px rgba(0, 0, 0, 0.15)',
            }}
        >
            <h2 style={{ margin: '0 0 10px 0' }}>Add New Event</h2>
            <div>
                <input
                    type="text"
                    placeholder="Add Title"
                    style={{ width: '98%' }}
                    value={newEvent.title}
                    onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                />

                {showingTime(!newEvent.allDay)}
                <div style={{ marginTop: '10px' }}>
                    <input
                        type="checkbox"
                        name="All Day"
                        value="True"
                        checked={newEvent.allDay}
                        onChange={() => changeAllDay(!newEvent.allDay)}
                    />
                    All day
                    <button style={{ float: 'right' }} onClick={addEvent}>
                        Add Event
                    </button>
                </div>
                <div style={{ marginTop: '10px' }}>
                    Relevant Farms
                    <br />
                    <input
                        type="checkbox"
                        name="Windmill Hill"
                        value="False"
                        checked={newEvent.wh}
                        onChange={() => setNewEvent({ ...newEvent, wh: !newEvent.wh })}
                    />
                    Windmill Hill
                    <br />
                    <input
                        type="checkbox"
                        name="Hartcliffe"
                        value="False"
                        checked={newEvent.hc}
                        onChange={() => setNewEvent({ ...newEvent, hc: !newEvent.hc })}
                    />
                    Hartcliffe
                    <br />
                    <input
                        type="checkbox"
                        name="St Werberghs"
                        value="False"
                        checked={newEvent.sw}
                        onChange={() => setNewEvent({ ...newEvent, sw: !newEvent.sw })}
                    />
                    St Werberghs
                </div>
            </div>
        </div>
    );
};
export default CreateEvent;
