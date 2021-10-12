import React from 'react'
import Card from './Card'
import { Divider } from 'primereact/divider';
import { Button } from 'primereact/button'

const PagoListCard = (props) => {
    return (
        <Card
            title={`ID: ${props.id}`}
            footer={
                <div>
                    <Divider/>
                    <div className="flex justify-content-between">
                        <Button className="btn btn-primary" onClick={()=> props.handleEdit()} label="Editar"></Button>
                        <Button className="p-button-danger" onClick={()=> props.handleDelete()} label="Borrar"></Button>
                    </div>
                </div>
            }
        >
            <div>{props.cliente}</div>
            <div>Fecha del pago: {props.fechaPago}</div>
            <div>Medio de pago: {props.medioType}</div>
            <div>Observacion: {props.observacion}</div>

            {props.nroRecibo? <div>Numero de recibo: {props.nroRecibo}</div>:null}

            {props.cbuOrigen? <div>CBU origen: {props.cbuOrigen}</div>:null}
            {props.cbuDestino? <div>CBU destino: {props.cbuDestino}</div>:null}
            {props.codigoTransferencia? <div>Numero de transferencia: {props.codigoTransferencia}</div>:null}

            {props.nroCheque? <div>Numero de cheque: {props.nroCheque}</div>:null}
            {props.fechaCobro? <div>Fecha de cobro: {props.fechaCobro}</div>:null}
            {props.banco? <div>Banco: {props.banco}</div>:null}
        </Card>
    )
}

export default PagoListCard
