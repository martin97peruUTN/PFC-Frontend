import React, {useState, useEffect, useRef, useContext} from 'react';
import { useHistory } from "react-router-dom";

import { Button } from 'primereact/button';
import { Paginator } from 'primereact/paginator';
import { Skeleton } from 'primereact/skeleton';
import { ScrollTop } from 'primereact/scrolltop';

import { FetchContext } from '../context/FetchContext';
import * as url from '../util/url';

import Card from '../components/cards/Card'
import BatchListCard from '../components/cards/BatchListCard';

const BatchList = ({showToast}) => {

    const fetchContext = useContext(FetchContext)
    const history = useHistory();

    const [loadingStart, setLoadingStart] = useState(false)

    //Paginator states
    const [paginatorFirst, setPaginatorFirst] = useState(0);
    const [paginatorRows, setPaginatorRows] = useState(10);
    const [paginatorPage, setPaginatorPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    const [auctionId, setAuctionId] = useState()

    //Listado de batches
    const [batchList, setBatchList] = useState([])

    useEffect(() => {
        setLoadingStart(true)
        if(!history.location.state){
            showToast('error', 'Error', 'No se encontro el remate')
            history.goBack();
        }else{
            const {auctionId} = history.location.state
            setAuctionId(auctionId)
            let fetchURL = `${url.AUCTION_BATCH_API}/by-auction/${auctionId}?limit=${paginatorRows}&page=${paginatorPage}`
            fetchContext.authAxios.get(fetchURL)
            .then(res => {
                setBatchList(res.data.content)
                setTotalPages(res.data.totalPages)
                setLoadingStart(false)
            })
            .catch(err => {
                showToast('error', 'Error', 'Error al cargar los lotes')
                history.goBack();
            })
        }
    }, [paginatorFirst, paginatorRows, paginatorPage])

    const onPaginatorPageChange = (event) => {
        setPaginatorFirst(event.first);
        setPaginatorRows(event.rows);
        setPaginatorPage(event.page);
    }

    const editHandler = (animalOnGroundId) => {
        history.push(url.BATCH_CRUD, 
            {
                auctionId: auctionId,
                animalOnGroundId: animalOnGroundId
            }
        )
    }

    const itemCardList = batchList.map(batch => (
        <BatchListCard
            id={batch.id}
            key={batch.id}
            corralNumber={batch.corralNumber}
            dteNumber={batch.dteNumber}
            animalsOnGround={batch.animalsOnGround}
            editHandler={() => editHandler(batch.animalsOnGround[0].id)}
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
            <Card
                title={
                    <div className="flex justify-content-between">
                        <>{"Lotes"}</>
                        <Button 
                            icon="pi pi-arrow-left"
                            label="Volver"
                            className="btn btn-primary"
                            onClick={() => history.goBack()}
                        />
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
                    batchList.length === 0 ?
                        <div className="text-2xl flex justify-content-center">No hay lotes aún</div>
                    :
                        itemCardList
                }
            </Card>
        </>
    )
}

export default BatchList
