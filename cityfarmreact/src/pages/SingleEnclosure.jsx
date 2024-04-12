import {useParams} from "react-router-dom";
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

const SingleEnclosure = (props) => {
  const token = getConfig();
  const enclosureID = useParams().enclosureID
  const [enclosure, setEnclosure] = useState({name: 'Loading...'})
  const [animalTypes,setAnimalTypes] = useState([])
  const [openAnimalsPopup ,setOpenAnimalsPopup] = useState(false)
  const [allEnclosures,setAllEnclosures] = useState([])
  const [animalToMove,setAnimalToMove] = useState(false)


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

  const animalTo = (animal, enc) =>{
    //TODO fix this please i keep getting 401 errors even tho im logged in
    console.log(animal.name , "to : " ,enc.name);
    (async ()=>{
      try {
        const req = await axios.patch(`enclosures/moveanimal/${animal._id}/to/${enc._id}/from/${enclosure._id}`,token)
        console.log(req);
        window.location.reload(false);
      }catch (error) {
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

  const enclosureMove =(animal) =>{
    if (animal){
      return(
          <div> Moving {animalToMove.name} to one of: <br/>{
            allEnclosures.map((enc)=>(<div onClick={()=>animalTo(animal,enc)}>{enc.name}<br/></div>
            ))}
            <Button startIcon={<DeleteIcon />} onClick={()=>setAnimalToMove(false)}/>
          </div>
            )
    }else{
      return <></>
    }
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
        holdingDisplay.push(
            <div>
            <h3 style={{ display: "inline-block" }}>{type}:</h3><br/>
              {animalsByType(type).map((animal) => (<div className="animalAndMove" >
               <AnimalPopover key={animal._id} animalID={animal._id}/>
               <Button onClick={() => setAnimalToMove(animal)}> Move</Button></div>
       ))}
            <br/>
            </div>
        )

      }
    }
    return holdingDisplay
  }


  const setEnclosureNewAnimals = (animalList) => {

    updateEnclosure({...enclosure, holding: animalList})
  }

  const handleOpenAnimalsPopup = () => {
    setOpenAnimalsPopup(!openAnimalsPopup);
  }
  const updateEnclosure = (enclosure) =>{
    (async() => {
      try{
        const response = await axios.patch(`/enclosures/by_id/${enclosure._id}/update/${enclosure}`, null, token)
        console.log(response);
        window.location.reload(false);
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
    {enclosure.name}<br/>
    <h2 style={{ display: "inline-block" }}>Animal Holdings:</h2><br/>
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
    {enclosureMove(animalToMove)}


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