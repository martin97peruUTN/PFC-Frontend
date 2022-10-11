import React, {useState, useEffect, useContext} from 'react';
import { useHistory } from "react-router-dom";
import * as url from '../util/url';

import { Skeleton } from 'primereact/skeleton';
import { Paginator } from 'primereact/paginator';
import { ScrollTop } from 'primereact/scrolltop';
import { Calendar } from 'primereact/calendar';

import { FetchContext } from '../context/FetchContext';
import { AuthContext } from '../context/AuthContext';

import Card from '../components/cards/Card'
import AuctionCard from '../components/cards/AuctionCard';

import * as miscFunctions from '../util/miscFunctions';

const AuctionHistory = ({showToast}) => {

    const authContext = useContext(AuthContext)
    const fetchContext = useContext(FetchContext)
    const history = useHistory();

    const [loadingStart, setLoadingStart] = useState(false)

    //Paginator states
    const [paginatorFirst, setPaginatorFirst] = useState(0);
    const [paginatorRows, setPaginatorRows] = useState(10);
    const [paginatorPage, setPaginatorPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    //Dates es un arreglo de 2 fechas, donde la sub 0 es la inicial y la sub 1 la final
    const [dates, setDates] = useState(null);

    const [auctionList, setAuctionsList] = useState([])

    useEffect(() => {
        setLoadingStart(true)
        let fetchUrl = `${url.USER_AUCTIONS_API}/history/${authContext.getUserInfo().id}?page=${paginatorPage}&limit=${paginatorRows}`
        if(dates && dates[0]){
            fetchUrl += `&first-date=${miscFunctions.parseDateFrontToBack(dates[0])}`
        }
        if(dates && dates[1]){
            fetchUrl += `&last-date=${miscFunctions.parseDateFrontToBack(dates[1])}`
        }
        fetchContext.authAxios.get(fetchUrl)
        .then(res => {
            setAuctionsList(res.data.content)
            setTotalPages(res.data.totalPages)
            setLoadingStart(false)
        })
        .catch(err => {
            showToast('error', 'Error', 'No se pudo cargar el historial de remates')
            history.push(url.HOME);
        })
    },[dates, paginatorFirst, paginatorRows, paginatorPage])

    const onPaginatorPageChange = (event) => {
        setPaginatorFirst(event.first);
        setPaginatorRows(event.rows);
        setPaginatorPage(event.page);
    }

    const auctionScreenHandler = (auctionId) => {
        history.push(url.AUCTION, {auctionId: auctionId})
    }

    const soldBatchesHandler = (auctionId) => {
        history.push(url.FINAL_BATCHES, {auctionId: auctionId})
    }

    const noAuctionYetMessage = (
        <div className="text-2xl flex justify-content-center">Sin resultados</div>
    )

    const auctionCardList = auctionList.length===0? noAuctionYetMessage : auctionList.map((auction) => (
        <AuctionCard
            key={auction.id}
            id={auction.id}
            senasaNumber={auction.senasaNumber}
            date={auction.date}
            locality={auction.locality.name}
            //paso el index para mostrar o no los botones, segun que pestaña esta mirando
            //Eso en la pantalla de Home, aca paso 0 para que muestre los botones
            tabViewActiveIndex={0}
            isOnHistory={true}
            auctionScreenHandler={auctionScreenHandler}
            soldBatchesHandler={soldBatchesHandler}
        />
    ))

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
                title={'Historial de remates'}
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
                <span className="p-float-label">
                    <Calendar
                        id='calendar' 
                        className='w-full'
                        value={dates} 
                        onChange={(e) => setDates(e.value)} 
                        selectionMode="range"
                        dateFormat="d/m/yy"
                        tooltip="D/M/AAAA - D/M/AAAA (espacio, guión y otro espacio entre las fechas)"
                        tooltipOptions={{position: 'top'}}
                    />    
                    <label htmlFor="calendar">Buscar por rango de fechas</label>
                </span>
                <br/>
                {loadingStart?
                    loadingScreen
                    :
                    auctionCardList
                }
            </Card>
        </>
    )
}

export default AuctionHistory
