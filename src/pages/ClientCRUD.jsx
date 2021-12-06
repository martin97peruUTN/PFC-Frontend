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
            .catch(() => {
                showToast('error', 'Error', 'No se encontro el usuario')
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

    const confirm = () => {
        console.log(provenances)
        //TODO: validar (CUIT PUEDE SER NULL)
    }

    const deleteHandler = () => {
        //TODO
    }

    const deleteProvenance = (index) => {
        //Si viene id positivo es porque es una que viene del backend
        if(provenances[index].id>=0){
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
            key={item.id}
            reference={item.reference}
            renspaNumber={item.renspaNumber}
            locality={item.locality}
            enableEditing={enableEditing}
            deleteProvenance={() => deleteProvenance(index)}
            updateProvenance={(value, prop) => updateProvenance(value, prop, item.id)}
            showToast={showToast}
        />
    ))

    const cardFormClient = (
        <Card
            title={
                <div className="flex justify-content-between">
                    <>{clientId?'Informacion del cliente':'Nuevo cliente'}</>
                    {clientId?
                        <Button 
                            className="btn btn-primary" 
                            icon="pi pi-plus" 
                            onClick={()=> setEnableEditing(!enableEditing)} 
                            label={`Habilitar edicion`}
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
                <label htmlFor="name">Nombre</label>
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
                    <div className="flex justify-content-start pb-2">
                        <Button 
                            className="btn btn-primary"
                            onClick={()=> addProvenance()} 
                            label="Agregar"
                        />
                    </div>
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
            <Skeleton width="100%" height="3rem"/>
            <br/>
            <Skeleton width="100%" height="3rem"/>
            <br/>
            <Skeleton width="100%" height="3rem"/>
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
