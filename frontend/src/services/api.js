import axios from "axios";

const api = axios.create({
    baseURL: "https://careerguide-xms5.onrender.com/api"
});

export default api;