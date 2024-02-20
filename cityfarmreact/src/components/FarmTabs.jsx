import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import "./FarmTabs.css";
import { React, useState } from 'react';
import { ThemeProvider, useTheme } from "@emotion/react";
import { createTheme } from "@mui/material";

const WH = 0, HC = 1, SW = 2;
const farms = {
    0: 'WH',
    1: 'HC',
    2: 'SW'
}

const FarmTabs = (props) => {
    var tabTheme = createTheme();
    tabTheme.palette.primary.main = useTheme().palette[farms[props.selectedFarm]].main;

    return (
        <div className="tab-container">
            <ThemeProvider theme={tabTheme}>
                <Tabs value={props.selectedFarm} onChange={(e, farm)=>{props.setSelectedFarm(farm)}}>
                    <Tab value={WH} label="Windmill Hill"/>
                    <Tab value={HC} label="Hartcliffe"/>
                    <Tab value={SW} label="St Werburghs"/>
                </Tabs>
            </ThemeProvider>
        </div>
    );
}

export default FarmTabs;
