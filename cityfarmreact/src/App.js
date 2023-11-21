import './App.css';
import AnimalTable from "./pages/AnimalTable";
import NavBar from "./components/NavBar";
import Calendar from "./pages/calendar";
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';

const App = () => {
    return (
        <Router>
        <div className="App">
            <NavBar/> {/* Navbar available in all pages for navigation*/}
            <div className="Content">
                <Routes>
                    <Route exact path="/" > {/*This is just for testing. Will probably navigate to a home page */}
                        <AnimalTable/>
                    </Route>
                    <Route exact path="/animals" > {/*There won't be pathing issues since all api paths start /api*/}
                        <AnimalTable/>
                    </Route>
                    <Route path="/create" >
                        {/*<Create/> when implemented*/}
                    </Route>
                    <Route path="/calendar" >
                        <Calendar/>
                    </Route>
                </Routes>
            </div>
        </div>
        </Router>
    )
}

export default App;