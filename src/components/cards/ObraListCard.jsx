import React from 'react'
import Card from './Card'

const ObraListCard = (props) => {
    const title = `Direccion: ${props.direccion}`
    return (
        <Card
            title={title}
        >
            <div>Descripcion: {props.descripcion}</div>
            <div>Tipo de obra: {props.tipo}</div>
        </Card>
    )
}

export default ObraListCard
