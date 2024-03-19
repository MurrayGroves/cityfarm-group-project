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

import AssociateAnimal from '../components/AssociateAnimal';
import CapacityChanger from '../components/CapacityChanger';
import { Unstable_Popup as BasePopup } from '@mui/base/Unstable_Popup';
import { styled } from '@mui/system';
import {  DialogActions, DialogContent, DialogContentText, DialogTitle, Dialog } from "@mui/material";

const EnclosureCreator = (props) => {
    const [newEnclosure, setNewEnclosure] = useState({name: '', holding: {}, capacities: {}, notes: '', farm: ''});
    const [create, setCreate] = useState(false);
    const [anchor, setAnchor] = React.useState(null);
    const [openAnimalsPopup ,setOpenAnimalsPopup] = useState(false)
    const [openCapacitiesPopup ,setOpenCapacitiesPopup] = useState(false)

    const token = getConfig();

    const setNewEnclosureAnimals = (animalList) => {
        console.log(animalList);
        setNewEnclosure({...newEnclosure, holding: animalList})
    }

    const reset = () => {
        setCreate(false);
        setNewEnclosure({name: '', holding: {}, capacities: {}, notes: '', farm: ''})
    }

    // useEffect(() => {
    //     console.log(newEnclosure);
    // },[newEnclosure]);

    return (<>
        {create ? <>
            <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '20px'}}>
            <TableContainer component={Paper} style={{marginRight: '20px'}}>
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
                            <TableCell> {/* Table cell for name of enclosure */}
                                <TextField 
                                    style={{width: '100%'}} 
                                    onChange={(e)=>{setNewEnclosure({...newEnclosure, name: e.target.value})}} label='Name'
                                />
                            </TableCell> 
                            <TableCell> {/* Table cell for animals in enclosure */}
                                <Button variant='outlined' onClick={() => {setOpenAnimalsPopup(true)}}>Add Animals</Button> 
                            </TableCell>
                            <TableCell> {/* Table cell for capacities */}
                                <Button variant='outlined' onClick={() => {setOpenCapacitiesPopup(true)}}>Capacities</Button> 
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </TableContainer>
            <Button className='tallButton' variant='contained' endIcon={<DeleteIcon/>} onClick={() => {reset()}}>Discard</Button>
            </div>
            <div id="AssociateAnimal" style={{textAlign:'center'}}>
                <Dialog open={openAnimalsPopup} onClose={()=>{setOpenAnimalsPopup(false)}}>
                    <DialogTitle>Add Animal</DialogTitle>
                    <DialogContent>
                        <AssociateAnimal setAnimals={setNewEnclosureAnimals} animals={newEnclosure.holding} close={()=>setOpenAnimalsPopup(false)}></AssociateAnimal>
                    </DialogContent>
                </Dialog>
            </div>

                {/* WIP */}
            {/* <div id="CapacityChanger" style={{textAlign:'center'}}>
                <Dialog open={openCapacitiesPopup} onClose={()=>{setOpenCapacitiesPopup(false)}}>
                    <DialogTitle>Capacities</DialogTitle>
                    <DialogContent>
                        <CapacityChanger close={()=>setOpenCapacitiesPopup(false)}></CapacityChanger>
                    </DialogContent>
                </Dialog>
            </div> */}

            <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '20px'}}>
            <Button
            className='tallButton'
            variant="contained"
            aria-label="add"
            endIcon={<AddIcon/>}
            onClick={() => {
                //console.log(newEnclosure)
                (async () => {
                    try {
                        await axios.post(`/enclosures/create`, newEnclosure, token)
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
            : <></></>
        : <Button variant='contained' endIcon={<AddIcon/>} style={{float: 'right'}} onClick={() => setCreate(true)}>Create</Button>}
    </>)
}

export default EnclosureCreator;