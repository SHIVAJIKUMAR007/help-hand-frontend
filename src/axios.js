import axios from "axios";
const backend = axios.create({ baseURL: "http://localhost:5000/" });

export default backend;
export const assest = "http://localhost:5000/";
export const massageSocket = "http://localhost:5000/";

export const source = axios.CancelToken.source();

// https://help-hand12.herokuapp.com/
