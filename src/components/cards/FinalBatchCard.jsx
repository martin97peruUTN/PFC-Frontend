import React, {useRef} from 'react'

import { Button } from 'primereact/button';
import { Menu } from 'primereact/menu';

import { CARD_TWO_COLUMNS_BUTTON_DIV, CARD_TWO_COLUMNS_BUTTON } from '../../util/constants';
import CardTwoColumns from './CardTwoColumns'
import { isSmallScreen } from '../../util/miscFunctions'

//Si el remate esta terminado solo se puede sacar la boleta y cargar el DTe

const FinalBatchCard = (props) => {

    const menu = useRef(null);

    const menuItems = []
    if(!props.auctionIsFinished && props.mustWeigh && props.tabViewActiveIndex===0){
        menuItems.push({
            icon: "pi pi-sort",
            label: props.weight?"Editar peso":"Pesar",
            command: () => props.weighHandler(props.id)
        })
    }
    menuItems.push({
        icon: "pi pi-tag",
        label: props.dteNumber?"Editar DTe":"Cargar DTe",
        command: () => props.dteNumberSetHandler(props.id)
    })
    if(props.tabViewActiveIndex===0){
        menuItems.push(
            {
                icon: "pi pi-print",
                label: "Boleta",
                command: () => props.getBillHandler(props.id)
            }
        )
    }
    if(!props.auctionIsFinished && props.tabViewActiveIndex===0){
        menuItems.push(
            {
                icon: "pi pi-pencil",
                label: "Editar lote",
                command: () => props.editHandler(props.id)
            },
            {
                icon: "pi pi-times",
                label: "Eliminar",
                command: () => props.deleteHandler(props.id)
            }
        )
    }

    return (
        <>
            <Menu 
                className='w-auto' 
                model={menuItems} 
                popup 
                ref={menu} 
                id="popup_menu"
            />
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
                buttons = {
                    //tabViewActiveIndex => 0:Vendido 1:No vendido
                    !isSmallScreen() || (isSmallScreen() && props.tabViewActiveIndex===1)?//Pantalla grande (las 2 pesatañas) y los no vendidos en pantalla chica (los no vendidos tienen 1 solo boton)
                    <div className={CARD_TWO_COLUMNS_BUTTON_DIV}>
                        {!props.auctionIsFinished && props.mustWeigh && props.tabViewActiveIndex===0?//Solo si se deben pesar muestro el boton
                            <Button className={CARD_TWO_COLUMNS_BUTTON} icon="pi pi-sort" onClick={()=> props.weighHandler(props.id)} label={props.weight?"Editar peso":"Pesar"}/>
                            :
                            null
                        }
                        <Button className={CARD_TWO_COLUMNS_BUTTON} icon="pi pi-tag" onClick={()=> props.dteNumberSetHandler(props.id)} label={props.dteNumber?"Editar DTe":"Cargar DTe"}/>
                        {props.tabViewActiveIndex===0?//Solo los vendidos tienen boleta
                            <Button className={CARD_TWO_COLUMNS_BUTTON} icon="pi pi-print" onClick={()=> props.getBillHandler(props.id)} label="Boleta"/>
                            :
                            null
                        }
                        {!props.auctionIsFinished && props.tabViewActiveIndex===0?//Solo los vendidos  se pueden editar o eliminar
                            <div className={CARD_TWO_COLUMNS_BUTTON_DIV}>
                                <Button className={CARD_TWO_COLUMNS_BUTTON} icon="pi pi-pencil" onClick={()=> props.editHandler(props.id)} label="Editar lote"/>
                                <Button className="p-button-danger" icon="pi pi-times" onClick={()=> props.deleteHandler(props.id)} label="Eliminar"/>
                            </div>
                            :
                            null
                        }
                    </div>
                    ://Pantalla chica de los vendidos
                    <div className={CARD_TWO_COLUMNS_BUTTON_DIV}>
                        <Button 
                            icon="pi pi-bars"
                            label="Acciones"
                            className="sm-menubar-button m-0"
                            onClick={(event) => menu.current.toggle(event)}
                        />
                    </div>
                }
            />
        </>
    )
}

export default FinalBatchCard
