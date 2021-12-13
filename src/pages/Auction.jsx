import React, {useState, useEffect, useRef, useContext} from 'react';
import { useHistory } from "react-router-dom";

import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { Skeleton } from 'primereact/skeleton';
import { ScrollTop } from 'primereact/scrolltop';
import { Menu } from 'primereact/menu';
import { TabView, TabPanel } from 'primereact/tabview';
import { confirmDialog } from 'primereact/confirmdialog';

import { FetchContext } from '../context/FetchContext';
import { AuthContext } from './../context/AuthContext';
import * as url from '../util/url';

import Card from '../components/cards/Card'
import BatchCard from '../components/cards/BatchCard'

const Auction = ({showToast}) => {

    const fetchContext = useContext(FetchContext)
    const authContext = useContext(AuthContext);
    const history = useHistory();
    
    const menu = useRef(null);

    const [loadingStart, setLoadingStart] = useState(false)

    const [auctionId, setAuctionId] = useState()
    const [tabViewActiveIndex, setTabViewActiveIndex] = useState(0);
    const [batches, setBatches] = useState([])

    //TODO terminar cuando tengamos los endpoints
    useEffect(() => {
        setLoadingStart(true)
        if(!history.location.state){
            showToast('error', 'Error', 'No se encontro el remate')
            history.goBack();
        }else{
            setAuctionId(history.location.state.auctionId)
            setLoadingStart(false)
            /*fetchContext.authAxios.get(`${url.AUCTION_BATCHES_API}/${auctionId}`)
            .then(response => {
                setBatches(response.data)
                setLoadingStart(false)
            })
            .catch(error => {
                showToast('error', 'Error', 'No se pudo obtener los lotes del remate')
                history.goBack();
            })*/
        }
    }, [])

    const tabViewActiveIndexChange = (index) => {
        setTabViewActiveIndex(index)
        //TODO llamar a la API para cargar lo que corresponda
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

    const tabView = (
        <TabView className='w-full' 
            activeIndex={tabViewActiveIndex} 
            onTabChange={(e) => tabViewActiveIndexChange(e.index)}
        >
            <TabPanel header="Para venta">
                Content I
            </TabPanel>
            <TabPanel header="No vendidos">
                Content II
            </TabPanel>
            <TabPanel header="Vendidos">
                Content III
            </TabPanel>
        </TabView>
    )

    //TODO cambiar urls cuando las tengamos (url o command: () => hacerAlgo())
    const menuItems = []
    if(authContext.isAdmin() || authContext.isConsignee()){
        menuItems.push({
            label: 'Agregar lote',
            icon: 'pi pi-fw pi-plus-circle',
            url: url.HOME
        },
        {
            label: 'Participantes',
            icon: 'pi pi-fw pi-users',
            command: () => history.push(url.ADD_PARTICIPANT,
                {
                    auctionId: auctionId
                }
            )
        },
        {
            label: 'Informacion del remate',
            icon: 'pi pi-fw pi-info-circle',
            command: () => history.push(url.AUCTION_CRUD, 
                {
                    auctionId: auctionId
                }
            )
        })
    }else{
        menuItems.push({
            label: 'Agregar lote',
            icon: 'pi pi-fw pi-plus-circle',
            url: url.HOME
        },
        {
            label: 'Informacion del remate',
            icon: 'pi pi-fw pi-info-circle',
            command: () => history.push(url.AUCTION_CRUD, 
                {
                    auctionId: auctionId
                }
            )
        })
    }
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
            url: url.HOME
        },
        {separator: true},
        {separator: true},
        {
            label: 'Terminar remate',
            icon: 'pi pi-fw pi-check-square',
            command: () => confirmFinishAuction()
        }
    )

    const itemCardList = batches.map(batch => (
        <BatchCard
            id={batch.id}
        />
    ))

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
