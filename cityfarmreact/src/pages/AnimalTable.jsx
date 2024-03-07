import React, { useEffect, useState } from 'react';
import axios from '../api/axiosConfig';
import FarmTabs from '../components/FarmTabs';
import AnimalPopover from '../components/AnimalPopover';
import './AnimalTable.css';
import { DataGrid } from '@mui/x-data-grid';
import TableContainer from '@mui/material/TableContainer';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import AnimalCreator from '../components/AnimalCreator';

import { getConfig } from '../api/getToken';

const AnimalTable = ({ farms }) => {
    const [animalList, setAnimalList] = useState([]); /* The State for the list of animals. The initial state is [] */
    const [searchTerm, setSearchTerm] = useState(''); /* The term being searched for in the searchbar */
    const [schemaList, setSchemaList] = useState([]);

    const [farm, setFarm] = useState(null);

    const token = getConfig();

    function displayAll() {
        (async () => {
            try {
                const response = await axios.get(`/animals`, {
                    params: { farm: farm },
                    ...token,
                });
                setAnimalList(response.data);
            } catch (error) {
                console.log(error);
                if (error.response.status === 401) {
                    window.location.href = '/login';
                    return;
                } else {
                    window.alert(error);
                }
            }
        })();
    }

    function getSchemas() {
        (async () => {
            try {
                const response = await axios.get(`/schemas`, token);
                setSchemaList(response.data.reverse());
            } catch (error) {
                if (error.response.status === 401) {
                    window.location.href = '/login';
                    return;
                } else {
                    window.alert(error);
                }
            }
        })();
    }

    useEffect(getSchemas, []);

    useEffect(() => {
        (async () => {
            if (searchTerm === '') {
                displayAll();
                return;
            }
            try {
                const response = await axios.get(`/animals/by_name/${searchTerm}`, {
                    params: { farm: farm },
                    ...token,
                });
                setAnimalList(response.data);
            } catch (error) {
                if (error.response.status === 401) {
                    window.location.href = '/login';
                    return;
                } else {
                    window.alert(error);
                }
            }
        })();
    }, [searchTerm, farm]);

    const rows = animalList.map((animal) => ({
        id: animal._id,
        name: animal,
        type: animal,
        father: animal.father !== null ? animal : 'Unregistered',
        mother: animal.mother !== null ? animal : 'Unregistered',
        sex: animal.sex === 'f' ? 'Male' : animal.sex === 'm' ? 'Female' : 'Castrated',
    }));

    const cols = [
        {
            field: 'name',
            headerName: 'Name',
            headerClassName: 'grid-header',
            headerAlign: 'left',
            flex: 1,
            renderCell: (animal) => {
                return <AnimalPopover animalID={animal.value._id} />;
            },
        },
        {
            field: 'type',
            headerName: 'Type',
            headerClassName: 'grid-header',
            headerAlign: 'left',
            flex: 1,
            renderCell: (animal) => {
                let exists = false;
                schemaList.forEach((schema) => {
                    if (schema._name === animal.value.type) {
                        exists = true;
                    }
                });
                return exists ? (
                    <p>{animal.value.type.charAt(0).toUpperCase() + animal.value.type.slice(1)}</p>
                ) : (
                    <p style={{ color: 'red' }}>
                        {animal.value.type.charAt(0).toUpperCase() + animal.value.type.slice(1)}
                    </p>
                );
            },
        },
        {
            field: 'father',
            headerName: 'Father',
            headerClassName: 'grid-header',
            headerAlign: 'left',
            flex: 1,
            renderCell: (animal) => {
                return animal.value.father ? (
                    <AnimalPopover key={animal.value.father} animalID={animal.value.father} />
                ) : (
                    'Unregistered'
                );
            },
        },
        {
            field: 'mother',
            headerName: 'Mother',
            headerClassName: 'grid-header',
            headerAlign: 'left',
            flex: 1,
            renderCell: (animal) => {
                return animal.value.mother ? (
                    <AnimalPopover key={animal.value.mother} animalID={animal.value.mother} />
                ) : (
                    'Unregistered'
                );
            },
        },
        {
            field: 'sex',
            headerName: 'Sex',
            headerClassName: 'grid-header',
            headerAlign: 'left',
            flex: 1,
        },
    ];

    const [creatorOffset, setCreatorOffset] = useState(36.5 + 20);

    return (
        <>
            <h1>Livestock</h1>
            <span
                style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    height: '60px',
                }}
            >
                <TextField
                    size="small"
                    placeholder="Search"
                    style={{ margin: '0 20px 20px 0' }}
                    onChange={(e) => setSearchTerm(e.target.value)}
                ></TextField>
                <FarmTabs farms={farms} selectedFarm={farm} setSelectedFarm={setFarm} />
            </span>
            <Paper
                style={{
                    height: `calc(100vh - (170.88px + ${creatorOffset}px))`,
                    marginBottom: '20px',
                }}
            >
                <DataGrid style={{ fontSize: '1rem' }} columns={cols} rows={rows} />
            </Paper>
            <AnimalCreator animalList={animalList} schemaList={schemaList} setOffset={setCreatorOffset} farms={farms} />
        </>
    );
};

export default AnimalTable;
