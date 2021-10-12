import React from 'react'
import CardSecondary from '../CardSecondary'
import { InputText } from 'primereact/inputtext';

const EfectivoCard = (props) => {
    return (
        <CardSecondary title={"Efectivo"}>
            <span className="p-float-label">
                <InputText id="observacion" className='w-full' value={props.observacion} onChange={(event) => props.updateMedioPago(event, "observacion")} tooltip="Ingrese el monto de la transaccion o cualquier informacion relevante" tooltipOptions={{ position: 'top' }}/>
                <label htmlFor="observacion">Observacion</label>
            </span>
            <br/>
            <span className="p-float-label">
                <InputText id="nroRecibo" className='w-full' value={props.nroRecibo} keyfilter="num" onChange={(event) => props.updateMedioPago(event, "nroRecibo")} />
                <label htmlFor="nroRecibo">Numero de recibo</label>
            </span>
        </CardSecondary>
    )
}

export default EfectivoCard
