import React from 'react'
import Card from './Card'
import { Divider } from 'primereact/divider';
import { Button } from 'primereact/button'

const PedidoListCard = (props) => {

    return (
        <Card
            title={`ID: ${props.id}`}
            footer={
                <div>
                    <Divider/>
                    <div className="flex justify-content-between">
                        <Button className="btn btn-primary" onClick={()=> props.handleEdit()} label="Editar"></Button>
                        <Button className="p-button-danger" onClick={()=> props.handleDelete()} label="Borrar"></Button>
                    </div>
                </div>
            }
        >
            <div>Obra: {props.obra}</div>
            <div>Fecha del pedido: {props.fechaPedido}</div>
            <div>Estado: {props.estado}</div>
        </Card>
    )
}

export default PedidoListCard
