import "./FarmTabs.css";
import Button from '@mui/material/Button';
import { createTheme, ThemeProvider } from '@mui/material/styles';

const WH = 0, HC = 1, SW = 2;

const theme = createTheme({
  palette: {
    WH: {
        main: '#035afc',
        light: '#ffffff',
        dark: '#2643a3',
        contrastText: '#050f24'
    },
    HC: {
        main: '#FF0012',
        light: '#FFFFFF',
        dark: '#AA0033',
        contrastText: '#333333'
    },
    SW: {
        main: '#E3D026',
        light: '#E9DB5D',
        dark: '#A29415',
        contrastText: '#242105'
    }
  },
});

const FarmTabs = (props) => {
    return (
        <ThemeProvider theme={theme}>
        <div className="tab-container">
            <Button variant='contained' disableElevation onClick={()=>{props.selectFarm(WH)}} color="WH">Windmill Hill</Button>
            <Button variant='contained' disableElevation onClick={()=>{props.selectFarm(HC)}} color="HC">Hartecliffe</Button>
            <Button variant='contained' disableElevation onClick={()=>{props.selectFarm(SW)}} color="SW">St Werburghs</Button>
        </div>
        </ThemeProvider>
    );
}

export default FarmTabs;
