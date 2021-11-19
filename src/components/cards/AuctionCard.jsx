import React, { useContext } from 'react'
import { parseDateGetTime, parseDateToShow } from '../../util/miscFunctions';
import { AuthContext } from '../../context/AuthContext';

import { Button } from 'primereact/button';

import CardTwoColumns from './CardTwoColumns'

const AuctionCard = props => {

    const authContext = useContext(AuthContext)

    return (
        <CardTwoColumns
            key = {props.id}
            leftSide = {
                <div className="md:text-4xl text-xl">
                    {`Numero de Senasa: ${props.senasaNumber}`}
                    <br/>
                    {`Fecha: ${parseDateToShow(props.date)}`}
                    <br/>
                    {`Hora: ${parseDateGetTime(props.date)}`}
                    <br/>
                    {`Lugar: ${props.locality}`}
                </div>
            }
            rightSide = {
                //Si no es admin o no esta mirando sus remates (index = 0), no muestro los botones
                authContext.isAdmin() || props.tabViewActiveIndex === 0 ?
                <div className="flex flex-column">
                    <Button className="btn btn-primary mb-1" icon="pi pi-plus-circle" onClick={()=> props.addBatchHandler(props.id)} label="Agregar lote"></Button>
                    <Button className="btn btn-primary" icon="pi pi-eye" onClick={() => props.auctionScreenHandler(props.id)} label="Ver"></Button>
                </div>
                :
                null
            }
        />
    )
}

export default AuctionCard
