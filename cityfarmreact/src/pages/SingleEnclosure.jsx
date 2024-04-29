import {useParams} from "react-router-dom";
import React, {useEffect, useState} from "react";
import axios from "../api/axiosConfig";
import {getConfig} from "../api/getToken";
import AnimalPopover from "../components/AnimalPopover.tsx";
import "./SingleEnclosure.css"
import {Alert, Dialog, DialogContent, DialogTitle, Paper} from "@mui/material";
import AssociateAnimal from "../components/AssociateAnimal.tsx";
import Button from "@mui/material/Button";
import DeleteIcon from '@mui/icons-material/Delete';

import {DataGrid} from "@mui/x-data-grid";
import {readableFarm} from "./SingleAnimal.tsx";
import EnclosureMove from "../components/EnclosureMove";

const SingleEnclosure = (props) => {
  const token = getConfig();
  const enclosureID = useParams().enclosureID
  const [enclosure, setEnclosure] = useState({name: 'Loading...',holding:[],_id : 'wait'})
  const [animalTypes,setAnimalTypes] = useState([])
  const [openAnimalsPopup ,setOpenAnimalsPopup] = useState(false)
  const [allEnclosures,setAllEnclosures] = useState([])
  const [animalToMove,setAnimalToMove] = useState(false)
  const [selectedAnimals,setSelectedAnimals] = useState([])
  const [enclosureDelete,setEnclosureDelete]=useState(false)
  const [capacitiesWarning,setCapacitiesWarning] = useState('')
  const cityfarm= props.cityfarm

  useEffect(() => {
    (
        async () => {
    try {
      const req1 = await axios.get(`/enclosures/by_id/${enclosureID}`, token)
      setEnclosure(req1.data)
      const req2 = await axios.get('/enclosures',token)
      setAllEnclosures(req2.data)


    } catch (error) {
      if (error.response.status === 401) {
        window.location.href = "/login";
        return;
      } else {
        window.alert(error);
      }
    }
  })();
  }, [enclosureID])


  const animalsByType = (type)=> {
    let animals = []
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


  const holdings =()=>{
    let holdingDisplay=[]
    if (enclosure.holding!==undefined){
      for (const animal of enclosure.holding){
        if (animalTypes.indexOf(animal.type)=== -1){
          setAnimalTypes([...animalTypes,animal.type])
        }
      }
      for (const type of animalTypes){
        let rows = []
        for (const a of animalsByType(type)){
          rows.push({id: a._id,name : a , move: a})
        }
        holdingDisplay.push(
            <div key={type}>
            <h3 style={{ display: "inline-block" }}>{type}:</h3><br/>

              <DataGrid columns={
                [
                    { field: 'name', headerName: 'Name', headerClassName: 'grid-header', headerAlign: 'left', flex: 1,
                  renderCell: (animal) => (<AnimalPopover cityfarm={cityfarm} key={animal.value._id} animalID={animal.value._id}/>)},
                  { field: 'move', headerName: '', headerClassName: 'grid-header', headerAlign: 'left', flex: 1,
                  renderCell:(animal)=>(<Button onClick={() => setSelectedAnimals([animal.id])}> Move</Button>)}
                ]
              } rows={rows}
              disableRowSelectionOnClick
              checkboxSelection
              onRowSelectionModelChange={(ids) => {
                updateSelectedAnimals(ids.map(name => name));}}
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

  const setEnclosureNewAnimals = (animalList) => {

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
    updateEnclosure(enclosure._id,{name: enclosure.name, holding: animalList.map((animal,key)=>(animal.id)),
          capacities: enclosure.capacities, notes: enclosure.notes, farm: enclosure.farm})
    window.location.reload()
  }



  const handleOpenAnimalsPopup = () => {
    setOpenAnimalsPopup(!openAnimalsPopup);
  }
  const updateEnclosure = (id,enclosure) =>{
    (async() => {
      try{
        console.log(enclosure)
        const response = await axios.patch(`/enclosures/by_id/${id}/update`, enclosure, token)
        console.log(response);
        //window.location.reload(false);
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
    (async ()=>{
      try {
        console.log(enclosure)
        const req = await axios.delete(`/enclosures/by_id/${enclosure._id}/delete`,token)

      } catch (error) {
        if (error.response.status === 401) {
          window.location.href = "/login";
          console.log(error)
          return;
        } else {
          window.alert(error);
        }
    }
    })
    ()
    setEnclosureDelete(false)
    window.location.href="/enclosures";
  }


  return (

  <div className="enclosureView">
    <h2>{enclosure.name}</h2>
    <Button color={'warning'} onClick={()=>setEnclosureDelete(true)} variant="outlined">Delete Enclosure <DeleteIcon /> </Button>
    <br/>
    <Dialog open={enclosureDelete} onClose={()=>setEnclosureDelete(false)}>
      <DialogTitle>Delete {enclosure.name}?</DialogTitle>
      <DialogContent>
        Are you sure you want to delete {enclosure.name}? <br/>
        <Button color={'warning'} onClick={handleEnclosureDeletion}>Delete <DeleteIcon /> </Button>
        <Button color={'success'} onClick={()=>setEnclosureDelete(false)}>Cancel</Button>
      </DialogContent>
    </Dialog>
    <b>Farm: </b> {readableFarm(enclosure.farm)}<br/>
    <h3 style={{ display: "inline-block" }}>Animal Holdings:</h3>
    <br/>

    <Button onClick={handleOpenAnimalsPopup}>Edit Animals</Button>
    <div id="AssociateAnimal" style={{textAlign:'center'}}>

      <Dialog fullWidth maxWidth='md' open={openAnimalsPopup} onClose={()=>{setOpenAnimalsPopup(false)}}>
        <DialogTitle>Change Animals</DialogTitle>
        <DialogContent>
          <AssociateAnimal cityfarm={cityfarm}  setAnimals={setEnclosureNewAnimals} animals={enclosure.holding} close={()=>{setOpenAnimalsPopup(false);}}></AssociateAnimal>
        </DialogContent>
      </Dialog>
    </div>
    {holdings().map((item,key)=>(item))}
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

export default SingleEnclosure