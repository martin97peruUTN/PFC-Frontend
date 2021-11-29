import React, {useState, useEffect, useRef, useContext} from 'react';
import { useHistory } from "react-router-dom";

import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { Skeleton } from 'primereact/skeleton';
import { confirmDialog } from 'primereact/confirmdialog';

import { AuthContext } from '../context/AuthContext';
import { FetchContext } from '../context/FetchContext';
import * as url from '../util/url';

const UserCRUD = () => {

    const authContext = useContext(AuthContext)
    const fetchContext = useContext(FetchContext)
    const history = useHistory();
    const toast = useRef(null);
    const showToast = (severity, summary, message) => {
        toast.current.show({severity:severity, summary: summary, detail:message});
    }

    const [loadingAccept, setLoadingAccept] = useState(false)
    const [loadingStart, setLoadingStart] = useState(false)

    const [enableEditing, setEnableEditing] = useState(true)

    const [userId, setUserId] = useState(null)

    useEffect(() => {
        if(history.location.state){
            //Si esta editando me llega esto desde la otra pantalla
            setLoadingStart(true)
            setEnableEditing(false)
            const {userId} = history.location.state
            setUserId(userId)
            fetchContext.authAxios.get(`${url.USER_API}/${userId}`)
            //TODO
        }
    }, [history.location.state])

    return (
        <div>
            
        </div>
    )
}

export default UserCRUD
