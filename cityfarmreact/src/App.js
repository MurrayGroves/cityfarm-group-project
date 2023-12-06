// Filename - App.js
import './App.css';
import AnimalTable from "./pages/AnimalTable";
import NavBar from "./components/NavBar";
import Calendar from "./pages/Calendar";
import EnclosureTable from "./pages/EnclosureTable";
import Error from "./pages/Error.jsx";
import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

const App = () => {
    const [openNav, setOpenNav] = useState(false);

    return (
        <Router>
        <div className="App">
            <NavBar openNavbar={setOpenNav}/> {/* Navbar available in all pages for navigation*/}
            <div className="Content">
            <Routes>
                <Route exact path="/"> {/*This is just for testing. Will probably navigate to a home page */}
                    <Route path="calendar" element={<Calendar/>}/>
                    <Route path="animals" element={<AnimalTable/>}/> {/*There won't be pathing issues since all api paths start /api*/}
                    <Route path="enclosures" element={<EnclosureTable/>}/>
                    <Route path="create"/>{/*<Create/> when implemented*/}
                    <Route path="*" element={<Error/>}/>
                </Route>
            </Routes>
            </div>
        </div>
        </Router>
    )
}

export default App;
