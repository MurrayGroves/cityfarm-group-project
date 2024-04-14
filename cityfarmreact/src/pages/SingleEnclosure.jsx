import {Link, useParams} from "react-router-dom";
import React, {useEffect, useState} from "react";
import axios from "../api/axiosConfig";
import {getConfig} from "../api/getToken";
import AnimalPopover from "../components/AnimalPopover";
import "./SingleEnclosure.css"
import {Dialog, DialogContent, DialogTitle} from "@mui/material";
import AssociateAnimal from "../components/AssociateAnimal";
import Button from "@mui/material/Button";
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from "@mui/material/IconButton";
import {DataGrid} from "@mui/x-data-grid";

const SingleEnclosure = (props) => {
  const token = getConfig();
  const enclosureID = useParams().enclosureID
  const [enclosure, setEnclosure] = useState({name: 'Loading...'})
  const [animalTypes,setAnimalTypes] = useState([])
  const [openAnimalsPopup ,setOpenAnimalsPopup] = useState(false)
  const [allEnclosures,setAllEnclosures] = useState([])
  const [animalToMove,setAnimalToMove] = useState(false)
  const [selectedAnimals,setSelectedAnimals] = useState([])


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

  const animalTo = (animalList, enc) =>{


    //TODO fix this please i keep getting 401 errors even tho im logged in
    for (const animal of animalList) {
      (async () => {
        try {
          console.log(animal)
          const req = await axios.patch(`enclosures/moveanimal/${animal}/to/${enc._id}/from/${enclosure._id}`, token)
          console.log(req);
          window.location.reload(false);
        } catch (error) {
          if (error.response.status === 401) {
            //this is errored out bc im just getting a 401 error
            //window.location.href = "/login";
            console.log(error)
            return;
          } else {
            window.alert(error);
          }
        }
      })();
    }
  }

  const enclosureMove =(animalList) =>{

    let name = ' animal group'


    console.log(animalList)

    if (animalList.length >0){
      if (animalList.length === 1){
        name = <AnimalPopover key={animalList[0]} animalID={animalList[0]}/>
      }
      return(
          <div> Moving {name} to one of: <br/>{
            allEnclosures.map((enc)=>(<div onClick={()=>animalTo(animalList,enc)}>{enc.name}<br/></div>
            ))}
            <Button startIcon={<DeleteIcon />} onClick={closeEnclosureMove}/>
          </div>
            )
    }else{
      return <></>
    }
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
            <div>
            <h3 style={{ display: "inline-block" }}>{type}:</h3><br/>

              <DataGrid columns={
                [
                    { field: 'name', headerName: 'Name', headerClassName: 'grid-header', headerAlign: 'left', flex: 1,
                  renderCell: (animal) => (<AnimalPopover key={animal.value._id} animalID={animal.value._id}/>)},
                  { field: 'move', headerName: '', headerClassName: 'grid-header', headerAlign: 'left', flex: 1,
                  renderCell:(animal)=>(<Button onClick={() => setSelectedAnimals([animal.id])}> Move</Button>)}
                ]
              } rows={rows}
              disableRowSelectionOnClick
              checkboxSelection
              onRowSelectionModelChange={(ids) => {
              setSelectedAnimals(ids.map(name => name));}}
              />
            <br/>
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
    updateEnclosure(enclosure._id,{name: enclosure.name, holding: animalList,
          capacities: enclosure.capacities, notes: enclosure.notes, farm: enclosure.farm})
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

  return (

  <div className="enclosureView">
    <h2>{enclosure.name}</h2>
    <h3 style={{ display: "inline-block" }}>Animal Holdings:</h3><br/>
    {holdings().map((item)=>(item))}

    <div id="AssociateAnimal" style={{textAlign:'center'}}>
      <Button onClick={handleOpenAnimalsPopup}>Edit Animals</Button>
      <Dialog fullWidth maxWidth='md' open={openAnimalsPopup} onClose={()=>{setOpenAnimalsPopup(false)}}>
        <DialogTitle>Change Animals</DialogTitle>
        <DialogContent>
          <AssociateAnimal setAnimals={setEnclosureNewAnimals} animals={enclosure.holding} close={()=>setOpenAnimalsPopup(false)}></AssociateAnimal>
        </DialogContent>
      </Dialog>
    </div>
    {enclosureMove(selectedAnimals)}


  </div>
  )

}


//FOR WHEN TYPES ARE COOLER
// for (const [type,animalList] of Object.entries(enclosure.holding)){
//   console.log([type,animalList])
//     holdingDisplay.push(<>
//         <h4>{type}</h4>
//         <div>
//           {animalList.map((animal) => (
//               <AnimalPopover key={animal} animalID={animal}/>
//           ))}
//         </div>
// </>)
export default SingleEnclosure