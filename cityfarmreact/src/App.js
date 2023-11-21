// Filename - App.js
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

/*
import React,{useState} from 'react';

const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"]


// Okay I do not know why this doesnt run but here is the code for the calendar in react.
// I think maybe my npm is configured weird but if you want to run it just copy the code over into your own react thing.

var year =2018
var month = 0

//adjusting for leap years
var leap =0
if (year%4===0){ leap = 1}


const monthDays =[31,28+leap,31,30,
    31,30,31,31,
    30,31,30,31]

//returns a day of the week from year num day num and month
function getDayOfWeek(year, month, day) {
    if (month < 3) {
        month += 12;
        year -= 1;
    }

    const k = year % 100;
    const j = Math.floor(year / 100);

    const dayOfWeek = (day + Math.floor((13 * (month + 1)) / 5) + k + Math.floor(k / 4) + Math.floor(j / 4) - 2 * j) % 7;

    return (dayOfWeek ) % 7;
}


//makes a dictionary of days (logic doenst work fully i think)
function MakeDays (year,month){
    const days = []
    var weekDir = {'D1': '', 'D2': '', 'D3': '', 'D4': '', 'D5': '', 'D6': '', 'D7': ''}
    for (let day = 0; day < monthDays[month]; day++) {
        //LOGIC NEEDS FIXING HERE IM SURE
        const daynum = getDayOfWeek(year,month,day+1);

        if (weekDir["D7"] ==='' ){
            weekDir["D"+ (daynum+1)] = day+1;
        }
        else{
            days.push(weekDir);
            weekDir = {'D1': '', 'D2': '', 'D3': '', 'D4': '', 'D5': '', 'D6': '', 'D7': ''};
            weekDir["D"+ (daynum+1)] = day+1;
        }

    }
    days.push(weekDir);
    return days
}





function App() {
    //setting Gdays as a globally updating state
    const [Gdays, setDays] = useState(MakeDays(2018,0))

    //adding 1 to the month number and setting a new Gdays
    function plus1(){
        if (month===11) {month = 0;year+=1}
        else {month+=1}
        setDays(MakeDays(year,month))

    }

    //minusing 1 to the month number and setting a new Gdays
    function minus1(){
        if (month===0) {month = 11;year-=1}
        else{month-=1}
        setDays(MakeDays(year,month))
    }


    return (
        <div className="App">

            <p>
                {// testing to indicate if it works and just indicator for month and year }

                {monthNames[month]}
                _
                {year}

                TEST
            </p>

            {/* buttons to call the two functions }
            <button onClick={
                minus1}> -1 </button>

            <button onClick={
                plus1}> +1 </button>

            {/* creating the calendar table }
            <table>
                <tr>
                    <th>Monday</th>
                    <th>Tuesday</th>
                    <th>Wednesday</th>
                    <th>Thursday</th>
                    <th>Friday</th>
                    <th>Saturday</th>
                    <th>Sunday</th>
                </tr>
                {/* mapping the table elements to elements of the dictionary of Gdays }
                {Gdays.map((val, key) => {
                    return (
                        <tr key={key}>
                            <td>{val.D1}</td>
                            <td>{val.D2}</td>
                            <td>{val.D3}</td>
                            <td>{val.D4}</td>
                            <td>{val.D5}</td>
                            <td>{val.D6}</td>
                            <td>{val.D7}</td>
                        </tr>
                    )
                })}
            </table>
        </div>
    );
*/
}

export default App;