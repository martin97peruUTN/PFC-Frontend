import React, {useState, useEffect, useContext} from 'react';
import { useHistory } from "react-router-dom";

import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Skeleton } from 'primereact/skeleton';
import { confirmDialog } from 'primereact/confirmdialog';

import { AuthContext } from '../context/AuthContext';
import { FetchContext } from '../context/FetchContext';
import * as url from '../util/url';

import Card from '../components/cards/Card'

const Profile = ({showToast}) => {

    const authContext = useContext(AuthContext)
    const fetchContext = useContext(FetchContext)
    const history = useHistory();

    const [loadingAccept, setLoadingAccept] = useState(false)
    const [loadingStart, setLoadingStart] = useState(false)

    const [edit, setEdit] = useState(false)
    const [user, setUser] = useState('')
    const [name, setName] = useState('')
    const [lastname, setLastname] = useState('')
    const [role, setRole] = useState('')

    useEffect(() => {
        setLoadingStart(true)
        setUser(authContext.getUserInfo().username)
        setName(authContext.getUserInfo().name)
        setLastname(authContext.getUserInfo().lastname)
        setRole(authContext.getUserInfo().role)
        setLoadingStart(false)
    }, [authContext, history.location])

    const handlePasswordChange = () => {
        history.push(url.PASSWORD_CHANGE)
    }

    //Se dispara al presionar el boton Guardar
    const confirm = () => {
        if(user.length < 6 || user.length > 30){
            showToast('warn','Error','El usuario debe tener entre 6 y 30 caracteres!')
        }else{
            if(name.length === 0){
                showToast('warn','Error','El nombre no puede ser vacío!')
            }else{
                if(name===authContext.getUserInfo().name && user===authContext.getUserInfo().username && lastname===authContext.getUserInfo().lastName){
                    showToast('warn','Cuidado','Ningún dato fue cambiado!')
                }else{
                    confirmDialog({
                        message: '¿Está seguro que desea proceder?',
                        header: 'Actualizar información de usuario',
                        icon: 'pi pi-exclamation-circle',
                        acceptLabel: 'Sí',
                        accept: () => handleSubmit()
                    });
                }
            }
        }
    }

    const handleSubmit = () => {
        setLoadingAccept(true)
        fetchContext.authAxios.patch(`${url.USER_API}/profile/${authContext.getUserInfo().id}`, {
            name: name!==authContext.getUserInfo().name? name : null,
            lastname: lastname!==authContext.getUserInfo().lastname? lastname : null,
            username: user!==authContext.getUserInfo().username? user : null,
        }).then((res) => {
            //Actualizo el token y toda la info del usuario
            authContext.setAuthState(res.data.token)
            showToast('success','Éxito','El usuario se actualizó correctamente!')
            setLoadingAccept(false)
        }).catch((err) => {
            showToast('error','Error',err.response.data.errorMsg)
            setLoadingAccept(false)
        })
    }

    const cardForm = (
        <div>
            <span className="p-float-label">
                <InputText
                    id="name"
                    className='w-full' 
                    value={name} 
                    onChange={e => setName(e.target.value)} 
                    disabled={!edit}
                />
                <label htmlFor="name">Nombre</label>
            </span>
            <br/>
            <span className="p-float-label">
                <InputText
                    id="lastname"
                    className='w-full' 
                    value={lastname} 
                    onChange={e => setLastname(e.target.value)} 
                    disabled={!edit}
                />
                <label htmlFor="lastname">Apellido</label>
            </span>
            <br/>
            <span className="p-float-label">
                <InputText 
                    id="user" 
                    className='w-full' 
                    keyfilter="email" 
                    value={user} 
                    onChange={e => setUser(e.target.value)} 
                    disabled={!edit}
                    tooltip="Entre 6 y 30 caracteres" 
                    tooltipOptions={{position: 'top', event: 'focus'}}
                />
                <label htmlFor="user">Usuario</label>
            </span>
            <br/>
            <span className="p-float-label">
                <InputText id="role" value={role} className='w-full' disabled/>
                <label htmlFor="role">{!edit ? 'Rol' : 'Rol (no editable)'}</label>
            </span>
            <br/>
            <div className="flex">
                <Button 
                    className="btn btn-primary" 
                    icon="pi pi-user-edit" 
                    onClick={()=> setEdit(!edit)} 
                    label={edit?'Dejar de editar':'Editar'}
                />
                <Button 
                    className="btn btn-primary ml-2" 
                    icon="pi pi-pencil" 
                    onClick={(event)=> handlePasswordChange(event)} 
                    label="Cambiar contraseña"
                />
            </div>
        </div>
    )

    const loadingScreen = (
        <div>
            <Skeleton width="100%" height="3rem"/>
            <br/>
            <Skeleton width="100%" height="3rem"/>
            <br/>
            <Skeleton width="100%" height="3rem"/>
            <br/>
            <Skeleton width="100%" height="3rem"/>
        </div>
    )

    return (
        <Card
            title='Perfil'
            footer={
                <div className="flex justify-content-between">
                    <Button 
                        className="p-button-danger" 
                        onClick={()=> history.goBack()} 
                        label="Cancelar"
                    />
                    <Button 
                        className="btn btn-primary" 
                        icon="pi pi-check" 
                        onClick={()=> confirm()} 
                        label="Guardar" 
                        loading={loadingAccept}
                    />
                </div>
            }
        >
            {loadingStart?
                loadingScreen
                :
                cardForm
            }
        </Card>
    )
}

export default Profile
