import { FindEvent } from './FindEvent';
import { EventCreator } from './EventCreator';
import { useState } from 'react';
import { Tabs, Tab, Divider } from '@mui/material';

export const FindOrCreateEvent = (props) => {
    const farms = props.farms;

    const [finding, setFinding] = useState(1);

    return (
        <div style={props.style}>
            <Tabs value={finding} onChange={(_, value) => setFinding(value)}>
                <Tab label="Create"/>
                <Tab label="Find"/>
            </Tabs>
            <Divider/>
            {finding === 1 ? <FindEvent setIdToEvent={props.setIdToEvent} setEvent={props.setEvent} farms={farms} style={{marginTop: '1%'}}/> : <EventCreator style={{marginTop: '1%'}} farms={farms}/>}
        </div>
    )
}