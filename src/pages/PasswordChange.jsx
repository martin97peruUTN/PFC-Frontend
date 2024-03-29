import React, {useState, useContext} from 'react';
import { useHistory } from "react-router-dom";

import { Password } from 'primereact/password';
import { Button } from 'primereact/button';
import { confirmDialog } from 'primereact/confirmdialog';

import { FetchContext } from '../context/FetchContext';
import { AuthContext } from '../context/AuthContext';
import hash from '../util/hash';
import * as url from '../util/url';

import Card from '../components/cards/Card'

const PasswordChange = ({showToast}) => {

    const fetchContext = useContext(FetchContext)
    const authContext = useContext(AuthContext)
    const history = useHistory();

    const [loadingAccept, setLoadingAccept] = useState(false);

    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [newPasswordConfirm, setNewPasswordConfirm] = useState('');

    //Se dispara al presionar el boton Guardar
    const confirm = () => {
        /*Condiciones:
            1) Campos no vacios
            2) La contraseña nueva debe tener mas de 8 caracteres
            3) La contraseña nueva y la confirmacion deben ser iguales
            4) La contraseña nueva debe ser distinta a la anterior
        */
        if(currentPassword === '' || newPassword === '' || newPasswordConfirm === '') {
            showToast('warn', 'Cuidado', 'Complete todos los campos');
        }else{
            if(newPassword.length < 8 || newPasswordConfirm.length < 8) {
                showToast('warn', 'Cuidado', 'La nueva contraseña debe tener al menos 8 caracteres');
            }else{
                if(newPassword !== newPasswordConfirm){
                    showToast('warn', 'Cuidado', 'Los campos de la nueva contraseñas no coinciden');
                }else{
                    if(currentPassword === newPassword){
                        showToast('warn', 'Cuidado', 'La nueva contraseña no puede ser igual a la anterior');
                    }else{
                        confirmDialog({
                            message: '¿Está seguro que desea proceder?',
                            header: 'Cambio de contraseña',
                            icon: 'pi pi-exclamation-circle',
                            acceptLabel: 'Sí',
                            accept: () => handleSubmit()
                        });
                    }
                }
            }
        }
    }

    const handleSubmit = () => {
        setLoadingAccept(true);
        fetchContext.authAxios.patch(`${url.USER_API}/profile/${authContext.getUserInfo().id}/modificarpass`, {
            oldPassword: hash(currentPassword),
            newPassword: hash(newPassword)
        }).then(response => {
            showToast('success', 'Éxito', 'Contraseña modificada con éxito');
            history.push(url.PROFILE);
        }).catch(error => {
            showToast('error', 'Error', error.response.data.errorMsg);
            setLoadingAccept(false);
        })
    }

    return (
        <Card
            title="Cambio de contraseña"
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
            <span className="p-float-label">
                <Password id="currentPassword" 
                    className='w-full' 
                    inputClassName='w-full' 
                    feedback={false} 
                    toggleMask 
                    onChange={e => setCurrentPassword(e.target.value)}
                />
                <label htmlFor="currentPassword">Contraseña actual</label>
            </span>
            <br/>
            <span className="p-float-label">
                <Password 
                    id="newPassword" 
                    className='w-full' 
                    inputClassName='w-full' 
                    feedback={false} 
                    toggleMask 
                    onChange={e => setNewPassword(e.target.value)}
                />
                <label htmlFor="newPassword">Contraseña nueva</label>
            </span>
            <br/>
            <span className="p-float-label">
                <Password 
                    id="confirmNewPassword" 
                    className='w-full' 
                    inputClassName='w-full' 
                    feedback={false} 
                    toggleMask 
                    onChange={e => setNewPasswordConfirm(e.target.value)} 
                />
                <label htmlFor="confirmNewPassword">Confirme la nueva contraseña</label>
            </span>
        </Card>
    )
}

export default PasswordChange
