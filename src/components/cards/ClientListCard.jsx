import React from 'react'
import Card from './Card'

const ClientListCard = (props) => {
    return (
        <Card
            title={props.razonSocial}
        >
            <div>CUIT: {props.cuit}</div>
            <div>Mail: {props.mail}</div>
            <div>Usuario: {props.user}</div>
        </Card>
    )
}

export default ClientListCard
