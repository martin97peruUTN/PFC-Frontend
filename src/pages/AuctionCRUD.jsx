import React, {useState, useEffect, useContext} from 'react';
import { useHistory } from "react-router-dom";

import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Skeleton } from 'primereact/skeleton';
import { confirmDialog } from 'primereact/confirmdialog';
import { AutoComplete } from 'primereact/autocomplete';
import { Calendar } from 'primereact/calendar';

import { AuthContext } from '../context/AuthContext';
import { FetchContext } from '../context/FetchContext';
import * as url from '../util/url';
import * as miscFunctions from '../util/miscFunctions';

import Card from '../components/cards/Card'

const AuctionCRUD = ({showToast}) => {

    const authContext = useContext(AuthContext)
    const fetchContext = useContext(FetchContext)
    const history = useHistory();

    const [loadingAccept, setLoadingAccept] = useState(false)
    const [loadingStart, setLoadingStart] = useState(false)

    const [enableEditing, setEnableEditing] = useState(true)

    const [auctionId, setAuctionId] = useState(null)
    const [senasaNumber, setSenasaNumber] = useState('')
    const [date, setDate] = useState()
    const [time, setTime] = useState()
    const [filteredLocalityList, setFilteredLocalityList] = useState([])
    const [selectedLocality, setSelectedLocality] = useState()

    const [auctionIsFinished, setAuctionIsFinished] = useState(false)

    useEffect(() => {
        //Si esta editando me llega esto desde la otra pantalla
        if(history.location.state){
            setLoadingStart(true)
            setEnableEditing(false)
            const {auctionId, auctionIsFinished} = history.location.state
            setAuctionId(auctionId)
            setAuctionIsFinished(auctionIsFinished)
            fetchContext.authAxios.get(`${url.AUCTION_API}/${auctionId}`)
            .then(response => {
                const {senasaNumber, date, locality} = response.data
                setSenasaNumber(senasaNumber)
                setDate(miscFunctions.parseDateBackToFront(date))
                setTime(miscFunctions.parseDateBackToFront(date))
                setSelectedLocality(locality)
                setLoadingStart(false)
            })
            .catch(error => {
                showToast('error', 'Error', error.response.data.errorMsg)
                history.goBack();
            })
        }
    }, [history.location.state])

    //Busqueda de localidades por nombre para el autocomplete
    const searchLocality = (event) => {
        fetchContext.authAxios.get(`${url.LOCALITY_API}?name=${event.query}`)
        .then(response => {
            setFilteredLocalityList(response.data.content)
        })
        .catch(error => {
            showToast('error','Error','No se pudo obtener la lista de localidades')
        })
    }

    //Se dispara al presionar el boton Guardar
    const confirm = () => {
        if(!senasaNumber || !date || !time || !selectedLocality){
            showToast('warn', 'Cuidado', 'Debe completar todos los campos')
        }else{
            confirmDialog({
                message: '¿Esta seguro de que desea proceder?',
                header: 'Guardar remate',
                icon: 'pi pi-exclamation-circle',
                acceptLabel: 'Si',
                accept: () => handleSubmit()
            });
        }
    }

    const handleSubmit = () => {
        setLoadingAccept(true)
        let body = {
            senasaNumber,
            'date' : miscFunctions.parseDateFrontToBack(date, time),
            locality: selectedLocality
        }
        if(!authContext.isAdmin()){
            body = {...body, 'users': [
                    {
                        "id" : authContext.getUserInfo().id
                    }
                ]
            }
        }
        //Si no hay id es que estoy creando, si hay es que estoy editando
        if(!auctionId){
            fetchContext.authAxios.post(url.AUCTION_API, body)
            .then(response => {
                showToast('success', 'Exito', 'El remate ha sido creado')
                history.push('/');
            })
            .catch(error => {
                showToast('error', 'Error', error.response.data.errorMsg)
                setLoadingAccept(false)
            })
        }else{
            fetchContext.authAxios.patch(`${url.AUCTION_API}/${auctionId}`, body)
            .then(response => {
                showToast('success', 'Exito', 'El remate ha sido actualizado')
                history.goBack();
            })
            .catch(error => {
                showToast('error', 'Error', error.response.data.errorMsg)
                setLoadingAccept(false)
            })
        }
    }

    //Se dispara al tocar el boton eliminar
    const deleteHandler = () => {
        confirmDialog({
            message: '¿Esta seguro de que desea eliminar el remate?',
            header: 'Eliminar remate',
            icon: 'pi pi-exclamation-circle',
            acceptLabel: 'Si',
            accept: () => deleteAuction()
        })
    }

    const deleteAuction = () => {
        fetchContext.authAxios.delete(`${url.AUCTION_API}/${auctionId}`)
        .then(response => {
            showToast('success', 'Exito', 'El remate ha sido eliminado')
            history.push('/');
        })
        .catch(error => {
            showToast('error', 'Error', error.response.data.errorMsg)
        })
    }

    const cardForm = (
        <div>
            <span className="p-float-label">
                <InputText
                    id="senasaNumber"
                    className='w-full' 
                    value={senasaNumber} 
                    onChange={e => setSenasaNumber(e.target.value)}
                    disabled={!enableEditing}
                />
                <label htmlFor="senasaNumber">Numero de Senasa</label>
            </span>
            <br/>
            <div className="grid">
                <div className="col-6 pb-0">
                    <span className="p-float-label">
                        <Calendar
                            id='calendar' 
                            className='w-full'
                            value={date} 
                            onChange={(e) => setDate(e.value)} 
                            dateFormat="d/m/y"
                            tooltip="D/M/AA"
                            tooltipOptions={{position: 'top'}}
                            minDate={new Date()}//Fecha actual
                            disabled={!enableEditing}
                        />    
                        <label htmlFor="calendar">Fecha</label>
                    </span>
                </div>
                <div className="col-6 pb-0">
                    <span className="p-float-label">
                        <Calendar
                            id='time' 
                            className='w-full'
                            value={time} 
                            onChange={(e) => setTime(e.value)} 
                            dateFormat="d/m/y"
                            tooltip="HH:MM"
                            tooltipOptions={{position: 'top'}}
                            timeOnly
                            disabled={!enableEditing}
                        />    
                        <label htmlFor="time">Hora</label>
                    </span>
                </div>
            </div>
            <br/>
            <span className="p-float-label">
                <AutoComplete 
                    id='localityAutocompleteForm'
                    className='w-full'
                    value={selectedLocality} 
                    suggestions={filteredLocalityList} 
                    completeMethod={searchLocality} 
                    field="name" 
                    dropdown 
                    forceSelection 
                    onChange={(e) => setSelectedLocality(e.value)} 
                    disabled={!enableEditing}
                />
                <label htmlFor="localityAutocompleteForm">Localidad</label>
            </span>
            {auctionId && !auctionIsFinished && (authContext.isAdmin() || authContext.isConsignee())?
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
        <Card
            title={auctionId?'Informacion del remate':'Nuevo remate'}
            footer={
                <div className="flex justify-content-between">
                    <div className="flex justify-content-start">
                        <Button 
                            className="p-button-danger mr-2" 
                            onClick={()=> history.goBack()} 
                            label={auctionIsFinished || (!authContext.isAdmin() && !authContext.isConsignee())?"Volver":"Cancelar"}
                        />
                        {auctionId && !auctionIsFinished && (authContext.isAdmin() || authContext.isConsignee())?
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
                    {!auctionIsFinished && (authContext.isAdmin() || authContext.isConsignee())?
                        <Button 
                            className="btn btn-primary" 
                            icon="pi pi-check" 
                            onClick={()=> confirm()} 
                            label="Guardar" 
                            loading={loadingAccept}
                        />
                    :
                        null
                    }
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

export default AuctionCRUD
