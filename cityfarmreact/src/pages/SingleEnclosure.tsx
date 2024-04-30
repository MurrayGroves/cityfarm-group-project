import {Link, useParams} from "react-router-dom";
import React, {ReactNode, useEffect, useState} from "react";
import axios from "../api/axiosConfig.js";
import {getConfig} from "../api/getToken.js";
import AnimalPopover from "../components/AnimalPopover.tsx";
import "./SingleEnclosure.css"
import {Alert, Dialog, DialogContent, DialogTitle, Divider, Icon, Paper} from "@mui/material";
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

const SingleEnclosure = ({farms, cityfarm}: {farms: any, cityfarm: CityFarm}) => {
  const token = getConfig();
  const enclosureID = useParams().enclosureID!
  const [enclosure, setEnclosure] = useState<Enclosure>(new Enclosure({name: 'Loading...', holding: [], capacities: {}}))
  const [animalTypes, setAnimalTypes] = useState<string[]>(new Array<string>())
  const [openAnimalsPopup, setOpenAnimalsPopup] = useState<boolean>(false)
  const [allEnclosures, setAllEnclosures] = useState<Enclosure[]>([])
  const [animalToMove, setAnimalToMove] = useState<boolean>(false)
  const [selectedAnimals, setSelectedAnimals] = useState<Animal[]>([])
  const [enclosureDelete, setEnclosureDelete] = useState<boolean>(false)
  const [capacitiesWarning, setCapacitiesWarning] = useState<string>('')

  useEffect(() => {
    (async () => {
      const enclosure = await cityfarm.getEnclosure(enclosureID, true, (enclosure) => setEnclosure(enclosure));
      setEnclosure(enclosure!);
      const enclosures = await cityfarm.getEnclosures(true, null, (enclosures) => setAllEnclosures(enclosures));
      setAllEnclosures(enclosures);
    })();
  }, [enclosureID])


  const animalsByType = (type: string)=> {
    let animals: Animal[] = []
    for (const animal of enclosure.holding) {
      if (animal.type === type) {
        animals.push(animal)
      }
    }
    return animals
  }

  const updateSelectedAnimals = (ids) => {
    console.log(ids)

      // Merge the newly selected animals with the already selected ones
     //  const newSelectedAnimals = selectedAnimals;
    //   ids.forEach((id) => {
    //     console.log(id)
    //     // Check if the id is already in the selected list
    //     const index = newSelectedAnimals.indexOf(id);
    //     if (index === -1) {
    //
    //       // If not, add it to the list
    //       console.log("ID not found!")
    //       newSelectedAnimals.push(id);
    //       console.log("Updated list")
    //       console.log(newSelectedAnimals)
    //
    //     } else {
    //       console.log("ID found")
    //       // If yes, remove it from the list (deselect)
    //       newSelectedAnimals.splice(index, 1);
    //       console.log("Updated list with remove")
    //       console.log(newSelectedAnimals)
    //     }
    //   });
    //   setSelectedAnimals(newSelectedAnimals)
    // console.log(selectedAnimals)
    // console.log("Function Complete")
    setSelectedAnimals(ids)
    }

  const closeEnclosureMove =()=>{
    setAnimalToMove(false)
    setSelectedAnimals([])
  }


  const cols: GridColDef [] = [
    {field: 'name', headerName: 'Name', headerClassName: 'grid-header', headerAlign: 'left', flex: 1,
    renderCell: (animal) => (<AnimalPopover cityfarm={cityfarm} key={animal.value.id} animalID={animal.value.id}/>)},
    { field: 'move', headerName: '', headerClassName: 'grid-header', headerAlign: 'left', flex: 1,
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
                onRowSelectionModelChange={(ids) => updateSelectedAnimals(ids)}
              />
            </div>
        )
      }
    }
    return holdingDisplay
  }

  // const setEnclosureNewAnimals = async (animalList) => {
  //   try {
  //     const newHolding = await Promise.all(animalList.map(async (id) => {
  //       const response = await axios.get(`/animals/by_id/${id}`, token);
  //       return response.data;
  //     }));
  //
  //     console.log('newholding', newHolding);
  //     updateEnclosure({name: enclosure.name, holding: newHolding,
  //       capacities: enclosure.capacities, notes: enclosure.notes, farm: enclosure.farm});
  //   } catch (error) {
  //     window.alert(error);
  //   }
  // }

  const setEnclosureNewAnimals = (animalList: Animal[]) => {

    //iterate thru each type in capacity
    for (const type of Object.entries(enclosure.capacities)){
      let typeTotal=0
      for (const animal of animalList){
        if(animal.type===type[0]){
          typeTotal+=1
        }

      }
      if (typeTotal>type[1]){
        setCapacitiesWarning(
            `There are too many of ${type[0]} in this enclosure, you need to assign less`
        )
        return
      }
    }
    console.log("HELLO ",animalList)
    updateEnclosure(enclosure.id, new Enclosure({name: enclosure.name, holding: animalList,
          capacities: enclosure.capacities, notes: enclosure.notes, farm: enclosure.farm}))
    window.location.reload()
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

    <div id="AssociateAnimal" style={{textAlign:'center'}}>
      <Dialog fullWidth maxWidth='md' open={openAnimalsPopup} onClose={()=>{setOpenAnimalsPopup(false)}}>
        <DialogTitle>Change Animals</DialogTitle>
        <DialogContent>
          <AssociateAnimal cityfarm={cityfarm} setAnimals={setEnclosureNewAnimals} animals={enclosure.holding} close={()=>{setOpenAnimalsPopup(false);}}></AssociateAnimal>
        </DialogContent>
      </Dialog>
    </div>
    {holdings()}
    <EnclosureMove cityfarm={cityfarm} excludedEnc={enclosure}
                   enclosures={allEnclosures} animalList={selectedAnimals} close={closeEnclosureMove} />

      <Dialog open={capacitiesWarning !==''} onClose={()=>{setCapacitiesWarning('')}}>
        <DialogTitle>Capacity issue for enclosure movement</DialogTitle>
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