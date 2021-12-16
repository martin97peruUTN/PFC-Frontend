import React from 'react'

import { Button } from 'primereact/button';
import { CARD_TWO_COLUMNS_BUTTON, CARD_TWO_COLUMNS_BUTTON_DIV } from '../../util/constants';

import CardTwoColumns from './CardTwoColumns'

const AnimalsOnGroundCRUDCard = props => (
    <CardTwoColumns
        key = {props.id}
        content = {
            <>
                <>{`Categoria: ${props.category.name}`}</>
                <br/>
                <>{`Cantidad: ${props.amount}`}</>
            </>
        }
        buttons = {
            props.enableEditing?
            <div className={CARD_TWO_COLUMNS_BUTTON_DIV}>
                <Button className={CARD_TWO_COLUMNS_BUTTON} icon="pi pi-pencil" onClick={()=> props.editItemHandler(props.id)} label="Editar"></Button>
                <Button className="p-button-danger" icon="pi pi-trash" onClick={() => props.deleteItemHandler(props.id)} label="Borrar"></Button>
            </div>
            :
            null
        }
    />
)

export default AnimalsOnGroundCRUDCard
