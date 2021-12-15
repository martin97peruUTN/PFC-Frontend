import React from 'react'

import { Button } from 'primereact/button';

import { CARD_TWO_COLUMNS_BUTTON_DIV, CARD_TWO_COLUMNS_BUTTON } from '../../util/constants';
import CardTwoColumns from './CardTwoColumns'
import { isSmallScreen } from '../../util/miscFunctions'

const AnimalsOnGroundCard = (props) => (
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
            <div className={CARD_TWO_COLUMNS_BUTTON_DIV}>
                {props.tabViewActiveIndex === 0 || props.tabViewActiveIndex === 1 ?
                <Button className={CARD_TWO_COLUMNS_BUTTON} icon={isSmallScreen()?null:"pi pi-check-circle"} onClick={()=> props.sellHandler(props.id)} label="Vender"></Button>
                :
                null
                }
                {props.tabViewActiveIndex === 0 ?
                <Button className={CARD_TWO_COLUMNS_BUTTON} icon={isSmallScreen()?null:"pi pi-times-circle"} onClick={()=> props.notSoldHandler(props.id)} label="No vendido"></Button>
                :
                null
                }
                <Button className="btn btn-primary" icon={"pi pi-pencil"} onClick={() => props.editHandler(props.id)} label={isSmallScreen()?null:"Editar"}></Button>
            </div>
        }
    />
)

export default AnimalsOnGroundCard
