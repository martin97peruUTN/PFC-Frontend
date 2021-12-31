import React, {useRef} from 'react'

import { Button } from 'primereact/button';
import { SplitButton } from 'primereact/splitbutton';
import { Menu } from 'primereact/menu';

import { CARD_TWO_COLUMNS_BUTTON_DIV, CARD_TWO_COLUMNS_BUTTON } from '../../util/constants';
import CardTwoColumns from './CardTwoColumns'
import { isSmallScreen } from '../../util/miscFunctions'

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
                    isSmallScreen()?
                    <div>
                        {`Corral: ${props.corralNumber} - ${props.category}`}
                        <br/>
                        {`Vendedor: ${props.seller}`}
                        <br/>
                        {`Animales totales: ${props.amount}`}
                        <br/>
                        {`Vendidos: ${props.soldAmount}`}
                    </div>
                    :
                    <div>
                        {`Corral: ${props.corralNumber} - Categoria: ${props.category}`}
                        <br/>
                        {`Vendedor: ${props.seller}`}
                        <br/>
                        {`Animales totales: ${props.amount} - Vendidos: ${props.soldAmount}`}
                    </div>
                }
                buttons = {
                    //tabViewActiveIndex => 0:Para venta 1:No vendido 2:Vendido
                    <div className={CARD_TWO_COLUMNS_BUTTON_DIV}>
                        {(props.tabViewActiveIndex === 0 || props.tabViewActiveIndex === 1) && !props.auctionIsFinished ?
                            <Button className={CARD_TWO_COLUMNS_BUTTON} icon={isSmallScreen()?null:"pi pi-check-circle"} onClick={()=> props.sellHandler(props.id)} label="Vender"></Button>
                            :
                            null
                        }
                        {props.tabViewActiveIndex === 0  && !props.auctionIsFinished?
                            <Button className={CARD_TWO_COLUMNS_BUTTON} icon={isSmallScreen()?null:"pi pi-times-circle"} onClick={()=> props.notSoldHandler(props.id)} label="No vendido"></Button>
                            :
                            null
                        }
                        {!props.auctionIsFinished && (!isSmallScreen() || props.tabViewActiveIndex !== 0)?
                            <SplitButton className="btn btn-primary" model={items} icon={"pi pi-pencil"} onClick={() => props.editAnimalOnGroundHandler(props.id)} label={isSmallScreen() && props.tabViewActiveIndex==0?null:"Editar"}></SplitButton>
                            :
                            null
                        }
                        {!props.auctionIsFinished && isSmallScreen() && props.tabViewActiveIndex === 0?
                            <Button className="btn btn-primary" icon={"pi pi-pencil"} onClick={(event) => menuEditToSellScreenButton.current.toggle(event)}></Button>
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
