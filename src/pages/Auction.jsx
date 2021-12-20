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

    const [auctionId, setAuctionId] = useState()
    const [auctionIsFinished, setAuctionIsFinished] = useState()

    //0:Para venta 1:No vendido 2:Vendido
    const [tabViewActiveIndex, setTabViewActiveIndex] = useState(0);

    const [animalsOnGround, setAnimalsOnGround] = useState([])

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
    }, [tabViewActiveIndex, paginatorFirst, paginatorRows, paginatorPage])

    const onPaginatorPageChange = (event) => {
        setPaginatorFirst(event.first);
        setPaginatorRows(event.rows);
        setPaginatorPage(event.page);
    }

    const tabViewActiveIndexChange = (index) => {
        setTabViewActiveIndex(index)
        //FIXME capaz no haga falta hacer nada aca, porque puse el tabViewActiveIndex en el useEffect
    }

    const sellHandler = (animalOnGroundId) => {
        if(auctionIsFinished){

        }
    }

    const notSoldHandler = (animalOnGroundId) => {
        if(auctionIsFinished){
            
        }
    }

    const editHandler = (animalOnGroundId) => {
        if(auctionIsFinished){
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
            label: 'Lotes vendidos',
            icon: 'pi pi-fw pi-shopping-cart',
            url: url.HOME//TODO mandar el auctionIsFinished capaz
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
            onTabChange={(e) => tabViewActiveIndexChange(e.index)}
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
