import React, {useState, useEffect} from 'react';
import "../pages/Calendar.css";
import AnimalPopover from "./AnimalPopover";
import Close from '@mui/icons-material/Close';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import {  DialogContent, DialogTitle, Fab, ToggleButton, ToggleButtonGroup } from "@mui/material";
import { IconButton, Button, ButtonGroup, Checkbox, FormControlLabel, FormGroup, Dialog, } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import Delete from '@mui/icons-material/Delete';
import AssociateAnimal from './AssociateAnimal';
import AssociateEnclosure from './AssociateEnclosure';
import { EventCreator } from './EventCreator.tsx';
import { EventInstance, Event, EventRecurring, EventOnce } from '../api/events.ts';
import { CityFarm } from '../api/cityfarm.ts';


const EventDisplay = ({
    selectedEvent, setSelectedEvent,
    modifiedEvent, modifyEvent, setModifiedEvent, setModifiedEventAnimals, setModifiedEventEnclosures, setModifyEvent,
    createEvent,
    handleDelEvent, handlePatchEvent,
    showingTime, functionopenPopup, functionclosePopup,
    openAnimalsPopup, openEnclosurePopup,
    changeAllDay,
    farms, cityfarm
    }: {selectedEvent: EventInstance | null, setSelectedEvent: (eventInstance: EventInstance | null) => void, modifiedEvent: Event | null, modifyEvent: boolean, setModifiedEvent: (event: Event | null) => void,
        setModifiedEventAnimals: (animals: string[]) => void, setModifiedEventEnclosures: (enclosures: string[]) => void, setModifyEvent: (modify: boolean)=>void,
        createEvent: boolean, handleDelEvent: () => void, handlePatchEvent: () => void, showingTime: (show: boolean) => JSX.Element, functionopenPopup: (type: string) => void, functionclosePopup: () => void,
        openAnimalsPopup: boolean, openEnclosurePopup: boolean, changeAllDay: (allDay: boolean, type: string) => void, farms: any, cityfarm: CityFarm
    }) => {
    
        console.log("selected", selectedEvent);

    return (<>
        <div style={{overflow: 'auto'}}>
            { selectedEvent !== null ?
                <>
                    <div style={{display: "flex", justifyContent: "space-between"}}>
                        <h2 className='boxTitle'>Selected Event</h2>
                        <span style={{display: 'flex', justifyContent: 'right'}}>
                            {!modifyEvent && <IconButton sx={{height: '40px'}} onClick={()=>{setModifyEvent(true)}}><EditIcon/></IconButton>}
                            <IconButton sx={{height: '40px'}} onClick={() => handleDelEvent()}><Delete/></IconButton>
                            <IconButton sx={{height: '40px'}} onClick={() => {setModifyEvent(false); setSelectedEvent(null)}}><Close/></IconButton>
                        </span>
                    </div>
                    {!modifyEvent ?
                    <div className='selectedEvent'>
                        <h2 className='noMarginTop'>{selectedEvent.event.title}</h2>
                        {
                            selectedEvent.event.allDay ?
                                <div>
                                    <p>{selectedEvent.start.toLocaleDateString()} {selectedEvent.end == null ? <></> : selectedEvent.end.toLocaleDateString() === selectedEvent.start.toLocaleDateString() ? <></> : " - " + selectedEvent.end.toLocaleDateString()}</p>
                                </div>
                                :
                                <div>
                                    <p>{selectedEvent.start.toLocaleString([], {year: '2-digit', month: '2-digit', day: '2-digit', hour: '2-digit', minute:'2-digit'})} - {selectedEvent.start.toLocaleDateString() === selectedEvent.end.toLocaleDateString() ? selectedEvent.end.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : selectedEvent.end.toLocaleString([], {year: '2-digit', month: '2-digit', day: '2-digit', hour: '2-digit', minute:'2-digit'})}</p>
                                </div>

                        }
                        {selectedEvent.event.farms?.length > 0 ? <h3>Farms</h3> : <></>}
                        {selectedEvent.event.farms?.includes(farms.WH) ? <p>Windmill Hill</p> : <></>}
                        {selectedEvent.event.farms?.includes(farms.HC) ? <p>Hartcliffe</p> : <></>}
                        {selectedEvent.event.farms?.includes(farms.SW) ? <p>St Werburghs</p> : <></>}
                        {selectedEvent.event.animals?.length > 0 ? <h3>Animals</h3> : <></>}
                        {selectedEvent.event.animals?.map((animal) => (
                            <AnimalPopover key={animal._id} animalID={animal._id}/>
                        ))}
                        {selectedEvent.event.enclosures?.length > 0 &&
                        <div>
                            <h3>Enclosures</h3>
                            {selectedEvent.event.enclosures.map((enclosure, index) => (
                                <p key={index} className='noMarginTop'>{enclosure.name}</p>
                            ))}
                        </div>}
                        {selectedEvent.event.description !== "" ?
                        <div>
                            <h3>Description</h3>
                            {selectedEvent.event.description}
                        </div> : <></>}
                    </div>
                    :
                    <div className='modifyEvent'>
                        <TextField
                            error={modifiedEvent?.title === ''}
                            fullWidth
                            size='small'
                            placeholder={selectedEvent?.event.title}
                            label='Title'
                            value={modifiedEvent?.title}
                            onChange={(e)=>{
                                if (modifiedEvent !== null) {
                                    setModifiedEvent({...modifiedEvent, title: e.target.value})
                                } else {
                                    setModifiedEvent({...selectedEvent.event, title: e.target.value})
                                }
                            }}
                        />
                        {showingTime(!modifiedEvent?.allDay)}
                        <div style={{marginTop: "10px"}}>
                            <FormControlLabel control={<Checkbox checked={modifiedEvent?.allDay} size='small'/>} label="All Day" onChange={(e) => {changeAllDay(!modifiedEvent?.allDay, "modify")}}/>
                            <ButtonGroup style={{float: 'right'}}>
                                <Button variant='contained' color='warning' onClick={()=>{setModifyEvent(false)}}>Discard</Button>
                                <Button variant='contained' color='success' onClick={()=>{handlePatchEvent()}}>Update</Button>
                            </ButtonGroup>
                        </div>
                        <div>
                            <h3>Farms</h3>
                            <FormGroup>
                                <FormControlLabel control={<Checkbox checked={modifiedEvent?.farms.includes(farms.WH)} color={farms.WH} size='small'/>} label="Windmill Hill" onChange={() => {
                                    let eventBase = modifiedEvent ? modifiedEvent : selectedEvent.event;
                                    setModifiedEvent({...eventBase, farms: eventBase.farms.includes(farms.WH) ? eventBase.farms.filter((farm) => farm !== farms.WH) : eventBase.farms.concat(farms.WH)})
                                }}/>
                                <FormControlLabel control={<Checkbox checked={modifiedEvent?.farms.includes(farms.HC)} color={farms.HC} size='small'/>} label="Hartcliffe" onChange={() => {
                                    let eventBase = modifiedEvent ? modifiedEvent : selectedEvent.event;
                                    setModifiedEvent({...eventBase, farms: eventBase.farms.includes(farms.HC) ? eventBase.farms.filter((farm) => farm !== farms.HC) : eventBase.farms.concat(farms.HC)})
                                }}/>
                                <FormControlLabel control={<Checkbox checked={modifiedEvent?.farms.includes(farms.SW)} color={farms.SW} size='small'/>} label="St Werburghs" onChange={() => {
                                    let eventBase = modifiedEvent ? modifiedEvent : selectedEvent.event;
                                    setModifiedEvent({...eventBase, farms: eventBase.farms.includes(farms.SW) ? eventBase.farms.filter((farm) => farm !== farms.SW) : eventBase.farms.concat(farms.SW)})
                                
                                }}/>
                            </FormGroup>
                        </div>
                        <div>
                            <span style={{display: 'flex'}}><h3>Animals</h3><IconButton style={{height: '40px', margin: '12.5px 0 0 5px'}} onClick={() => {functionopenPopup("animals")}}><AddIcon color='primary'/></IconButton></span>
                            {modifiedEvent?.animals.map((animal) => {
                                return (<AnimalPopover key={animal} animalID={animal} />)}
                            )}{/*Add a way to remove animals from events */}
                            <div id="AssociateAnimal" style={{textAlign:'center'}}>
                                <Dialog fullWidth maxWidth='md' open={openAnimalsPopup} onClose={functionclosePopup}>
                                    <DialogTitle>Add Animal</DialogTitle>
                                    <DialogContent>
                                        <AssociateAnimal setAnimals={setModifiedEventAnimals} animals={modifiedEvent?.animals} close={functionclosePopup}></AssociateAnimal>
                                    </DialogContent>
                                </Dialog>
                            </div>
                        </div>
                        <div>
                            <span style={{display: 'flex'}}><h3>Enclosures</h3><IconButton style={{height: '40px', margin: '12.5px 0 0 5px'}} onClick={() => {functionopenPopup("enclosures")}}><AddIcon color='primary'/></IconButton></span>
                            {modifiedEvent?.enclosures.map((enclosure, index) => (
                                <p key={index}>{enclosure}</p>
                            ))}{/*Add a way to remove enclosures from events */}
                            {/* idea: make this open the enlcosure  page with a new column of checkboxes. Click on an associate enlcosure(s) button would then pass a list of enclosure names to the calendar to be placed in a field*/}
                            <div id="AssociateEnclosure" style={{textAlign:'center'}}>
                                <Dialog fullWidth maxWidth='md' open={openEnclosurePopup} onClose={functionclosePopup}>
                                    <DialogTitle>Add Enclosure</DialogTitle>
                                    <DialogContent>
                                        <AssociateEnclosure enclosures={modifiedEvent?.enclosures} setEnclosures={setModifiedEventEnclosures} close={functionclosePopup}></AssociateEnclosure>
                                    </DialogContent>
                                </Dialog>
                            </div>
                        </div>
                        <div>
                            <h3>Description</h3>
                            <TextField
                                fullWidth
                                size='small'
                                multiline
                                rows={3}
                                placeholder='Enter Description'
                                value={modifiedEvent?.description}
                                onChange={(e) => {
                                    if (modifiedEvent !== null) {
                                        setModifiedEvent({...modifiedEvent, description: e.target.value})
                                    } else {
                                        setModifiedEvent({...selectedEvent.event, description: e.target.value})
                                    }
                                }}
                            />
                        </div>
                    </div>}
                </>
                :
                <>
                {createEvent && <EventCreator farms={farms} cityfarm={cityfarm} setEvent={(eventID)=>{cityfarm.getEvent(eventID, true).then((event) => {
                    if (event === null) {
                        setSelectedEvent(null);
                        return;
                    }

                    if (event instanceof EventRecurring) {
                        let instance = new EventInstance({start: new Date(event.firstStart), end: event.firstEnd === null ? null : new Date(event.firstEnd), event: event})
                        setSelectedEvent(instance)
                    } else if (event instanceof EventOnce) {
                        let instance = new EventInstance({start: new Date(event.start), end: event.end === null ? null : new Date(event.end), event: event})
                        setSelectedEvent(instance)
                    }
                }
                )}} style={{width: '100%'}}/>}</>}
        </div>
    </>)
}

export default EventDisplay