import { React, useEffect, useState } from 'react';
import { Select } from "@mui/material";
import MenuItem from '@mui/material/MenuItem';
import TableCell from '@mui/material/TableCell';
import TextField from '@mui/material/TextField';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

const FieldSelector = (props) => {
    const [fieldName, setFieldName] = useState(props.fieldName)
    const [fieldType, setFieldType] = useState(props.fieldType)
    const [value, setValue] = useState()

    const newAnimal = props.newAnimal;
    const setNewAnimal = props.setNewAnimal;

    useEffect(() => {
        setNewAnimal(...newAnimal, {fields: {...newAnimal.fields, fieldName: value}})
    },[value])

    const fieldTypeSwitch = (field) => {
        newAnimal.fields[field] = '' ;
        switch(fieldType) {
            case "java.lang.Boolean":
                return (
                <Select
                    style={{width: '100%'}}
                    value={newAnimal.fields[field]}
                    onChange={(e)=>{console.log(e.target.value); setValue(e.target.value)}}>
                    <MenuItem value={true}>Yes</MenuItem>
                    <MenuItem value={false}>No</MenuItem>
                </Select>
                );
            case "java.lang.String":
                return <TextField/>
            case "java.lang.Integer":
                return <TextField/>
            case "java.lang.Double":
                return <TextField/>
            case "java.time.ZonedDateTime":
                return (
                <DatePicker onChange={(e)=>{let tempNewAnimal = newAnimal; tempNewAnimal.fields[field] = e.$d; setNewAnimal(tempNewAnimal);}}  slotProps={{textField: {fullWidth: true}}}/>
                )
            default:
                return <></>;
        };
    }

    return(
        <TableCell>{fieldTypeSwitch(fieldName)}</TableCell>
    )
}

export default FieldSelector;