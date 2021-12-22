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

const FinalBatches = ({showToast}) => {

    const fetchContext = useContext(FetchContext)
    const authContext = useContext(AuthContext);
    const history = useHistory();

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

    return (
        <div>
            
        </div>
    )
}

export default FinalBatches
