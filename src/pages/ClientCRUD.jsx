import React, {useState, useEffect, useContext} from 'react';
import { useHistory } from "react-router-dom";

import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Skeleton } from 'primereact/skeleton';
import { confirmDialog } from 'primereact/confirmdialog';

import { FetchContext } from '../context/FetchContext';
import * as url from '../util/url';

import Card from '../components/cards/Card'
import ProvenanceCard from '../components/cards/ProvenanceCard';

const ClientCRUD = ({showToast}) => {

    const fetchContext = useContext(FetchContext)
    const history = useHistory();

    const [loadingAccept, setLoadingAccept] = useState(false)
    const [loadingStart, setLoadingStart] = useState(false)

    const [enableEditing, setEnableEditing] = useState(true)

    const [clientId, setClientId] = useState(null)
    const [clientName, setClientName] = useState('')
    //CUIT es opcional
    const [clientCuit, setClientCuit] = useState('')

    //Pongo un valor negativo cualquiera, los que vienen desde el backend tienen un valor positivo
    const [provenancesId, setProvenancesId] = useState(-101)
    const [provenances, setProvenances] = useState([])

    const [deletedProvenances, setDeletedProvenances] = useState([])

    useEffect(() => {
        //Si esta editando me llega esto desde la otra pantalla
        if(history.location.state){
            setLoadingStart(true)
            setEnableEditing(false)
            const {id} = history.location.state
            setClientId(id)
            fetchContext.authAxios.get(`${url.CLIENT_API}/${id}`)
            .then(res => {
                const {name, cuit, provenances} = res.data
                setClientName(name)
                setClientCuit(cuit)
                setProvenances(provenances)
                setLoadingStart(false)
            })
            .catch((error) => {
                showToast('error', 'Error', error.response.data.errorMsg)
                history.goBack();
            })
        }else{
            setProvenances([
                {
                    id: provenancesId+1,
                    reference: '',
                    renspaNumber: '',
                    locality: null
                }
            ])
        }
    }, [history.location.state])

    //Se dispara al tocar el boton guardar
    const confirm = () => {
        //(CUIT PUEDE SER NULL)
        const invalidProvenances = validateProvenances()
        if(!clientName){
            showToast('warn', 'Error', 'El nombre es obligatorio')
        }else if(provenances.length === 0){
            showToast('warn', 'Error', 'Debe ingresar al menos una procedencia')
        }else if(invalidProvenances.length > 0){
            showToast('warn', 'Error', `Las siguientes procedencias no son válidas: ${invalidProvenances}`)
        }else{
            confirmDialog({
                message: '¿Está seguro que desea guardar los cambios?',
                header: 'Guardar cliente',
                icon: 'pi pi-exclamation-circle',
                acceptLabel: 'Aceptar',
                rejectLabel: 'Cancelar',
                accept: () => handleSubmit()
            })
        }
    }

    //Valido las procedencias y armo un string con los subindices+1 de las invalidas
    const validateProvenances = () => {
        let invalidProvenances = ''
        provenances.forEach(p => {
            if(!p.reference || !p.locality){
                //Renspa es opcional
                invalidProvenances+=`${provenances.indexOf(p)+1}°, `
            }
        })
        return invalidProvenances.substring(0, invalidProvenances.length-2)
    }

    //Quito el id de las provenances que lo tengan negativo
    //ya que lo uso en el front end solamente
    const clearProvenancesId = () => {
        let provenancesCopy = [...provenances]
        provenancesCopy.forEach(p => {
            if(p.id<0){
                p.id = null
            }
        })
        return provenancesCopy
    }

    //Se dispara al tocar el boton aceptar en el dialogo
    const handleSubmit = () => {
        setLoadingAccept(true)
        let client = {
            id: clientId,
            name: clientName,
            cuit: clientCuit,
            provenances: clearProvenancesId()
        }
        //Si hay id es que estoy editando
        if(clientId){
            client = {...client, 'deletedProvenances': deletedProvenances}
            fetchContext.authAxios.patch(`${url.CLIENT_API}/${clientId}`, client)
            .then(res => {
                showToast('success', 'Cliente guardado', 'El cliente fue guardado correctamente')
                history.goBack();
            })
            .catch((error) => {
                showToast('error', 'Error', error.response.data.errorMsg)
                setLoadingAccept(false)
            })
        }else{
            //Si no hay id es que estoy creando
            fetchContext.authAxios.post(`${url.CLIENT_API}`, client)
            .then(res => {
                showToast('success', 'Cliente guardado', 'El cliente fue guardado correctamente')
                history.goBack();
            })
            .catch((error) => {
                showToast('error', 'Error', error.response.data.errorMsg)
                setLoadingAccept(false)
            })
        }
    }

    const deleteHandler = () => {
        confirmDialog({
            message: '¿Está seguro que desea eliminar el cliente?',
            header: 'Eliminar cliente',
            icon: 'pi pi-exclamation-circle',
            acceptLabel: 'Aceptar',
            rejectLabel: 'Cancelar',
            accept: () => handleDelete()
        })
    }

    const handleDelete = () => {
        setLoadingAccept(true)
        fetchContext.authAxios.delete(`${url.CLIENT_API}/${clientId}`)
        .then(res => {
            showToast('success', 'Éxito', 'El cliente ha sido eliminado')
            history.goBack();
        })
        .catch((error) => {
            showToast('error', 'Error', error.response.data.errorMsg)
        })
    }

    const deleteProvenanceHandler = (index) => {
        confirmDialog({
            message: '¿Está seguro que desea eliminar la procedencia?',
            header: 'Eliminar procedencia',
            icon: 'pi pi-exclamation-circle',
            acceptLabel: 'Aceptar',
            rejectLabel: 'Cancelar',
            accept: () => deleteProvenance(index)
        })
    }

    const deleteProvenance = (index) => {
        //Si viene id positivo es porque es una que viene del backend
        //Si es null puede ser porque agrego una nueva, le dio a guardar, se seteo en null con el clearProvenancesId
        //y si no reviso eso se agrega al listado este tambien (no se bien porque)
        //asi que la agrego al listado de eliminadas
        if(provenances[index].id!==null && provenances[index].id>=0){
            setDeletedProvenances([...deletedProvenances, provenances[index]])
        }
        const provenancesCopy = [...provenances]
        provenancesCopy.splice(index, 1)
        setProvenances(provenancesCopy)
    }

    const addProvenance = () => {
        setProvenances([...provenances, {'id':provenancesId, 'reference':'', 'renspaNumber':'', 'locality':null}])
        setProvenancesId(provenancesId-1)
    }

    const updateProvenance = (value, prop, id) => {
        const provenancesIndex = provenances.findIndex(p => p.id === id)
        const provenancesCopy = [... provenances]
        provenancesCopy[provenancesIndex][prop] = value
        setProvenances(provenancesCopy)
    }

    const provenancesCardList = provenances.map((item, index) => (
        <ProvenanceCard
            key={index}
            reference={item.reference}
            renspaNumber={item.renspaNumber}
            locality={item.locality}
            enableEditing={enableEditing}
            deleteProvenance={() => deleteProvenanceHandler(index)}
            updateProvenance={(value, prop) => updateProvenance(value, prop, item.id)}
            showToast={showToast}
        />
    ))

    const cardFormClient = (
        //En pantalla grande muestro el boton de editar a la derecha del titulo (primer caso)
        //En pantalla pequeña muestro el boton de editar abajo del titulo (segundo caso)
        <Card
            title={
                <div>
                <div className="flex justify-content-between">
                    <>{clientId?'Información del cliente':'Nuevo cliente'}</>
                    {clientId?
                        <Button 
                            className="btn btn-primary big-screen" 
                            icon="pi pi-pencil" 
                            onClick={()=> setEnableEditing(!enableEditing)} 
                            label={enableEditing?"Dejar de editar":"Editar"}
                        />
                        :
                        null
                    }
                </div>
                    {clientId?
                        <Button 
                            className="btn btn-primary mt-2 small-screen" 
                            icon="pi pi-pencil" 
                            onClick={()=> setEnableEditing(!enableEditing)} 
                            label={enableEditing?"Dejar de editar":"Editar"}
                        />
                        :
                        null
                    }
                </div>
            }
        >
            <span className="p-float-label">
                <InputText
                    id="name"
                    className='w-full' 
                    value={clientName} 
                    onChange={e => setClientName(e.target.value)}
                    disabled={!enableEditing}
                />
                <label htmlFor="name">Nombre/Referencia</label>
            </span>
            <br/>
            <span className="p-float-label">
                <InputText
                    id="cuit"
                    className='w-full' 
                    value={clientCuit} 
                    onChange={e => setClientCuit(e.target.value)}
                    disabled={!enableEditing}
                />
                <label htmlFor="cuit">CUIT (opcional)</label>
            </span>
        </Card>
    )

    const cardFormProvenances = (
        <Card
            title={'Procedencias'}
            footer={
                <div>
                    {enableEditing?
                        <div className="flex justify-content-start mb-2">
                            <Button 
                                className="btn btn-primary"
                                onClick={()=> addProvenance()} 
                                label="Agregar procedencia"
                            />
                        </div>
                        :
                        null    
                    }
                    <div className="flex justify-content-between">
                        <div className="flex justify-content-start">
                            <Button 
                                className="p-button-danger mr-2" 
                                onClick={()=> history.goBack()} 
                                label="Cancelar"
                            />
                            {clientId?
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
                </div>
            }
        >
            {provenancesCardList}
        </Card>
    )

    const loadingScreen = (
        <div>
            <Skeleton width="100%" height="13rem"/>
            <br/>
            <Skeleton width="100%" height="30rem"/>
        </div>
    )

    return (
        <div>
        {loadingStart?
            loadingScreen
            :
            <div>
                {cardFormClient}
                {cardFormProvenances}
            </div>
        }
        </div>
    )
}

export default ClientCRUD
