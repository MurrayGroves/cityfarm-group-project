import {Link, useParams} from "react-router-dom";
import React, {Fragment, ReactNode, useEffect, useState} from "react";
import axios from "../api/axiosConfig.js";
import {getConfig} from "../api/getToken.js";
import AnimalPopover from "../components/AnimalPopover.tsx";
import "./SingleEnclosure.css"
import {Alert, Dialog, DialogContent, DialogTitle, Divider, Grid, Icon, Paper} from "@mui/material";
import AssociateAnimal from "../components/AssociateAnimal.tsx";
import Button from "@mui/material/Button";
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import EnclosureMove from "../components/EnclosureMove.tsx";
import IconButton from "@mui/material/IconButton";
import {DataGrid, FooterPropsOverrides, GridColDef, GridSlotsComponentsProps} from "@mui/x-data-grid";
import {readableFarm} from "./SingleAnimal.tsx";
import { Enclosure } from "../api/enclosures.ts";
import { CityFarm } from "../api/cityfarm.ts";
import { Animal } from "../api/animals.ts";
import { Event, EventInstance, EventOnce, EventRecurring } from '../api/events.ts';
import EnclosurePopover from "../components/EnclosurePopover.tsx";
import CapacityChanger from "../components/CapacityChanger.tsx";

