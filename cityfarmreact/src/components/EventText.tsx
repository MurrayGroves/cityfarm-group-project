import { getConfig } from '../api/getToken';
import axios from "../api/axiosConfig";

import React, {useEffect, useState} from 'react';

import { EventPopover } from './EventPopover';
import { CityFarm } from '../api/cityfarm';
import { Event, EventOnce, EventRecurring } from '../api/events.ts';

export const EventText = ({eventID, farms, cityfarm}: {eventID: string, farms: any, cityfarm: CityFarm}) => {
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

    function formatPeriod(period: string): string {
        const periodString = period.replace('P', '');
        const yearIndex = periodString.indexOf('Y');
        const monthIndex = periodString.indexOf('M');
        const dayIndex = periodString.indexOf('D');

        const years = yearIndex !== -1 ? parseInt(periodString.substring(0, yearIndex)) : 0;
        const months = monthIndex !== -1 ? parseInt(periodString.substring(Math.max(yearIndex+1, 0), monthIndex)) : 0;
        let days = dayIndex !== -1 ? parseInt(periodString.substring(Math.max(monthIndex+1, yearIndex+1, 0), dayIndex)) : 0;
        const weeks = Math.floor(days / 7);
        days = days % 7;

        console.log(`Parsed ${period} as ${years} years, ${months} months, ${weeks} weeks, ${days} days`)
        let yearString = years > 0 ? years + " year" + (years > 1 ? "s" : "") : "";
        let monthString = months > 0 ? months + " month" + (months > 1 ? "s" : "") : "";
        let weekString = weeks > 0 ? weeks + " week" + (weeks > 1 ? "s" : "") : "";
        let dayString = days > 0 ? days + " day" + (days > 1 ? "s" : "") : "";

        return `${yearString} ${monthString} ${weekString} ${dayString}`;
    }

    console.log("Rendering event: ", event);

    return (
        <div className='event' style={{margin: '0%', width: '12vw', alignItems: 'left'}} onMouseEnter={(e) => setAnchorEl(e.target)} onMouseLeave={() => setAnchorEl(null)}>
            <EventPopover eventID={event.id} farms={farms} anchorEl={anchorEl}/>
            <p className='noMarginTop'><b>{event.title}</b></p>
            <p>{event.description}</p>
        </div>
    )

}