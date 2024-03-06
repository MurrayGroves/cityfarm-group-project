import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import "./FarmTabs.css";
import { React, useState } from 'react';
import { ThemeProvider, useTheme } from "@emotion/react";
import { createTheme } from "@mui/material";

const FarmTabs = (props) => {
    const farms = props.farms;

    var tabTheme = createTheme(useTheme());
    var mainTheme = useTheme();

    if (props.selectedFarm) {
        tabTheme.palette.primary.main = mainTheme.palette[farms[props.selectedFarm]].main;
    } else {
        if (props.selectedFarm != null) {
            tabTheme.palette.primary.main = mainTheme.palette.green.main;
        }
    }

    return (
        <div className="tab-container">
            <ThemeProvider theme={tabTheme}>
                <Tabs value={props.selectedFarm} onChange={(e, farm)=>{props.setSelectedFarm(farm)}}>
                    <Tab value={null} label="All"/>
                    <Tab value={farms.WH} label="Windmill Hill"/>
                    <Tab value={farms.HC} label="Hartcliffe"/>
                    <Tab value={farms.SW} label="St Werburghs"/>
                    <Tab value={''} label="Other"/>
                </Tabs>
            </ThemeProvider>
        </div>
    );
}

export default FarmTabs;
