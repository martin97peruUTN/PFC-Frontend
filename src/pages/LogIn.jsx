import React, {useState, useRef, useContext} from 'react'
import { useHistory } from "react-router-dom";
import { publicFetch } from './../util/fetch';
import { AuthContext } from './../context/AuthContext';

import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { Button } from 'primereact/button'
import { Toast } from 'primereact/toast';
import { ReactComponent as BusinessLogo } from '../assets/images/BusinessLogo.svg';

import Card from '../components/cards/Card'

const LogIn = () => {

    const authContext = useContext(AuthContext);
    let history = useHistory();
    const toast = useRef(null);
    const showToast = (severity, summary, message) => {
        toast.current.show({severity:severity, summary: summary, detail:message});
    }
    const[loading, setLoading] = useState(false);

    const[username, setUsername] = useState('')
    const[password, setPassword] = useState('')

    const validForm = () => {
        return username && password
    }

    const submit = event => {
        event.preventDefault();
        if(validForm()){
            setLoading(true);
            //TODO cambiar por login o lo que decidamos
            publicFetch.post('authenticate', {
                //TODO sacar email si hace falta
                email: username,
                password
            })
            .then(res => {
                console.log(res.data)
                authContext.setAuthState(res.data);
                history.push('/')
            })
            .catch(err => {
                showToast('error', 'Error', 'No se pudo conectar con el servidor')
                setLoading(false);
                console.log(err)
            })
        }else{
            showToast('warn', 'Error', 'Complete los campos vacios!')
        }
    }

    return (
        <>
        <div className="flex justify-content-center">
            <BusinessLogo/>
        </div>
        <br/>
        <Card 
            title='Ingrese a su cuenta'
            footer={
                <div className="flex justify-content-center">
                    <Button label='Ingresar' className="btn btn-primary" icon="pi pi-sign-in" onClick={e => submit(e)} loading={loading}></Button>
                </div>
            }
        >   
            <Toast ref={toast}/>
            <span className="p-float-label">
                <InputText id="user" className='w-full' onChange={e => setUsername(e.target.value)} />
                <label htmlFor="user">Usuario</label>
            </span>
            <br/>
            <span className="p-float-label">
                <Password id="password" className='w-full' inputClassName='w-full' feedback={false} toggleMask onChange={e => setPassword(e.target.value)} />
                <label htmlFor="password">Contraseña</label>
            </span>
        </Card>
        </>
    )
}

export default LogIn
