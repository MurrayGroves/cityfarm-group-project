import {useParams} from "react-router-dom";
import React, {useEffect, useState} from "react";
import axios from "../api/axiosConfig";
import {getConfig} from "../api/getToken";
import AnimalPopover from "../components/AnimalPopover";
import "./SingleEnclosure.css"
import {Dialog, DialogContent, DialogTitle} from "@mui/material";
import AssociateAnimal from "../components/AssociateAnimal";
import Button from "@mui/material/Button";
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
            <>
            <h3 style={{ display: "inline-block" }}>{type}:</h3><br/>
              {animalsByType(type).map((animal) => (<span style={{marginRight: '0.5em'}}>
               <AnimalPopover key={animal._id} animalID={animal._id}/>
               <Button onClick={() => setAnimalToMove(animal)}> Move</Button></span>
       ))}

            </>
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