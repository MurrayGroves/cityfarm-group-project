import AnimalPopover from "./AnimalPopover.tsx";
import * as React from "react";
import Close from "@mui/icons-material/Close";
import IconButton from "@mui/material/IconButton";
import { useTheme } from "@mui/material";
import { Event } from '../api/events.ts';

const SelectedEvent = (props) => {

  const event: Event = props.event;
  const farms = props.farms;
  const theme = useTheme().palette;

  if (!event) {
    return <></>;
  }

  return (
      <div>
        <div style={{display: "flex", justifyContent: "space-between"}}>
          <h2 className='boxTitle'>Selected Event</h2>
          <IconButton className='closeButton' onClick={() => props.setEvent("")}><Close/></IconButton>
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
            {event.description? <><br/> {event.description} </>: ''}
          {event.animals.length !== 0 && <h3>Animals</h3>}

          {event.animals.map((animal) => (
              <AnimalPopover key={animal} cityfarm={props.cityfarm} animalID={animal}/>
          ))}
        </div>
      </div>
  );
};

export default SelectedEvent;