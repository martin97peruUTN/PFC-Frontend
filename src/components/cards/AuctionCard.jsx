import React, { useContext } from 'react'
import { parseDateGetTime, parseDateToShow } from '../../util/miscFunctions';
import { AuthContext } from '../../context/AuthContext';

import { Button } from 'primereact/button';
import { CARD_TWO_COLUMNS_BUTTON, CARD_TWO_COLUMNS_BUTTON_DIV } from '../../util/constants';

import CardTwoColumns from './CardTwoColumns'

const AuctionCard = props => {

    const authContext = useContext(AuthContext)

    return (
        <CardTwoColumns
            key = {props.id}
            content = {
                <div>
                    {`${window.screen.width>600?'Numero de Senasa':'N° Senasa'}: ${props.senasaNumber}`}
                    <br/>
                    {`Fecha: ${parseDateToShow(props.date)} ${parseDateGetTime(props.date)}`}
                    <br/>
                    {`Lugar: ${props.locality}`}
                </div>
            }
            buttons = {
                //Si no es admin o no esta mirando sus remates (index = 0), no muestro los botones
                authContext.isAdmin() || props.tabViewActiveIndex === 0 ?
                <div className={CARD_TWO_COLUMNS_BUTTON_DIV}>
                    <Button className={CARD_TWO_COLUMNS_BUTTON} icon="pi pi-plus-circle" onClick={()=> props.addBatchHandler(props.id)} label="Agregar lote"></Button>
                    <Button className="btn btn-primary" icon="pi pi-eye" onClick={() => props.auctionScreenHandler(props.id)} label="Ver"></Button>
                </div>
                :
                null
            }
        />
    )
}

export default AuctionCard