const SingleEnclosure = ({farms, cityfarm}: {farms: any, cityfarm: CityFarm}) => {
  const token = getConfig();
  const enclosureID = useParams().enclosureID!
  const [enclosure, setEnclosure] = useState<Enclosure>(new Enclosure({name: 'Loading...', holding: [], capacities: {}}))
  const [animalTypes, setAnimalTypes] = useState<string[]>(new Array<string>())
  const [openAnimalsPopup, setOpenAnimalsPopup] = useState<boolean>(false)
  const [allEnclosures, setAllEnclosures] = useState<Enclosure[]>([])
  const [selectedAnimals, setSelectedAnimals] = useState<Animal[]>([])
  const [enclosureDelete, setEnclosureDelete] = useState<boolean>(false)
  const [capacitiesWarning, setCapacitiesWarning] = useState<string>('')
  const [animalsCurrentlySelected, setAnimalsCurrentlySelected] = useState<{ [key: string]: Animal[] }>({});
  const [relEvents,setRelEvents] = useState<Event[]>([])
  const [eventsAll, setEventAll] = useState(false);
  const [openCapacitiesPopup, setOpenCapacitiesPopup] = useState<boolean>(false)

  useEffect(() => {
    (async () => {
      const enclosure = await cityfarm.getEnclosure(enclosureID, true, (enclosure) => setEnclosure(enclosure));
      setEnclosure(enclosure!);
      const enclosures = await cityfarm.getEnclosures(true, null, (enclosures) => setAllEnclosures(enclosures));
      setAllEnclosures(enclosures);
      const events = await cityfarm.getEvents(true, (events) => setRelEvents(events));
      setRelEvents(events);
    })();

    const tempAnimalsCurrentlySelected: { [key: string]: Animal[] } = {};
    for (const type of Object.keys(enclosure.holding)){
      tempAnimalsCurrentlySelected[type] = [];
    }
    setAnimalsCurrentlySelected(tempAnimalsCurrentlySelected);
  }, [enclosureID]);

  const animalsByType = (type: string)=> {
    let animals: Animal[] = []
    for (const animal of enclosure.holding) {
      if (animal.type === type) {
        animals.push(animal)
      }
    }
    return animals
  }

  useEffect(()=>{
    if(!openCapacitiesPopup){
      const badCapacity = setEnclosureNewAnimals(enclosure.holding);
      if(badCapacity != null){
        let typeTotal = 0
        for (const animal of enclosure.holding){
          if(animal.type===badCapacity){
            typeTotal+=1
          }
        }
        enclosure.capacities[badCapacity] = typeTotal
      }
    }
  },[openCapacitiesPopup])

  useEffect(()=>{
    // send whole thing into selectedanimals
    const selectedList = Object.values(animalsCurrentlySelected).flat();
    setSelectedAnimals(selectedList);
  },[animalsCurrentlySelected])

  const updateSelectedAnimals = (as: Animal[], type: string) => {
    // update by modifying the specific type
    setAnimalsCurrentlySelected(prevState => ({
      ...prevState,
      [type]: as
    }));
  }


  const closeEnclosureMove = () => {
    setSelectedAnimals([])
  }

  const cols: GridColDef [] = [
    {field: 'name', headerName: 'Name', headerClassName: 'grid-header', headerAlign: 'left', flex: 1,
    renderCell: (animal) => (<AnimalPopover cityfarm={cityfarm} key={animal.value.id} animalID={animal.value.id}/>)},
    { field: 'move', headerName: '', headerClassName: 'grid-header', headerAlign: 'left', width: 85,
    renderCell:(animal)=>(<Button onClick={() => setSelectedAnimals([animal.value])}>Move</Button>)}
  ]

  const holdings = () => {
    let holdingDisplay: any[] = []
    if (enclosure.holding !== undefined) {
      for (const animal of enclosure.holding) {
        if (animalTypes.indexOf(animal.type) === -1) {
          setAnimalTypes([...animalTypes, animal.type])
        }
      }
      for (const type of animalTypes){
        let rows: any[] = []
        rows = animalsByType(type).map((a) => ({
          id: a.id,
          name: a,
          move: a
        }))
        holdingDisplay.push(
            <div key={type}>
            <h3 style={{ display: "inline-block" }}>{type}: ({rows.length} / {enclosure.capacities[type]})</h3><br/>
              <DataGrid columns={cols} rows={rows}
                slots={{
                    footer: CustomFooter
                }}
                slotProps={{
                    footer: {
                        handleOpenAnimalsPopup
                    } as FooterPropsOverrides
                }}
                disableRowSelectionOnClick
                checkboxSelection
                onRowSelectionModelChange={(ids) => {
                  const selectedAnimalObjects = rows.filter(row => ids.includes(row.id)).map(row => row.name);
                  updateSelectedAnimals(selectedAnimalObjects, type);
                }}
              />
            </div>
        )
      }
    }
    return holdingDisplay
  }

  const handleEventClick=(event: Event) => {
    //nothing
  }

  const singleEvent = (e: Event)=>{
    return(
        <Grid item xs={1}>
        <Paper elevation={3} className="event-box">
            <h2 onClick={() => handleEventClick(e)}>{e.title}</h2>
            {
                e.allDay ?
                    <div>
                        <p>{e.start.toLocaleDateString()} {e.end == null ? <></> : e.end.toLocaleDateString() === e.start.toLocaleDateString() ? <></> : " - " + e.end.toLocaleDateString()}</p>
                    </div>
                    :
                    <div>
                        <p>{e.start.toLocaleString([], {year: '2-digit', month: '2-digit', day: '2-digit', hour: '2-digit', minute:'2-digit'})} - {e.start.toLocaleDateString() === e.end.toLocaleDateString() ? e.end.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}): e.end.toLocaleString([], {year: '2-digit', month: '2-digit', day: '2-digit', hour: '2-digit', minute:'2-digit'})}</p>
                    </div>

            }
            {e.farms.length !== 0 ? <h3>Farms</h3> : <></>}
            {e.farms.map((farm, index) => <p key={index}>{readableFarm(farm)}</p>)}
            {e.animals.length !== 0 ? <h3>Animals</h3> : <></>}
            {e.animals.map((animal: Animal, index) => (
                <AnimalPopover key={index} cityfarm={cityfarm} animalID={animal.id}/>
            ))}
            {e.enclosures.length !== 0 &&
                <div>
                    <h3>Enclosures</h3>
                    {e.enclosures.map((enclosure, index) => (
                        <EnclosurePopover key={index} cityfarm={cityfarm} enclosureID={enclosure.id}/>
                    ))}
                </div>}
            {e.description !== "" ?
                <div>
                    <h3>Description</h3>
                    {e.description}
                </div> : <></>}
        </Paper>
        </Grid>
    )
  }

  const setEnclosureNewAnimals = (animalList: Animal[]) => {
    //iterate through each type in capacity
    for (const type of Object.entries(enclosure.capacities)){
      let typeTotal=0
      for (const animal of animalList){
        if(animal.type===type[0]){
          typeTotal+=1
        }

      }
      if (typeTotal>type[1]){
        setCapacitiesWarning(
            `There are too many ${type[0]}(s) in this enclosure, you need to assign less or change capacities`
        )
        return type[0]
      }
    }
    updateEnclosure(enclosure.id, new Enclosure({name: enclosure.name, holding: animalList,
          capacities: enclosure.capacities, notes: enclosure.notes, farm: enclosure.farm}))
  }

  const handleOpenAnimalsPopup = () => {
    setOpenAnimalsPopup(!openAnimalsPopup);
  }

  const updateEnclosure = (id: string, enclosure: Enclosure) =>{
    (async() => {
      try {
        const response = await axios.patch(`/enclosures/by_id/${id}/update`, {...enclosure, holding: enclosure.holding.map((animal => animal.id))}, token)
        console.log(response);
      } catch (error) {
        console.log(error)
        if (error.response.status === 401) {
          window.location.href = "/login";
          return;
        } else {
          window.alert(error);
        }
      }
    })();
  }

  function handleEnclosureDeletion() {
    (async () => {
      try {
        console.log(enclosure)
        const req = await axios.delete(`/enclosures/by_id/${enclosure.id}/delete`, token)
        console.log(req);
      } catch (error) {
        if (error.response.status === 401) {
          window.location.href = "/login";
          console.log(error)
          return;
        } else {
          window.alert(error);
        }
    }
    })()
    setEnclosureDelete(false)
    window.location.href="/enclosures";
  }

  return (
  <div className="enclosureView">
    <span style={{display: 'flex'}}>
      <h2>{enclosure.name}</h2>
      <IconButton style={{marginLeft: '20px', marginTop: '20px', maxHeight: '40px'}} color={'warning'} onClick={()=>setEnclosureDelete(true)}><DeleteIcon/></IconButton>
    </span>
    <Dialog open={enclosureDelete} onClose={()=>setEnclosureDelete(false)}>
      <DialogTitle>Delete {enclosure.name}?</DialogTitle>
      <DialogContent>
        Are you sure you want to delete {enclosure.name}? <br/><br/>
        <span style={{display: 'flex', justifyContent: 'space-between'}}>
            <Button variant='contained' color={'warning'} onClick={handleEnclosureDeletion} endIcon={<DeleteIcon/>}>Delete</Button>
            <Button variant='contained' color={'success'} onClick={()=>setEnclosureDelete(false)}>Cancel</Button>
        </span>
      </DialogContent>
    </Dialog>
    <b>Farm: </b> {readableFarm(enclosure.farm)}<br/>
    {enclosure.notes !== '' && <b>Notes: </b>} {enclosure.notes}<br/>
    <h3 style={{ display: "inline-block" }}>Livestock:</h3>
    <br/>

    <Button variant='outlined' onClick={() => {setOpenCapacitiesPopup(true)}}>Capacities</Button> 

    <div id="CapacityChanger" style={{textAlign:'center'}}>
      <Dialog open={openCapacitiesPopup} onClose={()=>{setOpenCapacitiesPopup(false)}}>
        <DialogTitle><span style={{display: 'flex', justifyContent: 'space-between'}}>Change Capacities<Button variant='outlined' onClick={() => setOpenCapacitiesPopup(false)}>Close</Button></span></DialogTitle>
        <DialogContent>
          <CapacityChanger enclosure={enclosure} cityfarm={cityfarm}/>
        </DialogContent>
      </Dialog>
    </div>

    <div id="AssociateAnimal" style={{textAlign:'center'}}>
      <Dialog fullWidth maxWidth='md' open={openAnimalsPopup} onClose={()=>{setOpenAnimalsPopup(false)}}>
        <DialogTitle>Change Animals</DialogTitle>
        <DialogContent>
          <AssociateAnimal cityfarm={cityfarm} setAnimals={setEnclosureNewAnimals} animals={enclosure.holding} close={()=>{setOpenAnimalsPopup(false); window.location.reload()}}></AssociateAnimal>
        </DialogContent>
      </Dialog>
    </div>

    {holdings()}
    <EnclosureMove cityfarm={cityfarm} excludedEnc={enclosure}
                   enclosures={allEnclosures} animalList={selectedAnimals} close={closeEnclosureMove} />

    <div>
          {relEvents.length !== 0 ? <h2 onClick={()=>setEventAll(!eventsAll)}>Linked Event, click for {!eventsAll ? 'more' : 'less'}</h2> : <></>}
              <Grid container spacing={3} columns={{xs: 1, md: 2, lg: 3, xl: 4}}>
                  {!eventsAll ? <>
                  {relEvents.slice(0, 3).map((e, index)=>(
                      <Fragment key={index}>{singleEvent(e)}</Fragment>
                  ))} </>
                      :
                  <>
                      {relEvents.map((e, index)=>(
                          <Fragment key={index}>{singleEvent(e)}</Fragment>
                      ))} </>

                  }
              </Grid>

      </div>

      <Dialog open={capacitiesWarning !==''} onClose={()=>{setCapacitiesWarning('')}}>
        <DialogTitle>Capacity issue</DialogTitle>
          <DialogContent >
            <Alert severity={'warning'}>
              {capacitiesWarning}
            </Alert>
          </DialogContent>
      </Dialog>
  </div>
  )
}

const CustomFooter = (props: NonNullable<GridSlotsComponentsProps['footer']>) => {
    return (<>
        <Divider/>
        <div style={{maxHeight: '56.5px', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
            <Button sx={{margin: '10px'}} aria-label="edit" onClick={() => props.handleOpenAnimalsPopup()} variant='contained' endIcon={<EditIcon/>}>Edit</Button>
        </div>
    </>)
}

export default SingleEnclosure