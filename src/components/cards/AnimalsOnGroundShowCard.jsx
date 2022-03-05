import React, {useRef} from 'react'

import { Button } from 'primereact/button';
import { SplitButton } from 'primereact/splitbutton';
import { Menu } from 'primereact/menu';

import { CARD_TWO_COLUMNS_BUTTON_DIV, CARD_TWO_COLUMNS_BUTTON } from '../../util/constants';
import CardTwoColumns from './CardTwoColumns'

const AnimalsOnGroundShowCard = (props) => {

    const menuEditToSellScreenButton = useRef(null);

    const items = [
        {
            label: 'Editar lote',
            icon: 'pi pi-pencil',
            command: () => props.editHandler(props.id)
        }
    ]

    const menuItems = [
        {
            label: 'Editar',
            icon: 'pi pi-pencil',
            command: () => props.editAnimalOnGroundHandler(props.id)
        },
        {
            label: 'Editar lote',
            icon: 'pi pi-pencil',
            command: () => props.editHandler(props.id)
        }
    ]
    
    return (
        <>
            <Menu 
                className='w-auto' 
                model={menuItems} 
                popup 
                ref={menuEditToSellScreenButton} 
                id="popup_menu"
            />
            <CardTwoColumns
                key = {props.id}
                content = {
                    <>
                        <div className='small-screen'>
                            <b>{`Corral: `}</b>{`${props.corralNumber} - ${props.category}`}
                            <br/>
                            <b>{`Vendedor: `}</b>{`${props.seller}`}
                            <br/>
                            <b>{`Animales totales: `}</b>{`${props.amount}`}
                            <br/>
                            <b>{`Vendidos: `}</b>{`${props.soldAmount}`}
                        </div>
                        <div className='big-screen'>
                            <b>{`Corral: `}</b>{`${props.corralNumber}`}<b>{` - Categoria: `}</b>{`${props.category}`}
                            <br/>
                            <b>{`Vendedor: `}</b>{`${props.seller}`}
                            <br/>
                            <b>{`Animales totales: `}</b>{`${props.amount}`}<b>{` - Vendidos: `}</b>{`${props.soldAmount}`}
                        </div>
                    </>
                }
                buttons = {
                    //tabViewActiveIndex => 0:Para venta 1:No vendido 2:Vendido
                    <div className={CARD_TWO_COLUMNS_BUTTON_DIV}>
                        {(props.tabViewActiveIndex === 0 || props.tabViewActiveIndex === 1) && !props.auctionIsFinished ?
                            <Button className={CARD_TWO_COLUMNS_BUTTON} icon={"pi pi-check-circle big-screen"} onClick={()=> props.sellHandler(props.id)} label="Vender"></Button>
                            :
                            null
                        }
                        {props.tabViewActiveIndex === 0  && !props.auctionIsFinished?
                            <Button className={CARD_TWO_COLUMNS_BUTTON} icon={"pi pi-times-circle big-screen"} onClick={()=> props.notSoldHandler(props.id)} label="No vendido"></Button>
                            :
                            null
                        }
                        {!props.auctionIsFinished?
                            <>
                            {props.tabViewActiveIndex === 0 ?
                                //En la pestaña 0 muestro uno u otro depende el tamaño de la pantalla
                                <>
                                    <Button className="btn btn-primary small-screen" icon={"pi pi-pencil"} onClick={(event) => menuEditToSellScreenButton.current.toggle(event)}></Button>
                                    <SplitButton className="btn btn-primary big-screen" model={items} icon={"pi pi-pencil"} onClick={() => props.editAnimalOnGroundHandler(props.id)} label={"Editar"}></SplitButton>
                                </>
                            :
                                //En el resto siempre este porque hay lugar
                                <SplitButton className="btn btn-primary" model={items} icon={"pi pi-pencil"} onClick={() => props.editAnimalOnGroundHandler(props.id)} label={"Editar"}></SplitButton>
                            }
                            </>
                        :
                            null
                        }
                    </div>
                }
            />
        </>
    )
}

export default AnimalsOnGroundShowCard
