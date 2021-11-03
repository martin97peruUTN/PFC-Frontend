import React, {useState, useEffect, useRef, useContext} from 'react';
import { useHistory } from "react-router-dom";

import { Password } from 'primereact/password';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { confirmDialog } from 'primereact/confirmdialog';

import { FetchContext } from '../context/FetchContext';

import Card from '../components/cards/Card'

const PasswordChange = () => {

    const fetchContext = useContext(FetchContext)
    const history = useHistory();
    const toast = useRef(null);
    const showToast = (severity, summary, message) => {
        toast.current.show({severity:severity, summary: summary, detail:message});
    }

    const [loadingAccept, setLoadingAccept] = useState(false);

    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [newPasswordConfirm, setNewPasswordConfirm] = useState('');

    const handleSubmit = () => {
        setLoadingAccept(true);
        //TODO cambiar esta ruta si hace falta
        fetchContext.post('/api/user/password-change', {
            currentPassword: currentPassword,
            newPassword: newPassword
        }).then(response => {
            showToast('success', 'Exito', 'La Contraseña ha sido cambiada');
            setTimeout(() => {
                history.goBack();
            }, 3000);
        }).catch(error => {
            showToast('error', 'Error', error.message);
        })
    }

    const confirm = () => {
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
                            message: '¿Esta seguro de que desea proceder?',
                            header: 'Cambio de contraseña',
                            icon: 'pi pi-exclamation-circle',
                            accept: () => handleSubmit()
                        });
                    }
                }
            }
        }
    }

    return (
        <>
        <Toast ref={toast} />
        <Card
            title="Cambio de contraseña"
            footer={
                <div className="flex justify-content-between">
                    <Button className="p-button-danger" onClick={()=> history.goBack()} label="Cancelar"></Button>
                    <Button className="btn btn-primary" icon="pi pi-check" onClick={()=> confirm()} label="Guardar" loading={loadingAccept}></Button>
                </div>
            }
        >
            <span className="p-float-label">
                <Password id="currentPassword" className='w-full' inputClassName='w-full' feedback={false} toggleMask onChange={e => setCurrentPassword(e.target.value)} />
                <label htmlFor="currentPassword">Contraseña actual</label>
            </span>
            <br/>
            <span className="p-float-label">
                <Password id="newPassword" className='w-full' inputClassName='w-full' feedback={false} toggleMask onChange={e => setNewPassword(e.target.value)} />
                <label htmlFor="newPassword">Contraseña nueva</label>
            </span>
            <br/>
            <span className="p-float-label">
                <Password id="confirmNewPassword" className='w-full' inputClassName='w-full' feedback={false} toggleMask onChange={e => setNewPasswordConfirm(e.target.value)} />
                <label htmlFor="confirmNewPassword">Confirme la nueva contraseña</label>
            </span>
        </Card>
        </>
    )
}

export default PasswordChange