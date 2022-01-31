import React, {useState, useContext} from 'react'
import { useHistory } from "react-router-dom";
import { publicFetch } from './../util/fetch';
import { AuthContext } from './../context/AuthContext';
import hash from '../util/hash';
import * as url from '../util/url';

import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { Button } from 'primereact/button'
import { ReactComponent as BusinessLogo } from '../assets/images/BusinessLogo.svg';

import Card from '../components/cards/Card'

const LogIn = ({showToast}) => {

    const authContext = useContext(AuthContext);
    let history = useHistory();

    const[loading, setLoading] = useState(false);

    const[username, setUsername] = useState('')
    const[password, setPassword] = useState('')

    const validForm = () => {
        return username && password //campos no vacios
    }

    const submit = event => {
        event.preventDefault();
        if(validForm()){
            setLoading(true);
            publicFetch.post(url.LOGIN_API, {
                username,
                password: hash(password)
            })
            .then(res => {
                //Llamo a AuthContext para guardar la info del usuario
                authContext.setAuthState(res.data.access_token);
                history.push('/')
            })
            .catch(err => {
                //TODO preguntarle a Tomi en este caso
                //Pregunto si hay response porque sino crashea
                if(err.response && err.response.status === 400){
                    showToast('error', 'Error', 'Usuario o contraseña incorrecto, vuelva a intentarlo')
                    setLoading(false);
                }else{
                    showToast('error', 'Error', 'No se puedo conectar con el servidor')
                    setLoading(false);
                }
            })
        }else{
            showToast('warn', 'Cuidado', 'Complete los campos vacios!')
        }
    }

    return (
        <>
            <style>{
                `body { background: no-repeat fixed url(${url.LOGIN_WALLPAPER}); background-size:cover}`
            }</style>
            <div className="flex justify-content-center">
                <BusinessLogo/>
            </div>
            <br/>
            
            <div className="md:mx-8">
                <Card 
                    title='Ingrese a su cuenta'
                    footer={
                        <div className="flex justify-content-center">
                            <Button 
                                label='Ingresar' 
                                className="btn btn-primary" 
                                icon="pi pi-sign-in" 
                                onClick={e => submit(e)} 
                                loading={loading}
                            />
                        </div>
                    }
                >   
                    <span className="p-float-label">
                        <InputText 
                            id="user" 
                            className='w-full' 
                            onChange={e => setUsername(e.target.value)} 
                        />
                        <label htmlFor="user">Usuario</label>
                    </span>
                    <br/>
                    <span className="p-float-label">
                        <Password 
                            id="password" 
                            className='w-full' 
                            inputClassName='w-full' 
                            feedback={false} 
                            toggleMask 
                            onChange={e => setPassword(e.target.value)} 
                        />
                        <label htmlFor="password">Contraseña</label>
                    </span>
                </Card>
            </div>
        </>
    )
}

export default LogIn
