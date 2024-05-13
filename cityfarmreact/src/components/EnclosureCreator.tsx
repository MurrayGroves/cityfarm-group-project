import React, { useState, useEffect } from 'react';
import axios from "../api/axiosConfig.js";
import './AnimalCreator.css';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import TextField from '@mui/material/TextField';
import { getConfig } from '../api/getToken.js';

import AssociateAnimal from './AssociateAnimal.tsx';
import CapacityChanger from './CapacityChanger.tsx';
import { DialogContent, DialogTitle, Dialog, Backdrop, Alert } from "@mui/material";
import { Enclosure } from '../api/enclosures.ts';
import { Animal } from '../api/animals.ts';
import { CachePolicy, CityFarm } from '../api/cityfarm.ts';

const EnclosureCreator = ({ setCreateProp, cityfarm, farms}: {setCreateProp: any, cityfarm: CityFarm, farms: any}) => {
    const [newEnclosure, setNewEnclosure] = useState<Enclosure>(new Enclosure({name: '', holding: [], capacities: {}, notes: '', farm: ''}));
    const [openAnimalsPopup, setOpenAnimalsPopup] = useState<boolean>(false)
    const [openCapacitiesPopup, setOpenCapacitiesPopup] = useState<boolean>(false)
    const [inputErr, setInputErr] = useState({});
    const [showErr, setShowErr] = useState(false);
    const token = getConfig();

    //const [present, setPresent] = useState(false);

    const setNewEnclosureAnimals = (animalList: string[]) => {
        (async () => {
            let newList = await cityfarm.getAnimalsByIds(animalList, CachePolicy.CACHE_ONLY, null);
            for(const animal of newList){
                let present = false
                newEnclosure.holding.forEach((heldAnimal) => heldAnimal.id == animal.id ? present = true : <></>)
                if(!present){
                    if (newEnclosure.capacities[animal.type] == null){
                        newEnclosure.capacities[animal.type] = 1
                    }
                    else{
                        newEnclosure.capacities[animal.type] = newEnclosure.capacities[animal.type] + 1
                    }
                }
                present = false
            }
            setNewEnclosure({...newEnclosure, holding: newList})
        })()

    }

    const reset = () => {
        setCreateProp(false);
        setNewEnclosure(new Enclosure({name: '', holding: [], capacities: {}, notes: '', farm: ''}))
        setInputErr(new Object);
    }

    useEffect(() => {
        setInputErr(prevInputErr => ({...prevInputErr, name: newEnclosure.name === ''}));
    }, [newEnclosure])

    return (<>
            <div style={{display: 'flex', justifyContent: 'space-between', marginTop: '10px'}}>
            <TableContainer component={Paper} style={{marginRight: '10px'}}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell width='20%'>Name</TableCell>
                            <TableCell width='20%'>Holding</TableCell>
                            <TableCell width='20%'>Capacities</TableCell>
                            <TableCell width='20%'>Farm</TableCell>
                            <TableCell width='20%'>Notes</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        <TableRow>
                            <TableCell sx={{borderBottom: 'none'}}> {/* Table cell for name of enclosure */}
                                <TextField 
                                    required
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

                            <TableCell sx={{borderBottom: 'none'}}> {/* Table cell for farm*/}
                                <TextField select fullWidth label='Farm' value={newEnclosure.farm} size='small' onChange={(e) => { setNewEnclosure({ ...newEnclosure, farm: e.target.value }); } }>
                                    <MenuItem value={''}><em>Empty</em></MenuItem>
                                    <MenuItem value={farms.WH}>Windmill Hill</MenuItem>
                                    <MenuItem value={farms.HC}>Hartcliffe</MenuItem>
                                    <MenuItem value={farms.SW}>St Werburghs</MenuItem>
                                </TextField>
                            </TableCell>

                            <TableCell sx={{borderBottom: 'none'}}> {/* Table cell for notes of enclosure */}
                                <TextField 
                                    style={{width: '100%'}} 
                                    onChange={(e)=>{setNewEnclosure({...newEnclosure, notes: e.target.value})}} label='Notes'
                                />
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
                    if (Object.values(inputErr).filter((err) => err === true).length > 0) {
                        return setShowErr(true);
                    }
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
                        window.location.reload();
                    })()
                }}
            >Create</Button>
            </div>
            </div>

            <div id="AssociateAnimal" style={{textAlign:'center'}}>
                <Dialog fullWidth maxWidth='md' open={openAnimalsPopup} onClose={()=>{setOpenAnimalsPopup(false)}}>
                    <DialogTitle>Add Animal</DialogTitle>
                    <DialogContent>
                        <AssociateAnimal setAnimals={setNewEnclosureAnimals} cityfarm={cityfarm} animals={newEnclosure.holding.map(x => x.id)} close={()=>setOpenAnimalsPopup(false)}></AssociateAnimal>
                    </DialogContent>
                </Dialog>
            </div>

            <div id="CapacityChanger" style={{textAlign:'center'}}>
                <Dialog open={openCapacitiesPopup} onClose={()=>{setOpenCapacitiesPopup(false)}}>
                    <DialogTitle><span style={{display: 'flex', justifyContent: 'space-between'}}>Capacities<Button variant='outlined' onClick={() => setOpenCapacitiesPopup(false)}>Close</Button></span></DialogTitle>
                    <DialogContent>
                        <CapacityChanger enclosure={newEnclosure} cityfarm={cityfarm}/>
                    </DialogContent>
                </Dialog>
            </div>

            <Backdrop style={{zIndex: '4', background: '#000000AA'}} open={showErr} onClick={() => setShowErr(false)}>
                <Alert severity='warning'>
                    Please ensure all required fields are filled
                </Alert>
            </Backdrop>

        </>)
}

export default EnclosureCreator;