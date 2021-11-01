//Codigo tomado del tutorial de Ryan Chenkie: https://github.com/chenkie/orbit

import React, { createContext, useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import * as constants from '../util/constants'

const AuthContext = createContext();
const { Provider } = AuthContext;

const AuthProvider = ({ children }) => {
    const history = useHistory();

    //TODO meter esto en un useEffect
    const token = localStorage.getItem('token');
    const userInfo = localStorage.getItem('userInfo');
    const expiresAt = localStorage.getItem('expiresAt');

    const [authState, setAuthState] = useState({
        token,
        expiresAt,
        userInfo: userInfo ? JSON.parse(userInfo) : {}
    });

    const setAuthInfo = ({ token, userInfo, expiresAt }) => {
        localStorage.setItem('token', token);
        localStorage.setItem('userInfo', JSON.stringify(userInfo));
        localStorage.setItem('expiresAt', expiresAt);

        setAuthState({
            token,
            userInfo,
            expiresAt
        });
    };

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
                authState,
                setAuthState: authInfo => setAuthInfo(authInfo),
                logout,
                isAuthenticated,
                isAdmin,
                isConsignee,
                isAssistant
            }}
        >
            {children}
        </Provider>
    );
};

export { AuthContext, AuthProvider };