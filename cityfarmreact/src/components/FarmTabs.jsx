import Tabs, {tabsClasses} from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import "./FarmTabs.css";
import { React, useEffect, useState } from 'react';
import { ThemeProvider, useTheme } from "@emotion/react";
import { createTheme } from "@mui/material";

const FarmTabs = ({farms, setSelectedFarm}) => {

    var tabTheme = createTheme(useTheme());
    var mainTheme = useTheme();
    const [farm, setFarm] = useState(null);

    if (farm) {
        tabTheme.palette.primary.main = mainTheme.palette[farms[farm]].main;
    } else {
        if (farm != null) {
            tabTheme.palette.primary.main = mainTheme.palette.green.main;
        }
    }

    useEffect(() => {
        setTimeout(() => setSelectedFarm(farm), 250);
    }, [farm])

    function readableFarm(farm) {
        switch(farm) {
            case "WH": return 'Windmill Hill';
            case "HC": return 'Hartcliffe';
            case "SW": return 'St Werburghs';
            default: return 'Loading...';
        }   
    }

    return (
        <div className="tab-container">
            <ThemeProvider theme={tabTheme}>
                <Tabs
                    variant='scrollable'
                    scrollButtons='auto'
                    value={farm}
                    onChange={(_, farm) => {setFarm(farm)}}
                    sx={{
                        [`& .${tabsClasses.scrollButtons}`]: {
                          '&.Mui-disabled': { opacity: 0.3 },
                        },
                    }}
                >
                    <Tab value={null} label="All"/>
                    {Object.values(farms).map((farm) => <Tab key={farm} value={farm} label={readableFarm(farm)}/>)}
                    {/*<Tab value={farms.WH} label="Windmill Hill"/>
                    <Tab value={farms.HC} label="Hartcliffe"/>
                    <Tab value={farms.SW} label="St Werburghs"/>*/}
                </Tabs>
            </ThemeProvider>
        </div>
    );
}

export default FarmTabs;
