import React from 'react'

import { Button } from 'primereact/button';

import CardTwoColumns from './CardTwoColumns'

const SimpleNameCard = props => (
    <CardTwoColumns
        key = {props.id}
        leftSide = {
            <div className="md:text-4xl text-xl">
                {props.name}
            </div>
        }
        rightSide = {
            <div className="flex flex-column">
                <Button className="btn btn-primary mb-1" icon="pi pi-pencil" onClick={()=> props.editHandler(props.id)} label="Editar"></Button>
                <Button className="p-button-danger" icon="pi pi-trash" onClick={() => props.deleteHandler(props.id)} label="Borrar"></Button>
            </div>
        }
    />
)

export default SimpleNameCard
