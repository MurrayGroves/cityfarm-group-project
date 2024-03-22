import { Button, Dialog } from "@mui/material";
import React, { useEffect } from "react";
import { useState } from "react";
import { FindOrCreateEvent } from "./FindOrCreateEvent.tsx";
import { Close } from "@mui/icons-material";
import { CityFarm } from "../api/cityfarm";

export const EventSelectorButton = (
                                    {farms, key, currentEventID, setEventID, cityfarm, style}:
                                    {cityfarm: CityFarm, farms: any, key: any, currentEventID: string, setEventID: (eventID: string | null) => void, style: any}
                                    ) => {
    const [eventDialog, setEventDialog] = useState(null);
    const [eventTitle, setEventTitle] = useState('');

    useEffect(() => {
        async function getEvent() {
            const event = await cityfarm.getEvent(currentEventID, true);
            if (event) {
                setEventTitle(event.title);
            }
        }
        getEvent();
    }, [currentEventID, cityfarm.events_cache])
    
    return (
        currentEventID === null || currentEventID === '' ?
            <div style={style}>
                <Button variant="contained" onClick={() => setEventDialog(key)}>Select Event</Button>
                <Dialog open={eventDialog === key} onClose={() => setEventDialog(null)}>
                    <FindOrCreateEvent style={{padding: '1%', width: '30vw', height: '80vh'}} farms={farms} cityfarm={cityfarm} setEvent={(eventID) => {
                        setEventID(eventID);
                    }}/>
                </Dialog>
            </div>
        :
            <div style={style}>
                <Button startIcon={<Close/>} variant="outlined" onClick={() => {
                    setEventID(null);                       
                }}>{eventTitle}</Button>
            </div>
    );
}