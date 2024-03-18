import {Calendar as BigCalendar, dayjsLocalizer} from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import React, {useState, useEffect, useCallback} from 'react';
import dayjs from 'dayjs';
import "../pages/Calendar.css";
import Event from "./Event";
import CreateEvent from "./FindOrCreateEvent";
import AnimalPopover from "./AnimalPopover";
import Close from '@mui/icons-material/Close';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import {  DialogActions, DialogContent, DialogContentText, DialogTitle, ToggleButton, ToggleButtonGroup } from "@mui/material";
import { IconButton, Button, ButtonGroup, Checkbox, FormControlLabel, FormGroup, useTheme, Dialog, FormHelperText, Backdrop, Alert } from '@mui/material';
import AlertTitle from '@mui/material/AlertTitle';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import Delete from '@mui/icons-material/Delete';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import AssociateAnimal from './AssociateAnimal';
import axios from '../api/axiosConfig'
import AssociateEnclosure from './AssociateEnclosure';

export const EventCreator = (props) => {
    const [newEvent,setNewEvent] = useState({
        title: "",
        allDay: true,
        start: new Date(),
        end: new Date(),
        farms: [],
        animals: [],
        description: "",
        enclosures: []
    })


    function showingTime(isShown) {
        if (isShown){
            return(<>
                <FormHelperText>Start</FormHelperText>
                <DateTimePicker
                    value={recurring ? dayjs(newEvent.firstStart) : dayjs(newEvent.start)}
                    onChange={(e) => {
                        recurring ?
                            setNewEvent({...newEvent, firstStart: e.$d, firstEnd: newEvent.firstEnd < e.$d ? e.$d : newEvent.firstEnd})
                            : setNewEvent({...newEvent, start: e.$d, end: newEvent.end < e.$d ? e.$d : newEvent.end})
                    }}
                    slotProps={{textField: {fullWidth: true, size: 'small'}}}
                />
                <FormHelperText>End</FormHelperText>
                <DateTimePicker
                    value={recurring ? dayjs(newEvent.firstEnd) : dayjs(newEvent.end)}
                    onChange={(e) => {
                        recurring ?
                            setNewEvent({...newEvent, firstEnd: e.$d, firstStart: e.$d < newEvent.firstStart ? e.$d : newEvent.firstStart})
                            : setNewEvent({...newEvent, end: e.$d, start: e.$d < newEvent.start ? e.$d : newEvent.start})
                    }}
                    slotProps={{textField: {fullWidth: true, size: 'small'}}}
                />
            </>)
        } else {
            return(<>
                <FormHelperText>Start</FormHelperText>
                <DatePicker
                    value={recurring ? dayjs(newEvent.firstStart) : dayjs(newEvent.start)}
                    onChange={(e) => {
                        console.log('date changed');
                        recurring ?
                            setNewEvent({...newEvent, firstStart: e.$d, firstEnd: newEvent.firstEnd < e.$d ? e.$d : newEvent.firstEnd})
                            : setNewEvent({...newEvent, start: e.$d, end: newEvent.end < e.$d ? e.$d : newEvent.end})
                    }}
                    slotProps={{textField: {fullWidth: true, size: 'small'}}}
                />
                <FormHelperText>End</FormHelperText>
                <DatePicker
                    value={recurring ? dayjs(newEvent.firstEnd) : dayjs(newEvent.end)}
                    onChange={(e) => {
                        recurring ?
                            setNewEvent({...newEvent, firstEnd: e.$d, firstStart: e.$d < newEvent.firstStart ? e.$d : newEvent.firstStart})
                            : setNewEvent({...newEvent, end: e.$d, start: e.$d < newEvent.start ? e.$d : newEvent.start})
                    }}
                    slotProps={{textField: {fullWidth: true, size: 'small'}}}
                />
            </>)
        }
    }

    return (
        <Paper elevation={3} style={{width: '400px', margin: '0 0 20px 0', padding: '10px'}}>
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
                {showingTime(!newEvent.allDay, "add")}
            </div>

            <div className='smallMarginTop'>
                <FormControlLabel control={<Checkbox defaultChecked size='small'/>} label="All Day" onChange={() => changeAllDay(!newEvent.allDay, "add")}/>
                <FormControlLabel control={<Checkbox size='small'/>} label="Recurring" onChange={() => changeRecurring(!recurring, "add")} />
                <Button variant='contained' style={{float: "right"}} onClick={()=>handleAddEvent()} endIcon={<AddIcon/>}>Create</Button>
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
                    <ToggleButton value='P28D'>Monthly</ToggleButton>
                    <ToggleButton value='P265D'>Yearly</ToggleButton>
                </ToggleButtonGroup>
            </div>)}
            <div className='smallMarginTop'>
                <h3>Farms</h3>
                <FormGroup>
                    <FormControlLabel control={<Checkbox color={farms.WH} size='small'/>} label="Windmill Hill" onChange={() => setNewEvent({...newEvent, farms: newEvent.farms.includes(farms.WH) ? newEvent.farms.filter((farm) => farm !== farms.WH) : newEvent.farms.concat(farms.WH)})}/>
                    <FormControlLabel control={<Checkbox color={farms.HC} size='small'/>} label="Hartcliffe" onChange={()=>setNewEvent({...newEvent, farms: newEvent.farms.includes(farms.HC) ? newEvent.farms.filter((farm) => farm !== farms.HC) : newEvent.farms.concat(farms.HC)})}/>
                    <FormControlLabel control={<Checkbox color={farms.SW} size='small'/>} label="St Werburghs" onChange={()=>setNewEvent({...newEvent, farms: newEvent.farms.includes(farms.SW) ? newEvent.farms.filter((farm) => farm !== farms.SW) : newEvent.farms.concat(farms.SW)})}/>
                </FormGroup>
            </div>
            <div>
                <span style={{display: 'flex'}}><h3>Animals</h3><IconButton style={{height: '40px', margin: '12px 0 0 5px'}} onClick={() => {functionopenPopup("animals")}}><AddIcon color='primary'/></IconButton></span>
                {/* idea: make this open the animal table page with a new column of checkboxes. Click on an associate animal(s) button would then pass a list of animal id to the calendar to the new event state. This could be re used in the modification of events.  */}
                {newEvent.animals.map((animalID) => (
                    <AnimalPopover key={animalID} animalID={animalID} />
                ))}
                <div id="AssociateAnimal" style={{textAlign:'center'}}>
                    <Dialog open={openAnimalsPopup} onClose={functionclosePopup}>
                        <DialogTitle>Add Animal</DialogTitle>
                        <DialogContent>
                            <AssociateAnimal setAnimals={setAddEventAnimals} animals={newEvent.animals} close={functionclosePopup}></AssociateAnimal>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>
            <div>
                <span style={{display: 'flex'}}><h3>Enclosures</h3><IconButton style={{height: '40px', margin: '12.5px 0 0 5px'}} onClick={() => {functionopenPopup("enclosures")}}><AddIcon color='primary'/></IconButton></span>
                {newEvent.enclosures.map((enclosureName, index) => (
                    <p key={index}>{enclosureName}</p>
                ))}{/*Add a way to remove enclosures from events */}
                {/* idea: make this open the enlcosure  page with a new column of checkboxes. Click on an associate enlcosure(s) button would then pass a list of enclosure names to the calendar to be placed in a field*/}
                <div id="AssociateEnclosure" style={{textAlign:'center'}}>
                    <Dialog open={openEnclosurePopup} onClose={functionclosePopup}>
                        <DialogTitle>Add Enclosure</DialogTitle>
                        <DialogContent>
                            <AssociateEnclosure enclosures={newEvent.enclosures} setEnclosures={setAddEventEnclosures} close={functionclosePopup}></AssociateEnclosure>
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
        </Paper>
    )
}
