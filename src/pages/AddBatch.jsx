import React, {useState, useEffect, useContext} from 'react';
import { useHistory } from "react-router-dom";

import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Skeleton } from 'primereact/skeleton';
import { confirmDialog } from 'primereact/confirmdialog';
import { AutoComplete } from 'primereact/autocomplete';
import { Dialog } from 'primereact/dialog';
import { ScrollTop } from 'primereact/scrolltop';
import { Dropdown } from 'primereact/dropdown';

import { FetchContext } from '../context/FetchContext';

import Card from '../components/cards/Card'

import * as url from '../util/url';
import * as miscFunctions from '../util/miscFunctions';

const AddBatch = ({showToast, ...props}) => {

    const fetchContext = useContext(FetchContext)
    const history = useHistory();

    const [loadingStart, setLoadingStart] = useState(false)

    const [enableEditing, setEnableEditing] = useState(false)

    //Mostrar el dialogo de agregar o esconderlo
    const [displayDialog, setDisplayDialog] = useState(false);

    //Item que se esta editando o creando (ver el Dialog)
    const [editingItem, setEditingItem] = useState(null);

    //Estados del batch
    const [batchId, setBatchId] = useState(null);
    const [seller, setSeller] = useState(null);
    const [provenance, setProvenance] = useState(null);
    const [corralNumber, setCorralNumber] = useState(null);
    const [dteNumber, setDteNumber] = useState(null);

    const [animalsOnGroundList, setAnimalsOnGroundList] = useState([]);
    
    //Estados de autocompletes
    const [filteredCategoryList, setFilteredCategoryList] = useState([])
    const [filteredClientList, setFilteredClientList] = useState([])
    const [provenanceList, setProvenanceList] = useState([])

    useEffect(() => {
        setLoadingStart(true)
        //auctionId debe llegar siempre, si llega animalOnGroundId es que estoy editando
        const {auctionId, animalOnGroundId} = history.location.state
        if(animalOnGroundId){
            fetchContext.authAxios.get(`${url.AUCTION_BATCH_API}/by-animals-on-ground/${animalOnGroundId}`)
            .then(response => {
                setBatchId(response.data.id)
                setSeller(response.data.client)
                setProvenance(response.data.provenance)
                setCorralNumber(response.data.corralNumber)
                setDteNumber(response.data.dteNumber)
                setAnimalsOnGroundList(response.data.animalsOnGround)
                setLoadingStart(false)
            })
            .catch(error => {
                showToast('error', 'Error', 'No se pudo conectar al servidor')
                history.goBack()
            })
        }
    },[])

    //Searchs de los autocompletes
    const searchCategory = (event) => {
        fetchContext.authAxios.get(`${url.CATEGORY_API}?name=${event.query}`)
        .then(response => {
            setFilteredCategoryList(response.data.content)
        })
        .catch(error => {
            showToast('error','Error','No se pudo obtener la lista de categorias')
        })
    }

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

    //Se dispara cuando se toca el boton guardar cuando se esta CREANDO un lote
    const saveNewBatchHandler = () => {
        //TODO
    }

    //Se dispara cuando se toca el boton guardar cuando se esta EDITANDO un lote
    const saveEditBatchHandler = () => {
        //TODO
    }

    //Se dispara al tocar el boton agregar, se abre el dialogo
    const createItemHandler = () => {
        setDisplayDialog(true)
        setEditingItem(null)
    }

    //Se dispara la tocar el boton editar, abre el dialogo y setea editingItem al que corresponde
    const editHandler = (id) => {
        setDisplayDialog(true)
        setEditingItem(animalsOnGroundList.find(item => item.id === id))
    }

    //Se dispara al tocar el boton aceptar en el dialogo
    const saveItemHandler = () => {
        if(editingItem && editingItem.amount && editingItem.category){
        //Si tiene id es que estoy haciendo una edicion, caso contrario, estoy creando uno nuevo
        if(editingItem.id){
            fetchContext.authAxios.patch(`${url.ANIMALS_ON_GROUND_API}/${editingItem.id}`, editingItem)
            .then(response => {
                showToast('success', 'Exito', `Aminales guardados`)
                setDisplayDialog(false)
                setEditingItem(null)
            })
            .catch(error => {
                showToast('error', 'Error', `No se pudieron guardar los animales`)
            })
        }else{
            fetchContext.authAxios.post(`${url.AUCTION_BATCH_API}/${batchId}/animals-on-ground`, editingItem)
            .then(response => {
                showToast('success', 'Exito', `Animales guardados`)
                setDisplayDialog(false)
                setEditingItem(null)
            })
            .catch(error => {
                showToast('error', 'Error', `No se pudieron guardar los animales`)
            })
        }
        }else{
            showToast('warn', 'Cuidado', 'Algun campo esta vacio')
        }
    }

    //Se dispara al tocar el boton eliminar, abre un dialogo de confirmacion
    const deleteHandler = (animalsOnGroundId) => {
        confirmDialog({
            header: 'Confirmación',
            message: `¿Está seguro que desea eliminar estos animales?`,
            acceptLabel: 'Si',
            className: 'w-9 md:w-6',
            rejectLabel: 'No',
            acceptClassName: 'p-button-danger',
            accept: () => {
                fetchContext.authAxios.delete(`${url.ANIMALS_ON_GROUND_API}/${animalsOnGroundId}`)
                .then(response => {
                    showToast('success', 'Éxito', `Los animales fueron eliminados`)
                })
                .catch(error => {
                    showToast('error', 'Error', `No se pudieron eliminar los animales`)
                })
            }
        });
    }

    const editDialog = (
        <Dialog
            header={editingItem?`Editar animales`:`Agregar animales`}
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
                        id='categoryAutocompleteForm'
                        className='w-full'
                        value={editingItem?editingItem.category:null} 
                        suggestions={filteredCategoryList} 
                        completeMethod={searchCategory} 
                        field="name" 
                        dropdown 
                        forceSelection 
                        onChange={(e) => setEditingItem({...editingItem, category:e.target.value})}
                    />
                    <label htmlFor="categoryAutocompleteForm">Categoria</label>
                </span>
                <br/>
                <span className="p-float-label">
                    <InputText 
                        id="amount" 
                        className='w-full'
                        keyfilter="int" 
                        value={editingItem?editingItem.amount:''} 
                        onChange={e => setEditingItem({...editingItem, amount:e.target.value})}
                    />
                    <label htmlFor="amount">Cantidad</label>
                </span>
        </Dialog>
    )

    const cardFormBatch = (
        //En pantalla grande muestro el boton de editar a la derecha del titulo (primer caso)
        //En pantalla pequeña muestro el boton de editar abajo del titulo (segundo caso)
        <Card
            title={
                <div>
                <div className="flex justify-content-between">
                    <>{batchId?'Informacion del lote':'Nuevo lote'}</>
                    {batchId && !miscFunctions.isSmallScreen()?
                        <Button 
                            className="btn btn-primary" 
                            icon="pi pi-pencil" 
                            onClick={()=> setEnableEditing(!enableEditing)} 
                            label={enableEditing?"Dejar de editar":"Editar"}
                        />
                        :
                        null
                    }
                </div>
                    {batchId && miscFunctions.isSmallScreen()?
                        <Button 
                            className="btn btn-primary mt-2" 
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
                <div className="">
                    <Button label="Cancelar" icon="pi pi-times" onClick={() => history.goBack()} className="p-button-danger" />
                    <Button label="Guardar" icon="pi pi-check" onClick={() => saveEditBatchHandler()} className="btn btn-primary" />
                </div>
                :
                null
            }
        >
            <span className="p-float-label">
                <AutoComplete 
                    id='sellerAutocompleteForm'
                    className='w-full'
                    value={seller} 
                    suggestions={filteredClientList} 
                    completeMethod={searchClient} 
                    field="name" 
                    dropdown 
                    forceSelection 
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
                    value={corralNumber} 
                    onChange={e => setCorralNumber(e.target.value)}
                />
                <label htmlFor="corralNumber">Numero de corral</label>
            </span>
            <br/>
            <span className="p-float-label">
                <InputText 
                    id="dte" 
                    className='w-full'
                    value={dteNumber} 
                    onChange={e => setDteNumber(e.target.value)}
                />
                <label htmlFor="dte">Numero de DT-e (opcional)</label>
            </span>
        </Card>
    )

    const cardFormAnimalsOnGround = (
        <Card
            title={
                //En pantalla grande muestro el boton de agregar a la derecha del titulo (primer caso)
                //En pantalla pequeña muestro el boton de agregar abajo del titulo (segundo caso)
                <div>
                <div className="flex justify-content-between">
                    <>{'Animales'}</>
                    {!miscFunctions.isSmallScreen()?
                        <Button 
                            className="btn btn-primary" 
                            icon="pi pi-plus" 
                            onClick={()=> createItemHandler()} 
                            label="Agregar"
                        />
                        :
                        null
                    }
                </div>
                    {miscFunctions.isSmallScreen()?
                        <Button 
                            className="btn btn-primary mt-2" 
                            icon="pi pi-plus" 
                            onClick={()=> createItemHandler()} 
                            label="Agregar"
                        />
                        :
                        null
                    }
                </div>
            }
            footer={
                //Si estoy creando pongo los botones aca, sino al final de la primera card
                batchId?
                null
                :
                <div className="">
                    <Button label="Cancelar" icon="pi pi-times" onClick={() => history.goBack()} className="p-button-danger" />
                    <Button label="Guardar" icon="pi pi-check" onClick={() => saveNewBatchHandler()} className="btn btn-primary" />
                </div>
            }
        >

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
            <ScrollTop />
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
