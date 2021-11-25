//Codigo tomado del tutorial de Ryan Chenkie: https://github.com/chenkie/orbit

import React, { createContext, useState } from 'react';
import { useHistory } from 'react-router-dom';
import jwt_decode from "jwt-decode";
import * as constants from '../util/constants'
import { randomColorGenerator } from '../util/miscFunctions'

const AuthContext = createContext();
const { Provider } = AuthContext;

//Encargado de almacenar la info del user al loguearse y proveerla a los componentes que lo requieran

const AuthProvider = ({ children }) => {
    const history = useHistory();

    const token = localStorage.getItem('token');
    const userInfo = localStorage.getItem('userInfo');
    const expiresAt = localStorage.getItem('expiresAt');

    const [authState, setAuthState] = useState({
        token,
        expiresAt,
        userInfo: userInfo ? JSON.parse(userInfo) : {}
    });

    //(setAuthState)
    const setAuthInfo = (token) => {
        localStorage.setItem('token', token);
        const decodedToken = jwt_decode(token);
        localStorage.setItem('expiresAt', decodedToken.exp);
        const incomingUserInfo = {
            name: decodedToken.name,
            lastname: decodedToken.lastname,
            username: decodedToken.username,
            id: decodedToken.uid,
            role: decodedToken.rol[0].authority
        }
        localStorage.setItem('userInfo', JSON.stringify(incomingUserInfo));
        
        setAuthState({
            token: token,
            userInfo: incomingUserInfo,
            expiresAt: decodedToken.exp
        });

        //Guardo un color random para el avatar del usuario
        localStorage.setItem('avatarColor', randomColorGenerator());
    }

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userInfo');
        localStorage.removeItem('expiresAt');
        setAuthState({});
        history.push('/login');
    };

    const isAuthenticated = () => {
        if (!authState.token || !authState.expiresAt) {
            return false;
        }
        return (
            //Calculo si el token ha expirado o no (getTime es en milisegundos y expirestAt en segundos)
            new Date().getTime() / 1000 < authState.expiresAt
        );
    };

    const isAdmin = () => {
        return authState.userInfo.role === constants.ADMIN_ROLE;
    };

    const isConsignee = () => {
        return authState.userInfo.role === constants.CONSIGNEE_ROLE;
    }

    const isAssistant = () => {
        return authState.userInfo.role === constants.ASSISTANT_ROLE;
    }

    return (
        <Provider
            value={{
                setAuthState: token => setAuthInfo(token),
                logout,
                isAuthenticated,
                isAdmin,
                isConsignee,
                isAssistant,
                getToken: () => authState.token,
                getUserInfo: () => authState.userInfo,
                getAvatarColor: () => localStorage.getItem('avatarColor')
            }}
        >
            {children}
        </Provider>
    );
};

export { AuthContext, AuthProvider };