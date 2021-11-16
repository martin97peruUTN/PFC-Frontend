import React, {useState, useEffect, useRef, useContext} from 'react';
import { useHistory } from "react-router-dom";

import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { Skeleton } from 'primereact/skeleton';

import { AuthContext } from '../context/AuthContext';
import { FetchContext } from '../context/FetchContext';
import * as url from '../util/url';

import Card from '../components/cards/Card'
import BatchCard from '../components/cards/BatchCard'

const Auction = () => {

    const authContext = useContext(AuthContext)
    const fetchContext = useContext(FetchContext)
    const history = useHistory();
    const toast = useRef(null);
    const showToast = (severity, summary, message) => {
        toast.current.show({severity:severity, summary: summary, detail:message});
    }

    const [loadingStart, setLoadingStart] = useState(false)

    const [auctionId, setAuctionId] = useState()
    const [batches, setBatches] = useState([])

    useEffect(() => {
        setLoadingStart(true)
        if(!history.location.state){
            showToast('error', 'Error', 'No se encontro el remate')
            setTimeout(() => {
                history.goBack();
            }, 3000)
        }else{
            setAuctionId(history.location.state.auctionId)
            fetchContext.authAxios.get(`${url.AUCTION_BATCHES_API}/${auctionId}`)
            .then(response => {
                setBatches(response.data)
                setLoadingStart(false)
            })
            .catch(error => {
                showToast('error', 'Error', 'No se pudo obtener los lotes del remate')
                setTimeout(() => {
                    history.goBack();
                }, 3000)
            })
        }
    }, [])

    const itemCardList = batches.map(batch => {
        <BatchCard
            id={batch.id}
        />
    })

    return (
        <>
            <Toast ref={toast} />

        </>
    )
}

export default Auction
