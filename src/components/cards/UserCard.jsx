import React, {useContext} from 'react'
import { AuthContext } from '../../context/AuthContext';

import { Button } from 'primereact/button';
import { CARD_TWO_COLUMNS_BUTTON, CARD_TWO_COLUMNS_BUTTON_DIV } from '../../util/constants';

import CardTwoColumns from './CardTwoColumns'

const UserCard = props => {

    const authContext = useContext(AuthContext)

    return (
        <CardTwoColumns
            key = {props.id}
            title = {`${props.name} ${props.lastname}`}
            content = {
                <div>
                    {`Usuario: ${props.username}`}
                    <br/>
                    {`Rol: ${props.rol}`}
                </div>
            }
            buttons = {
                authContext.isAdmin() ?
                <div className={CARD_TWO_COLUMNS_BUTTON_DIV}>
                    <Button className={CARD_TWO_COLUMNS_BUTTON} icon="pi pi-pencil" onClick={()=> props.editHandler(props.id)} label="Editar"></Button>
                    <Button className="p-button-danger" icon="pi pi-trash" onClick={() => props.deleteHandler(props.id)} label="Borrar"></Button>
                </div>
                :
                null
            }
        />
    )
}

export default UserCard
