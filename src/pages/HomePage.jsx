import React, {useState, useEffect, useRef, useContext} from 'react';
import { useHistory } from "react-router-dom";
import * as url from '../util/url';

import { Skeleton } from 'primereact/skeleton';
import { Paginator } from 'primereact/paginator';
import { ScrollTop } from 'primereact/scrolltop';
import { TabView, TabPanel } from 'primereact/tabview';

import { FetchContext } from '../context/FetchContext';
import { AuthContext } from '../context/AuthContext';

import Card from '../components/cards/Card'
import AuctionCard from '../components/cards/AuctionCard';

const HomePage = ({showToast}) => {

    const authContext = useContext(AuthContext)
    const fetchContext = useContext(FetchContext)
    const history = useHistory();

    const [loadingStart, setLoadingStart] = useState(false)

    //Paginator states
    const [paginatorFirst, setPaginatorFirst] = useState(0);
    const [paginatorRows, setPaginatorRows] = useState(10);
    const [paginatorPage, setPaginatorPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    //uso este estado para controlar el tabView asi como para saber que listado mostrar
    //0 para remates propios, 1 para ajenos. En caso de los admins no se usa
    const [tabViewActiveIndex, setTabViewActiveIndex] = useState(0);

    const [auctionList, setAuctionsList] = useState([])

    useEffect(() => {
        setLoadingStart(true)
        fetchContext.authAxios.get(`${url.USER_AUCTIONS_API}${authContext.isAdmin() ? "" : (tabViewActiveIndex === 0? "/own/"+authContext.getUserInfo().id : "/others/"+authContext.getUserInfo().id)}?page=${paginatorPage}&limit=${paginatorRows}`)
        .then(res => {
            setAuctionsList(res.data.content)
            setTotalPages(res.data.totalPages)
            setLoadingStart(false)
        })
        .catch(err => {
            showToast('error', 'Error', 'No se pudieron cargar lo remates')
            history.goBack();
        })
    },[tabViewActiveIndex, paginatorFirst, paginatorRows, paginatorPage])

    const onPaginatorPageChange = (event) => {
        setPaginatorFirst(event.first);
        setPaginatorRows(event.rows);
        setPaginatorPage(event.page);
    }

    const addBatchHandler = (auctionId) => {
        //TODO terminar cuando se tenga el endpoint
        if(authContext.isAdmin() || tabViewActiveIndex === 0){
            
        }
    }

    const auctionScreenHandler = (auctionId) => {
        //Este if es por las dudas nomas, para asegurar, porque igual no se muestan los botones
        if(authContext.isAdmin() || tabViewActiveIndex === 0){
            history.push(url.AUCTION, {auctionId: auctionId})
        }
    }

    const auctionCardList = auctionList.map((auction) => (
        <AuctionCard
            key={auction.id}
            id={auction.id}
            senasaNumber={auction.senasaNumber}
            date={auction.date}
            locality={auction.locality.name}
            //paso el index para mostrar o no los botones, segun que pestaña esta mirando
            tabViewActiveIndex={tabViewActiveIndex}
            addBatchHandler={addBatchHandler}
            auctionScreenHandler={auctionScreenHandler}
        />
    ))

    const tabView = (
        <TabView className='w-full' 
            activeIndex={tabViewActiveIndex} 
            onTabChange={(e) => setTabViewActiveIndex(e.index)}
        >
            <TabPanel header="Mis remates">
                {auctionCardList}
            </TabPanel>
            <TabPanel header="Remates ajenos">
                {auctionCardList}
            </TabPanel>
        </TabView>
    )

    const loadingScreen = (
        <div>
            <Skeleton width="100%" height="7rem"/>
            <br/>
            <Skeleton width="100%" height="7rem"/>
            <br/>
            <Skeleton width="100%" height="7rem"/>
        </div>
    )

    return (
        <>
            <ScrollTop />
            <Card
                title={'Inicio'}
                footer={
                    <Paginator
                        first={paginatorFirst}
                        rows={paginatorRows}
                        totalRecords={totalPages*paginatorRows}
                        rowsPerPageOptions={[10, 20, 30]}
                        onPageChange={onPaginatorPageChange}
                    ></Paginator>
                }
            >
                {loadingStart?
                    loadingScreen
                    :
                    authContext.isAdmin()?
                        //Si es admin le muestro directamente las cards porque tiene acceso a todas
                        auctionCardList 
                        :
                        tabView
                }
            </Card>
        </>
    )
}

export default HomePage
