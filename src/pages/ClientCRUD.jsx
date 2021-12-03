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

    const [id, setId] = useState(null)
    const [name, setName] = useState('')
    //CUIT es opcional
    const [cuit, setCuit] = useState('')
    const [provenances, setProvenances] = useState([])

    const [deletedProvenances, setDeletedProvenances] = useState([])

    useEffect(() => {
        //Si esta editando me llega esto desde la otra pantalla
        if(history.location.state){
            setLoadingStart(true)
            setEnableEditing(false)
            const {id} = history.location.state
            setId(id)
            fetchContext.authAxios.get(`${url.CLIENT_API}/${id}`)
            .then(res => {
                const {name, cuit, provenances} = res.data
                setName(name)
                setCuit(cuit)
                setProvenances(provenances)
                setLoadingStart(false)
            })
            .catch(() => {
                showToast('error', 'Error', 'No se encontro el usuario')
                history.goBack();
            })
        }else{
            setProvenances([...provenances,
            {
                reference: '',
                renspaNumber: '',
                locality: null
            }])
        }
    }, [history.location.state])

    const confirm = () => {
        //TODO: validar (CUIT PUEDE SER NULL)
    }

    const deleteHandler = () => {
        //TODO
    }

    const deleteProvenance = (id) => {
        //Si viene id es porque es una que viene del backend
        if(id){
            //TODO agregar a la lista de eliminados
        }
        //TODO Sacar de la lista de provenances
    }

    const addProvenance = () => {
        //TODO
    }

    const updateProvenance = (id, reference, renspaNumber, locality) => {
        //TODO
    }

    const provenancesCardList = provenances.map((item) => {
        <ProvenanceCard
            key={item.id}
            id={item.id}
            reference={item.reference}
            renspaNumber={item.renspaNumber}
            locality={item.locality}
            enableEditing={enableEditing}
            deleteProvenance={deleteProvenance}
            updateProvenance={updateProvenance}
            showToast={showToast}
        />
    })

    const cardFormClient = (
        <Card
            title={id?'Informacion del cliente':'Nuevo cliente'}
        >
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
                    id="cuit"
                    className='w-full' 
                    value={cuit} 
                    onChange={e => setCuit(e.target.value)}
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
                <div className="flex justify-content-between">
                    <div className="flex justify-content-start">
                        <Button 
                            className="p-button-danger mr-2" 
                            onClick={()=> history.goBack()} 
                            label="Cancelar"
                        />
                        {id?
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
