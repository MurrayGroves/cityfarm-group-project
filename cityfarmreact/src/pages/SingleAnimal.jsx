
import * as React from "react";
//import aExamples from "./../components/Animal";
//import events from "./Calendar";
import {useParams} from "react-router-dom";

//make this a database search!
const aExamples =[
    {
        id : 1,
        name:"bob",
        type:"cow",
        sex:"F",
        father : "undefined",
        mother	:"undefined",
        tBInoculated : true,
        live : true

    },
    {
        id : 2,
        name:"alice",
        type:"sheep",
        sex:"M",
        father : "undefined",
        mother	:"undefined",
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

const SingleAnimal = (props) => {
    const { animalID } = useParams();
    let relEvents=[]
    let chosenanimal;


    for (let i = 0; i < aExamples.length; i++) {

        if (parseInt(animalID) === aExamples[i].id) {
            chosenanimal =aExamples[i];

        }
    }

    let relevantEvents =[]
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
            {chosenanimal.name}
    </h1>

        <div>

            {relEvents.map((event, index) => (
                <div key={index}>
                    {/* Display relevant event information */}
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