//Codigo tomado del tutorial de Ryan Chenkie: https://github.com/chenkie/orbit

import React, { createContext, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from './AuthContext';

const FetchContext = createContext();
const { Provider } = FetchContext;

const FetchProvider = ({ children }) => {

    //Usado para cualquier ruta que requiera autenticacion

    const authContext = useContext(AuthContext);

    const authAxios = axios.create({
        baseURL: process.env.REACT_APP_API_URL
    });

    //intercepto y agrego el token
    authAxios.interceptors.request.use(
        config => {
            config.headers.Authorization = `Bearer ${authContext.authState.token}`;
            return config;
        },
        error => {
            return Promise.reject(error);
        }
    );

    authAxios.interceptors.response.use(
        response => {
            return response;
        },
        error => {
            return Promise.reject(error);
        }
    );

    return (
        <Provider
            value={{
                authAxios
            }}
        >
            {children}
        </Provider>
    );
};

export { FetchContext, FetchProvider };