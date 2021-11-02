import React, {useState, useEffect, useRef, useContext} from 'react';
import { useHistory } from "react-router-dom";

import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { ProgressSpinner } from 'primereact/progressspinner';
import { confirmDialog } from 'primereact/confirmdialog';

import { FetchContext } from '../context/FetchContext';

import Card from '../components/cards/Card'

const Perfil = () => {

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
        /*setLoadingStart(true)
        TODO corregir esta ruta
        fetchContext.authAxios.get('/user/info').then((res) => {
            setUser(res.data.user);
            setName(res.data.name);
            setRole(res.data.role);
            setLoadingStart(false)
        }).catch((err) => {
            showToast('error','Error','No se pudo cargar el perfil, intentelo mas tarde')
            setTimeout(() => {
                history.goBack()
            }, 3000);
        })*/
    }, [])

    const handlePasswordChange = () => {
        history.push('/password-change')
    }

    const handleSubmit = () => {
        setLoadingAccept(true)
        //TODO corregir esta ruta
        fetchContext.authAxios.post('/user/update', {
            name: name,
            user: user,
        }).then((res) => {
            showToast('success','Exito','Se actualizo el usuario, intentelo mas tarde')
            //TODO definir si deslogueamos al usuario o si actualizamos el localStorage
            setTimeout(() => {
                history.push('/')
            }, 3000);
        }).catch((err) => {
            showToast('error','Error','No se pudo actualizar el usuario')
            setLoadingAccept(false)
        })
    }

    const confirm = () => {
        //TODO ver si deben definirse mas condiciones
        if(user.length > 0 && name.length > 0 && user.length < 20){
            confirmDialog({
                message: '¿Esta seguro de que desea proceder?',
                header: 'Actualizar informacion de usuario',
                icon: 'pi pi-exclamation-circle',
                accept: () => handleSubmit()
            });
        }else{
            if(user.length >= 20){
                showToast('warn','Cuidado','El nombre de usuario debe tener menos de 20 caracteres')
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
                    <div className="flex justify-content-between">
                        <Button className="btn btn-primary mr-2" icon="pi pi-pencil" onClick={(event)=> handlePasswordChange(event)} label="Cambiar contraseña"></Button>
                        <Button className="btn btn-primary" icon="pi pi-check" onClick={()=> confirm()} label="Guardar" loading={loadingAccept}></Button>
                    </div>
                </div>
            }
        >
            <span className="p-float-label">
                <InputText id="name" className='w-full' onChange={e => setName(e.target.value)} disabled={!edit}/>
                <label htmlFor="name">Nombre</label>
            </span>
            <br/>
            <span className="p-float-label">
                <InputText id="user" className='w-full' keyfilter="email" onChange={e => setUser(e.target.value)} disabled={!edit}/>
                <label htmlFor="user">Usuario</label>
            </span>
            <br/>
            <span className="p-float-label">
                <InputText id="role" className='w-full' disabled/>
                <label htmlFor="role">{!edit ? 'Rol' : 'Rol (no editable)'}</label>
            </span>
            <br/>
            <Button className="btn btn-primary" icon="pi pi-user-edit" onClick={()=> setEdit(!edit)} label={edit?'Dejar de editar':'Editar'}></Button>
        </Card>
        }
        </>
    )
}

export default Perfil
