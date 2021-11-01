//Codigo tomado del tutorial de Ryan Chenkie: https://github.com/chenkie/orbit

import axios from 'axios';

const publicFetch = axios.create({
    baseURL: process.env.REACT_APP_API_URL
});

export { publicFetch };