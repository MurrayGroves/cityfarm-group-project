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
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import SingleAnimal from "./pages/SingleAnimal";
import React, { useState } from 'react';

import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

const App = () => {

    const darkTheme = createTheme({
        palette: {
            mode: 'dark',
        },
    });

    const defaultTheme = createTheme();
    
    const [dark, setDark] = useState(false);

    return (
        <ThemeProvider theme={dark ? darkTheme : defaultTheme}>
        <CssBaseline/>
        <Router>
            <NavBar setDark={setDark}/> {/* Navbar available in all pages for navigation*/}
            <div className="Content">
            <Routes>
                <Route exact path="/"> {/*This is just for testing. Will probably navigate to a home page */}
                    <Route path="calendar" element={<Calendar/>}/>
                    <Route path="animals" element={<AnimalTable/>}/> {/*There won't be pathing issues since all api paths start /api*/}
                    <Route path="enclosures" element={<EnclosureTable/>}/>
                    <Route path="schemas" element={<Schemas/>}/>
                    <Route path="single-animal/:animalID" element={<SingleAnimal/>} />
                    <Route path="*" element={<Error/>}/>
                </Route>
            </Routes>
            </div>
        </Router>
        </ThemeProvider>
    )
}

export default App;
