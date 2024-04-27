import axios from "axios";

const url = process.env.REACT_APP_BASE_URL || `http://${window.location.host.split(':')[0]}:8080/api`;
console.log("Using base URL: " + url);

export default axios.create({
    baseURL: url,
});