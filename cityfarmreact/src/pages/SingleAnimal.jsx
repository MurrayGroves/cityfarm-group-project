import * as React from "react";
//import aExamples from "./../components/Animal";
//import events from "./Calendar";
import {Link, useParams} from "react-router-dom";
import Typography from "@mui/material/Typography";

//make these a database search! PLEASEEEE
const aExamples =[
    {
        id : 1,
        name:"bob",
        type:"cow",
        sex:"F",
        father : "alice",
        fid : 2,
        mother	:"undefined",
        mid : null,
        tBInoculated : true,
        live : true

    },
    {
        id : 2,
        name:"alice",
        type:"sheep",
        sex:"M",
        father : "undefined",
        fid : null,
        mother	:"undefined",
        mid : null,
        tBInoculated : true,
        live : true

    }]

const events = [ /*These are example events.*/
    {
        title : "Boss Meeting",
        allDay: false,
        start: new  Date(2023,11,1, 13),
        end: new  Date(2023,11,1, 14),
        animals : [1]
    },
    {
        title : "Bull in with cows",
        allDay: false,
        start: new  Date(2023,11,25, 8),
        end: new  Date(2023,11,28, 16),
        animals : [2]
    },
    {
        title : "School Visits",
        allDay: true,
        start: new  Date(2023,11,20),
        end: new  Date(2023, 11, 21, 23, 59),
        animals : [2,1]
    },
    {
        title : "Defra Inspection",
        allDay: true,
        start: new  Date(2023,11,29),
        end: new Date(2023, 11, 29),
        animals : []
    }
];

const SingleAnimal = () => {
    const { animalID } = useParams();
    let relEvents
    let chosenAnimal;


    for (let i = 0; i < aExamples.length; i++) {

        if (parseInt(animalID) === aExamples[i].id) {
            chosenAnimal =aExamples[i];

        }
    }

    let relevantEvents = []
    for (let i = 0; i < events.length; i++) {
        for (let j =0; j<events[i].animals.length; j++){
            if (parseInt(animalID) === events[i].animals[j]) {
                relevantEvents.push(events[i])
                break;
            }
        }
    }

    relEvents=relevantEvents;

    return(<>
        <h1>
            {chosenAnimal.name}
        </h1>
            <Typography sx={{ p: 1,whiteSpace: 'pre-line' }}>
                sex : {chosenAnimal.sex}{'\n'}
                species : {chosenAnimal.type}{'\n'}
                father : {chosenAnimal.fid ? (<Link to={`/SingleAnimal/${chosenAnimal.fid}`}>{chosenAnimal.father}</Link>) : chosenAnimal.father}{'\n'}
                mother : {chosenAnimal.mid ? (<Link to={`/SingleAnimal/${chosenAnimal.mid}`}>{chosenAnimal.mother}</Link>) : chosenAnimal.mother}{'\n'}
            </Typography>
        <div>

            {relEvents.map((event, index) => (
                <div key={index}>
                    {/* Display relevant event information very similar to event view*/}
                    {event.title} {"\n"}
                    {event.allDay ?(
                            <div>
                                <p>{event.start.toLocaleDateString()} {event.end == null ? <p></p>:event.end.toLocaleDateString()===event.start.toLocaleDateString() ? <p></p>: " - " + event.end.toLocaleDateString()}</p>
                            </div>
                        ):
                        <div>
                            <p>{event.start.toLocaleString([], {year: '2-digit', month: '2-digit', day: '2-digit', hour: '2-digit', minute:'2-digit'})} - {event.start.toLocaleDateString() === event.end.toLocaleDateString() ? event.end.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}): event.end.toLocaleString([], {year: '2-digit', month: '2-digit', day: '2-digit', hour: '2-digit', minute:'2-digit'})}</p>
                        </div>}
                </div>))}
        </div>
        </>
    );

}

export default SingleAnimal