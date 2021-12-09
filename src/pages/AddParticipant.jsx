import React, {useState, useEffect, useContext} from 'react';
import { useHistory } from "react-router-dom";
import * as url from '../util/url';

import { Button } from 'primereact/button';
import { Skeleton } from 'primereact/skeleton';
import { confirmDialog } from 'primereact/confirmdialog';
import { Dialog } from 'primereact/dialog';
import { ScrollTop } from 'primereact/scrolltop';
import { AutoComplete } from 'primereact/autocomplete';

import { FetchContext } from '../context/FetchContext';

import Card from '../components/cards/Card';
import SimpleNameCard from '../components/cards/SimpleNameCard'

const AddParticipant = ({showToast, ...props}) => {

    const fetchContext = useContext(FetchContext)
    const history = useHistory();

    const [loadingStart, setLoadingStart] = useState(false)
    
    //uso este estado "comodin" para refrescar la pagina cuando hay un cambio
    const [refresh, setRefresh] = useState(false);

    //Mostrar el dialogo de confirmacion o esconderlo
    const [displayDialog, setDisplayDialog] = useState(false);

    const [auctionId, setAuctionId] = useState(null);
    const [userList, setUserList] = useState([]);

    const [selectedUserItem, setSelectedUserItem] = useState(null);

    //Para el autocomplete
    const [filteredUserList, setFilteredUserList] = useState([])

    useEffect(() => {
        if(history.location.state){
            setAuctionId(history.location.state.auctionId)
            setLoadingStart(true)
            fetchContext.authAxios.get(`${url.USER_AUCTIONS_API}/users/${auctionId}`)
            //TODO sacar este
            //fetchContext.authAxios.get(`https://61895cd6d0821900178d795e.mockapi.io/api/users`)
            .then(response => {
                setUserList(response.data)
                setLoadingStart(false)
            })
            .catch(error => {
                showToast('error', 'Error', 'No se pudo conectar al servidor')
                history.push(url.HOME);
            })
        }else{
            showToast('error', 'Error', 'No se pudo conectar al servidor')
            history.push(url.HOME);
        }
    }, [refresh, fetchContext.authAxios, history])

    //Agrego un label a cada user para que muestre nombre y apellido en el autocomplete
    const setUserListWithLabel = data => {
        const dataCopy = data.map(item => (
            {
                ...item,
                'label': `${item.lastname} ${item.name}`
            }
        ))
        setFilteredUserList(dataCopy)
    }

    //Busqueda de usuarios por nombre o apellido para el autocomplete
    const searchUser = (event) => {
        fetchContext.authAxios.get(`${url.USER_API}?name=${event.query}`)
        //TODO es para pruebas este, sacar despues
        //fetchContext.authAxios.get(`${url.USER_API}/user-list`)
        .then(response => {
            setUserListWithLabel(response.data.content)
        })
        .catch(error => {
            props.showToast('error','Error','No se pudo obtener la lista de usuarios')
        })
    }

    //Se dispara al tocar el boton agregar, se abre el dialogo de creacion
    const createItemHandler = () => {
        setDisplayDialog(true)
        setSelectedUserItem(null)
    }

    //Se dispara al tocar el boton aceptar en el dialogo
    const saveItemHandler = () => {
        if(selectedUserItem){
            fetchContext.authAxios.post(`${url.USER_AUCTIONS_API}/${auctionId}/adduser/${selectedUserItem.id}`)
            .then(response => {
                showToast('success', 'Exito', `Participante agregado`)
                setRefresh(!refresh)
                setDisplayDialog(false)
                setSelectedUserItem(null)
            })
            .catch(error => {
                showToast('error', 'Error', `No se pudo agregar el participante`)
            })
        }else{
            showToast('warn', 'Error', `Ingrese un participante`)
        }
    }

    //Se dispara al tocar el boton eliminar, abre un dialogo de confirmacion
    const deleteHandler = (id) => {
        confirmDialog({
            header: 'Confirmación',
            message: `¿Está seguro que desea quitar el participante?`,
            acceptLabel: 'Si',
            className: 'w-9 md:w-6',
            rejectLabel: 'No',
            acceptClassName: 'p-button-danger',
            accept: () => {
                fetchContext.authAxios.delete(`${url.USER_AUCTIONS_API}/${auctionId}/deleteuser/${id}`)
                .then(response => {
                    showToast('success', 'Éxito', `El participante ha sido quitado`)
                    setRefresh(!refresh)
                })
                .catch(error => {
                    showToast('error', 'Error', `No se pudo quitar al participante`)
                })
            }
        });
    }

    //Listado de los items a mostrar en pantalla
    const usersCardList = userList.map((item) => (
        <SimpleNameCard
            key={item.id}
            id={item.id}
            name={item.name}
            deleteHandler={deleteHandler}
        />
    ))

    const createDialog = (
        <Dialog
            header={`Agregar participante`}
            visible={displayDialog}
            className="w-11 md:w-6"
            onHide={() => setDisplayDialog(false)}
            footer={
                <div className="">
                    <Button label="Cancelar" icon="pi pi-times" onClick={() => setDisplayDialog(false)} className="p-button-danger" />
                    <Button label="Guardar" icon="pi pi-check" onClick={() => saveItemHandler()} autoFocus className="btn btn-primary" />
                </div>
            }
            >
                <br/>
                <span className="p-float-label">
                    <AutoComplete 
                        id='userAutocompleteForm'
                        className='w-full'
                        value={selectedUserItem}
                        suggestions={filteredUserList} 
                        completeMethod={searchUser} 
                        field="label"
                        dropdown 
                        forceSelection
                        onChange={e => setSelectedUserItem(e.target.value)}
                    />
                    <label htmlFor="userAutocompleteForm">Nombre del participante</label>
                </span>
        </Dialog>
    )

    const loadingScreen = (
        <div>
            <Skeleton width="100%" height="8rem"/>
            <br/>
            <Skeleton width="100%" height="8rem"/>
            <br/>
            <Skeleton width="100%" height="8rem"/>
            <br/>
            <Skeleton width="100%" height="8rem"/>
        </div>
    )

    return (
        <>  
            <ScrollTop />
            {createDialog}
            <Card
                title={
                    <div className="flex justify-content-between">
                    <>Participantes</>
                    <Button 
                        className="btn btn-primary" 
                        icon="pi pi-plus" 
                        onClick={()=> createItemHandler()} 
                        label={`Agregar`}/>
                    </div>
                }
            >
                {loadingStart?
                    loadingScreen
                    :
                    usersCardList
                }
            </Card>     
        </>
    )
}

export default AddParticipant