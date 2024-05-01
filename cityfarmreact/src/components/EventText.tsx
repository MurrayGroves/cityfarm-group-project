import React, {useEffect, useState} from 'react';

import { EventPopover } from './EventPopover.tsx';
import { CityFarm } from '../api/cityfarm';
import { Event, EventOnce, EventRecurring } from '../api/events.ts';

export const EventText = ({eventID, farms, cityfarm, style, secondary}: {eventID: string, farms: any, cityfarm: CityFarm, style: (any | undefined), secondary: boolean | undefined}) => {
    const [event, setEvent] = useState<Event | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);
    const [anchorEl, setAnchorEl] = useState<EventTarget | null>(null);

    useEffect(() => {
        (async () => {
            const resp = await cityfarm.getEvent(eventID, true, (event) => {
                setEvent(event);
                setLoading(false);
            })

            if (resp) {
                setEvent(resp);
                setLoading(false);
            } else {
                setError(new Error("Error fetching event"));
                setLoading(false);
            }
        })()
        
    }, [eventID]);

    if (error) {
        return <p>Error: {error.message}</p>;
    }

    if (loading || event == null) {
        return <p>Loading...</p>;
    }

    return (
        <div className='event' style={{margin: '0%', width: '12vw', alignItems: 'left', ...style}} onMouseEnter={(e) => setAnchorEl(e.target)} onMouseLeave={() => setAnchorEl(null)}>
            <EventPopover cityfarm={cityfarm} eventID={event.id} farms={farms} anchorEl={anchorEl}/>
            {
                secondary ? <div>
                                <p className='noMarginTop'>{event.title}</p>
                                <p style={{opacity: '60%'}}>{event.description}</p>
                            </div>
                    :
                    <div>
                        <p className='noMarginTop'><b>{event.title}</b></p>
                        <p>{event.description}</p>
                    </div>
            }

        </div>
    )

}