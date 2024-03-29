import React, {useContext} from 'react'
import { AuthContext } from '../../context/AuthContext';

import { Button } from 'primereact/button';
import { CARD_TWO_COLUMNS_BUTTON, CARD_TWO_COLUMNS_BUTTON_DIV, ADMIN_ROLE } from '../../util/constants';

import CardTwoColumns from './CardTwoColumns'

const UserCard = props => {

    const authContext = useContext(AuthContext)

    return (
        <CardTwoColumns
            key = {props.id}
            title = {`${props.lastname} ${props.name}`}
            content = {
                <div>
                    <b>{`Usuario: `}</b>{`${props.username}`}
                    <br/>
                    <b>{`Rol: `}</b>{`${props.rol}`}
                </div>
            }
            buttons = {
                //No puede editar/elimianr a un admin (incluido el mismo), por eso no le muestro los botones
                (authContext.isAdmin() && props.rol!==ADMIN_ROLE) ?
                <div className={CARD_TWO_COLUMNS_BUTTON_DIV}>
                    <Button className={CARD_TWO_COLUMNS_BUTTON} icon="pi pi-pencil" onClick={()=> props.editHandler(props.id)} label="Ver/Editar"></Button>
                    <Button className="p-button-danger" icon="pi pi-trash" onClick={() => props.deleteHandler(props.id, props.rol)} label="Borrar"></Button>
                </div>
                :
                null
            }
        />
    )
}

export default UserCard
