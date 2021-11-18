import React from 'react'
import { parseDateToShow } from '../../util/miscFunctions';

import { Button } from 'primereact/button';

import CardTwoColumns from './CardTwoColumns'

const AuctionCard = props => (
    <CardTwoColumns
        key = {props.id}
        leftSide = {
            <div className="md:text-4xl text-xl">
                {`Numero de Senasa: ${props.senasaNumber}`}
                {`Fecha: ${parseDateToShow(props.date)}`}
                {`Lugar: ${props.locality}`}
            </div>
        }
        rightSide = {
            <div className="flex flex-column">
                <Button className="btn btn-primary mb-1" icon="pi pi-plus-circle" onClick={()=> props.addBatchHandler(props.id)} label="Agregar lote"></Button>
                <Button className="btn btn-primary" icon="pi pi-eye" onClick={() => props.auctionScreenHandler(props.id)} label="Ver"></Button>
            </div>
        }
    />
)

export default AuctionCard
