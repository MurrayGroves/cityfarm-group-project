import React, {useEffect, useState} from "react";

const Eevent = require("../assets/example event.png");

//updating the constants here updates them globally
export const calData = <>
    This displays a calendar which shows relevant events for you and the animals,
    each event has  a title, a description, start and end times (or date), an indicator whether it lasts a full day or not,
    a list of relevant animals it effects, a list of what farms it happens in and the people associated with that event. For example:
    <br/><img src={Eevent} width={400} height={200}/>
</>
export const liveData = <>
    This table displays all the animals, each one has 5 main attributes, father, mother, name, type and sex.
    This can be searched by name using the search bar at the top. Each name in the table is clickable and will take you to a single animal viewpage that
    will displays more information about the animl, including further fields and any related events with that animal.{'\n'}
    To move an animal's fields, select it on the grid and then press the move farm buttons below the table.
    The add animal button adds an animal where you can selected the types from the ones defined in the animal types page and all the fields can be assigned.
</>
export const encData = <>
    For each enclosure you can see which animals it is currently holding - and how many of each type it can hold at most.
    <br/><br/>
    Click on an enclosure's name to see all the information about it, or to edit it.
    <br/><br/>
    You can hover over an animal's name to see information about it - or click it to see even more information.
</>

export const typeData = <>
    This displays a page to create custom animal types, in case any new animals are to be added,
    once the type name is filled out, any number of properties can be added that pertain to that animal. Once an animal type is added,
    the creation of animals in the livestock table will be updated to include that.
</>
export const singleData = <>
    This is the page for viewing a single animal, below you can see the upcoming events pertaining
    to it as well as more information about it such as tb inoculation status if it's a cow.
    {'\n'}In order to change what farm this animal belongs to,
    press the change farm button on the right. In order to see more events,
    click on the text that says linked event, each event name is clickable to see it as a normal selected event.
</>

export const singleEncData = <>
    This is the page for viewing a single enclosure, if you click move on the buttons then you
    will be able to move an animal from one enclosure to another, you can also generally edit the list of animals as a whole and even move them if needed.
</>

const Help = () => {

    const [calShowing,setCalShowing] = useState(false)
    const [calContent,setCalContent] = useState(<></>)
    const [liveShowing,setLiveShowing] = useState(false)
    const [liveContent,setLiveContent] = useState(<></>)
    const [encShowing,setEncShowing] = useState(false)
    const [encContent,setEncContent] = useState(<></>)
    const [typeShowing,setTypeShowing] = useState(false)
    const [typeContent,setTypeContent] = useState(<></>)

    //allows all the various elements to be expanded and minimised
    const showCal = () => {
        if (calShowing) {setCalShowing(false)} else {setCalShowing(true)}
    }
    
    useEffect(() => {
        if (calShowing) {setCalContent(calData)} else {setCalContent(<></>)}
    },[calShowing])

    const showLive = () => {
        if (liveShowing) {setLiveShowing(false)} else {setLiveShowing(true)}
    }
    
    useEffect(() => {
        if (liveShowing) {setLiveContent(liveData)} else{setLiveContent(<></>)}
    },[liveShowing])
    
    const showEnc = () => {
        if (encShowing) {setEncShowing(false)} else {setEncShowing(true)}
    }
    
    useEffect(() => {
        if (encShowing) {setEncContent(encData)} else {setEncContent(<></>)}
    },[encShowing])

    const showType = () => {
        if (typeShowing) {setTypeShowing(false)} else {setTypeShowing(true)}
    }

    useEffect(() => {
        if (typeShowing) {setTypeContent(typeData)} else {setTypeContent(<></>)}
    },[typeShowing])

    return(<>
        <h1>Help</h1>
        <p>
        On the left is the side menu, this contains various ways to manage livestock across the three farms.<br/>
        Below are instructions and help to navigate your way around the application, click the headers to reveal their content.
        </p>

        <h2 onClick={showCal}>Calendar</h2>
        {calContent}
        <h2 onClick={showLive}>Animal Table</h2>
        {liveContent}
        <h2 onClick={showEnc}>Enclosures</h2>
        {encContent}
        <h2 onClick={showType}>Animal Types</h2>
        {typeContent}
    </>)
}

export default Help