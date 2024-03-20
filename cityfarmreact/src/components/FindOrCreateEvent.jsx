import { FindEvent } from './FindEvent';
import { EventCreator } from './EventCreator';
import { useState } from 'react';
import { Switch, Tabs, Tab, CustomTabPanel } from '@mui/material';

export const FindOrCreateEvent = (props) => {
    const farms = props.farms;

    const [finding, setFinding] = useState(1);

    return (
        <div>
            <h1>Find or Create Event</h1>
            <Tabs value={finding} onChange={(_, value) => setFinding(value)}>
                <Tab label="Create"/>
                <Tab label="Find"/>
            </Tabs>
            {finding === 1 ? <FindEvent farms={farms}/> : <p>hello</p>}
        </div>
    )
}