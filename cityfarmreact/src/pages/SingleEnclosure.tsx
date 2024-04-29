import {Link, useParams} from "react-router-dom";
import React, {ReactNode, useEffect, useState} from "react";
import axios from "../api/axiosConfig.js";
import {getConfig} from "../api/getToken.js";
import AnimalPopover from "../components/AnimalPopover.tsx";
import "./SingleEnclosure.css"
import { Dialog, DialogContent, DialogTitle, Paper} from "@mui/material";
import AssociateAnimal from "../components/AssociateAnimal.tsx";
import Button from "@mui/material/Button";
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from "@mui/material/IconButton";
import {DataGrid, GridColDef} from "@mui/x-data-grid";
import {readableFarm} from "./SingleAnimal.tsx";
import { Enclosure } from "../api/enclosures.ts";
import { CityFarm } from "../api/cityfarm.ts";
import { Animal } from "../api/animals.ts";

const SingleEnclosure = (farms: any, cityfarm: CityFarm) => {
  const token = getConfig();
  const enclosureID = useParams().enclosureID
  const [enclosure, setEnclosure] = useState<Enclosure>(new Enclosure({name: 'Loading...', holding: [], capacities: {}}))
  const [animalTypes, setAnimalTypes] = useState<string[]>(new Array<string>())
  const [openAnimalsPopup, setOpenAnimalsPopup] = useState<boolean>(false)
  const [allEnclosures, setAllEnclosures] = useState<Enclosure[]>([])
  const [animalToMove, setAnimalToMove] = useState<boolean>(false)
  const [selectedAnimals, setSelectedAnimals] = useState<Animal[]>([])
  const [enclosureDelete, setEnclosureDelete] = useState<boolean>(false)

  useEffect(() => {
    (async () => {
    try {
      const req1 = await axios.get(`/enclosures/by_id/${enclosureID}`, token)
      setEnclosure(new Enclosure(req1.data))
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


  const animalsByType = (type: string)=> {
    let animals: Animal[] = []
    for (const animal of enclosure.holding) {
      if (animal.type === type) {
        animals.push(animal)
      }
    }
    return animals
  }

  const animalTo = (animalList: Animal[], enc: Enclosure) => {
      (async () => {
        for (const animal of animalList) {
        try {
          const req = await axios.patch(`/enclosures/moveanimal`, [animal.id, enc.id, enclosure.id], token)
          // console.log(req);
          //window.location.reload(false);
        } catch (error) {
          if (error.response.status === 401) {
            window.location.href = "/login";
            console.log(error)
            return;
          } else {
            window.alert(error);
          }
        }
      }
      })();


  }



  const enclosureMove = (animalList: Animal[]) =>{
    let name: string | ReactNode = 'animal group'
      if (animalList.length === 1){
        name = <AnimalPopover key={animalList[0].id} animalID={animalList[0].id} cityfarm={cityfarm}/>
      }
      return(
          <div> Moving {name} to one of: <br/>{
            allEnclosures.map((enc, index)=>(<>{
              (enc.id!==enclosure.id)?
                  <Button key={index} onClick={()=>{animalTo(animalList, enc); window.location.reload();}}>{enc.name}<br/></Button>
            :
            <></>}

            </>))}
            <Button startIcon={<DeleteIcon />} onClick={closeEnclosureMove}/>
          </div>
            )

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
        let rows = []
        animalsByType(type).map((a) => {return({
          id: a.id,
          name: a,
          move: a
        })})
        holdingDisplay.push(
            <div key={type}>
            <h3 style={{ display: "inline-block" }}>{type}:</h3><br/>

              <DataGrid columns={cols} rows={rows}
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
    console.log("HELLO ", animalList)
    updateEnclosure(enclosure.id, new Enclosure({name: enclosure.name, holding: animalList,
          capacities: enclosure.capacities, notes: enclosure.notes, farm: enclosure.farm}))
  }



  const handleOpenAnimalsPopup = () => {
    setOpenAnimalsPopup(!openAnimalsPopup);
  }
  const updateEnclosure = (id: string, enclosure: Enclosure) =>{
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
        const req = await axios.delete(`/enclosures/by_id/${enclosure.id}/delete`,token)

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
    <h2>{enclosure.name}</h2><br/>
    <Button color={'warning'} onClick={()=>setEnclosureDelete(true)}>Delete Enclosure <DeleteIcon /> </Button>
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
          <AssociateAnimal cityfarm={cityfarm} setAnimals={setEnclosureNewAnimals} animals={enclosure.holding} close={()=>{setOpenAnimalsPopup(false);}}></AssociateAnimal>
        </DialogContent>
      </Dialog>
    </div>
    {holdings()}
    <div className={`moveContent ${selectedAnimals.length > 0 ? 'moveVisible' : 'moveHidden'}`}>
      <Paper elevation={3} className={'movePaper'}>
        {enclosureMove(selectedAnimals)}
      </Paper>
    </div>
  </div>
  )

}

export default SingleEnclosure