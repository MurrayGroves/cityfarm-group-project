
import AnimalPopover from "./AnimalPopover";
import * as React from "react";

const WH = 0, HC = 1, SW = 2;
const SelectedEvent = ({ event}) => {


  if (!event || event === "No event selected") {
    return null;
  }

  return (
      <div className='selectedBox'>
        <div style={{display: "flex", justifyContent: "space-between"}}>
          <h2 className='boxTitle'>Selected Event</h2>
        </div>
        <div>
          <h3>{event.title}</h3>
          {
            event.allDay ?
                <div>
                  <p>{event.start.toLocaleDateString()} {event.end == null ? "" : event.end.toLocaleDateString() === event.start.toLocaleDateString() ? "" : " - " + event.end.toLocaleDateString()}</p>
                </div>
                :
                <div>
                  <p>{event.start.toLocaleString([], {year: '2-digit', month: '2-digit', day: '2-digit', hour: '2-digit', minute:'2-digit'})} - {event.start.toLocaleDateString() === event.end.toLocaleDateString() ? event.end.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : event.end.toLocaleString([], {year: '2-digit', month: '2-digit', day: '2-digit', hour: '2-digit', minute:'2-digit'})}</p>
                </div>
          }
          {event.farms.length !== 0 && <h3>Relevant Farms</h3>}
          {event.farms.includes(WH) && <p>Windmill Hill</p>}
          {event.farms.includes(HC) && <p>Hartcliffe</p>}
          {event.farms.includes(SW) && <p>St Werberghs</p>}
          {event.animals.length !== 0 && <h3>Relevant Animals</h3>}
          {event.animals.map((animalID) => (
              <p key={animalID}><AnimalPopover animalID={animalID} /></p>
          ))}
        </div>
      </div>
  );
};

export default SelectedEvent;