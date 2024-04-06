import {useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import axios from "../api/axiosConfig";
import {getConfig} from "../api/getToken";

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

  return (<div>{enclosure.name}</div>)

}

export default SingleEnclosure