import React, {useState, useEffect, useRef} from 'react'
import axios from 'axios'
import { ProgressSpinner } from 'primereact/progressspinner';
import { Toast } from 'primereact/toast';
import {currentAccountService} from '../Url'
import PagoListCard from '../components/cards/PagoListCard'

const ListadoPagos = (props) => {

    const[loading, setLoading] = useState(true)
    const toast = useRef(null);
    const [pagos, setPagos] = useState([])

    const showToast = (summary, message, severity) => {
        toast.current.show({severity:severity, summary: summary, detail:message, life: 3000});
    }

    useEffect(() => {
        axios.get(currentAccountService+'/pago').then((res) => {
            setPagos(res.data);
            setLoading(false)
        })
        .catch((err) => {
            showToast('Error','No se pudieron cargar los pagos, intentelo mas tarde','error')
            setTimeout(() => {
                props.history.push("/")
            }, 3000);
        })
    }, [pagos])

    const parseDate = (dateJson) => {
        if(dateJson){
            const date = new Date(JSON.parse(`"${dateJson}"`));
            return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`
        }
        return null
    }

    const handleDelete = (id) => {
        //event.preventDefault();
        axios.delete(currentAccountService+'/pago/'+id).then((res) => {
            showToast('Exito!','Pago eliminado correctamente','success')
            console.log('delete pago '+id)
        })
        .catch((err) => {
            console.log('error delete pago '+id)
        })
    }

    const handleEdit = (id) => {
        //event.preventDefault();
        props.history.push("/pago/"+id)
    }

    const cardsMarkup = pagos.map((pago) => (
        <PagoListCard
            key = {pago.id}
            id = {pago.id}
            cliente = {`Cliente: ${pago.cliente.razonSocial} - CUIT: ${pago.cliente.cuit}`}
            fechaPago = {parseDate(pago.fechaPago)}
            medioType = {pago.medio.type}
            observacion = {pago.medio.observacion}
            //estos son dependientes del types
            //efectivo
            nroRecibo = {pago.medio.nroRecibo}
            //transferencia
            cbuOrigen = {pago.medio.cbuOrigen}
            cbuDestino = {pago.medio.cbuDestino}
            codigoTransferencia = {pago.medio.codigoTransferencia}
            //cheque
            nroCheque = {pago.medio.nroCheque}
            fechaCobro = {parseDate(pago.medio.fechaCobro)}
            banco = {pago.medio.banco}
            //ahora los metodos de los botones
            handleDelete = {() => handleDelete(pago.id)}
            handleEdit = {() => handleEdit(pago.id)}
        />
    ))

    return (
        loading?
        <div style={{"display": "flex"}}>
            <Toast ref={toast} />
            <ProgressSpinner/>
        </div>
        :
        <div>
            <Toast ref={toast} />
            {cardsMarkup}
        </div>
    )
}

export default ListadoPagos
