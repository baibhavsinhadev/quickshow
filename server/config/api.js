import axios from 'axios';

const TMDB_BASE_URL = "https://api.themoviedb.org/3";
const token = process.env.TMDP_READ_ACCESS_TOKEN;

const api = axios.create({
    baseURL: TMDB_BASE_URL,
    timeout: 5000,
    headers: {
        Authorization: `Bearer ${token}`,
    },
});

export default api;