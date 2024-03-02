import React, {useEffect, useState} from "react";
import Eevent from "../assets/example event.png";

//updating the constants here updates them globally
export const calData =<>This displays a calendar which shows relevant events for you and the animals,
    each event has  a title, a description, start and end times (or date), an indicator whether it lasts a full day or not,
    a list of relevant animals it effects, a list of what farms it happens in and the people associated with that event. For example:
    <p><img src={Eevent} width={400} height={200}/></p></>
export const liveData=<>This table displays all the animals, each one has 5 main attributes, father, mother, name, type and sex.
This can be searched by name using the search bar at the top. Each name in the table is clickable and will take you to a single animal viewpage that
will displays more information about the animl, including further fields and any related events with that animal.{'\n'}
The add animal button adds an animal where you can selected the types from the ones defined in the animal types page and all the fields can be assigned.</>
export const encData=<>Every enclosure has animals assigned to it, you can give it specific events which will affect all the animals within it.
Click on an enclosure to expand it, you can edit them by clicking the edit button then pressing a field.</>
export const typeData=<>This displays a page to create custom animal types, in case any new animals are to be added,
    once the type name is filled out, any number of properties can be added that pertain to that animal. Once an animal type is added,
    the creation of animals in the livestock table will be updated to include that.</>
export const singleData=<>This is the page for viewing a single animal, below you can see the upcoming events pertaining
    to it as well as more information about it such as tb inoculation status if it's a cow. In order to change what farm this animal belongs to,
    press the change farm button on the right.
</>
const HelpPage = () => {

    const [calShowing,setCalShowing] = useState(false)
    const [calContent,setCalContent] = useState(<></>)
    const [liveShowing,setLiveShowing] = useState(false)
    const [liveContent,setLiveContent] = useState(<></>)
    const [encShowing,setEncShowing] = useState(false)
    const [encContent,setEncContent] = useState(<></>)
    const [typeShowing,setTypeShowing] = useState(false)
    const [typeContent,setTypeContent] = useState(<></>)

    //allows all the various elements to be expanded and minimised
    const showCal =()=>{
        if (calShowing){setCalShowing(false)}else {setCalShowing(true)}}
    useEffect(()=>{
        if (calShowing){
            setCalContent(calData
            )}else{
            setCalContent(<></>)}},[calShowing])
    const showLive =()=>{
        if (liveShowing){setLiveShowing(false)}else {setLiveShowing(true)}}
    useEffect(()=>{
        if (liveShowing){
            setLiveContent(liveData)}else{
            setLiveContent(<></>)}},[liveShowing])
    const showEnc =()=>{
        if (encShowing){setEncShowing(false)}else {setEncShowing(true)}}
    useEffect(()=>{
        if (encShowing){
            setEncContent(encData)}else{
            setEncContent(<></>)}},[encShowing])
    const showType =()=>{
        if (typeShowing){setTypeShowing(false)}else {setTypeShowing(true)}}
    useEffect(()=>{
        if (typeShowing){
            setTypeContent(typeData)}else{
            setTypeContent(<></>)}},[typeShowing])
  return(
      <>
          On the left is the side menu, this contains various ways to manage livestock across the three farms. Below are instructions and help to navigate your way around the application, click the headers to reveal their content.

          <h2 onClick={showCal}>Calendar</h2>
          {calContent}

          <h2 onClick={showLive}>Animal Table</h2>
          {liveContent}
          <h2 onClick={showEnc}>Enclosures</h2>
          {encContent}
          <h2 onClick={showType}>Animal Types</h2>
          {typeContent}
      </>
  )
}

export default HelpPage