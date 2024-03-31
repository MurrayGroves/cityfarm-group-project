import { FindEvent } from './FindEvent.tsx';
import { EventCreator } from './EventCreator.tsx';
import { useState } from 'react';
import { Tabs, Tab, Divider } from '@mui/material';
import { CityFarm } from '../api/cityfarm';
import React from 'react';

export const FindOrCreateEvent = ({style, farms, cityfarm, setEvent}: {style: any, farms: any, cityfarm: CityFarm, setEvent: (string) => void}) => {
    const [finding, setFinding] = useState(1);

    return (
        <div style={style}>
            <Tabs value={finding} onChange={(_, value) => setFinding(value)}>
                <Tab label="Create"/>
                <Tab label="Find"/>
            </Tabs>
            <Divider/>
            {finding === 1 ?
                <FindEvent cityfarm={cityfarm} setEvent={setEvent} farms={farms} style={{marginTop: '1%'}}/>
            :
                <EventCreator style={{marginTop: '1%'}} farms={farms} cityfarm={cityfarm} setEvent={setEvent}/>
            }
        </div>
    )
}