import React, {useState, useEffect, useRef, useContext} from 'react';
import { useHistory } from "react-router-dom";
import * as url from '../util/url';

import { Toast } from 'primereact/toast';
import { Skeleton } from 'primereact/skeleton';
import { Paginator } from 'primereact/paginator';
import { ScrollTop } from 'primereact/scrolltop';
import { TabView, TabPanel } from 'primereact/tabview';

import { FetchContext } from '../context/FetchContext';
import { AuthContext } from '../context/AuthContext';

import Card from '../components/cards/Card'
import AuctionCard from '../components/cards/AuctionCard';

const HomePage = () => {

    const authContext = useContext(AuthContext)
    const fetchContext = useContext(FetchContext)
    const history = useHistory();
    const toast = useRef(null);
    const showToast = (severity, summary, message) => {
        toast.current.show({severity:severity, summary: summary, detail:message});
    }

    const [loadingStart, setLoadingStart] = useState(false)

    //Paginator states
    const [paginatorFirst, setPaginatorFirst] = useState(0);
    const [paginatorRows, setPaginatorRows] = useState(10);
    const [paginatorPage, setPaginatorPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    const [isAdmin, setIsAdmin] = useState(false)
    const [userId, setUserId] = useState()
    const [tabViewActiveIndex, setTabViewActiveIndex] = useState(0);
    const [auctionList, setAuctionsList] = useState([])

    useEffect(() => {
        setLoadingStart(true)
        setUserId(authContext.getUserInfo().id)
        setIsAdmin(authContext.isAdmin())
        const auctionListToGet = isAdmin? 'all' : tabViewActiveIndex === 0 ? 'own' : 'others'
        /*fetchContext.authAxios.get(`${url.USER_AUCTIONS_API}/${ownOrOthers}/${userId}?page=${paginatorPage}&limit=${paginatorRows}`)
        .then(res => {
            setAuctionsList(res.data)
            setLoadingStart(false)
        })
        .catch(err => {
            showToast('error', 'Error', 'No se pudieron cargar lo remates')
            setTimeout(() => {
                history.goBack();
            },3000)
        })*/
    },[tabViewActiveIndex, paginatorFirst, paginatorRows, paginatorPage])

    const onPaginatorPageChange = (event) => {
        setPaginatorFirst(event.first);
        setPaginatorRows(event.rows);
        setPaginatorPage(event.page);
    }

    const addBatchHandler = (auctionId) => {
        //TODO terminar cuando se tenga el endpoint
    }

    const auctionScreenHandler = (auctionId) => {
        history.push(url.AUCTION, {auctionId: auctionId})
    }

    const auctionCardList = auctionList.map((auction) => (
        <AuctionCard
            key={auction.id}
            id={auction.id}
            senasaNumber={auction.senasaNumber}
            date={auction.date}
            locality={auction.locality}
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
            <Toast ref={toast} />
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
                    tabView
                }
            </Card>
        </>
    )
}

export default HomePage
