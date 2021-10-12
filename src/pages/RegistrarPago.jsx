import React, {useState, useRef, useEffect} from 'react'
import Card from '../components/cards/Card';
import { Button } from 'primereact/button'
import axios from 'axios'
import {userService, orderService, productService} from '../Url'
import { ProgressSpinner } from 'primereact/progressspinner';
import { AutoComplete } from 'primereact/autocomplete';
import { Toast } from 'primereact/toast';
import { Divider } from 'primereact/divider';
import { Dropdown } from 'primereact/dropdown';
import CardSecondary from '../components/cards/CardSecondary';
import EfectivoCard from '../components/cards/mediosDePago/EfectivoCard'
import ChequeCard from '../components/cards/mediosDePago/ChequeCard'
import TransferenciaCard from '../components/cards/mediosDePago/TransferenciaCard'
import {currentAccountService} from '../Url'

import {useParams} from "react-router-dom"

const RegistrarPago = (props) => {

    const {pagoId} = useParams()

    const[loadingStart, setLoadingStart] = useState(true)
    const[loadingSubmit, setLoadingSubmit] = useState(false)
    const toast = useRef(null);
    const [allClientes, setAllClientes] = useState([])
    const [filteredClientes, setFilteredClientes] = useState([])
    const [selectedCliente, setSelectedCliente] = useState()
    const [medioDePago, setMedioDePago] = useState({})
    const [medioPagoCard, setMedioPagoCard] = useState()

    const allMediosDePago = [
        {label: 'Efectivo', value: 'efectivo'},
        {label: 'Transferencia', value: 'transferencia'},
        {label: 'Cheque', value: 'cheque'}
    ];

    const [dateUpdate, setDateUpdate] = useState()

    const showToast = (summary, message, severity) => {
        toast.current.show({severity:severity, summary: summary, detail:message, life: 3000});
    }

    useEffect(() => {
        setLoadingStart(true)
        axios.get(userService+'/cliente').then((res) => {
            setAllClientes(res.data);
            setLoadingStart(false)
        })
        .catch(function (error) {
            showToast('Error','No se pudieron cargar los clientes, intentelo mas tarde','error')
            setTimeout(() => {
                props.history.push("/listado-pago")
            }, 3000);
        })
    }, [])

    useEffect(() => {
        //Si viene el id del pedido lleno los datos
        if(pagoId){
            console.log('pago con id: '+pagoId)
            axios.get(currentAccountService+'/pago/'+pagoId).then((res) => {
                setClienteEditar(res.data.cliente.id)
                setMedioDePago(res.data.medio)
                setDateUpdate(res.data.fechaPago)
            })
            .catch(function (error) {
                showToast('Error','No se pudo cargar el pago, intentelo mas tarde','error')
                setTimeout(() => {
                    props.history.push("/pago-listado")
                }, 3000);
            })
        }else{
            console.log('sin id')
        }
    }, [allClientes])

    useEffect(() => {
        switch (medioDePago.type) {
            case "efectivo":
                setMedioPagoCard(<EfectivoCard
                    updateMedioPago={(event, prop)=>updateMedioPago(event, prop)}
                    observacion={medioDePago.observacion}
                    nroRecibo={medioDePago.nroRecibo}
                />)
                break;
            case "transferencia":
                setMedioPagoCard(<TransferenciaCard
                    updateMedioPago={(event, prop)=>updateMedioPago(event, prop)}
                    observacion={medioDePago.observacion}
                    cbuOrigen = {medioDePago.cbuOrigen}
                    cbuDestino = {medioDePago.cbuDestino}
                    codigoTransferencia = {medioDePago.codigoTransferencia}
                />)
                break;
            case "cheque":
                setMedioPagoCard(<ChequeCard
                    updateMedioPago={(event, prop)=>updateMedioPago(event, prop)}
                    observacion={medioDePago.observacion}
                    nroCheque={medioDePago.nroCheque}
                    calendarValue={parseDate(medioDePago.fechaCobro)}
                    banco={medioDePago.banco}
                />)
                break;
            default:
                setMedioPagoCard(<CardSecondary title="Seleccione un medio de pago"></CardSecondary>)
                break;
        }
    }, [medioDePago])
    //tengo que ponerlo asi y no medioDePago.type porque los campos internos andan mal sino, no se que onda

    const parseDate = (dateJson) => {
        const dateReturn = new Date(JSON.parse(`"${dateJson}"`));
        return dateReturn;
    }

    const setClienteEditar = (idCliente) => {
        for(let i=0; i<allClientes.length; i++) {
            if(allClientes[i].id == idCliente){
                setSelectedCliente(allClientes[i])
                return null
            }
        }
        console.log('NO SE ENCONTRO CLIENTE')
    }

    const updateMedioPago = (event, prop) => {
        const medioPagoCopy = {...medioDePago}
        medioPagoCopy[prop] = event.target.value;
        setMedioDePago(medioPagoCopy)
    }

    const searchClientes = (event) => {
        let _filteredClientes;
        if(!event.query.trim().length){
            _filteredClientes = [...allClientes];
        }else{
            _filteredClientes = allClientes.filter((cliente) => {
                return cliente.razonSocial.startsWith(event.query)
            })
        }
        setFilteredClientes(_filteredClientes);
    }

    const handleCancel = (event) => {
        event.preventDefault();
        props.history.goBack()
    }

    const validPago = () => {
        let boolean = selectedCliente && medioDePago.type && medioDePago.observacion
        switch (medioDePago.type) {
            case "efectivo":
                boolean = boolean && medioDePago.nroRecibo
                break;
            case "transferencia":
                boolean = boolean && medioDePago.cbuOrigen && medioDePago.cbuDestino && medioDePago.codigoTransferencia
                break;
            case "cheque":
                boolean = boolean && medioDePago.nroCheque && medioDePago.fechaCobro && medioDePago.banco
                break;
            default:
                showToast('Error','Seleccione un medio de pago','warn')
                boolean = false
                break;
        }
        return boolean
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        //console.log(data)
        if(validPago()){
            setLoadingSubmit(true);
            if(pagoId){
                const data = {
                    "id": pagoId,
                    "cliente":selectedCliente,
                    "medio":medioDePago,
                    "fechaPago":dateUpdate
                }
                axios.put(currentAccountService+'/pago/'+pagoId, data)
                    .then(function (response) {
                        console.log(response);
                        setLoadingSubmit(false);
                        showToast('Exito!','Pago guardado correctamente','success')
                        props.history.push("/pago-listado")
                    })
                    .catch(function (error) {
                        console.log(error);
                        showToast('Error','No se pudo guardar el pedido, intentelo mas tarde','error')
                        setLoadingSubmit(false);
                    })
            }else{
                const data = {
                    "cliente":selectedCliente,
                    "medio":medioDePago
                }
                axios.post(currentAccountService+'/pago', data)
                .then(function (response) {
                    //Ver que hago aca
                    console.log(response);
                    setLoadingSubmit(false);
                    showToast('Exito!','Pago creado correctamente','success')
                    props.history.push("/pago-listado")
                })
                .catch(function (error) {
                    console.log(error);
                    showToast('Error','No se pudo guardar el pago, intentelo mas tarde','error')
                    setLoadingSubmit(false);
                })
            }
        }else{
            showToast('Error','FALTAN LLENAR CAMPOS','warn')
        }
    }

    return (
        loadingStart?
        <div style={{"display": "flex"}}>
            <Toast ref={toast} />
            <ProgressSpinner/>
        </div>
        :
        <div>
            <Toast ref={toast} />
            <p className="text-3xl font-bold text-800">{pagoId?"Editar pago":"Registrar pago"}</p>
            <Card title="Datos del pago"
            footer={
                <div>
                    <Divider/>
                    <div className="flex justify-content-between">
                        <Button className="p-button-danger" onClick={(event)=> handleCancel(event)} label="Cancelar"></Button>
                        <Button type="submit" className="btn btn-primary" icon="pi pi-check" onClick={(event)=> handleSubmit(event)} label="Guardar" loading={loadingSubmit}></Button>
                    </div>
                </div>
            }>
                <span className="p-float-label">
                    <AutoComplete id="clienteAutocomplete" className='w-full' value={selectedCliente} suggestions={filteredClientes} completeMethod={searchClientes} field="razonSocial" dropdown forceSelection onChange={(e)=>setSelectedCliente(e.value)} />
                    <label htmlFor="clienteAutocomplete">Cliente</label>
                </span>
                <br/>
                <span className="p-float-label">
                    <Dropdown id="medioPagoDropdown" className='w-full' value={medioDePago.type} options={allMediosDePago} onChange={e=>setMedioDePago({"type": e.value})} />
                    <label htmlFor="medioPagoDropdown">Medio de pago</label>
                </span>
                <br/>
                {medioPagoCard}
            </Card>
        </div>
    )
}

export default RegistrarPago
