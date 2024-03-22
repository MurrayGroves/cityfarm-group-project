import { Button, Dialog } from "@mui/material";
import React from "react";
import { useState } from "react";
import { FindOrCreateEvent } from "./FindOrCreateEvent";

export const EventSelectorButton = ({farms, key, currentEventID, setEventID}) => {
    const [eventDialog, setEventDialog] = useState(null);
    
    return (
        currentEventID === null || currentEventID === '' ?
            <div>
                <Button variant="contained" onClick={() => setEventDialog(key)}>Select Event</Button>
                <Dialog open={eventDialog === key} onClose={() => setEventDialog(null)}>
                    <FindOrCreateEvent style={{padding: '1%', width: '30vw', height: '80vh'}} farms={farms} setIdToEvent={(id, event) => {
                        let newMapping = {...idToEvent};
                        newMapping[id] = event;
                        setIdToEvent(newMapping);
                    }} setEvent={(eventID) => {
                        let newFields = modifyAnimal.fields;
                        newFields[key] = eventID;
                        setModifyAnimal({...modifyAnimal, field: newFields});
                    }}/>
                </Dialog>
            </div>
        :
            <div>
                <Button startIcon={<Close/>} variant="outlined" onClick={() => {
                    let newFields = modifyAnimal.fields;
                    newFields[key] = '';
                    setNewAnimal({...modifyAnimal, field: newFields});                        
                }}>{idToEvent[params.row[key]].event.title}</Button>
            </div>
    );
}