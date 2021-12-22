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

import Card from '../components/cards/Card'
import AnimalsOnGroundShowCard from '../components/cards/AnimalsOnGroundShowCard'
import SellDialog from '../components/SellDialog'

const Auction = ({showToast}) => {

    const fetchContext = useContext(FetchContext)
    const authContext = useContext(AuthContext);
    const history = useHistory();
    
    const menu = useRef(null);

    const [loadingStart, setLoadingStart] = useState(false)

    //Paginator states
    const [paginatorFirst, setPaginatorFirst] = useState(0);
    const [paginatorRows, setPaginatorRows] = useState(20);
    const [paginatorPage, setPaginatorPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    //uso este estado "comodin" para refrescar la pagina cuando hay un cambio
    const [refresh, setRefresh] = useState(false);

    //Mostrar el dialogo de vender o esconderlo
    const [displayDialog, setDisplayDialog] = useState(false);

    const [auctionId, setAuctionId] = useState()
    const [auctionIsFinished, setAuctionIsFinished] = useState()

    //0:Para venta 1:No vendido 2:Vendido
    const [tabViewActiveIndex, setTabViewActiveIndex] = useState(0);

    //Listado de animales en pista
    const [animalsOnGround, setAnimalsOnGround] = useState([])

    //Item de la lista que estoy queriendo vender en este caso
    const [editingItem, setEditingItem] = useState({mustWeigh: true});

    useEffect(() => {
        setLoadingStart(true)
        if(!history.location.state){
            showToast('error', 'Error', 'No se encontro el remate')
            history.goBack();
        }else{
            const {auctionId} = history.location.state
            setAuctionId(auctionId)
            let fetchURL = `${url.ANIMALS_ON_GROUND_API}/by-auction/${auctionId}?limit=${paginatorRows}&page=${paginatorPage}`
            if(tabViewActiveIndex === 0){
                fetchURL = fetchURL.concat('&sold=false&notSold=false')
            }else if(tabViewActiveIndex === 1){
                fetchURL = fetchURL.concat('&sold=false&notSold=true')
            }else{
                fetchURL = fetchURL.concat('&sold=true')
            }
            const p1 = fetchContext.authAxios.get(url.AUCTION_API+'/'+auctionId)
            const p2 = fetchContext.authAxios.get(fetchURL)
            Promise.all([p1, p2]).then(values => {
                const auction = values[0].data
                const animals = values[1].data
                setAuctionIsFinished(auction.finished)
                setAnimalsOnGround(animals.content)
                setTotalPages(animals.totalPages)
                setLoadingStart(false)
            })
            .catch(error => {
                showToast('error', 'Error', 'No se pudo obtener los lotes del remate')
                history.goBack();
            })
        }
    }, [tabViewActiveIndex, paginatorFirst, paginatorRows, paginatorPage, refresh])

    const onPaginatorPageChange = (event) => {
        setPaginatorFirst(event.first);
        setPaginatorRows(event.rows);
        setPaginatorPage(event.page);
    }

    //Se dispara al tocar algun boton vender
    const sellHandler = (animalOnGroundId) => {
        if(!auctionIsFinished){
            setDisplayDialog(true)
            setEditingItem({...editingItem, 'id':animalOnGroundId})
        }
    }

    //Se dispara al tocar el boton aceptar del dialogo de vender
    const sellAnimalsHandler = () => {
        if(!auctionIsFinished){
            if(editingItem.id && editingItem.client && editingItem.price && editingItem.amount && editingItem.mustWeigh!==null){
                if(editingItem.amount<=0){
                    showToast('warn', 'Error', 'La cantidad debe ser mayor a 0')
                }else if(editingItem.price<=0){
                    showToast('warn', 'Error', 'El precio debe ser mayor a 0')
                }else{
                    const actualAnimals = animalsOnGround.find(animal => animal.id === editingItem.id)
                    //Si la cantidad que quiero vender es menor o igual a la cantidad del animalsOnGround
                    //menos la cantidad ya vendida (los que quedan por vender), lo dejo seguir
                    if(editingItem.amount<=actualAnimals.amount - actualAnimals.soldAmount){
                        const data = {
                            'client': editingItem.client,
                            'price': editingItem.price,
                            'amount': editingItem.amount,
                            'mustWeigh': editingItem.mustWeigh
                        }
                        fetchContext.authAxios.post(`${url.SOLD_BATCH_API}/${editingItem.id}`, data)
                        .then(response => {
                            showToast('success','Exito','Se vendieron los animales correctamente')
                            setDisplayDialog(false)
                            setEditingItem({mustWeigh: true})
                            setRefresh(!refresh)
                        })
                        .catch(error => {
                            showToast('error','Error','No se pudieron vender los animales')
                        })
                    }else{
                        showToast('warn','Error','La cantidad que quiere vender no puede ser mayor a la cantidad restante')
                    }
                }
            }else{
                showToast('warn','Error','Debe completar todos los campos')
            }
        }
    }

    const notSoldHandler = (animalOnGroundId) => {
        if(!auctionIsFinished){
            confirmDialog({
                message: '¿Esta seguro de que desea proceder?',
                header: 'Marcar como no vendido',
                icon: 'pi pi-exclamation-circle',
                acceptLabel: 'Si',
                accept: () => {
                    fetchContext.authAxios.patch(`${url.ANIMALS_ON_GROUND_API}/${animalOnGroundId}`, {'notSold': true})
                    .then(response => {
                        showToast('success', 'Exito', 'Animales marcados como no vendido')
                        setRefresh(!refresh)
                    })
                    .catch(error => {
                        showToast('error', 'Error', 'No se pudieron marcar como no vendidos')
                    })
                }
            });
        }
    }

    const editHandler = (animalOnGroundId) => {
        if(!auctionIsFinished){
            history.push(url.BATCH_CRUD, 
                {
                    auctionId: auctionId,
                    animalOnGroundId: animalOnGroundId
                }
            )
        }
    }

    //Se dispara al presionar Terminar remate
    const confirmFinishAuction = () => {
        confirmDialog({
            message: '¿Esta seguro de que desea proceder?',
            header: 'Terminar remate',
            icon: 'pi pi-exclamation-circle',
            acceptLabel: 'Si',
            accept: () => finishAuction()
        });
    }

    const finishAuction = () => {
        fetchContext.authAxios.patch(`${url.AUCTION_API}/${auctionId}`, {finished : true})
        .then(response => {
            showToast('success', 'Exito', 'Remate finalizado')
            history.goBack();
        })
        .catch(error => {
            showToast('error', 'Error', 'No se pudo finalizar el remate')
        })
    }

    //TODO cambiar urls cuando las tengamos (url o command: () => hacerAlgo())
    const menuItems = []
    if(!auctionIsFinished){
        menuItems.push(
            {
                label: 'Agregar lote',
                icon: 'pi pi-fw pi-plus-circle',
                command: () => history.push(url.BATCH_CRUD, 
                    {
                        auctionId: auctionId
                    }
                )
            }
        )
    }
    if(authContext.isAdmin() || authContext.isConsignee()){
        menuItems.push(
            {
                label: 'Participantes',
                icon: 'pi pi-fw pi-users',
                command: () => history.push(url.ADD_PARTICIPANT,
                    {
                        auctionId: auctionId,
                        auctionIsFinished: auctionIsFinished
                    }
                )
            }
        )
    }
    menuItems.push(
        {
            label: 'Informacion del remate',
            icon: 'pi pi-fw pi-info-circle',
            command: () => history.push(url.AUCTION_CRUD, 
                {
                    auctionId: auctionId,
                    auctionIsFinished: auctionIsFinished
                }
            )
        }
    )
    menuItems.push(
        {separator: true},
        {
            label: 'Orden de salida',
            icon: 'pi pi-fw pi-sort-amount-down-alt',
            url: url.HOME
        },
        {
            label: 'Resumen',
            icon: 'pi pi-fw pi-book',
            url: url.HOME
        },
        {
            label: `${auctionIsFinished?'Lotes finales':'Lotes vendidos'}`,
            icon: 'pi pi-fw pi-shopping-cart',
            command: () => history.push(url.FINAL_BATCHES,
                {
                    auctionId: auctionId
                }
            )
        }
    )
    if(!auctionIsFinished){
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

    const itemCardList = animalsOnGround.map(animalOnGround => (
        <AnimalsOnGroundShowCard
            id={animalOnGround.id}
            key={animalOnGround.id}
            amount={animalOnGround.amount}
            soldAmount={animalOnGround.soldAmount}
            seller={animalOnGround.seller.name}
            category={animalOnGround.category.name}
            corralNumber={animalOnGround.corralNumber}
            tabViewActiveIndex = {tabViewActiveIndex}
            auctionIsFinished={auctionIsFinished}
            sellHandler = {sellHandler}
            notSoldHandler = {notSoldHandler}
            editHandler = {editHandler}
        />
    ))

    //0:Para venta 1:No vendido 2:Vendido
    const tabView = (
        <TabView className='w-full' 
            activeIndex={tabViewActiveIndex} 
            onTabChange={(e) => setTabViewActiveIndex(e.index)}
        >
            <TabPanel header="Para venta">
                {itemCardList}
            </TabPanel>
            <TabPanel header="No vendidos">
                {itemCardList}
            </TabPanel>
            <TabPanel header="Vendidos">
                {itemCardList}
            </TabPanel>
        </TabView>
    )

    const sellDialog = (
        <SellDialog
            isCreating={true}
            acceptHandler = {sellAnimalsHandler}
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
                        <>{"Remate"}</>
                        <Button 
                            icon="pi pi-bars"
                            label="Menu"
                            className="sm-menubar-button m-0"
                            onClick={(event) => menu.current.toggle(event)}
                        />
                    </div>
                }
                footer={
                    <Paginator
                        first={paginatorFirst}
                        rows={paginatorRows}
                        totalRecords={totalPages*paginatorRows}
                        rowsPerPageOptions={[20,40,60]}
                        onPageChange={onPaginatorPageChange}
                    ></Paginator>
                }
            >
                {loadingStart?
                    loadingScreen
                :
                    tabView
                }
            </Card>
        </>
    )
}

export default Auction
