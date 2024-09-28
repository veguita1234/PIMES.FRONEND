import axios from "axios";
import { baseUrl } from "../Constant/global.constanst";

const HttpModule = axios.create({
    baseURL: baseUrl,
});

export default HttpModule;