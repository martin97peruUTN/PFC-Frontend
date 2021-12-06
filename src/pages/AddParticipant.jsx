import React, {useState, useEffect, useContext} from 'react';
import { useHistory } from "react-router-dom";

import { Button } from 'primereact/button';
import { confirmDialog } from 'primereact/confirmdialog';

import { AuthContext } from '../context/AuthContext';
import { FetchContext } from '../context/FetchContext';
import * as url from '../util/url';

import Card from '../components/cards/Card'
import AddParticipantCard from '../components/cards/AddParticipantCard'

const AddParticipant = ({showToast}) => {

    const fetchContext = useContext(FetchContext)
    const history = useHistory();

    const [loadingAccept, setLoadingAccept] = useState(false)
    const [loadingStart, setLoadingStart] = useState(false)

    const [auctionId, setAuctionId] = useState(null)
    const [users, setUsers] = useState([]);
    const [deletedUsers, setDeletedUsers] = useState([]);

    //Pongo un valor negativo cualquiera, los que vienen desde el backend tienen un valor positivo
    const [newUserId, setNewUserId] = useState(-101)

    useEffect(() => {
        if(history.location.state){
            setLoadingStart(true)
            const {auctionId} = history.location.state
            setAuctionId(auctionId)
            //fetchContext.authAxios.get(`${url.USER_AUCTIONS_API}/get-users/${auctionId}`)
            fetchContext.authAxios.get(`https://61895cd6d0821900178d795e.mockapi.io/api/users`)
            .then(res => {
                setUsers(res.data)
                setLoadingStart(false)
            })
            .catch(err => {
                showToast('error', 'Error', 'No se pudo cargar la información')
                history.goBack()
            })
        }else{
            showToast('error', 'Error', 'No se pudo cargar la información')
            history.goBack()
        }
    },[])

    const addParticipant = () => {
        setUsers([...users, {'id': newUserId, 'username': ''}])
        setNewUserId(newUserId-1)
    }

    const deleteParticipantHandler = () => {
        confirmDialog({
            message: '¿Esta seguro que desea quitar este participante del remate?',
            header: 'Quitar participante',
            icon: 'pi pi-exclamation-circle',
            acceptLabel: 'Aceptar',
            rejectLabel: 'Cancelar',
            accept: () => deleteParticipant()
        })
    }

    const deleteParticipant = (index) => {
        //Si viene id positivo es porque es una que viene del backend
        //Si es null puede ser porque agrego una nueva, le dio a guardar, se seteo en null con el clearProvenancesId
        //y si no reviso eso se agrega al listado este tambien (no se bien porque)
        //asi que la agrego al listado de eliminadas
        if(users[index].id!==null && users[index].id>=0){
            setDeletedUsers([...deletedUsers, users[index]])
        }
        const usersCopy = [...users]
        usersCopy.splice(index, 1)
        setUsers(usersCopy)
    }

    //FIXME problemas con los id
    const updateParticipant = (value, id) => {
        const userIndex = users.findIndex(user => user.id === id)
        const usersCopy = [...users]
        usersCopy[userIndex] = value
        setUsers(usersCopy)
    }

    const confirm = () => {
        console.log(users)
    }

    const usersCardList = users.map((user, index) => (
        <AddParticipantCard
            key={user.id}
            user={user}
            showToast={showToast}
            deleteParticipant={() => deleteParticipantHandler(index)}
            updateParticipant={(value) => updateParticipant(value, user.id)}
        />
    ))

    return (
        <Card
            title={`Participantes`}
            footer={
                <div>
                    <div className="flex justify-content-start mb-2">
                        <Button 
                            className="btn btn-primary"
                            onClick={()=> addParticipant()} 
                            label="Agregar participante"
                        />
                    </div>
                    <div className="flex justify-content-between">
                        <Button 
                            className="p-button-danger mr-2" 
                            onClick={()=> history.goBack()} 
                            label="Cancelar"
                        />
                        <Button 
                            className="btn btn-primary" 
                            icon="pi pi-check" 
                            onClick={()=> confirm()} 
                            label="Guardar" 
                            loading={loadingAccept}
                        />
                    </div>
                </div>
            }
        >
            {usersCardList}
        </Card>
    )
}

export default AddParticipant
