import React from 'react'
import Card from './Card'

const MaterialListCard = (props) => {
    return (
        <Card
            title={props.nombre}
        >
            <div>Descripcion: {props.descripcion}</div>
            <div>Precio: {props.precio}</div>
            <div>Stock actual: {`${props.stockActual} ${props.unidad}`}</div>
            <div>Stock minimo: {`${props.stockMinimo} ${props.unidad}`}</div>
        </Card>
    )
}

export default MaterialListCard
