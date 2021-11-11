import React from 'react'
import '../../Components.css'
import Card from './Card'

const CardTwoColumns = (props) => {
    return (
        <Card secondary={true} title={props.title} footer={props.footer} >
            <div className="grid">
                <div className="col-6 md:col-10">
                    {props.leftSide}
                </div>
                <div className="col-6 md:col-2">
                    {props.rightSide}
                </div>
            </div>
        </Card>
    )
}

export default CardTwoColumns
