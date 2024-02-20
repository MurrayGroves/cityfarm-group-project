import AnimalPopover from "./AnimalPopover";
import * as React from "react";

const SelectedEvent = (props) => {

  const event = props.event;
  const farms = props.farms;

  if (!event || event === "No event selected") {
    return <></>;
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
          {event.farms.length !== 0 && <h3>Farms</h3>}
          {event.farms.includes(farms.WH) && <p>Windmill Hill</p>}
          {event.farms.includes(farms.HC) && <p>Hartcliffe</p>}
          {event.farms.includes(farms.SW) && <p>St Werberghs</p>}
          {event.animals.length !== 0 && <h3>Animals</h3>}
          {event.animals.map((animal) => (
              <AnimalPopover key={animal._id} animalID={animal._id}/>
          ))}
        </div>
      </div>
  );
};

export default SelectedEvent;