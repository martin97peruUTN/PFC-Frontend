import React from 'react'

import { Button } from 'primereact/button';
import { CARD_TWO_COLUMNS_BUTTON, CARD_TWO_COLUMNS_BUTTON_DIV } from '../../util/constants';
import { pluralizeSpanishWord } from '../../util/miscFunctions';

import CardTwoColumns from './CardTwoColumns'

const BatchListCard = props => {

    const animalsOnGroundCard = props.animalsOnGround.map(animal => (
        <div className="text-2xl">
            <>{`${animal.amount} ${pluralizeSpanishWord(animal.category.name)}`}</>
            <br/>
        </div>
    ))

    return (
        <CardTwoColumns
            key = {props.id}
            content = {
                <>
                    <>{`Corral ${props.corralNumber}`}</>
                    <br/>
                    {props.dteNumber?
                        <>
                            <>{`DTe: ${props.dteNumber}`}</>
                            <br/>
                        </>
                    :
                        null
                    }
                    {animalsOnGroundCard}
                </>
            }
            buttons = {
                <div className={CARD_TWO_COLUMNS_BUTTON_DIV}>
                    <Button className="btn btn-primary" icon="pi pi-pencil" onClick={()=> props.editHandler()} label="Ver/Editar"></Button>
                </div>
            }
        />
    )
}

export default BatchListCard
