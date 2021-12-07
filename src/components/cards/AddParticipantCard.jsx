import React, {useState, useContext} from 'react'

import { Button } from 'primereact/button';
import { AutoComplete } from 'primereact/autocomplete';

import { FetchContext } from '../../context/FetchContext';
import { AuthContext } from '../../context/AuthContext';
import * as url from '../../util/url';

import CardSecondary from './CardSecondary'

const AddParticipantCard = props => {

    const fetchContext = useContext(FetchContext)
    const authContext = useContext(AuthContext)

    const [filteredUserList, setFilteredUserList] = useState([])
    const [selectedUser, setSelectedUser] = useState(null)

    //Busqueda de usuarios por nombre para el autocomplete
    const searchUser = (event) => {
        //fetchContext.authAxios.get(`${url.USER_API}?name=${event.query}`)
        //TODO es para pruebas este, sacar despues
        fetchContext.authAxios.get(`${url.USER_API}/user-list`)
        .then(response => {
            setFilteredUserList(response.data.content)
        })
        .catch(error => {
            props.showToast('error','Error','No se pudo obtener la lista de usuarios')
        })
    }

    return (
        <CardSecondary
            footer = {
                <Button className="p-button-danger" icon="pi pi-trash" onClick={props.deleteParticipant} label="Eliminar"></Button>
            }
        >
            <span className="p-float-label">
                <AutoComplete 
                    id='userAutocompleteForm'
                    className='w-full'
                    value={props.user} 
                    suggestions={filteredUserList} 
                    completeMethod={searchUser} 
                    field="name" 
                    dropdown 
                    forceSelection
                    onChange={(e) => props.updateParticipant(e.target.value)}
                />
                <label htmlFor="userAutocompleteForm">Nombre del participante</label>
            </span>
        </CardSecondary>
    )
}

export default AddParticipantCard
