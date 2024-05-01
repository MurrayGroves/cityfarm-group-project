import React, { useState, useEffect } from 'react';
import { Paper, Popover } from '@mui/material';

import AnimalPopover from './AnimalPopover.tsx';
import { Event, EventOnce, EventRecurring } from '../api/events.ts';
import { CityFarm } from '../api/cityfarm.ts';

const dateTimeFormat: any = {year: 'numeric', month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit'}
const timeFormat: any = {hour: '2-digit', minute: '2-digit'}

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

    let yearString = years > 0 ? years + " year" + (years > 1 ? "s" : "") : "";
    let monthString = months > 0 ? months + " month" + (months > 1 ? "s" : "") : "";
    let weekString = weeks > 0 ? weeks + " week" + (weeks > 1 ? "s" : "") : "";
    let dayString = days > 0 ? days + " day" + (days > 1 ? "s" : "") : "";

    return `${yearString} ${monthString} ${weekString} ${dayString}`;
}

function sameDay(date1: Date, date2: Date): boolean {
    return (date1.getDate() === date2.getDate() 
            && date1.getMonth() === date2.getMonth()
            && date1.getFullYear() === date2.getFullYear())
}

export const EventDate = ({event}: {event: Event}) => {
    return event.allDay ?
    <div>
        {(event instanceof EventRecurring) ? 
            <div>
                {sameDay(event.firstStart, event.firstEnd) ?
                    <p>{event.firstStart.toLocaleDateString()}</p>
                :
                    <p>{event.firstStart.toLocaleDateString()} - {event.firstEnd.toLocaleDateString()}</p>
                }

                Repeats every {formatPeriod(event.delay)}
            </div>
        :
            (
                sameDay((event as EventOnce).start, (event as EventOnce).end) ?
                    <p>{(event as EventOnce).start.toLocaleDateString()}</p>
                :
                    <p>{(event as EventOnce).start.toLocaleDateString()} - {(event as EventOnce).end.toLocaleDateString()}</p>
            )
        }
    </div>
    :
    <div>
        {(event instanceof EventRecurring) ? 
            <div>
                {sameDay(event.firstStart, event.firstEnd) ?
                    <p>First occurence at {event.firstStart.toLocaleString([], dateTimeFormat)} - {event.firstEnd.toLocaleTimeString([], timeFormat)}</p>
                :
                    <p>First occurence at {event.firstStart.toLocaleString([], dateTimeFormat)} - {event.firstEnd.toLocaleString([], dateTimeFormat)}</p>
                }

                Repeats every {formatPeriod(event.delay)}
            </div>
        :
            (
                sameDay((event as EventOnce).start, (event as EventOnce).end) ?
                    <p>{(event as EventOnce).start.toLocaleString([], dateTimeFormat)} - {(event as EventOnce).end.toLocaleTimeString([], timeFormat)}</p>
                :
                    <p>{(event as EventOnce).start.toLocaleString([], dateTimeFormat)} - {(event as EventOnce).end.toLocaleString([], dateTimeFormat)}</p>
            )
        }
    </div>
}

export const EventPopover = ({farms, cityfarm, eventID, anchorEl}: {farms: any, cityfarm: CityFarm, eventID: string, anchorEl: any}) => {
    const [event, setEvent] = useState<Event | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

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
        return <Paper>Error: {error.message}</Paper>;
    }

    const open = Boolean(anchorEl);

    return (
        <Popover
            id="mouse-over-popover"
            sx={{pointerEvents: 'none', maxWidth: '80vw'}}
            anchorEl={anchorEl}
            open={open}
            anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
            }}
            disableRestoreFocus
        >
            {loading || event === null ? <Paper>Loading...</Paper> :
                    <div className='event' style={{margin: '5%'}}>
                        <h2 className='noMarginTop'>{event.title}</h2>
                        <EventDate event={event} />
                        {event.farms.length > 0 ? <h3>Farms</h3> : <></>}
                        {event.farms.includes(farms.WH) ? <p>Windmill Hill</p> : <></>}
                        {event.farms.includes(farms.HC) ? <p>Hartcliffe</p> : <></>}
                        {event.farms.includes(farms.SW) ? <p>St Werburghs</p> : <></>}
                        {event.animals.length > 0 ? <h3>Animals</h3> : <></>}
                        {event.animals.map((animal) => (
                            <AnimalPopover cityfarm={cityfarm} key={animal.id} animalID={animal.id}/>
                        ))}
                        {event.enclosures.length > 0 &&
                        <div>
                            <h3>Enclosures</h3>
                            {event.enclosures.map((enclosure, index) => (
                                <p key={index} className='noMarginTop'>{enclosure.name}</p>
                            ))}
                        </div>}
                        {event.description !== "" ?
                        <div>
                            <h3>Description</h3>
                            {event.description}
                        </div> : <></>}
                    </div>
    }</Popover>
    )
}