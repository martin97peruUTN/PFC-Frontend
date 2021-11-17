import React from 'react'

import { Button } from 'primereact/button';

import CardTwoColumns from './CardTwoColumns'

const BatchCard = (props) => (
    <CardTwoColumns
        key = {props.id}
        leftSide = {
            null
        }
        rightSide = {
            null
        }
    />
)

export default BatchCard