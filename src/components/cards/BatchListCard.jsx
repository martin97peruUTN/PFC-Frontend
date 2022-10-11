import React from 'react'

import { Button } from 'primereact/button';
import { CARD_TWO_COLUMNS_BUTTON_DIV } from '../../util/constants';
import { pluralizeSpanishWord } from '../../util/miscFunctions';

import CardTwoColumns from './CardTwoColumns'

const BatchListCard = props => {

    const animalsOnGroundCard = props.animalsOnGround.map(animal => (
        <div>
            <>{`${animal.amount} ${pluralizeSpanishWord(animal.category.name)}`}</>
            <br/>
        </div>
    ))

    return (
        <CardTwoColumns
            key = {props.id}
            content = {
                <>
                    <><b>{`Corral: `}</b>{`${props.corralNumber}`}</>
                    <br/>
                    {props.dteNumber?
                        <>
                            <><b>{`DTe: `}</b>{`${props.dteNumber}`}</>
                            <br/>
                        </>
                    :
                        null
                    }
                    {animalsOnGroundCard}
                </>
            }
            buttons = {
                !props.auctionIsFinished?
                    <div className={CARD_TWO_COLUMNS_BUTTON_DIV}>
                        <Button className="btn btn-primary" icon="pi pi-pencil" onClick={()=> props.editHandler()} label="Ver/Editar"></Button>
                    </div>
                :
                    null
            }
        />
    )
}

export default BatchListCard
