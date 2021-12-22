import React from 'react'

import { Button } from 'primereact/button';

import { CARD_TWO_COLUMNS_BUTTON_DIV, CARD_TWO_COLUMNS_BUTTON } from '../../util/constants';
import CardTwoColumns from './CardTwoColumns'
import { isSmallScreen } from '../../util/miscFunctions'

const FinalBatchCard = (props) => (
    <CardTwoColumns
        key = {props.id}
        content = {
            <div className={isSmallScreen()?"text-xl":"text-2xl"}>
                {props.buyer?//Solo los vendidos tienen comprador
                    <div>
                        {`Comprador: ${props.buyer}`}
                        <br/>
                    </div>
                :
                null
                }
                {`Vendedor: ${props.seller}`/*Siempre*/}
                <br/>
                {`Cantidad: ${props.amount}`/*Siempre*/}
                <br/>
                {`Categoria: ${props.category}`/*Siempre*/}
                <br/>
                {props.weight?//Depende si debe pesarse, y si debe, depende de si ya fue pesado o no
                    <div>
                        {`Peso: ${props.weight}`}
                        <br/>
                    </div>
                :
                    null
                }
                {props.price?//Solo los vendidos tienen precio
                    <div>
                        {`Precio: ${props.price}`}
                        <br/>
                    </div>
                :
                    null
                }
                {props.dteNumber?//Depende de si ya se le cargo el DTe o no
                    `DTe: ${props.dteNumber}`
                :
                    null
                }
            </div>
        }
        buttons = {!props.auctionIsFinished?
            //tabViewActiveIndex => 0:Vendido 1:No vendido
            !isSmallScreen() || (isSmallScreen() && props.tabViewActiveIndex===1)?//Pantalla grande (las 2 pesatañas) y los no vendidos en pantalla chica (los no vendidos tienen 1 solo boton)
                <div className={CARD_TWO_COLUMNS_BUTTON_DIV}>
                    {props.mustWeigh && props.tabViewActiveIndex===0?//Solo si se deben pesar muestro el boton
                        <Button className={CARD_TWO_COLUMNS_BUTTON} icon="pi pi-sort" onClick={()=> props.weighHandler(props.id)} label={props.weight?"Editar peso":"Pesar"}/>
                        :
                        null
                    }
                    <Button className={CARD_TWO_COLUMNS_BUTTON} icon="pi pi-tag" onClick={()=> props.dteNumberSetHandler(props.id)} label={props.dteNumber?"Editar DTe":"Cargar DTe"}/>
                    {props.tabViewActiveIndex===0?//Solo los vendidos tienen boleta y se pueden editar o eliminar
                        <div className={CARD_TWO_COLUMNS_BUTTON_DIV}>
                            <Button className={CARD_TWO_COLUMNS_BUTTON} icon="pi pi-print" onClick={()=> props.getBillHandler(props.id)} label="Boleta"/>
                            <Button className={CARD_TWO_COLUMNS_BUTTON} icon="pi pi-pencil" onClick={()=> props.editHandler(props.id)} label="Editar lote"/>
                            <Button className="p-button-danger" icon="pi pi-times" onClick={()=> props.deleteHandler(props.id)} label="Eliminar"/>
                        </div>
                        :
                        null
                    }
                </div>
            ://TODO Pantalla chica de los vendidos
                <div className={CARD_TWO_COLUMNS_BUTTON_DIV}>
                    
                </div>
        ://Si esta terminado el remate no muestro botones
            null
        }
    />
)

export default FinalBatchCard
