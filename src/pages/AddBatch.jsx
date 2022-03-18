import React, {useState, useEffect, useContext} from 'react';
import { useHistory } from "react-router-dom";

import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Skeleton } from 'primereact/skeleton';
import { confirmDialog } from 'primereact/confirmdialog';
import { AutoComplete } from 'primereact/autocomplete';
import { Dropdown } from 'primereact/dropdown';

import { FetchContext } from '../context/FetchContext';

import Card from '../components/cards/Card'
import AnimalsOnGroundCRUDCard from '../components/cards/AnimalsOnGroundCRUDCard'

import * as url from '../util/url';
import EditAnimalOnGroundDialog from '../components/EditAnimalOnGroundDialog';

const AddBatch = ({showToast}) => {

    const fetchContext = useContext(FetchContext)
    const history = useHistory();

    //uso este estado "comodin" para refrescar la pagina cuando hay un cambio
    const [refresh, setRefresh] = useState(false);

    const [loadingAccept, setLoadingAccept] = useState(false)
    const [loadingStart, setLoadingStart] = useState(false)

    const [enableEditing, setEnableEditing] = useState(false)

    //Mostrar el dialogo de agregar o esconderlo
    const [displayDialog, setDisplayDialog] = useState(false);

    //Item que se esta editando o creando (ver el Dialog)
    const [editingItem, setEditingItem] = useState(null);

    //El auctionId sirve solo en el POST de batch, por lo que no se usa en el caso de un editar
    const [auctionId, setAuctionId] = useState(null);

    //Estados del batch
    const [batchId, setBatchId] = useState(null);
    const [seller, setSeller] = useState(null);
    const [provenance, setProvenance] = useState(null);
    const [corralNumber, setCorralNumber] = useState(null);
    const [dteNumber, setDteNumber] = useState(null);

    const [newItemsOnCreateBatchId, setNewItemsOnCreateBatchId] = useState(-100);
    const [animalsOnGroundList, setAnimalsOnGroundList] = useState([]);
    
    //Estados de autocompletes
    const [filteredClientList, setFilteredClientList] = useState([])
    const [provenanceList, setProvenanceList] = useState([])

    useEffect(() => {
        //auctionId debe llegar siempre, si llega animalOnGroundId es que estoy editando
        const {auctionId, animalOnGroundId} = history.location.state
        setAuctionId(auctionId)
        if(animalOnGroundId){
            setLoadingStart(true)
            //Editando
            fetchContext.authAxios.get(`${url.AUCTION_BATCH_API}/by-animals-on-ground/${animalOnGroundId}`)
            .then(response => {
                setBatchId(response.data.id)
                setSeller(response.data.client)
                setProvenanceList(response.data.client.provenances)
                setProvenance(response.data.provenance)
                setCorralNumber(response.data.corralNumber)
                setDteNumber(response.data.dteNumber)
                setAnimalsOnGroundList(response.data.animalsOnGround)
                setLoadingStart(false)
                if(!response.data.client.provenances.some(prov => prov.id === response.data.provenance.id)){
                    showToast('info', 'Importante', 'La procedencia de este lote fue eliminada')
                }
            })
            .catch(error => {
                //Cuando se elimina un AnimalsOnGround al editar el lote se pierde su id, y si era por el que entro al editar
                //y se elimino, entonces se debe refrescar la lista de AnimalsOnGround usando el batchId
                fetchContext.authAxios.get(`${url.AUCTION_BATCH_API}/${batchId}`)
                .then(response => {
                    setAnimalsOnGroundList(response.data.animalsOnGround)
                    setLoadingStart(false)
                })
                .catch(error => {
                    showToast('error', 'Error', error.response.data.errorMsg)
                    history.goBack()
                })
            })
        }else{
            setEnableEditing(true)
        }
    },[refresh])

    //>>>SEARCHS DE LOS AUTOCOMPLETES<<<

    const searchClient = (event) => {
        fetchContext.authAxios.get(`${url.CLIENT_API}?name=${event.query}`)
        .then(response => {
            setFilteredClientList(response.data.content)
        })
        .catch(error => {
            showToast('error','Error','No se pudo obtener la lista de clientes')
        })
    }

    //Este ademas de setear el vendedor tambien setea la lista de procedencias del mismo
    const setClientSeller = (value) => {
        setSeller(value)
        if(value && value.id){
            setProvenanceList(value.provenances)
        }else{
            setProvenanceList([])
        }
    }

    //>>>CRUD DE BATCH<<<

    //Se dispara al tocar el boton guardar
    const createOrUpdateHandler = () => {
        if(!provenance || !corralNumber){
            showToast('warn','Cuidado','Faltan campos por completar')
        }else if(animalsOnGroundList.length === 0){
            showToast('warn','Cuidado','No hay animales en el lote')
        }else{
            confirmDialog({
                message: '¿Está seguro que desea proceder?',
                header: 'Guardar lote',
                icon: 'pi pi-exclamation-circle',
                acceptLabel: 'Sí',
                accept: () => !batchId?createBatchHandler():editBatchHandler()
            });
        }
    }

    //Se dispara cuando se toca el boton guardar, acepta en el dialogo y esta CREANDO un lote
    const createBatchHandler = () => {
        setLoadingAccept(true)
        const body = {
            provenance: provenance,
            corralNumber: corralNumber,
            dteNumber: dteNumber,
            animalsOnGround: animalsOnGroundList.map(item => (
                {...item, 'sold': false, 'notSold': false, 'id': null, 'startingOrder': -1}
            ))
        }
        fetchContext.authAxios.post(`${url.AUCTION_BATCH_API}/${auctionId}`, body)
        .then(response => {
            showToast('success','Éxito','Se creó el lote correctamente')
            history.goBack()
        })
        .catch(error => {
            showToast('error','Error','No se pudo crear el lote')
            setLoadingAccept(false)
        })
    }

    //Se dispara cuando se toca el boton guardar, acepta en el dialogo y esta EDITANDO un lote
    const editBatchHandler = () => {
        setLoadingAccept(true)
        const body = {
            provenance: provenance,
            corralNumber: corralNumber,
            dteNumber: dteNumber
        }
        fetchContext.authAxios.patch(`${url.AUCTION_BATCH_API}/${batchId}`, body)
        .then(response => {
            showToast('success','Éxito','El lote se editó correctamente')
            setLoadingAccept(false)
        })
        .catch(error => {
            showToast('error','Error',error.response.data.errorMsg)
            setLoadingAccept(false)
        })
    }

    const deleteBatchHandler = () => {
        confirmDialog({
            header: 'Confirmación',
            message: `¿Está seguro que desea eliminar estos animales?`,
            acceptLabel: 'Sí',
            className: 'w-9 md:w-6',
            rejectLabel: 'No',
            acceptClassName: 'p-button-danger',
            accept: () => {
                fetchContext.authAxios.delete(`${url.AUCTION_BATCH_API}/${batchId}`)
                .then(response => {
                    showToast('success','Éxito','Se eliminó el lote correctamente')
                    history.goBack()
                })
                .catch(error => {
                    showToast('error','Error',error.response.data.errorMsg)
                })
            }
        })
    }

    //>>>CRUD DE ANIMALS ON GROUND<<<

    //Se dispara al tocar el boton agregar, se abre el dialogo
    const createItemHandler = () => {
        setDisplayDialog(true)
        setEditingItem(null)
    }

    //Se dispara la tocar el boton editar, abre el dialogo y setea editingItem al que corresponde
    const editItemHandler = (id) => {
        setDisplayDialog(true)
        setEditingItem(animalsOnGroundList.find(item => item.id === id))
    }

    //Se dispara al tocar el boton aceptar en el dialogo
    const saveItemHandler = () => {
        if(editingItem && editingItem.amount && editingItem.category){
            //Si tiene id es que estoy haciendo una edicion, caso contrario, estoy creando uno nuevo
            //Si hay batchId lo mando a guardar, sino lo agrego a la lista y despues mando del batch nuevo completo
            if(editingItem.id && batchId){
                const data = editingItem
                fetchContext.authAxios.patch(`${url.ANIMALS_ON_GROUND_API}/${editingItem.id}`, data)
                .then(response => {
                    showToast('success', 'Éxito', `Animales guardados`)
                    setRefresh(!refresh)
                    setDisplayDialog(false)
                    setEditingItem(null)
                })
                .catch(error => {
                    showToast('error', 'Error', error.response.data.errorMsg)
                })
            }else if(!editingItem.id && batchId){
                const data = {...editingItem, 'sold': false, 'notSold': false, 'id': null, 'startingOrder': -1}
                fetchContext.authAxios.post(`${url.AUCTION_BATCH_API}/${batchId}/animals-on-ground`, data)
                .then(response => {
                    showToast('success', 'Éxito', `Animales guardados`)
                    setRefresh(!refresh)
                    setDisplayDialog(false)
                    setEditingItem(null)
                })
                .catch(error => {
                    showToast('error', 'Error', error.response.data.errorMsg)
                })
            }else if(editingItem.id && !batchId){
                const modifiedItemIndex = animalsOnGroundList.findIndex(item => item.id === editingItem.id)
                const modifiedItem = {...animalsOnGroundList[modifiedItemIndex], ...editingItem}
                const modifiedList = [...animalsOnGroundList]
                modifiedList[modifiedItemIndex] = modifiedItem
                setAnimalsOnGroundList(modifiedList)
                setDisplayDialog(false)
                setEditingItem(null)
            }else{//!editingItem.id && !batchId
                const newItem = {...editingItem, 'id': newItemsOnCreateBatchId}
                setNewItemsOnCreateBatchId(newItemsOnCreateBatchId - 1)
                setAnimalsOnGroundList([...animalsOnGroundList, newItem])
                setDisplayDialog(false)
                setEditingItem(null)
            }
        }else{
            showToast('warn', 'Cuidado', 'Existen campos esta vacíos')
        }
    }

    //Se dispara al tocar el boton eliminar, abre un dialogo de confirmacion
    const deleteItemHandler = (animalsOnGroundId) => {
        confirmDialog({
            header: 'Confirmación',
            message: `¿Está seguro que desea eliminar estos animales?`,
            acceptLabel: 'Sí',
            className: 'w-9 md:w-6',
            rejectLabel: 'No',
            acceptClassName: 'p-button-danger',
            accept: () => {
                if(batchId && animalsOnGroundId>=0){
                    fetchContext.authAxios.delete(`${url.ANIMALS_ON_GROUND_API}/${animalsOnGroundId}`)
                    .then(response => {
                        showToast('success', 'Éxito', `Los animales fueron eliminados`)
                        setRefresh(!refresh)
                    })
                    .catch(error => {
                        showToast('error', 'Error', error.response.data.errorMsg)
                    })
                }else{
                    //(batchId && animalsOnGroundId<0) no se puede dar, porque ni bien creo un animalsOnGround se guarda en el back si hay batchId
                    //Si no hay batchId es que estoy creando el batch, asi que simplemente lo elimino de la lista
                    const modifiedList = animalsOnGroundList.filter(item => item.id !== animalsOnGroundId)
                    setAnimalsOnGroundList(modifiedList)
                    showToast('success', 'Éxito', `Los animales fueron eliminados`)
                    setRefresh(!refresh)
                }
            }
        });
    }
    
    const editDialog = (
        <EditAnimalOnGroundDialog
            acceptHandler={saveItemHandler}
            setDisplayDialog={setDisplayDialog}
            displayDialog={displayDialog}
            url={url}
            fetchContext={fetchContext}
            showToast = {showToast}
            editingItem={editingItem}
            setEditingItem={setEditingItem}
        />
    )

    const cardFormBatch = (
        //En pantalla grande muestro el boton de editar a la derecha del titulo (primer caso)
        //En pantalla pequeña muestro el boton de editar abajo del titulo (segundo caso)
        <Card
            title={
                <div>
                <div className="flex justify-content-between">
                    <>{batchId?'Información del lote':'Nuevo lote'}</>
                    {batchId?
                        <Button 
                            className="btn btn-primary big-screen" 
                            icon="pi pi-pencil" 
                            onClick={()=> setEnableEditing(!enableEditing)} 
                            label={enableEditing?"Dejar de editar":"Editar"}
                        />
                        :
                        null
                    }
                </div>
                    {batchId?
                        <Button 
                            className="btn btn-primary mt-2 small-screen" 
                            icon="pi pi-pencil" 
                            onClick={()=> setEnableEditing(!enableEditing)} 
                            label={enableEditing?"Dejar de editar":"Editar"}
                        />
                        :
                        null
                    }
                </div>
            }
            footer={
                //Si estoy editando pongo los botones aca, sino al final de la otra card
                batchId?
                <div className="flex justify-content-between">
                    <Button label="Volver" icon="pi pi-arrow-left" onClick={() => history.goBack()} className="btn btn-primary" />
                    <Button label="Guardar" icon="pi pi-check" loading={loadingAccept} onClick={() => createOrUpdateHandler()} className="btn btn-primary" />
                </div>
                :
                null
            }
        >
            <span className="p-float-label p-fluid">
                <AutoComplete 
                    id='sellerAutocompleteForm'
                    className='w-full'
                    value={seller} 
                    suggestions={filteredClientList} 
                    completeMethod={searchClient} 
                    field="name" 
                    //dropdown 
                    forceSelection 
                    disabled={!enableEditing}
                    onChange={(e) => setClientSeller(e.target.value)}
                />
                <label htmlFor="sellerAutocompleteForm">Vendedor</label>
            </span>
            <br/>
            <span className="p-float-label">
                <Dropdown 
                    id='provenanceAutocompleteForm'
                    className='w-full'
                    value={provenance} 
                    options={provenanceList}
                    optionLabel="reference"
                    emptyMessage="Primero seleccione un vendedor"
                    disabled={!enableEditing}
                    onChange={(e) => setProvenance(e.target.value)}
                />
                <label htmlFor="provenanceAutocompleteForm">Procedencia</label>
            </span>
            <br/>
            <span className="p-float-label">
                <InputText 
                    id="corralNumber" 
                    className='w-full'
                    keyfilter="int" 
                    value={corralNumber?corralNumber:''} 
                    disabled={!enableEditing}
                    onChange={e => setCorralNumber(e.target.value)}
                />
                <label htmlFor="corralNumber">Número de corral</label>
            </span>
            <br/>
            <span className="p-float-label">
                <InputText 
                    id="dte" 
                    className='w-full'
                    value={dteNumber?dteNumber:''} 
                    disabled={!enableEditing}
                    onChange={e => setDteNumber(e.target.value)}
                />
                <label htmlFor="dte">Número de DT-e (opcional)</label>
            </span>
        </Card>
    )

    const animalsOnGroundCardList = animalsOnGroundList.map(animal => (
        <AnimalsOnGroundCRUDCard
            key={animal.id}
            id={animal.id}
            category={animal.category}
            amount={animal.amount}
            enableEditing={enableEditing}
            editItemHandler={editItemHandler}
            deleteItemHandler={deleteItemHandler}
        />
    ))

    const cardFormAnimalsOnGround = (
        <Card
            title={
                <div className="flex justify-content-between">
                    <>{'Animales'}</>
                    {enableEditing?
                    <Button 
                        className="btn btn-primary" 
                        icon="pi pi-plus" 
                        onClick={()=> createItemHandler()} 
                        label="Agregar"
                    />
                    :
                    null}
                </div>
            }
            footer={
                //Si estoy creando pongo los botones aca, sino al final de la primera card y aca el boton de eliminar batch
                batchId?
                <div className="flex justify-content-between">
                    <Button label="Volver" icon="pi pi-arrow-left" onClick={() => history.goBack()} className="btn btn-primary" />
                    <Button label="Eliminar Lote" icon="pi pi-times" onClick={() => deleteBatchHandler()} className="p-button-danger" />
                </div>
                :
                <div className="flex justify-content-between">
                    <Button label="Cancelar" icon="pi pi-times" onClick={() => history.goBack()} className="p-button-danger" />
                    <Button label="Guardar" icon="pi pi-check" loading={loadingAccept} onClick={() => createOrUpdateHandler()} className="btn btn-primary" />
                </div>
            }
        >
            {animalsOnGroundList.length>0?
            animalsOnGroundCardList
            :
            <div className="text-2xl flex justify-content-center">Aún no hay animales agregados a este lote</div>}
        </Card>
    )

    const loadingScreen = (
        <div>
            <Skeleton width="100%" height="30rem"/>
            <br/>
            <Skeleton width="100%" height="30rem"/>
        </div>
    )
    
    return (
        <>  
            {editDialog}
            {loadingStart?
                loadingScreen
            :
            <div>
                {cardFormBatch}
                {cardFormAnimalsOnGround}
            </div>
            }
        </>
    )
}

export default AddBatch
