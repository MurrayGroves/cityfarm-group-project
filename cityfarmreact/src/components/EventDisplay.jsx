import React, {useState, useEffect} from 'react';
import "../pages/Calendar.css";
import AnimalPopover from "../components/AnimalPopover.tsx";
import Close from '@mui/icons-material/Close';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import {  DialogContent, DialogTitle, Fab, ToggleButton, ToggleButtonGroup } from "@mui/material";
import { IconButton, Button, ButtonGroup, Checkbox, FormControlLabel, FormGroup, Dialog, } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import Delete from '@mui/icons-material/Delete';
import AssociateAnimal from '../components/AssociateAnimal';
import AssociateEnclosure from '../components/AssociateEnclosure';
import Enclosure from './Enclosure.tsx';

const EventDisplay = ({
        selectedEvent, setSelectedEvent,
        modifiedEvent, modifyEvent, setModifiedEvent, setModifiedEventAnimals, setModifiedEventEnclosures, setModifyEvent,
        newEvent, createEvent, setNewEvent, setAddEventAnimals, setAddEventEnclosures,
        handleAddEvent, handleDelEvent, handlePatchEvent,
        showingTime, functionopenPopup, functionclosePopup,
        openAnimalsPopup, openEnclosurePopup,
        recurring, changeRecurring, changeAllDay,
        farms, device, cityfarm
    }) => {

    return (<>
        <div>
            { selectedEvent !== "" ?
                <>
                    <div style={{display: "flex", justifyContent: "space-between"}}>
                        <h2 className='boxTitle'>Selected Event</h2>
                        <span style={{display: 'flex', justifyContent: 'right'}}>
                            {!modifyEvent && <IconButton sx={{height: '40px'}} onClick={()=>{setModifyEvent(true)}}><EditIcon/></IconButton>}
                            <IconButton sx={{height: '40px'}} onClick={() => handleDelEvent()}><Delete/></IconButton>
                            <IconButton sx={{height: '40px'}} onClick={() => {setModifyEvent(false); setSelectedEvent("")}}><Close/></IconButton>
                        </span>
                    </div>
                    {!modifyEvent ?
                    <div className='selectedEvent'>
                        <h2 className='noMarginTop'>{selectedEvent.title}</h2>
                        {
                            selectedEvent.allDay ?
                                <div>
                                    <p>{selectedEvent.start.toLocaleDateString()} {selectedEvent.end == null ? <></> : selectedEvent.end.toLocaleDateString() === selectedEvent.start.toLocaleDateString() ? <></> : " - " + selectedEvent.end.toLocaleDateString()}</p>
                                </div>
                                :
                                <div>
                                    <p>{selectedEvent.start.toLocaleString([], {year: '2-digit', month: '2-digit', day: '2-digit', hour: '2-digit', minute:'2-digit'})} - {selectedEvent.start.toLocaleDateString() === selectedEvent.end.toLocaleDateString() ? selectedEvent.end.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : selectedEvent.end.toLocaleString([], {year: '2-digit', month: '2-digit', day: '2-digit', hour: '2-digit', minute:'2-digit'})}</p>
                                </div>

                        }
                        {selectedEvent.farms.length > 0 ? <h3>Farms</h3> : <></>}
                        {selectedEvent.farms.includes(farms.WH) ? <p>Windmill Hill</p> : <></>}
                        {selectedEvent.farms.includes(farms.HC) ? <p>Hartcliffe</p> : <></>}
                        {selectedEvent.farms.includes(farms.SW) ? <p>St Werburghs</p> : <></>}
                        {selectedEvent.animals.length > 0 ? <h3>Animals</h3> : <></>}
                        {selectedEvent.animals.map((animal) => (
                            <AnimalPopover key={animal._id} cityfarm={cityfarm} animalID={animal._id}/>
                        ))}
                        {selectedEvent.enclosures.length > 0 &&
                        <div>
                            <h3>Enclosures</h3>
                            {selectedEvent.enclosures.map((enclosure, index) => (
                                <Enclosure key={index} enclosureID={enclosure._id}/>
                            ))}
                        </div>}
                        {selectedEvent.description !== "" ?
                        <div>
                            <h3>Description</h3>
                            {selectedEvent.description}
                        </div> : <></>}
                    </div>
                    :
                    <div className='modifyEvent'>
                        <TextField
                            error={modifiedEvent.title === ''}
                            fullWidth
                            size='small'
                            placeholder={selectedEvent.title}
                            label='Title'
                            value={modifiedEvent.title}
                            onChange={(e)=>setModifiedEvent({...modifiedEvent, title: e.target.value})}
                        />
                        {showingTime(!modifiedEvent.allDay,"modify")}
                        <div style={{marginTop: "10px"}}>
                            <FormControlLabel control={<Checkbox checked={modifiedEvent.allDay} size='small'/>} label="All Day" onChange={(e) => {changeAllDay(!modifiedEvent.allDay, "modify")}}/>
                            <ButtonGroup style={{float: 'right'}}>
                                <Button variant='contained' color='warning' onClick={()=>{setModifyEvent(false)}}>Discard</Button>
                                <Button variant='contained' color='success' onClick={()=>{handlePatchEvent()}}>Update</Button>
                            </ButtonGroup>
                        </div>
                        <div>
                            <h3>Farms</h3>
                            <FormGroup>
                                <FormControlLabel control={<Checkbox checked={modifiedEvent.farms.includes(farms.WH)} color={farms.WH} size='small'/>} label="Windmill Hill" onChange={() => setModifiedEvent({...modifiedEvent, farms: modifiedEvent.farms.includes(farms.WH) ? modifiedEvent.farms.filter((farm) => farm !== farms.WH) : modifiedEvent.farms.concat(farms.WH)})}/>
                                <FormControlLabel control={<Checkbox checked={modifiedEvent.farms.includes(farms.HC)} color={farms.HC} size='small'/>} label="Hartcliffe" onChange={() => setModifiedEvent({...modifiedEvent, farms: modifiedEvent.farms.includes(farms.HC) ? modifiedEvent.farms.filter((farm) => farm !== farms.HC) : modifiedEvent.farms.concat(farms.HC)})}/>
                                <FormControlLabel control={<Checkbox checked={modifiedEvent.farms.includes(farms.SW)} color={farms.SW} size='small'/>} label="St Werburghs" onChange={() => setModifiedEvent({...modifiedEvent, farms: modifiedEvent.farms.includes(farms.SW) ? modifiedEvent.farms.filter((farm) => farm !== farms.SW) : modifiedEvent.farms.concat(farms.SW)})}/>
                            </FormGroup>
                        </div>
                        <div>
                            <span style={{display: 'flex'}}><h3>Animals</h3><IconButton style={{height: '40px', margin: '12.5px 0 0 5px'}} onClick={() => {functionopenPopup("animals")}}><AddIcon color='primary'/></IconButton></span>
                            {modifiedEvent.animals.map((animal) => {
                                return (<AnimalPopover key={animal} cityfarm={cityfarm} animalID={animal} />)}
                            )}{/*Add a way to remove animals from events */}
                            <div id="AssociateAnimal" style={{textAlign:'center'}}>
                                <Dialog fullWidth maxWidth='md' open={openAnimalsPopup} onClose={functionclosePopup}>
                                    <DialogTitle>Add Animal</DialogTitle>
                                    <DialogContent>
                                        <AssociateAnimal setAnimals={setModifiedEventAnimals} cityfarm={cityfarm} animals={modifiedEvent.animals} close={functionclosePopup}></AssociateAnimal>
                                    </DialogContent>
                                </Dialog>
                            </div>
                        </div>
                        <div>
                            <span style={{display: 'flex'}}><h3>Enclosures</h3><IconButton style={{height: '40px', margin: '12.5px 0 0 5px'}} onClick={() => {functionopenPopup("enclosures")}}><AddIcon color='primary'/></IconButton></span>
                            {modifiedEvent.enclosures.map((enclosure, index) => (
                                <Enclosure key={index} enclosureID={enclosure}/>
                            ))}{/*Add a way to remove enclosures from events */}
                            {/* idea: make this open the enlcosure  page with a new column of checkboxes. Click on an associate enlcosure(s) button would then pass a list of enclosure names to the calendar to be placed in a field*/}
                            <div id="AssociateEnclosure" style={{textAlign:'center'}}>
                                <Dialog fullWidth maxWidth='md' open={openEnclosurePopup} onClose={functionclosePopup}>
                                    <DialogTitle>Add Enclosure</DialogTitle>
                                    <DialogContent>
                                        <AssociateEnclosure enclosures={modifiedEvent.enclosures} cityfarm={cityfarm} setEnclosures={setModifiedEventEnclosures} close={functionclosePopup}></AssociateEnclosure>
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
                                value={modifiedEvent.description}
                                onChange={(e) => {setModifiedEvent({...modifiedEvent, description: e.target.value})}}
                            />
                        </div>
                    </div>}
                </>
                :
                <>
                {createEvent && <>
                    <h2 className='boxTitle'>Create New Event</h2>
                    <div>
                        <TextField
                            error={newEvent.title === ''}
                            size='small'
                            fullWidth
                            placeholder="Add Title"
                            label='Title'
                            value={newEvent.title}
                            onChange={(e)=>setNewEvent({...newEvent, title: e.target.value})}
                        />
                        {showingTime(!newEvent.allDay,"add")}
                    </div>

                    <div className='smallMarginTop'>
                        <Button variant='contained' style={{float: "right"}} onClick={()=>handleAddEvent()} endIcon={<AddIcon/>}>Create</Button>
                        <FormGroup>
                            <FormControlLabel control={<Checkbox checked={newEvent.allDay} size='small'/>} label="All Day" onChange={() => changeAllDay(!newEvent.allDay, "add")}/>
                            <FormControlLabel control={<Checkbox checked={recurring} size='small'/>} label="Recurring" onChange={() => changeRecurring(!recurring, "add")} />
                        </FormGroup>
                    </div>
                    {recurring && (
                    <div className='smallMarginTop'>
                        <ToggleButtonGroup
                            fullWidth
                            orientation='horizontal'
                            value={newEvent.delay}
                            exclusive
                            onChange={(e) => setNewEvent({...newEvent, delay: e.target.value})}
                        >
                            <ToggleButton value='P1D'>Daily</ToggleButton>
                            <ToggleButton value='P7D'>Weekly</ToggleButton>
                            <ToggleButton value='P30D'>Monthly</ToggleButton>
                            <ToggleButton value='P365D'>Yearly</ToggleButton>
                        </ToggleButtonGroup>
                    </div>)}
                    <div className='smallMarginTop'>
                        <h3>Farms</h3>
                        <FormGroup>
                            <FormControlLabel control={<Checkbox checked={newEvent.farms.includes(farms.WH)} color={farms.WH} size='small'/>} label="Windmill Hill" onChange={() => setNewEvent({...newEvent, farms: newEvent.farms.includes(farms.WH) ? newEvent.farms.filter((farm) => farm !== farms.WH) : newEvent.farms.concat(farms.WH)})}/>
                            <FormControlLabel control={<Checkbox checked={newEvent.farms.includes(farms.HC)} color={farms.HC} size='small'/>} label="Hartcliffe" onChange={()=>setNewEvent({...newEvent, farms: newEvent.farms.includes(farms.HC) ? newEvent.farms.filter((farm) => farm !== farms.HC) : newEvent.farms.concat(farms.HC)})}/>
                            <FormControlLabel control={<Checkbox checked={newEvent.farms.includes(farms.SW)} color={farms.SW} size='small'/>} label="St Werburghs" onChange={()=>setNewEvent({...newEvent, farms: newEvent.farms.includes(farms.SW) ? newEvent.farms.filter((farm) => farm !== farms.SW) : newEvent.farms.concat(farms.SW)})}/>
                        </FormGroup>
                    </div>
                    <div>
                        <span style={{display: 'flex'}}><h3>Animals</h3><IconButton style={{height: '40px', margin: '12px 0 0 5px'}} onClick={() => {functionopenPopup("animals")}}><AddIcon color='primary'/></IconButton></span>
                        {/* idea: make this open the animal table page with a new column of checkboxes. Click on an associate animal(s) button would then pass a list of animal id to the calendar to the new event state. This could be re used in the modification of events.  */}
                        {newEvent.animals.map((animalID) => (
                            <AnimalPopover key={animalID} cityfarm={cityfarm} animalID={animalID} />
                        ))}
                        <div id="AssociateAnimal" style={{textAlign:'center'}}>
                            <Dialog fullWidth maxWidth='md' open={openAnimalsPopup} onClose={functionclosePopup}>
                                <DialogTitle>Add Animal</DialogTitle>
                                <DialogContent>
                                    <AssociateAnimal setAnimals={setAddEventAnimals} cityfarm={cityfarm} animals={newEvent.animals} close={functionclosePopup}></AssociateAnimal>
                                </DialogContent>
                            </Dialog>
                        </div>
                    </div>
                    <div>
                        <span style={{display: 'flex'}}><h3>Enclosures</h3><IconButton style={{height: '40px', margin: '12.5px 0 0 5px'}} onClick={() => {functionopenPopup("enclosures")}}><AddIcon color='primary'/></IconButton></span>
                        {newEvent.enclosures.map((enclosure, index) => (
                            <Enclosure key={index} enclosureID={enclosure} />
                        ))}{/*Add a way to remove enclosures from events */}
                        {/* idea: make this open the enlcosure  page with a new column of checkboxes. Click on an associate enlcosure(s) button would then pass a list of enclosure names to the calendar to be placed in a field*/}
                        <div id="AssociateEnclosure" style={{textAlign:'center'}}>
                            <Dialog fullWidth maxWidth='md' open={openEnclosurePopup} onClose={functionclosePopup}>
                                <DialogTitle>Add Enclosure</DialogTitle>
                                <DialogContent>
                                    <AssociateEnclosure enclosures={newEvent.enclosures} cityfarm={cityfarm} setEnclosures={setAddEventEnclosures} close={functionclosePopup}></AssociateEnclosure>
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
                            value={newEvent.description}
                            onChange={(e) => {setNewEvent({...newEvent, description: e.target.value})}}
                        />
                    </div>
            </>}</>}
        </div>
    </>)
}

export default EventDisplay