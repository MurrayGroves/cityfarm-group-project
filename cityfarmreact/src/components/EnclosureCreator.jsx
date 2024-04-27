import React, { useState, useEffect } from 'react';
import axios from "../api/axiosConfig";
import './AnimalCreator.css';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { IconButton, Select } from "@mui/material";
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import { getConfig } from '../api/getToken';

import AssociateAnimal from '../components/AssociateAnimal.tsx';
import CapacityChanger from '../components/CapacityChanger';
import { Unstable_Popup as BasePopup } from '@mui/base/Unstable_Popup';
import { styled } from '@mui/system';
import { DialogActions, DialogContent, DialogContentText, DialogTitle, Dialog } from "@mui/material";


const EnclosureCreator = ({ setCreateProp, cityfarm}) => {
    const [newEnclosure, setNewEnclosure] = useState({name: '', holding: [], capacities: {}, notes: '', farm: ''});
    const [openAnimalsPopup ,setOpenAnimalsPopup] = useState(false)
    const [openCapacitiesPopup ,setOpenCapacitiesPopup] = useState(false)

    const token = getConfig();

    const setNewEnclosureAnimals = (animalList) => {
        console.log(animalList);
        setNewEnclosure({...newEnclosure, holding: animalList})
    }

    const reset = () => {
        setCreateProp(false);
        setNewEnclosure({name: '', holding: [], capacities: {}, notes: '', farm: ''})
    }

    return (<>
            <div style={{display: 'flex', justifyContent: 'space-between', marginTop: '10px'}}>
            <TableContainer component={Paper} style={{marginRight: '10px'}}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell width='20%'>Name</TableCell>
                            <TableCell width='20%'>Holding</TableCell>
                            <TableCell width='20%'>Capacities</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        <TableRow>
                            <TableCell sx={{borderBottom: 'none'}}> {/* Table cell for name of enclosure */}
                                <TextField 
                                    style={{width: '100%'}} 
                                    onChange={(e)=>{setNewEnclosure({...newEnclosure, name: e.target.value})}} label='Name'
                                />
                            </TableCell> 
                            <TableCell sx={{borderBottom: 'none'}}> {/* Table cell for animals in enclosure */}
                                <Button variant='outlined' onClick={() => {setOpenAnimalsPopup(true)}}>Add Animals</Button> 
                            </TableCell>
                            <TableCell sx={{borderBottom: 'none'}}> {/* Table cell for capacities */}
                                <Button variant='outlined' onClick={() => {setOpenCapacitiesPopup(true)}}>Capacities</Button> 
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </TableContainer>
            <div style={{display: 'flex'}}>
            <Button sx={{marginRight: '10px'}} color='warning' className='tallButton' variant='contained' endIcon={<DeleteIcon/>} onClick={() => {reset()}}>Discard</Button>
            <Button
                className='tallButton'
                variant="contained"
                color='success'
                aria-label="add"
                endIcon={<AddIcon/>}
                onClick={() => {
                    (async () => {
                        try {
                            await axios.post(`/enclosures/create`, {...newEnclosure, holding: newEnclosure.holding.map(animal => animal.id)}, token)
                        } catch(error) {
                            if (error.response.status === 401) {
                                window.location.href = "/login";
                                return;
                            } else {
                                window.alert(error);
                            }
                        }
                        window.location.reload(false);
                    })()
                }}
            >Create</Button>
            </div>
            </div>
            <div id="AssociateAnimal" style={{textAlign:'center'}}>
                <Dialog fullWidth maxWidth='md' open={openAnimalsPopup} onClose={()=>{setOpenAnimalsPopup(false)}}>
                    <DialogTitle>Add Animal</DialogTitle>
                    <DialogContent>
                        <AssociateAnimal setAnimals={setNewEnclosureAnimals} cityfarm={cityfarm} animals={newEnclosure.holding} close={()=>setOpenAnimalsPopup(false)}></AssociateAnimal>
                    </DialogContent>
                </Dialog>
            </div>

            <div id="CapacityChanger" style={{textAlign:'center'}}>
                <Dialog open={openCapacitiesPopup} onClose={()=>{setOpenCapacitiesPopup(false)}}>
                    <DialogTitle>Capacities</DialogTitle>
                    <DialogContent>
                        <CapacityChanger close={()=>setOpenCapacitiesPopup(false)} enclosure={newEnclosure}></CapacityChanger>
                    </DialogContent>
                </Dialog>
            </div>
        </>)
}

export default EnclosureCreator;