import React, {useState, useEffect} from 'react'
import CardSecondary from '../CardSecondary'
import { InputText } from 'primereact/inputtext';
import { Calendar } from 'primereact/calendar';
import { Tooltip } from 'primereact/tooltip';

const ChequeCard = (props) => {

    return (
        <CardSecondary title={"Cheque"}>
            <span className="p-float-label">
                <InputText id="observacion" className='w-full' value={props.observacion} onChange={(event) => props.updateMedioPago(event, "observacion")} tooltip="Ingrese el monto de la transaccion o cualquier informacion relevante" tooltipOptions={{ position: 'top' }}/>
                <label htmlFor="observacion">Observacion</label>
            </span>
            <br/>
            <span className="p-float-label">
                <InputText id="nroCheque" className='w-full' value={props.nroCheque} keyfilter="num" onChange={(event) => props.updateMedioPago(event, "nroCheque")} />
                <label htmlFor="nroCheque">Numero de cheque</label>
            </span>
            <br/>
            <span className="p-float-label">
                <Calendar id="calendar" className='w-full' value={props.calendarValue} onChange={(e) => props.updateMedioPago(e, "fechaCobro")} dateFormat="dd/mm/yy" mask="99/99/9999"/>
                <label htmlFor="calendar">Fecha de cobro</label>
            </span>
            <br/>
            <span className="p-float-label">
                <InputText id="banco" className='w-full' value={props.banco} onChange={(event) => props.updateMedioPago(event, "banco")} />
                <label htmlFor="banco">Banco</label>
            </span>
        </CardSecondary>
    )
}

export default ChequeCard
