import axios from "axios";
import { urlEndpointAPI } from "../utils";
export const request = axios.create({
    baseURL: `${urlEndpointAPI}`
})