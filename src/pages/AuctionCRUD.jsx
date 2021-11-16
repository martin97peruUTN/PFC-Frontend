import React, {useState, useEffect, useRef, useContext} from 'react';
import { useHistory } from "react-router-dom";

import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { Skeleton } from 'primereact/skeleton';
import { confirmDialog } from 'primereact/confirmdialog';
import { AutoComplete } from 'primereact/autocomplete';
import { Calendar } from 'primereact/calendar';

import { AuthContext } from '../context/AuthContext';
import { FetchContext } from '../context/FetchContext';
import * as url from '../util/url';

import Card from '../components/cards/Card'

const AuctionCRUD = () => {

    const authContext = useContext(AuthContext)
    const fetchContext = useContext(FetchContext)
    const history = useHistory();
    const toast = useRef(null);
    const showToast = (severity, summary, message) => {
        toast.current.show({severity:severity, summary: summary, detail:message});
    }

    const [loadingAccept, setLoadingAccept] = useState(false)
    const [loadingStart, setLoadingStart] = useState(false)

    const [auctionId, setAuctionId] = useState(null)
    const [senasaNumber, setsenasaNumber] = useState('')
    const [date, setDate] = useState('')
    const [filteredLocalityList, setFilteredLocalityList] = useState([])
    const [selectedLocality, setSelectedLocality] = useState()

    useEffect(() => {
        setLoadingStart(true)
        //Si esta editando me llega esto desde la otra pantalla
        //TODO ver esto despues desde la otra pantalla
        if(history.location.state){
            const {autionId, senasaNumber, date, selectedLocality} = history.location.state
            setAuctionId(autionId)
            setsenasaNumber(senasaNumber)
            setDate(date)
            setSelectedLocality(selectedLocality)
        }
        setLoadingStart(false)
    }, [])

    const handleSubmit = () => {
        setLoadingAccept(true)
        const body = {
            senasaNumber,
            date,
            locality: selectedLocality,
            users: [
                {
                    "id" : authContext.getUserInfo().id
                }
            ]
        }
        //Si no hay id es que estoy creando, si hay es que estoy editando
        if(!auctionId){
            fetchContext.authAxios.post(url.AUCTION_API, body)
            .then(response => {
                showToast('success', 'Exito', 'El remate ha sido creado')
                setTimeout(() => {
                    history.goBack();
                }, 3000);
            })
            .catch(error => {
                showToast('error', 'Error', 'No se pudo crear el remate')
                setLoadingAccept(false)
            })
        }else{
            fetchContext.authAxios.patch(`${url.AUCTION_API}/${auctionId}`, body)
            .then(response => {
                showToast('success', 'Exito', 'El remate ha sido actualizado')
                setTimeout(() => {
                    history.goBack();
                }, 3000);
            })
            .catch(error => {
                showToast('error', 'Error', 'No se pudo actualizar el remate')
                setLoadingAccept(false)
            })
        }
    }

    //Se dispara al presionar el boton Guardar
    const confirm = () => {
        if(senasaNumber.length === 0 || !date || !selectedLocality){
            showToast('warn', 'Cuidado', 'Debe completar todos los campos')
        }else{
            confirmDialog({
                message: '¿Esta seguro de que desea proceder?',
                header: 'Actualizar informacion de usuario',
                icon: 'pi pi-exclamation-circle',
                acceptLabel: 'Si',
                accept: () => handleSubmit()
            });
        }
    }

    //Busqueda de localidades por nombre para el automcomplete
    const searchLocality = (event) => {
        fetchContext.authAxios.get(`${url.LOCALITY_API}?name=${event.query}`)
        .then(response => {
            setFilteredLocalityList(response.data.content)
        })
        .catch(error => {
            toast.current.show({severity:'error', summary:'Error', detail:'No se pudo obtener la lista de localidades'})
        })
    }

    const cardForm = (
        <div>
            <span className="p-float-label">
                <InputText
                    id="senasaNumber"
                    className='w-full' 
                    value={senasaNumber} 
                    onChange={e => setsenasaNumber(e.target.value)}
                    keyfilter="pint"
                />
                <label htmlFor="senasaNumber">Numero de Senasa</label>
            </span>
            <br/>
            <span className="p-float-label">
                <Calendar
                    id='calendar' 
                    className='w-full' 
                    value={date} 
                    onChange={(e) => setDate(e.value)} 
                    dateFormat="dd/mm/yy" 
                    mask="99/99/9999"/>
                <label htmlFor="calendar">Fecha</label>
            </span>
            <br/>
            <span className="p-float-label">
                <AutoComplete 
                    id='localityAutocomplete'
                    className='w-full'
                    value={selectedLocality} 
                    suggestions={filteredLocalityList} 
                    completeMethod={searchLocality} 
                    field="name" 
                    dropdown 
                    forceSelection 
                    onChange={(e) => setSelectedLocality(e.value)} />
                <label htmlFor="localityAutocomplete">Localidad</label>
            </span>
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
        <Toast ref={toast} />
        <Card
            title={auctionId?'Editar remate':'Nuevo remate'}
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
        </>
    )
}

export default AuctionCRUD
