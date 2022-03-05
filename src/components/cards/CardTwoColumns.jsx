import React from 'react'

import Card from './Card'

const CardTwoColumns = (props) => {
    return (
        <Card 
            secondary={true} 
            title={props.title} 
            footer={
                //Si la pantalla es chica pongo los botones en el footer
                <div className="small-screen">
                    {props.buttons}
                </div>
            } 
        >
            <div className="grid">
                {/* Si la pantalla de chica el content ocupa todo el ancho (12), si es grande ocupa 5/6 del
                 ancho y deja lugar para los botones a la derecha. El texto tambien cambia de tamaño */}
                <div className="col-12 md:col-10 md:text-3xl text-xl">
                    {props.content}
                </div>
                {/*Si la pantalla es grande pongo los botones en la columna derecha*/}
                <div className="col-2 big-screen">
                    {props.buttons}
                </div>
            </div>
        </Card>
    )
}

export default CardTwoColumns
