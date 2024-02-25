import React, {useEffect, useState} from "react";
import Eevent from "../assets/example event.png";

export const calData =<>This displays a calendar which shows relevant events for you and the animals,
    each event has  a title, a description, start and end times (or date), an indicator whether it lasts a full day or not,
    a list of relevant animals it effects, a list of what farms it happens in and the people associated with that event. For example:
    <p><img src={Eevent} width={400} height={200}/></p></>
export const liveData=<>LIVESTOCK</>
export const encData=<>ENCLOSURES</>
export const typeData=<>ANIMAL TYPES</>

const HelpPage = () => {
    const [calShowing,setCalShowing] = useState(false)
    const [calContent,setCalContent] = useState(<></>)
    const [liveShowing,setLiveShowing] = useState(false)
    const [liveContent,setLiveContent] = useState(<></>)
    const [encShowing,setEncShowing] = useState(false)
    const [encContent,setEncContent] = useState(<></>)
    const [typeShowing,setTypeShowing] = useState(false)
    const [typeContent,setTypeContent] = useState(<></>)
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