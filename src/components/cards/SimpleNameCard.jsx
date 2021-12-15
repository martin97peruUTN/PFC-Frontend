import React from 'react'

import { Button } from 'primereact/button';
import { CARD_TWO_COLUMNS_BUTTON, CARD_TWO_COLUMNS_BUTTON_DIV } from '../../util/constants';

import CardTwoColumns from './CardTwoColumns'

const SimpleNameCard = props => (
    <CardTwoColumns
        key = {props.id}
        content = {
            props.name
        }
        buttons = {
            <div className={CARD_TWO_COLUMNS_BUTTON_DIV}>
                {props.editHandler?
                <Button className={CARD_TWO_COLUMNS_BUTTON} icon="pi pi-pencil" onClick={()=> props.editHandler(props.id)} label={props.editLabel?props.editLabel:"Editar"}></Button>
                :
                null
                }
                {props.deleteHandler?
                <Button className="p-button-danger" icon="pi pi-trash" onClick={() => props.deleteHandler(props.id)} label="Borrar"></Button>
                :
                null
                }
            </div>
        }
    />
)

export default SimpleNameCard
