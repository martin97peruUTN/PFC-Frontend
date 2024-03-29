import React, {useState, useEffect, useContext} from 'react';
import { useHistory } from "react-router-dom";

import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Skeleton } from 'primereact/skeleton';
import { confirmDialog } from 'primereact/confirmdialog';
import { Dropdown } from 'primereact/dropdown';
import { Password } from 'primereact/password';

import { FetchContext } from '../context/FetchContext';
import * as url from '../util/url';
import * as constants from '../util/constants';
import hash from '../util/hash'

import Card from '../components/cards/Card'

const UserCRUD = ({showToast}) => {

    const fetchContext = useContext(FetchContext)
    const history = useHistory();

    const [loadingAccept, setLoadingAccept] = useState(false)
    const [loadingStart, setLoadingStart] = useState(false)

    const [enableEditing, setEnableEditing] = useState(true)

    const [userId, setUserId] = useState(null)
    const [name, setName] = useState('')
    const [lastName, setLastName] = useState('')
    const [username, setUsername] = useState('')
    const [role, setRole] = useState()
    const [password, setPassword] = useState('')
    const [repeatPassword, setRepeatPassword] = useState('')

    const roleList = [
        {name: constants.ADMIN_ROLE},
        {name: constants.CONSIGNEE_ROLE},
        {name: constants.ASSISTANT_ROLE},
    ]

    useEffect(() => {
        //Si esta editando me llega esto desde la otra pantalla
        if(history.location.state){
            setLoadingStart(true)
            setEnableEditing(false)
            const {userId} = history.location.state
            setUserId(userId)
            fetchContext.authAxios.get(`${url.USER_API}/${userId}`)
            .then(res => {
                const {name, lastname, username, rol} = res.data
                setName(name)
                setLastName(lastname)
                setUsername(username)
                if(rol===constants.ADMIN_ROLE){
                    setRole(roleList[0])
                }else if(rol===constants.CONSIGNEE_ROLE){
                    setRole(roleList[1])
                }else if(rol===constants.ASSISTANT_ROLE){
                    setRole(roleList[2])
                }
                setLoadingStart(false)
            })
            .catch(error => {
                showToast('error', 'Error', error.response.data.errorMsg)
                history.goBack();
            })
        }
    }, [history.location.state])

    //Aviso de que puede dejar los campos de contraseña vacios si no la quiere cambiar (solo si esta editando)
    const showPasswordToast = () => {
        //El ultimo true es para que sea sticky (que se quede en pantalla salvo que el usuario la cierre)
        showToast('info','Cambio de contraseña','Si no desea cambiar la contraseña, puede dejar estos campos en blanco',true)
    }

    const passwordVerification = () => {
        /*Si no tengo userId es porque estoy creando, por lo que ambos campos contraseña
        deben estar completos */
        if(!userId && (!password || !repeatPassword)){
            return 'Debe ingresar una contraseña en ambos campos'   
        }
        /*Si hay userId estoy editando, por lo que puedo o no ingresar una nueva contraseña 
        pero si la ingreso, debe estar en ambos campos. Es un XOR, o ambas o ninguna */
        if(userId && ((password && !repeatPassword) || (!password && repeatPassword))){
            return 'Si va a ingresar una contraseña, debe ingresarla en ambos campos'
        }
        //Si hay userId y no ingresa ninguna password, puede continuar
        if(userId && !password && !repeatPassword){
            return null
        }
        //Estos son comunes a ambos casos
        if(password.length < 8 || repeatPassword.length < 8){
            return 'La contraseña debe tener al menos 8 caracteres'
        }
        if(password !== repeatPassword){
            return 'Las contraseñas no coinciden'
        }
        return null
    }

    //Se dispara al presionar el boton Guardar
    const confirm = () => {
        if(!name || !lastName || !username || !role){
            showToast('warn', 'Cuidado', 'Los primeros 4 campos no pueden estar vacíos')
        }else{
            if(username.length < 6 || username.length > 30){
                showToast('warn','Error','El usuario debe tener entre 6 y 30 caracteres')
            }else{
                const message = passwordVerification()
                if(message){
                    showToast('warn', 'Cuidado', message)
                }else{
                    confirmDialog({
                        message: '¿Está seguro que desea proceder?',
                        header: 'Guardar usuario',
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
        const data = {
            name,
            lastname: lastName,
            username,
            rol: role.name,
            password: password ? hash(password) : null
        }
        //Si no hay id es que estoy creando, si hay es que estoy editando
        if(!userId){
            fetchContext.authAxios.post(url.USER_API, data)
            .then(() => {
                showToast('success', 'Éxito', 'Usuario creado')
                history.goBack();
            })
            .catch(error => {
                showToast('error','Error',error.response.data.errorMsg)
                setLoadingAccept(false)
            })
        }else{
            fetchContext.authAxios.patch(`${url.USER_API}/admin-patch/${userId}`, data)
            .then(() => {
                showToast('success', 'Éxito', 'Usuario ha sido actualizado')
                history.goBack();
            })
            .catch(error => {
                showToast('error','Error',error.response.data.errorMsg)
                setLoadingAccept(false)
            })
        }
    }

    //Se dispara al tocar el boton eliminar
    const deleteHandler = () => {
        //No deberia llegar hasta aca desde la otra pantalla, este if es solo por las dudas
        if(role.name!==constants.ADMIN_ROLE){
            confirmDialog({
                message: '¿Está seguro que desea eliminar el usuario?',
                header: 'Eliminar usuario',
                icon: 'pi pi-exclamation-circle',
                acceptLabel: 'Sí',
                accept: () => deleteUser()
            })
        }
    }

    const deleteUser = () => {
        fetchContext.authAxios.delete(`${url.USER_API}/${userId}`)
        .then(() => {
            showToast('success', 'Éxito', 'El usuario ha sido eliminado')
            history.goBack();
        })
        .catch(() => {
            showToast('error', 'Error', 'No se pudo eliminar el usuario')
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
                    disabled={!enableEditing}
                />
                <label htmlFor="name">Nombre</label>
            </span>
            <br/>
            <span className="p-float-label">
                <InputText
                    id="lastName"
                    className='w-full' 
                    value={lastName} 
                    onChange={e => setLastName(e.target.value)}
                    disabled={!enableEditing}
                />
                <label htmlFor="lastName">Apellido</label>
            </span>
            <br/>
            <span className="p-float-label">
                <InputText
                    id="username"
                    className='w-full'
                    keyfilter="email" 
                    value={username} 
                    onChange={e => setUsername(e.target.value)}
                    disabled={!enableEditing}
                    tooltip="Entre 6 y 30 caracteres" 
                    tooltipOptions={{position: 'top', event: 'focus'}}
                />
                <label htmlFor="username">Usuario</label>
            </span>
            <br/>
            <span className="p-float-label">
                <Dropdown 
                    id="role"
                    className='w-full'
                    value={role} 
                    options={roleList} 
                    onChange={e => setRole(e.target.value)} 
                    optionLabel="name"
                    disabled={userId ? true : false}
                />
                <label htmlFor="role">Rol</label>
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
                    onFocus={() => userId ? showPasswordToast() : null}
                    disabled={!enableEditing}
                />
                <label htmlFor="password">Contraseña</label>
            </span>
            <br/>
            <span className="p-float-label">
                <Password 
                    id="repeatPassword" 
                    className='w-full' 
                    inputClassName='w-full' 
                    feedback={false} 
                    toggleMask 
                    onChange={e => setRepeatPassword(e.target.value)}
                    disabled={!enableEditing}
                />
                <label htmlFor="repeatPassword">Confirme la contraseña</label>
            </span>
            {userId?
                <>
                    <br/>
                    <Button 
                        className="btn btn-primary" 
                        icon="pi pi-user-edit" 
                        onClick={()=> setEnableEditing(!enableEditing)} 
                        label={enableEditing?'Dejar de editar':'Editar'}
                    />
                </>
            :
                null
                //Si no hay id es que estoy creando, por lo que no tiene sentido dejar de editar
            }
        </div>
    )

    const loadingScreen = (
        <div>
            <Skeleton width="100%" height="3rem"/>
            <br/>
            <Skeleton width="100%" height="3rem"/>
            <br/>
            <Skeleton width="100%" height="3rem"/>
        </div>
    )

    return (
        <>
        <Card
            title={userId?'Información del usuario':'Nuevo usuario'}
            footer={
                <div className="flex justify-content-between">
                    <div className="flex justify-content-start">
                        <Button 
                            className="p-button-danger mr-2" 
                            onClick={()=> history.goBack()} 
                            label="Cancelar"
                        />
                        {userId?
                            <Button 
                                className="p-button-danger" 
                                onClick={()=> deleteHandler()} 
                                label="Eliminar"
                            />
                        :
                            null
                            //No se muestra el boton eliminar si estoy creando
                        }
                    </div>
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
        </>
    )
}

export default UserCRUD
