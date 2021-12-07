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

    //Uso startingUsers para poder sacar la diferencia entre estos 2 listados al final
    const [startingUsers, setStartingUsers] = useState([])
    const [users, setUsers] = useState([]);

    useEffect(() => {
        if(history.location.state){
            setLoadingStart(true)
            const {auctionId} = history.location.state
            setAuctionId(auctionId)
            //fetchContext.authAxios.get(`${url.USER_AUCTIONS_API}/get-users/${auctionId}`)
            fetchContext.authAxios.get(`https://61895cd6d0821900178d795e.mockapi.io/api/users`)
            .then(res => {
                setUsers(res.data)
                setStartingUsers(res.data)
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
        setUsers([...users, {'username': '', 'name': '', 'lastname': ''}])
    }

    const deleteParticipantHandler = (index) => {
        confirmDialog({
            message: '¿Esta seguro que desea quitar este participante del remate?',
            header: 'Quitar participante',
            icon: 'pi pi-exclamation-circle',
            acceptLabel: 'Aceptar',
            rejectLabel: 'Cancelar',
            accept: () => deleteParticipant(index)
        })
    }

    const deleteParticipant = (index) => {
        const usersCopy = [...users]
        usersCopy.splice(index, 1)
        setUsers(usersCopy)
    }

    const updateParticipant = (value, index) => {
        const usersCopy = [...users]
        usersCopy[index] = value
        setUsers(usersCopy)
    }

    const confirm = () => {
        console.log(users)
    }

    //En este caso a diferencia que en ClienteCRUD con las provenances no puedo usar los id
    //porque aca los que cambio es el mismo objeto (el user), a diferencia del otro caso donde
    //modifico algo que esta dentro del objeto (las localidades) y ese objeto no cambia su id
    //en este caso si va a cambiar, asi que hago todo con el index
    const usersCardList = users.map((user, index) => (
        <AddParticipantCard
            key={index}
            user={user}
            index={index}
            showToast={showToast}
            deleteParticipant={() => deleteParticipantHandler(index)}
            updateParticipant={(value) => updateParticipant(value, index)}
        />
    ))
    //TODO a la card del usuario logueado no deberia dejar que la toque
    //TODO comprobar que no este el mismo usuario elegido 2 veces, o no dejar elegir, no se
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
