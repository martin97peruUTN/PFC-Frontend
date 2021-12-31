import React from 'react'
import { Card as CardPrime } from 'primereact/card';

const Card = (props) => {
    //secondary en un bool que indica si la card es secundaria o no
    const secondary = props.secondary;
    //Se usa para cambiar el color de la card si esta siendo movida en la pantalla SortAnimalsOnGround
    const isDragging = props.isDragging;
    //obtengo el gris del archivo css
    const grey = getComputedStyle(document.documentElement).getPropertyValue('--grey');
    const light = getComputedStyle(document.documentElement).getPropertyValue('--light');
    return (
        <CardPrime title={props.title} footer={props.footer} className="mb-3" style={{backgroundColor: secondary && !isDragging ? grey : isDragging? light : null}}>
            {props.children}
        </CardPrime>
    )
}

export default Card
