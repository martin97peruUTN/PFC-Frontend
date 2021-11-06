import React, {useState, useEffect, useRef, useContext} from 'react';
import { useHistory } from "react-router-dom";

import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { ProgressSpinner } from 'primereact/progressspinner';
import { confirmDialog } from 'primereact/confirmdialog';

import { AuthContext } from '../context/AuthContext';
import { FetchContext } from '../context/FetchContext';

import Card from '../components/cards/Card'

const Profile = () => {

    const authContext = useContext(AuthContext)
    const fetchContext = useContext(FetchContext)
    const history = useHistory();
    const toast = useRef(null);
    const showToast = (severity, summary, message) => {
        toast.current.show({severity:severity, summary: summary, detail:message});
    }

    const [loadingAccept, setLoadingAccept] = useState(false)
    const [loadingStart, setLoadingStart] = useState(false)

    const [edit, setEdit] = useState(false)
    const [user, setUser] = useState('')
    const [name, setName] = useState('')
    const [role, setRole] = useState('')

    useEffect(() => {
        setLoadingStart(true)
        setUser(authContext.getUserInfo().username)
        setName(authContext.getUserInfo().name)
        setRole(authContext.getUserInfo().role)
        setLoadingStart(false)
    }, [])

    const handlePasswordChange = () => {
        history.push('/password-change')
    }

    const handleSubmit = () => {
        setLoadingAccept(true)
        //Mando a guardar solo si cambio algo, sino hago history.goBack()
        if(name!==authContext.getUserInfo().name || user!==authContext.getUserInfo().username){
            fetchContext.authAxios.patch(`/user/${authContext.getUserInfo().id}`, {
                name: name!==authContext.getUserInfo().name? name : null,
                user: user!==authContext.getUserInfo().username? user : null,
            }).then((res) => {
                showToast('success','Exito','Se actualizo el usuario!')
                //Actualizo el token y toda la info del usuario
                authContext.setAuthInfo(res.data)
                setTimeout(() => {
                    history.push('/')
                }, 3000);
            }).catch((err) => {
                showToast('error','Error','No se pudo actualizar el usuario')
                setLoadingAccept(false)
            })
        }else{
            history.push('/')
        }
    }

    //Se dispara al presionar el boton Guardar
    const confirm = () => {
        if(user.length > 0 && name.length > 0 && user.length <= 20){
            confirmDialog({
                message: '¿Esta seguro de que desea proceder?',
                header: 'Actualizar informacion de usuario',
                icon: 'pi pi-exclamation-circle',
                accept: () => handleSubmit()
            });
        }else{
            if(user.length > 20){
                showToast('warn','Cuidado','El usuario debe tener como maximo 20 caracteres')
            }else{
                showToast('warn','Cuidado','Complete los campo del formulario')
            }
        }
    }

    return (
        <>
        <Toast ref={toast} />
        {
        loadingStart?
        <div style={{"display": "flex"}}>
            <ProgressSpinner/>
        </div>
        :
        <Card
            title='Perfil'
            footer={
                <div className="flex justify-content-between">
                    <Button className="p-button-danger" onClick={()=> history.goBack()} label="Cancelar"></Button>
                    <Button className="btn btn-primary" icon="pi pi-check" onClick={()=> confirm()} label="Guardar" loading={loadingAccept}></Button>
                </div>
            }
        >
            <span className="p-float-label">
                <InputText id="name" className='w-full' value={name} onChange={e => setName(e.target.value)} disabled={!edit}/>
                <label htmlFor="name">Nombre</label>
            </span>
            <br/>
            <span className="p-float-label">
                <InputText id="user" className='w-full' keyfilter="email" value={user} onChange={e => setUser(e.target.value)} disabled={!edit}/>
                <label htmlFor="user">Usuario</label>
            </span>
            <br/>
            <span className="p-float-label">
                <InputText id="role" value={role} className='w-full' disabled/>
                <label htmlFor="role">{!edit ? 'Rol' : 'Rol (no editable)'}</label>
            </span>
            <br/>
            <div className="flex">
                <Button className="btn btn-primary" icon="pi pi-user-edit" onClick={()=> setEdit(!edit)} label={edit?'Dejar de editar':'Editar'}></Button>
                <Button className="btn btn-primary ml-2" icon="pi pi-pencil" onClick={(event)=> handlePasswordChange(event)} label="Cambiar contraseña"></Button>
            </div>
        </Card>
        }
        </>
    )
}

export default Profile
