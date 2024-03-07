import { useState } from 'react';
import AnimalPopover from './AnimalPopover';
const Event = (props) => {
    const [event, setEvent] = useState(props.selectedEvent);
    const [updating, setUpdating] = useState(false);
    return (
        <>
            {event !== 'No event selected' ? (
                <div
                    style={{
                        width: '85%',
                        padding: '10px 10px 10px 10px',
                        boxShadow: '0 0 20px rgba(0, 0, 0, 0.15)',
                    }}
                >
                    <h2 style={{ margin: '0 0 10px 0' }}>Selected Event</h2>
                    <div>
                        <h3>{event.title}</h3>
                        <a
                            style={{
                                position: 'absolute',
                                top: 0,
                                right: 25,
                                marginLeft: 50,
                            }}
                            onClick={props.setSelectedEvent('No event selected')}
                        >
                            x
                        </a>

                        <button
                            onClick={() => {
                                setUpdating(!updating);
                            }}
                        >
                            Modify
                        </button>
                        {!updating ? (
                            <>
                                {event.allDay ? (
                                    <div>
                                        <p>
                                            {event.start.toLocaleDateString()}{' '}
                                            {event.end == null ? (
                                                <p></p>
                                            ) : event.end.toLocaleDateString() === event.start.toLocaleDateString() ? (
                                                <p></p>
                                            ) : (
                                                ' - ' + event.end.toLocaleDateString()
                                            )}
                                        </p>
                                    </div>
                                ) : (
                                    <div>
                                        <p>
                                            {event.start.toLocaleString([], {
                                                year: '2-digit',
                                                month: '2-digit',
                                                day: '2-digit',
                                                hour: '2-digit',
                                                minute: '2-digit',
                                            })}{' '}
                                            -{' '}
                                            {event.start.toLocaleDateString() === event.end.toLocaleDateString()
                                                ? event.end.toLocaleTimeString([], {
                                                      hour: '2-digit',
                                                      minute: '2-digit',
                                                  })
                                                : event.end.toLocaleString([], {
                                                      year: '2-digit',
                                                      month: '2-digit',
                                                      day: '2-digit',
                                                      hour: '2-digit',
                                                      minute: '2-digit',
                                                  })}
                                        </p>
                                    </div>
                                )}
                            </>
                        ) : (
                            <div>
                                {/*display of attributes to be modified (The changes made should alter event state) */}
                                <button onClick={() => props.setSelectedEvent(event)}>Update Event</button>
                                <button onClick={() => setEvent(props.selectedEvent)}>Discard Changes</button>
                            </div>
                        )}
                    </div>
                </div>
            ) : (
                <></>
            )}
        </>
    );
};
export default Event;
