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

    //Para el websocket
    const SockJS = require('sockjs-client'); // <1>
    const Stomp  = require('stompjs'); // <2>

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

    //Mostrar el dialogo un dialogo o esconderlo
    const [displayEditDialog, setDisplayEditDialog] = useState(false);
    const [displayWeighDialog, setDisplayWeighDialog] = useState(false);
    const [displayDteNumberDialog, setDisplayDteNumberDialog] = useState(false);
    const [displayBillDialog, setDisplayBillDialog] = useState(false);

    const [auctionId, setAuctionId] = useState()
    const [auctionIsFinished, setAuctionIsFinished] = useState()

    //0:Vendidos 1:No vendidos
    const [tabViewActiveIndex, setTabViewActiveIndex] = useState(0);

    //Listado de soldBatches o notSoldBatches segun la pestaña activa
    const [batchList, setBatchList] = useState([])

    //Item de la lista que estoy queriendo editar/pesar/cargar DTe
    const [editingItem, setEditingItem] = useState();

    //Cantidad de copias de boletas, 4 por defecto
    const [amountOfBillCopies, setAmountOfBillCopies] = useState(4);

    //Mensajes que llegan desde el websocket
    const [message, setMessage] = useState();

    //Opcion que indica si se imprime o se descarga el PDF de la boleta
    const [billOption, setBillOption] = useState(null);

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
    },[tabViewActiveIndex, paginatorFirst, paginatorRows, paginatorPage, refresh, message])

    useEffect(() => {
        const {auctionId} = history.location.state
        const baseURL = process.env.REACT_APP_API_URL.replace('/api', '')
        const socket = SockJS(`${baseURL}/payroll`); // <3>
        const stompClient = Stomp.over(socket);
        var headers = {
            "Authorization": `Bearer ${localStorage.getItem('token')}`
        }
        stompClient.connect(headers, function(frame) {
            stompClient.subscribe(`/topic/newSoldBatch/${auctionId}`, message => refreshData(message))
        }, function(frame) {
        });
        return () => {
            stompClient.disconnect();
        }
    },[])

    //Metodo para hacer que la pagina traiga la nueva info cuando llega un mensaje desde el websocket
    const refreshData = (message) => {
        //Pusimos el timeout sino no anda
        setTimeout(() => {
            setMessage(message)
        },1000)
    }

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
            showToast('warn', 'Error', 'Debe ingresar un peso')
        }else if(editingItem.weight<=0){
            showToast('warn', 'Error', 'El peso debe ser mayor a 0')
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
                showToast('error','Error',error.response.data.errorMsg)
            })
        }
    }

    //Se dispara al tocar algun boton cargar DTe
    const dteNumberSetHandler = (batchId) => {
        setDisplayDteNumberDialog(true)
        setEditingItem(batchList.find(batch => batch.id === batchId))
    }

    const saveDteNumberHandler = () => {
        if(!editingItem.dteNumber){
            showToast('error', 'Error', 'Debe ingresar un numero de DTe')
        }else{
            fetchContext.authAxios.patch(`${url.SOLD_BATCH_API}/${editingItem.id}`, 
            {
                dteNumber: editingItem.dteNumber
            })
            .then(response => {
                showToast('success','Exito','Se guardo el DTe correctamente')
                setDisplayDteNumberDialog(false)
                setEditingItem(null)
                setRefresh(!refresh)
            })
            .catch(error => {
                showToast('error','Error',error.response.data.errorMsg)
            })
        }
    }

    //Se dispara al tocar algun boton boleta
    const getBillHandler = (batchId, stringOption) => {
        setDisplayBillDialog(true)
        setBillOption(stringOption)
        setEditingItem(batchList.find(batch => batch.id === batchId))
    }

    //Se dispara al tocar aceptar en el dialogo de boleta
    const printBillHandler = () => {
        if(!amountOfBillCopies || amountOfBillCopies<=0){
            showToast('error', 'Error', 'Debe ingresar una cantidad de copias mayor a 0')
        }else{
            fetchContext.authAxios.get(`${url.PDF_API}/boleta/${editingItem.id}?copyAmount=${amountOfBillCopies}`)
            .then(res => {
                if(billOption==="print"){
                    window.open("").document.write(
                        "<iframe width='100%' height='100%' src='data:application/pdf;base64, " +
                        encodeURI(res.data) + "'></iframe>"
                    )
                }else{
                    var a = window.document.createElement('a');
                    a.href = `data:application/octet-stream;charset=utf-8;base64,${res.data}`
                    a.download = `Boleta ${editingItem.seller.name} ${editingItem.buyer.name}.pdf`;
                    a.target='_blank'
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                }
                setDisplayBillDialog(false)
                setEditingItem(null)
                setBillOption(null)
                setAmountOfBillCopies(4)
            })
            .catch(error => {
                showToast('error','Error',error.response.data.errorMsg)
            })
        }
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
                    'mustWeigh': editingItem.mustWeigh,
                    'paymentTerm': editingItem.paymentTerm?editingItem.paymentTerm:null
                }
                fetchContext.authAxios.patch(`${url.SOLD_BATCH_API}/${editingItem.id}`, data)
                .then(response => {
                    showToast('success','Exito','Se guardaron los cambios correctamente')
                    setDisplayEditDialog(false)
                    setEditingItem(null)
                    setRefresh(!refresh)
                })
                .catch(error => {
                    showToast('error','Error',error.response.data.errorMsg)
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
                    showToast('error', 'Error', error.response.data.errorMsg)
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
                    showToast('error', 'Error', error.response.data.errorMsg)
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

    const itemCardList = batchList.length === 0? 
        <div className="text-2xl flex justify-content-center">No hay lotes para mostrar</div> 
        :
        batchList.map(batch => (
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
                paymentTerm={batch.paymentTerm}
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
                icon="pi pi-book"
                label="Resumen"
                className="btn btn-primary mr-3"
                onClick={() => history.push(url.REPORT, {auctionId: auctionId})}
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
            icon: "pi pi-book",
            label: "Resumen",
            command: () => history.push(url.REPORT, {auctionId: auctionId})
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
    if((authContext.isAdmin() || authContext.isConsignee()) && auctionIsFinished){
        menuItems.push(
            {separator: true},
            {separator: true},
            {
                label: 'Reanudar remate',
                icon: 'pi pi-fw pi-replay',
                command: () => confirmResumeAuction()
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
                        keyfilter="pnum"
                        onChange={e => setEditingItem({...editingItem, weight:e.target.value})}
                    />
                    <label htmlFor="weight">Peso</label>
                </span>
                <span className="p-inputgroup-addon">Kg</span>
            </div>
        </Dialog>
    )

    const dteNumberDialog = (
        <Dialog
            header="Cargar DTe"
            visible={displayDteNumberDialog}
            className="w-11 md:w-6"
            onHide={() => setDisplayDteNumberDialog(false)}
            footer={
                <div className="">
                    <Button label="Cancelar" icon="pi pi-times" onClick={() => setDisplayDteNumberDialog(false)} className="p-button-danger" />
                    <Button label="Aceptar" icon="pi pi-check" onClick={() => saveDteNumberHandler()} autoFocus className="btn btn-primary" />
                </div>
            }
        >
            <br/>
            <span className="p-float-label">
                <InputText 
                    id="dte" 
                    className='w-full' 
                    value={editingItem?editingItem.dteNumber:null}
                    keyfilter="num"
                    onChange={e => setEditingItem({...editingItem, dteNumber:e.target.value})}
                />
                <label htmlFor="dte">Numero de DTe</label>
            </span>
        </Dialog>
    )

    const billDialog = (
        <Dialog
            header="Imprimir boleta"
            visible={displayBillDialog}
            className="w-11 md:w-6"
            onHide={() => setDisplayBillDialog(false)}
            footer={
                <div className="">
                    <Button label="Cancelar" icon="pi pi-times" onClick={() => setDisplayBillDialog(false)} className="p-button-danger" />
                    <Button label="Aceptar" icon="pi pi-check" onClick={() => printBillHandler()} autoFocus className="btn btn-primary" />
                </div>
            }
        >
            <br/>
            <span className="p-float-label">
                <InputText  
                    id="bill" 
                    className='w-full' 
                    keyfilter="pint"
                    value={amountOfBillCopies}
                    onChange={e => setAmountOfBillCopies(e.target.value)}
                />
                <label htmlFor="bill">Cantidad de copias</label>
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
            {sellDialog}
            {weighDialog}
            {dteNumberDialog}
            {billDialog}
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
