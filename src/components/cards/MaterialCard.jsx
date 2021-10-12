import React from 'react'
import CardSecondary from './CardSecondary'
import { InputText } from 'primereact/inputtext';

const MaterialCard = (props) => {

    return (
        <CardSecondary>
            <span className="p-float-label">
                <InputText id="nombre" className='w-full' onChange={(event) => props.updateMaterial(event, "nombre")} />
                <label htmlFor="nombre">Nombre</label>
            </span>
            <br/>
            <span className="p-float-label">
                <InputText id="descripcion" className='w-full' onChange={(event) => props.updateMaterial(event, "descripcion")} />
                <label htmlFor="descripcion">Descripcion</label>
            </span>
            <br/>
            <span className="p-float-label">
                <InputText id="precio" className='w-full' keyfilter="num" onChange={(event) => props.updateMaterial(event, "precio")} />
                <label htmlFor="precio">Precio</label>
            </span>
            <br/>
            <span className="p-float-label">
                <InputText id="stockActual" className='w-full' keyfilter="num" onChange={(event) => props.updateMaterial(event, "stockActual")} />
                <label htmlFor="stockActual">Stock actual</label>
            </span>
            <br/>
            <span className="p-float-label">
                <InputText id="stockMinimo" className='w-full' keyfilter="num" onChange={(event) => props.updateMaterial(event, "stockMinimo")} />
                <label htmlFor="stockMinimo">Stock minimo</label>
            </span>
            <br/>
            <span className="p-float-label">
                <InputText id="unidad" className='w-full' onChange={(event) => props.updateMaterial(event, "unidad")} />
                <label htmlFor="unidad">Unidad</label>
            </span>
        </CardSecondary>
    )
}

export default MaterialCard
