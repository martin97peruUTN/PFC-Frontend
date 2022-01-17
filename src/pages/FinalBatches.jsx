import React, {useState, useEffect, useRef, useContext} from 'react';
import { useHistory } from "react-router-dom";

import { Button } from 'primereact/button';
import { Paginator } from 'primereact/paginator';
import { Skeleton } from 'primereact/skeleton';
import { ScrollTop } from 'primereact/scrolltop';
import { Menu } from 'primereact/menu';
import { TabView, TabPanel } from 'primereact/tabview';
import { confirmDialog } from 'primereact/confirmdialog';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';

import { FetchContext } from '../context/FetchContext';
import { AuthContext } from './../context/AuthContext';
import * as url from '../util/url';
import { isSmallScreen } from '../util/miscFunctions'

import Card from '../components/cards/Card'
import FinalBatchCard from '../components/cards/FinalBatchCard';
import SellDialog from '../components/SellDialog'

const FinalBatches = ({showToast}) => {

    const fetchContext = useContext(FetchContext)
    const authContext = useContext(AuthContext);
    const history = useHistory();

    const menu = useRef(null);

    const [loadingStart, setLoadingStart] = useState(false)

    //Paginator states
    const [paginatorFirst, setPaginatorFirst] = useState(0);
    const [paginatorRows, setPaginatorRows] = useState(10);
    const [paginatorPage, setPaginatorPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    //uso este estado "comodin" para refrescar la pagina cuando hay un cambio
    const [refresh, setRefresh] = useState(false);

    //Mostrar el dialogo de editar o esconderlo
    const [displayEditDialog, setDisplayEditDialog] = useState(false);

    //Mostrar el dialogo de pesar o esconderlo
    const [displayWeighDialog, setDisplayWeighDialog] = useState(false);

    const [auctionId, setAuctionId] = useState()
    const [auctionIsFinished, setAuctionIsFinished] = useState()

    //0:Vendidos 1:No vendidos
    const [tabViewActiveIndex, setTabViewActiveIndex] = useState(0);

    //Listado de soldBatches o notSoldBatches segun la pestaña activa
    const [batchList, setBatchList] = useState([])

    //Item de la lista que estoy queriendo editar/pesar/cargar DTe
    const [editingItem, setEditingItem] = useState();

    useEffect(() => {
        setLoadingStart(true)
        if(!history.location.state){
            showToast('error', 'Error', 'No se encontro el remate')
            history.goBack();
        }else{
            const {auctionId} = history.location.state
            setAuctionId(auctionId)
            let fetchURL = `${url.SOLD_BATCH_API}/by-auction/${auctionId}/${tabViewActiveIndex===0?'sold':'not-sold'}?limit=${paginatorRows}&page=${paginatorPage}`
            const p1 = fetchContext.authAxios.get(url.AUCTION_API+'/'+auctionId)
            const p2 = fetchContext.authAxios.get(fetchURL)
            Promise.all([p1, p2]).then(values => {
                const auction = values[0].data
                const batches = values[1].data
                setAuctionIsFinished(auction.finished)
                setBatchList(batches.content)
                setTotalPages(batches.totalPages)
                setLoadingStart(false)
            })
            .catch(error => {
                showToast('error', 'Error', 'No se pudo obtener los lotes')
                history.goBack();
            })
        }
    },[tabViewActiveIndex, paginatorFirst, paginatorRows, paginatorPage, refresh])

    const onPaginatorPageChange = (event) => {
        setPaginatorFirst(event.first);
        setPaginatorRows(event.rows);
        setPaginatorPage(event.page);
    }

    //Se dispara al tocar algun boton pesar
    const weighHandler = (batchId) => {
        setDisplayWeighDialog(true)
        setEditingItem(batchList.find(batch => batch.id === batchId))
    }

    const saveWeighHandler = () => {
        if(!editingItem.weight){
            showToast('error', 'Error', 'Debe ingresar un peso')
        }else if(editingItem.weight<=0){
            showToast('error', 'Error', 'El peso debe ser mayor a 0')
        }else{
            fetchContext.authAxios.patch(`${url.SOLD_BATCH_API}/${editingItem.id}`, 
            {
                weight: editingItem.weight
            })
            .then(response => {
                showToast('success','Exito','Se guardo el peso correctamente')
                setDisplayWeighDialog(false)
                setEditingItem(null)
                setRefresh(!refresh)
            })
            .catch(error => {
                //TODO poner el mensaje del back
                showToast('error','Error','No se pudo guardar el peso')
            })
        }
    }

    //Se dispara al tocar algun boton cargar DTe
    const dteNumberSetHandler = (batchId) => {
        //TODO proximamente un nuevo dialogo
    }

    //Se dispara al tocar algun boton boleta
    const getBillHandler = (batchId) => {
        //TODO proximamente
    }

    //Se dispara al tocar algun boton editar
    const editHandler = (batchId) => {
        if(!auctionIsFinished){
            setDisplayEditDialog(true)
            setEditingItem(batchList.find(batch => batch.id === batchId))
        }
    }

    //Se dispara al tocar el boton aceptar del dialogo de editar
    const saveEditedItemHandler = () => {
        if(editingItem.id && editingItem.buyer && editingItem.price && editingItem.amount && editingItem.mustWeigh!==null){
            if(editingItem.amount<=0){
                showToast('warn', 'Error', 'La cantidad debe ser mayor a 0')
            }else if(editingItem.price<=0){
                showToast('warn', 'Error', 'El precio debe ser mayor a 0')
            }else{
                const data = {
                    'client': editingItem.buyer,
                    'price': editingItem.price,
                    'amount': editingItem.amount,
                    'mustWeigh': editingItem.mustWeigh
                }
                fetchContext.authAxios.patch(`${url.SOLD_BATCH_API}/${editingItem.id}`, data)
                .then(response => {
                    showToast('success','Exito','Se guardaron los cambios correctamente')
                    setDisplayEditDialog(false)
                    setEditingItem(null)
                    setRefresh(!refresh)
                })
                .catch(error => {
                    //TODO poner el mensaje del back, aca me va a decir tambien si la cantidad es mayor a la cantidad disponible
                    showToast('error','Error','No se pudieron guardar los cambios')
                })
            }
        }else{
            showToast('warn','Error','Debe completar todos los campos')
        }
    }

    //Se dispara al tocar algun boton eliminar
    const deleteHandler = (batchId) => {
        confirmDialog({
            header: 'Confirmación',
            message: `¿Está seguro que desea eliminar el lote?`,
            acceptLabel: 'Si',
            className: 'w-9 md:w-6',
            rejectLabel: 'No',
            acceptClassName: 'p-button-danger',
            accept: () => {
                fetchContext.authAxios.delete(`${url.SOLD_BATCH_API}/${batchId}`)
                .then(response => {
                    showToast('success', 'Éxito', `El lote ha sido eliminado`)
                    setRefresh(!refresh)
                })
                .catch(error => {
                    showToast('error', 'Error', `No se pudo eliminar el lote`)
                })
            }
        });
    }

    //Se dispara al presionar Terminar remate
    const confirmFinishAuction = () => {
        confirmDialog({
            message: `¿Está seguro de terminar el remate? Si lo termina, se generarán lotes para los 
                animales que no fueron vendidos y ya no podrá realizar mas cambios, salvo cargar los DTe 
                y generar las boletas y resúmenes.`,
            header: 'Terminar remate',
            icon: 'pi pi-exclamation-circle',
            className: 'w-11 md:w-7',
            acceptLabel: 'Si',
            accept: () => {
                fetchContext.authAxios.post(`${url.AUCTION_API}/finish/${auctionId}`)
                .then(response => {
                    showToast('success', 'Exito', 'Remate finalizado')
                    setRefresh(!refresh)
                })
                .catch(error => {
                    showToast('error', 'Error', 'No se pudo finalizar el remate')
                })
            }
        });
    }

    //Se dispara al presionar Reanudar remate
    const confirmResumeAuction = () => {
        confirmDialog({
            message: `¿Está seguro de reanudar el remate? Si lo hace no podra acceder a los lotes 
                de animales no vendidos hasta que vuelva a finalizarlo.`,
            header: 'Reanudar remate',
            icon: 'pi pi-exclamation-circle',
            className: 'w-11 md:w-7',
            acceptLabel: 'Si',
            accept: () => {
                fetchContext.authAxios.post(`${url.AUCTION_API}/resume/${auctionId}`)
                .then(response => {
                    showToast('success', 'Exito', 'Se reanudó el remate')
                    setTabViewActiveIndex(0)
                    setRefresh(!refresh)
                })
                .catch(error => {
                    showToast('error', 'Error', 'No se pudo reanudar el remate')
                })
            }
        });
    }

    const itemCardList = batchList.map(batch => (
        <FinalBatchCard
            id={batch.id}
            key={batch.id}
            buyer={batch.buyer?batch.buyer.name:null}
            seller={batch.seller.name}
            amount={batch.amount}
            category={batch.category.name}
            mustWeigh={batch.mustWeigh}
            weight={batch.weight}
            price={batch.price}
            dteNumber={batch.dteNumber}
            tabViewActiveIndex={tabViewActiveIndex}
            auctionIsFinished={auctionIsFinished}
            weighHandler={weighHandler}
            dteNumberSetHandler={dteNumberSetHandler}
            getBillHandler={getBillHandler}
            editHandler={editHandler}
            deleteHandler={deleteHandler}
        />
    ))

    const topButtons = (
        <div>
            <Button 
                icon="pi pi-arrow-left"
                label="Lotes de venta"
                className="btn btn-primary mr-3"
                onClick={() => history.push(url.AUCTION, {auctionId: auctionId})}
            />
            <Button 
                icon="pi pi-file"
                label="Resumen"
                className="btn btn-primary mr-3"
                //TODO onClick={} proximamente
            />
            {(authContext.isAdmin() || authContext.isConsignee()) && !auctionIsFinished?
                <Button 
                    icon="pi pi-check-square"
                    label="Terminar remate"
                    className="p-button-danger"
                    onClick={() => confirmFinishAuction()}
                />
            :
                null
            }
            {(authContext.isAdmin() || authContext.isConsignee()) && auctionIsFinished?
                <Button 
                    icon="pi pi-replay"
                    label="Reanudar remate"
                    className="btn btn-primary"
                    onClick={() => confirmResumeAuction()}
                />
            :
                null
            }
        </div>
    )

    const menuItems = [
        {
            icon: "pi pi-arrow-left",
            label: "Lotes de venta",
            command: () => history.push(url.AUCTION, {auctionId: auctionId}),
        },
        {
            icon: "pi pi-file",
            label: "Resumen",
            //TODO command: () => {} proximamente
        }
    ]
    if((authContext.isAdmin() || authContext.isConsignee()) && !auctionIsFinished){
        menuItems.push(
            {separator: true},
            {separator: true},
            {
                label: 'Terminar remate',
                icon: 'pi pi-fw pi-check-square',
                command: () => confirmFinishAuction()
            }
        )
    }
    

    //0:Vendidos 1:No vendidos
    const tabView = (
        <TabView className='w-full' 
            activeIndex={tabViewActiveIndex} 
            onTabChange={(e) => setTabViewActiveIndex(e.index)}
        >
            <TabPanel header="Vendidos">
                {itemCardList}
            </TabPanel>
            <TabPanel header="No vendidos">
                {itemCardList}
            </TabPanel>
        </TabView>
    )

    const sellDialog = (
        <SellDialog
            isCreating={false}
            acceptHandler = {saveEditedItemHandler}
            setDisplayDialog = {setDisplayEditDialog}
            displayDialog = {displayEditDialog}
            url = {url}
            fetchContext = {fetchContext}
            showToast = {showToast}
            editingItem = {editingItem}
            setEditingItem = {setEditingItem}
        />
    )

    const weighDialog = (
        <Dialog
            header="Pesar lote"
            visible={displayWeighDialog}
            className="w-11 md:w-6"
            onHide={() => setDisplayWeighDialog(false)}
            footer={
                <div className="">
                    <Button label="Cancelar" icon="pi pi-times" onClick={() => setDisplayWeighDialog(false)} className="p-button-danger" />
                    <Button label="Aceptar" icon="pi pi-check" onClick={() => saveWeighHandler()} autoFocus className="btn btn-primary" />
                </div>
            }
        >
            <br/>
            <div className="p-inputgroup">
                <span className="p-float-label">
                    <InputText 
                        id="weight" 
                        className='w-full' 
                        value={editingItem?editingItem.weight:null}
                        keyfilter="num"
                        onChange={e => setEditingItem({...editingItem, weight:e.target.value})}
                    />
                    <label htmlFor="weight">Peso</label>
                </span>
                <span className="p-inputgroup-addon">Kg</span>
            </div>
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
            {sellDialog}
            {weighDialog}
            <Menu 
                className='w-auto' 
                model={menuItems} 
                popup 
                ref={menu} 
                id="popup_menu"
            />
            <Card
                title={
                    <div className="flex justify-content-between">
                        <>{auctionIsFinished?"Lotes finales":"Lotes vendidos"}</>
                        {!isSmallScreen()?//Pantalla grande: botones a la derecha del titulo
                            topButtons
                        ://Pantalla chica: menu desplegable
                            <Button 
                                icon="pi pi-bars"
                                label="Menu"
                                className="sm-menubar-button m-0"
                                onClick={(event) => menu.current.toggle(event)}
                            />
                        }
                    </div>
                }
                footer={
                    <Paginator
                        first={paginatorFirst}
                        rows={paginatorRows}
                        totalRecords={totalPages*paginatorRows}
                        rowsPerPageOptions={[10,20,30]}
                        onPageChange={onPaginatorPageChange}
                    ></Paginator>
                }
            >
                {loadingStart?
                    loadingScreen
                :
                    auctionIsFinished?//Si no termino directamente muestra las cards, si total no hay no vendidos todavia
                        tabView
                        :
                        itemCardList
                }
            </Card>
        </>
    )
}

export default FinalBatches
