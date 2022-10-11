import React, {useRef} from 'react'

import { Button } from 'primereact/button';
import { SplitButton } from 'primereact/splitbutton';
import { Menu } from 'primereact/menu';

import { CARD_TWO_COLUMNS_BUTTON_DIV, CARD_TWO_COLUMNS_BUTTON } from '../../util/constants';
import CardTwoColumns from './CardTwoColumns'

//Si el remate esta terminado solo se puede sacar la boleta y cargar el DTe

const FinalBatchCard = (props) => {

    const menu = useRef(null);

    const menuItems = []
    if(!props.auctionIsFinished && props.mustWeigh){
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
    menuItems.push(
        {
            icon: "pi pi-print",
            label: "Imprimir boleta",
            command: () => props.getBillHandler(props.id, "print")
        },
        {
            icon: "pi pi-download",
            label: "Descargar boleta",
            command: ()=> props.getBillHandler(props.id, "download")
        }
    )
    if(!props.auctionIsFinished){
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

    const billMenuItems = [
        {
            icon: "pi pi-download",
            label: "Descargar boleta",
            command: ()=> props.getBillHandler(props.id, "download")
        }
    ]

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
                    <div className={"text-xl md:text-2xl"}>
                        <b>{`Número de lote: `}</b>{`${props.id}`}
                        {props.buyer?//Solo los vendidos tienen comprador
                            <div className="mb-1">
                                <b>{`Comprador: `}</b>{`${props.buyer}`}
                            </div>
                        :
                            null
                        }
                        <div className="mb-1">
                            <b>{`Vendedor: `}</b>{`${props.seller}`/*Siempre*/}
                        </div>
                        <div className="mb-1">
                            <b>{`Cantidad: `}</b>{`${props.amount}`/*Siempre*/}
                        </div>
                        <div className="mb-1">
                            <b>{`Categoría: `}</b>{`${props.category}`/*Siempre*/}
                        </div>
                        {props.price?//Solo los vendidos tienen precio
                            <div className="mb-1">
                                <b>{`Precio: `}</b>{`$${props.price}`}
                            </div>
                        :
                            null
                        }
                        {props.mustWeigh?//Depende si debe pesarse, y si debe, depende de si ya fue pesado o no
                            <div className="mb-1">
                                <><b>{`Peso: `}</b>{props.weight?`${props.weight} Kg`:<b>{`Falta pesar`}</b>}</>
                            </div>
                        :
                            null
                        }
                        {props.dteNumber?//Depende de si ya se le cargo el DTe o no
                            <div className="mb-1">
                                <b>{`DTe: `}</b>{`${props.dteNumber}`}
                            </div>
                        :
                            null
                        }
                        {props.paymentTerm?//Depende de si ya se le cargo el plazo o no
                            <div className="mb-1">
                                <b>{`Plazo: `}</b>{`${props.paymentTerm} días`}
                            </div>
                        :
                            null
                        }
                    </div>
                }
                buttons = {
                    props.tabViewActiveIndex===0?
                        <>
                            {/*Pantalla chica de los vendidos */}
                            <div className={CARD_TWO_COLUMNS_BUTTON_DIV}>
                                <Button 
                                    icon="pi pi-bars"
                                    label="Acciones"
                                    className="sm-menubar-button m-0 small-screen"
                                    onClick={(event) => menu.current.toggle(event)}
                                />
                            </div>

                            {/*Pantalla grande de los vendidos */}
                            <div className={CARD_TWO_COLUMNS_BUTTON_DIV+'big-screen'}>
                                {!props.auctionIsFinished && props.mustWeigh?//Solo si se deben pesar muestro el boton
                                    <Button className={CARD_TWO_COLUMNS_BUTTON} icon="pi pi-sort" onClick={()=> props.weighHandler(props.id)} label={props.weight?"Editar peso":"Pesar"}/>
                                    :
                                    null
                                }
                                <Button className={CARD_TWO_COLUMNS_BUTTON} icon="pi pi-tag" onClick={()=> props.dteNumberSetHandler(props.id)} label={props.dteNumber?"Editar DTe":"Cargar DTe"}/>
                                <SplitButton className={CARD_TWO_COLUMNS_BUTTON} model={billMenuItems} icon="pi pi-print" onClick={()=> props.getBillHandler(props.id, "print")} label="Boleta"/>
                                {!props.auctionIsFinished?//Solo los vendidos se pueden editar o eliminar
                                    <div className={CARD_TWO_COLUMNS_BUTTON_DIV}>
                                        <Button className={CARD_TWO_COLUMNS_BUTTON} icon="pi pi-pencil" onClick={()=> props.editHandler(props.id)} label="Editar lote"/>
                                        <Button className="p-button-danger" icon="pi pi-times" onClick={()=> props.deleteHandler(props.id)} label="Eliminar"/>
                                    </div>
                                    :
                                    null
                                }
                            </div>
                        </>
                    :
                        <div className={CARD_TWO_COLUMNS_BUTTON_DIV}>
                            <Button className={CARD_TWO_COLUMNS_BUTTON} icon="pi pi-tag" onClick={()=> props.dteNumberSetHandler(props.id)} label={props.dteNumber?"Editar DTe":"Cargar DTe"}/>
                        </div>
                }
            />
        </>
    )
}

export default FinalBatchCard
