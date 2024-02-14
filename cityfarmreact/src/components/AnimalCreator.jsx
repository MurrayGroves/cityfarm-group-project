import React, { useState, useEffect } from 'react';
import axios from "../api/axiosConfig";
import '../pages/AnimalTable.css';
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

const AnimalCreator = () => {

    const [newAnimal, setNewAnimal] = useState({name: '', type: 'Pig', father: 'Unregistered', mother: 'Unregistered', male: 'true', alive: 'true'})
    const [schemaList, setSchemaList] = useState([]);

    useEffect(() => {
        (async () => {
            try {
                const response = await axios.get(`/schemas`);
                console.log(response.data);
                setSchemaList(response.data.reverse());
            } catch (error) {
                window.alert(error);
            }
        })()
    },[])

    return (
        <TableContainer component={Paper}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Name</TableCell>
                        <TableCell>Type</TableCell>
                        <TableCell>Father</TableCell>
                        <TableCell>Mother</TableCell>
                        <TableCell>Sex</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    <TableRow>
                        <TableCell><TextField onChange={(e)=>{setNewAnimal({...newAnimal, name: e.target.value})}}></TextField></TableCell>
                        <TableCell>
                            <Select value={newAnimal.type} onChange={(e) => {setNewAnimal({...newAnimal, type: e.target.value})}}>
                            {schemaList.map((schema) => {
                                return <MenuItem value={schema._name}>{schema._name}</MenuItem>
                            })}
                            </Select>
                        </TableCell>
                        <TableCell>
                            <Autocomplete
                                size='medium'
                                renderInput={(params) => <TextField {...params} label="Father"/>}
                                options={[]}
                            />
                        </TableCell>
                        <TableCell>
                            <Autocomplete
                                size='medium'
                                renderInput={(params) => <TextField {...params} label="Mother"/>}
                                options={[]}
                            />
                        </TableCell>
                        <TableCell>
                            <Select value={newAnimal.male} onChange={(e) => {setNewAnimal({...newAnimal, male: e.target.value})}}>
                                <MenuItem value={true}>Male</MenuItem>  
                                <MenuItem value={false}>Female</MenuItem>
                            </Select>
                        </TableCell>
                    </TableRow>
                </TableBody>
            </Table>
        </TableContainer>
    )
}

export default AnimalCreator;