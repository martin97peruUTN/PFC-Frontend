import React from 'react'
import '../../Components.css'
import Card from './Card'

const CardTwoColumns = (props) => {
    return (
        <Card title={props.title} footer={props.footer} className="mb-3">
            <div className="row">
                <div className="col-md-10">
                    {props.leftSide}
                </div>
                <div className="col-md-2">
                    {props.rightSide}
                </div>
            </div>
        </Card>
    )
}

export default CardTwoColumns
