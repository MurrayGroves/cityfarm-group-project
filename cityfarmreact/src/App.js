// Filename - App.js
import './App.css';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import AnimalTable from "./pages/AnimalTable";
import NavBar from "./components/NavBar";
import Calendar from "./pages/Calendar";
import EnclosureTable from "./pages/EnclosureTable";
import Schemas from "./pages/Schemas";
import Error from "./pages/Error.jsx";
import Login from './pages/Login.jsx';
import SingleAnimal from "./pages/SingleAnimal";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import React, { useState } from 'react';

import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

import 'dayjs/locale/en-gb';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

const App = () => {

    const darkTheme = createTheme({
        palette: {
            mode: 'dark',
            WH: {
                main: "#035afc"
            },
            HC: {
                main: "#FF0012"
            },
            SW: {
                main: "#E3D026"
            },
            grey: {
                main: "#888888"
            },
            tertiary: {
                main: '#0085FA'
            }
        },
    });

    const defaultTheme = createTheme({
        palette: {
            mode: 'light',
            WH: {
                main: "#035afc"
            },
            HC: {
                main: "#FF0012"
            },
            SW: {
                main: "#E3D026"
            },
            grey: {
                main: "#888888"
            },
            tertiary: {
                main: '#0085FA'
            }
        }
    });
    
    const [dark, setDark] = useState(false);
    const [msal, setMsal] = useState(null);

    return (
        <ThemeProvider theme={dark ? darkTheme : defaultTheme}>
        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale={'en-gb'}>
        <CssBaseline/>
        <Router>
            <div className="Content">
            <Routes>
                <Route path="login" element={<Login msal={msal} setMsal={setMsal} />}/>
                <Route exact path="*" element={
                    <div>
                    <NavBar setDark={setDark} msal={msal}/>
                    <Routes>
                    <Route path="calendar" element={<Calendar/>}/>
                    <Route path="animals" element={<AnimalTable/>}/>
                    <Route path="enclosures" element={<EnclosureTable/>}/>
                    <Route path="schemas" element={<Schemas/>}/>
                    <Route path="single-animal/:animalID" element={<SingleAnimal/>} />
                    <Route path="/" element={"Homepage"}/>
                    <Route path="*" element={<Error/>}/>
                    </Routes>
                    </div>
                    }>

                </Route>
            </Routes>
            </div>
        </Router>
        </LocalizationProvider>
        </ThemeProvider>
    )
}

export default App;
