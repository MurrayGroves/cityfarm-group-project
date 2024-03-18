import { FindEvent } from './FindEvent';
import { EventCreator } from './EventCreator';
import { useState } from 'react';
import { Switch } from '@mui/material';

export const FindOrCreateEvent = (props) => {
    const farms = props.farms;

    const [finding, setFinding] = useState(true);

    return (
        <div>
            <h1>Find or Create Event</h1>
            <Switch checked={finding} onChange={(e) => setFinding(e.target.value)}/>
            {finding ? <FindEvent farms={farms}/> : <EventCreator/>}
        </div>
    )
}