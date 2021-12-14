import React from 'react'

import { Button } from 'primereact/button';

import { CARD_TWO_COLUMNS_BUTTON_DIV, CARD_TWO_COLUMNS_BUTTON } from '../../util/constants';
import CardTwoColumns from './CardTwoColumns'

const AnimalsOnGroundCard = (props) => (
    <CardTwoColumns
        key = {props.id}
        content = {
            null
        }
        buttons = {
            <div className={CARD_TWO_COLUMNS_BUTTON_DIV}>
                {props.tabViewActiveIndex === 0 || props.tabViewActiveIndex === 1 ?
                <Button className={CARD_TWO_COLUMNS_BUTTON} icon="pi pi-pencil" onClick={()=> props.sellHandler(props.id)} label="Vender"></Button>
                :
                null
                }
                {props.tabViewActiveIndex === 0 ?
                <Button className={CARD_TWO_COLUMNS_BUTTON} icon="pi pi-pencil" onClick={()=> props.notSoldHandler(props.id)} label="No vendido"></Button>
                :
                null
                }
                <Button className="p-button-danger" icon="pi pi-pencil" onClick={() => props.editHandler(props.id)} label="Editar"></Button>
            </div>
        }
    />
)

export default AnimalsOnGroundCard
