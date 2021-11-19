import React from 'react'

import { SMALL_SCREEN } from '../../util/constants'

import Card from './Card'

const CardTwoColumns = (props) => {
    return (
        <Card 
            secondary={true} 
            title={props.title} 
            footer={
                //Si la pantalla es chica pongo los botones en el footer
                window.screen.width<=SMALL_SCREEN?
                props.buttons
                :
                null
            } 
        >
            <div className="grid">
                {/* Si la pantalla de chica el content ocupa todo el ancho (12), si es grande ocupa 5/6 del
                 ancho y deja lugar para los botones a la derecha. El texto tambien cambia de tamaño */}
                <div className="col-12 md:col-10 md:text-4xl text-2xl">
                    {props.content}
                </div>
                {window.screen.width>SMALL_SCREEN ?
                    //Si la pantalla es grande pongo los botones en la columna derecha
                    <div className="col-2">
                        {props.buttons}
                    </div>
                    :
                    null
                }
                
            </div>
        </Card>
    )
}

export default CardTwoColumns
