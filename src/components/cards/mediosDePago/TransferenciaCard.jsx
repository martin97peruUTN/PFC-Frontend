import React from 'react'
import CardSecondary from '../CardSecondary'
import { InputText } from 'primereact/inputtext';

const TransferenciaCard = (props) => {
    return (
        <CardSecondary title={"Transferencia"}>
            <span className="p-float-label">
                <InputText id="observacion" className='w-full' value={props.observacion} onChange={(event) => props.updateMedioPago(event, "observacion")} tooltip="Ingrese el monto de la transaccion o cualquier informacion relevante" tooltipOptions={{ position: 'top' }}/>
                <label htmlFor="observacion">Observacion</label>
            </span>
            <br/>
            <span className="p-float-label">
                <InputText id="cbuOrigen" className='w-full' value={props.cbuOrigen} keyfilter="num" onChange={(event) => props.updateMedioPago(event, "cbuOrigen")} />
                <label htmlFor="cbuOrigen">CBU origen</label>
            </span>
            <br/>
            <span className="p-float-label">
                <InputText id="cbuDestino" className='w-full' value={props.cbuDestino} keyfilter="num" onChange={(event) => props.updateMedioPago(event, "cbuDestino")} />
                <label htmlFor="cbuDestino">CBU destino</label>
            </span>
            <br/>
            <span className="p-float-label">
                <InputText id="codigoTransferencia" className='w-full' value={props.codigoTransferencia} keyfilter="num" onChange={(event) => props.updateMedioPago(event, "codigoTransferencia")} />
                <label htmlFor="codigoTransferencia">Codigo de la transferencia</label>
            </span>
        </CardSecondary>
    )
}

export default TransferenciaCard
