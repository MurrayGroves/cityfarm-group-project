import {useParams} from "react-router-dom";
import React, {useEffect, useState} from "react";
import axios from "../api/axiosConfig";
import {getConfig} from "../api/getToken";
import AnimalPopover from "../components/AnimalPopover";

const SingleEnclosure = (props) => {
  const token = getConfig();
  const enclosureID = useParams().enclosureID
  const [enclosure, setEnclosure] = useState({name: 'Loading...'})
  const [animalTypes,setAnimalTypes] = useState([])



  useEffect(() => {
    (
        async () => {
    try {
      const req = await axios.get(`/enclosures/by_id/${enclosureID}`, token)
      setEnclosure(req.data)


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
      return animals
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
            <>
              {type}
              {animalsByType(type).map((animal) => (
               <AnimalPopover key={animal._id} animalID={animal._id}/>
       ))}
            </>
        )

      }
    }
    return holdingDisplay
  }

  return (
  <div>
    {enclosure.name}
    {holdings().map((item)=>(item))}

  </div>)

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