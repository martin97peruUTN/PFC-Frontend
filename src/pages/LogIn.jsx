import React, {useState, useRef} from 'react'
import axios from 'axios';
import { useHistory } from "react-router-dom";

import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { Button } from 'primereact/button'
import { Toast } from 'primereact/toast';

import {urlBase} from '../Url'
import Card from '../components/cards/Card'

const LogIn = () => {

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
            axios.post(`${urlBase}/log-in`, {
                username,
                password
            })
            .then(res => {
                console.log(res.data)
                localStorage.setItem('token', res.data.token)
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
        <Card 
            title='Ingrese su usuario y contraseña'
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
    )
}

export default LogIn
