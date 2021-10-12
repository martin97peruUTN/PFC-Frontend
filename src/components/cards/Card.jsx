import React from 'react'
import { Card as CardPrime } from 'primereact/card';

const Card = (props) => {
    //secondary en un bool que indica si la card es secundaria o no
    const secondary = props.secondary;
    //obtengo el gris del archivo css
    const grey = getComputedStyle(document.documentElement).getPropertyValue('--grey');
    return (
        <CardPrime title={props.title} footer={props.footer} className="mb-3" style={{backgroundColor: secondary ? grey : 'white'}}>
            {props.children}
        </CardPrime>
    )
}

export default Card
