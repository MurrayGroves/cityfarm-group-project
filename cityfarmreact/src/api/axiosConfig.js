import axios from "axios";

const url = process.env.REACT_APP_BASE_URL || 'http://localhost:8080/api';

export default axios.create({
    baseURL: url,
});