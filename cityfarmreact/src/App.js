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
import SingleAnimal from "./pages/SingleAnimal";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import React, { useState } from 'react';

import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

import 'dayjs/locale/en-gb';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

const App = () => {

    const farms = {
        WH: "WH",
        HC: "HC",
        SW: "SW"
    }

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

    return (
        <ThemeProvider theme={dark ? darkTheme : defaultTheme}>
        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale={'en-gb'}>
        <CssBaseline/>
        <Router>
            <NavBar setDark={setDark}/> {/* Navbar available in all pages for navigation*/}
            <div className="Content">
            <Routes>
                <Route exact path="/"> {/*This is just for testing. Will probably navigate to a home page */}
                    <Route path="calendar" element={<Calendar/>}/>
                    <Route path="animals" element={<AnimalTable farms={farms}/>}/> {/*There won't be pathing issues since all api paths start /api*/}
                    <Route path="enclosures" element={<EnclosureTable farms={farms}/>}/>
                    <Route path="schemas" element={<Schemas farms={farms}/>}/>
                    <Route path="single-animal/:animalID" element={<SingleAnimal farms={farms}/>} />
                    <Route path="*" element={<Error/>}/>
                </Route>
            </Routes>
            </div>
        </Router>
        </LocalizationProvider>
        </ThemeProvider>
    )
}

export default App;
