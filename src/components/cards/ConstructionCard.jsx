import React from 'react'
import CardSecondary from './CardSecondary'
import { Button } from 'primereact/button'
import { InputText } from 'primereact/inputtext';

const ConstructionCard = (props) => {

    return (
        <CardSecondary footer = {
            props.onDelete?<Button className="p-button-danger" onClick={props.onDelete}>Borrar obra</Button>:null
        }>
            <span className="p-float-label">
                <InputText id="descripcion" className='w-full' onChange={(event) => props.updateObra(event, "descripcion")} />
                <label htmlFor="descripcion">Descripcion</label>
            </span>
            <br/>
            <span className="p-float-label">
                <InputText id="latitud" className='w-full' keyfilter="num" onChange={(event) => props.updateObra(event, "latitud")} />
                <label htmlFor="latitud">Latitud</label>
            </span>
            <br/>
            <span className="p-float-label">
                <InputText id="longitud" className='w-full' keyfilter="num" onChange={(event) => props.updateObra(event, "longitud")} />
                <label htmlFor="longitud">Longitud</label>
            </span>
            <br/>
            <span className="p-float-label">
                <InputText id="direccion" className='w-full' onChange={(event) => props.updateObra(event, "direccion")} />
                <label htmlFor="direccion">Direccion</label>
            </span>
            <br/>
            <span className="p-float-label">
                <InputText id="superficie" className='w-full' keyfilter="num" onChange={(event) => props.updateObra(event, "superficie")} />
                <label htmlFor="superficie">Superficie</label>
            </span>
            <br/>
            <span className="p-float-label">
                <InputText id="tipo" className='w-full' onChange={(event) => props.updateObra(event, "tipo")} />
                <label htmlFor="tipo">Tipo de obra</label>
            </span>
        </CardSecondary>
    )
}

export default ConstructionCard
