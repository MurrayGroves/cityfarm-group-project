// Filename - App.js
import './App.css';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import AnimalTable from "./pages/AnimalTable.tsx";
import NavBar from "./components/NavBar.jsx";
import Calendar from "./pages/Calendar.tsx";
import EnclosureTable from "./pages/EnclosureTable.jsx";
import Schemas from "./pages/Schemas.jsx";
import Error from "./pages/Error.jsx";
import Login from './pages/Login.jsx';
import SingleAnimal from "./pages/SingleAnimal.jsx";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import React, { useEffect, useState } from 'react';

import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

import 'dayjs/locale/en-gb';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { PublicClientApplication } from "@azure/msal-browser";
import Home from "./pages/Home.jsx";
import Help from "./pages/Help.jsx";
import usePersistState from './components/PersistentState.jsx'

import { CityFarm } from './api/cityfarm.ts';

const App = () => {

    const farms = {
        WH: "WH",
        HC: "HC",
        SW: "SW"
    }

    const colours = {
        WH: {
            main: "#035afc"
        },
        HC: {
            main: "#FF0012"
        },
        SW: {
            main: "#ffb121"
        },
        grey: {
            main: "#888888"
        },
        green: {
            main: "#55DF34"
        },
        primary: {
            main: "#21A9FA",
            light: "#b4e2fd",
            dark: "#0480c8",
            veryDark: "#02304b",
        }
    }

    const darkTheme = createTheme({
        palette: {
            mode: 'dark',
            ...colours
        },
    });

    const lightTheme = createTheme({
        palette: {
            mode: 'light',
            ...colours
        }
    });
    
    const [theme, setTheme] = usePersistState('light', 'theme');
    const [msal, setMsal] = useState(null);
    const [device, setDevice] = useState('');

    useEffect(() => setDevice(getComputedStyle(document.documentElement).getPropertyValue('--device')), [])

    const msalConfig = {
        auth: {
            clientId: '5668872b-7957-4c09-a995-56cd915cb4a9',
            postLogoutRedirectUri: "/login",
        },
        cache: {
            cacheLocation: "localStorage",
            storeAuthStateInCookie: false,
        }
    };

    if (msal == null) {
        const msalInstance = new PublicClientApplication(msalConfig);
        msalInstance.initialize().then(() => {
            setMsal(msalInstance);
            if (msalInstance.getAllAccounts().length == 0) {
                if (!window.location.href.includes("/login")) {
                    window.location.href = "/login";
                }
            }
        })
        return;
    }

    const cityfarm = new CityFarm();
    // when window is resized, check if width thresholds have changed
    window.addEventListener("resize", () => setDevice(getComputedStyle(document.documentElement).getPropertyValue('--device')));

    return (
        <ThemeProvider theme={theme === 'dark' ? darkTheme : lightTheme}>
        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale={'en-gb'}>
        <CssBaseline/>
        <Router>
            <Routes>
                <Route path="/login" element={<Login msal={msal} setMsal={setMsal} />}/>
                <Route exact path="*" element={<>
                    <NavBar theme={theme} setTheme={setTheme} msal={msal} device={device}/>
                    <div className='Content'>
                        <Routes>
                            <Route path="/" element={<Home farms={farms}/>}/>
                            <Route path="/calendar" element={<Calendar farms={farms} device={device} cityfarm={cityfarm}/>}/>
                            <Route path="/animals" element={<AnimalTable farms={farms} cityfarm={cityfarm} device={device}/>}/>
                            <Route path="/enclosures" element={<EnclosureTable farms={farms}/>}/>
                            <Route path="/schemas" element={<Schemas farms={farms}/>}/>
                            <Route path="/help" element={<Help/>}/>
                            <Route path="/single-animal/:animalID" element={<SingleAnimal farms={farms}/>} />
                            <Route path="*" element={<Error/>}/>
                        </Routes>
                    </div>
                </>}>
                </Route>
            </Routes>
        </Router>
        </LocalizationProvider>
        </ThemeProvider>
    )

}

export default App;
