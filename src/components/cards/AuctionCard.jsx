import React, { useContext } from 'react'
import { parseDateTimeToShow, parseDateToShow } from '../../util/miscFunctions';
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
                    <b><span className='small-screen'>N° Senasa: </span><span className='big-screen'>Número de Senasa: </span></b>{props.senasaNumber}
                    <br/>
                    <b>{`Fecha: `}</b>{`${parseDateToShow(props.date)} - ${parseDateTimeToShow(props.date)}`}
                    <br/>
                    <b>{`Lugar: `}</b>{`${props.locality}`}
                </div>
            }
            buttons = {
                //Si no es admin o no esta mirando sus remates (index = 0), no muestro los botones
                authContext.isAdmin() || props.tabViewActiveIndex === 0 ?
                <div className={CARD_TWO_COLUMNS_BUTTON_DIV}>
                    {!props.isOnHistory? 
                    //true si esta siendo usada en el historial de remates
                    //false si esta siendo usada en el home
                    //Si es smallScreen no muestro este boton
                        <Button className={CARD_TWO_COLUMNS_BUTTON+'big-screen'} icon="pi pi-plus-circle" onClick={()=> props.addBatchHandler(props.id)} label="Agregar lote"></Button>
                    :
                        null
                    }
                    <Button className={CARD_TWO_COLUMNS_BUTTON} icon="pi pi-tags" onClick={() => props.auctionScreenHandler(props.id)} label="Venta"></Button>
                    <Button className="btn btn-primary" icon="pi pi-shopping-cart" onClick={() => props.soldBatchesHandler(props.id)} label="Lotes vendidos"></Button>
                </div>
                :
                null
            }
        />
    )
}

export default AuctionCard
