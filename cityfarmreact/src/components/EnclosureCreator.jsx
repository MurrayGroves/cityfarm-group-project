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

import AssociateAnimal from '../components/AssociateAnimal';
import { Unstable_Popup as BasePopup } from '@mui/base/Unstable_Popup';
import { styled } from '@mui/system';
import {  DialogActions, DialogContent, DialogContentText, DialogTitle, Dialog } from "@mui/material";

const EnclosureCreator = (props) => {
    const [newEnclosure, setNewEnclosure] = useState({name: '', holding: [], capacities: {}});
    const [create, setCreate] = useState(false);
    const [anchor, setAnchor] = React.useState(null);
    const [openAnimalsPopup ,setOpenAnimalsPopup] = useState(false)

    const setNewEnclosureAnimals = (animalList) => {
        setNewEnclosure({...newEnclosure, holding: animalList})
    }

    const reset = () => {
        setCreate(false);
        setNewEnclosure({name: '', holding: [], capacities: {}})
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
                                <div id="AssociateAnimal" style={{textAlign:'center'}}>
                                    <Dialog open={openAnimalsPopup} onClose={setOpenAnimalsPopup(false)}>
                                    <DialogTitle>Add Animal</DialogTitle>
                                    <DialogContent>
                                    <AssociateAnimal setAnimals={setNewEnclosureAnimals}></AssociateAnimal>
                                    </DialogContent>
                                    </Dialog>
                                </div>
                            </TableCell>
                            <TableCell> {/* Table cell for capacities */}
                                <Button variant='outlined' >Capacities</Button> 
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </TableContainer>
            <Button className='tallButton' variant='contained' endIcon={<DeleteIcon/>} onClick={() => {reset(); props.setOffset(36.5+20)}}>Discard</Button>
            </div>
            <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '20px'}}>
            <Button
            className='tallButton'
            variant="contained"
            aria-label="add"
            endIcon={<AddIcon/>}
            onClick={async() => {
                try{
                    await axios.post(`/enclosures/create`, newEnclosure,
                    { crossdomain: true, headers: {
                        "Access-Control-Allow-Origin": 'http://localhost:3000',
                        "Access-Control-Allow-Credentials": true
                    }})
                } catch(error) {
                    window.alert(error);
                }
                window.location.reload(false);
            }}
            >Create</Button>
            </div>
            : <></></>
        : <Button variant='contained' endIcon={<AddIcon/>} style={{float: 'right'}} onClick={() => setCreate(true)}>Create</Button>}
    </>)
}

export default EnclosureCreator;