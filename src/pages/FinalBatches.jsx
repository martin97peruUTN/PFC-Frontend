import React, {useState, useEffect, useRef, useContext} from 'react';
import { useHistory } from "react-router-dom";

import { Button } from 'primereact/button';
import { Paginator } from 'primereact/paginator';
import { Skeleton } from 'primereact/skeleton';
import { ScrollTop } from 'primereact/scrolltop';
import { Menu } from 'primereact/menu';
import { TabView, TabPanel } from 'primereact/tabview';
import { confirmDialog } from 'primereact/confirmdialog';

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

    const [loadingStart, setLoadingStart] = useState(false)

    //Paginator states
    const [paginatorFirst, setPaginatorFirst] = useState(0);
    const [paginatorRows, setPaginatorRows] = useState(10);
    const [paginatorPage, setPaginatorPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    //uso este estado "comodin" para refrescar la pagina cuando hay un cambio
    const [refresh, setRefresh] = useState(false);

    //Mostrar el dialogo de vender o esconderlo
    const [displayDialog, setDisplayDialog] = useState(false);

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
            //FIXME sacar la url de mock
            let fetchURL = 'https://61895cd6d0821900178d795e.mockapi.io/api/soldBatch'
            //let fetchURL = `${url.SOLD_BATCH_API}/by-auction/${auctionId}/${tabViewActiveIndex===0?'sold':'notSold'}?limit=${paginatorRows}&page=${paginatorPage}`
            const p1 = fetchContext.authAxios.get(url.AUCTION_API+'/'+auctionId)
            const p2 = fetchContext.authAxios.get(fetchURL)
            Promise.all([p1, p2]).then(values => {
                const auction = values[0].data
                const batches = values[1].data
                setAuctionIsFinished(auction.finished)
                setBatchList(batches/*.content*/)//FIXME
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

    const weighHandler = (batchId) => {
        //TODO
    }

    const dteNumberSetHandler = (batchId) => {
        //TODO
    }

    const getBillHandler = (batchId) => {
        //TODO proximamente
    }

    //Se dispara al tocar algun boton editar
    const editHandler = (batchId) => {
        if(!auctionIsFinished){
            setDisplayDialog(true)
            setEditingItem(batchList.find(batch => batch.id === batchId))
        }
    }

    //Se dispara al tocar el boton aceptar del dialogo de editar
    const saveEditedItemHandler = () => {
        //TODO
    }

    const deleteHandler = (batchId) => {
        //TODO
    }

    const itemCardList = batchList.map(batch => (
        <FinalBatchCard
            id={batch.id}
            key={batch.id}
            buyer={batch.buyer.name}
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
    
    const topButtons = (
        <div>
            <Button 
                icon="pi pi-file"
                label="Resumen"
                className="btn btn-primary mr-1"
                //TODO onClick={}
            />
            <Button 
                icon="pi pi-arrow-left"
                label="Lotes de venta"
                className="btn btn-primary"
                onClick={() => history.push(url.AUCTION, {auctionId: auctionId})}
            />
        </div>
    )

    const sellDialog = (
        <SellDialog
            isCreating={false}
            acceptHandler = {saveEditedItemHandler}
            setDisplayDialog = {setDisplayDialog}
            displayDialog = {displayDialog}
            url = {url}
            fetchContext = {fetchContext}
            showToast = {showToast}
            editingItem = {editingItem}
            setEditingItem = {setEditingItem}
        />
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
            <Card
                title={
                    <div className="flex justify-content-between">
                        <>{"Lotes finales"}</>
                        {!isSmallScreen()?//Pantalla grande: botones a la derecha del titulo
                            topButtons
                        :
                            null
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
                    <div>
                        {isSmallScreen()?//Pantalla chica: botones abajo del titulo
                            topButtons
                        :
                            null
                        }
                        {tabView}
                    </div>
                }
            </Card>
        </>
    )
}

export default FinalBatches
