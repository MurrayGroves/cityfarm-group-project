import axios from "axios";

const url = 'http://localhost:8080/api';

export default axios.create({
    baseURL: `${url}`
});