
import * as React from "react";
//import aExamples from "./../components/Animal";
//import events from "./Calendar";
import {Link, useParams} from "react-router-dom";
import Typography from "@mui/material/Typography";
import axios from "../api/axiosConfig";

const aExamples =[
    {
        id : 1,
        name:"ERROR",
        type:"you've fucked it",
        male:"kill yourself virgin",
        father : "alice",
        fid : 2,
        mother	:"kill yourself virgin",
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
        animals : ["64ca1356-e519-4f88-a5e9-593157dec235"]
    },
    {
        title : "Bull in with cows",
        allDay: false,
        start: new  Date(2023,11,25, 8),
        end: new  Date(2023,11,28, 16),
        animals : ["64ca1356-e519-4f88-a5e9-593157dec235"]
    },
    {
        title : "School Visits",
        allDay: true,
        start: new  Date(2023,11,20),
        end: new  Date(2023, 11, 21, 23, 59),
        animals : ["64ca1356-e519-4f88-a5e9-593157dec235","64ca1356-e519-4f88-a5e9-593157dec234"]
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
    const [relEvents,setRelEvents] =React.useState([])
    const [chosenAnimal, setChosenAnimal] = React.useState(aExamples[0]);


    React.useEffect(() => {
        (async () => {
            try {
                console.log(animalID);
                const response = await axios.get(`/animals/by_id/${animalID}`);

                console.log(response.data);
                setChosenAnimal(response.data);
            } catch (error) {
                window.alert(error);
            }
        })();
    }, []);
    React.useEffect(() => {
        let matchingEvents = []; // Temporary array to collect matching events
        for (let i = 0; i < events.length; i++) {
            for (let j = 0; j < events[i].animals.length; j++) {
                if (animalID === events[i].animals[j]) {
                    console.log("animal:", animalID, "\n events:", events[i].animals[j]);
                    matchingEvents.push(events[i]);
                    break; // Found a matching event, no need to check further animals in this event
                }
            }
        }
        setRelEvents(matchingEvents); // Update the state once with all matching events
    }, [animalID]);



    return(<>
        <h1>
            {chosenAnimal.name}
        </h1>
            <Typography sx={{ p: 1,whiteSpace: 'pre-line' }}>
                sex : {chosenAnimal.male ? 'Male' : 'Female'}{'\n'}
                species : {chosenAnimal.type}{'\n'}
                father : {chosenAnimal.fid ? (<Link to={`/SingleAnimal/${chosenAnimal.fid}`}>{chosenAnimal.father}</Link>)
                : (chosenAnimal.father? chosenAnimal.father : 'Unregistered father')}{'\n'}
                mother : {chosenAnimal.mid ? (<Link to={`/SingleAnimal/${chosenAnimal.mid}`}>{chosenAnimal.mother}</Link>)
                : (chosenAnimal.mother? chosenAnimal.mother : 'Unregistered mother')}{'\n'}
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