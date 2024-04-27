import { Button, Dialog } from "@mui/material";
import React, { useEffect } from "react";
import { useState } from "react";
import { FindOrCreateEvent } from "./FindOrCreateEvent.tsx";
import { Close } from "@mui/icons-material";
import { CityFarm } from "../api/cityfarm";

export const EventSelectorButton = (
                                    {farms, open, currentEventID, setEventID, cityfarm, style}:
                                    {cityfarm: CityFarm, farms: any, open: any, currentEventID: string, setEventID: (eventID: string | null) => void, style: any}
                                    ) => {
    const [eventDialog, setEventDialog] = useState(null);
    const [eventTitle, setEventTitle] = useState<string>('');

    useEffect(() => {
        async function getEvent() {
            const event = await cityfarm.getEvent(currentEventID, true);
            if (event) {
                setEventTitle(event.title);
            }
        }
        getEvent();
    }, [currentEventID, cityfarm.events_cache])

    // Close the dialog when the event is selected
    useEffect(() => {
        console.log("Current Event ID", currentEventID)
        setEventDialog(null)
    }, [currentEventID])
    
    return (
        currentEventID === null || currentEventID === '' ?
            <div style={style}>
                <Button variant="contained" onClick={() => setEventDialog(open)}>Select Event</Button>
                <Dialog fullWidth maxWidth='xs' open={eventDialog === open} onClose={() => setEventDialog(null)}>
                    <FindOrCreateEvent style={{padding: '10px', height: '60vw'}} farms={farms} cityfarm={cityfarm} setEvent={(eventID) => {
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