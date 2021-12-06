import React, {useState, useEffect, useContext} from 'react';
import { useHistory } from "react-router-dom";

import { Button } from 'primereact/button';
import { AutoComplete } from 'primereact/autocomplete';
import { confirmDialog } from 'primereact/confirmdialog';

import { AuthContext } from '../context/AuthContext';
import { FetchContext } from '../context/FetchContext';
import * as url from '../util/url';

import Card from '../components/cards/Card'

const AddParticipant = ({showToast}) => {

    const authContext = useContext(AuthContext)
    const fetchContext = useContext(FetchContext)
    const history = useHistory();

    const [loadingAccept, setLoadingAccept] = useState(false)
    const [loadingStart, setLoadingStart] = useState(false)

    const [auctionId, setAuctionId] = useState(null)
    const [participants, setParticipants] = useState([]);

    useEffect(() => {
        if(history.location.state){
            setLoadingStart(true)
            const {auctionId} = history.location.state
            setAuctionId(auctionId)
            fetchContext.authAxios.get(`${url.USER_AUCTIONS_API}/${auctionId}`)
            .then(res => {
                setParticipants(res.data.participants)
                setLoadingStart(false)
            })
            .catch(err => {
                showToast('error', 'Error', 'No se pudo cargar la información')
                history.goBack()
            })
        }else{
            showToast('error', 'Error', 'No se pudo cargar la información')
            history.goBack()
        }
    },[])

    return (
        <div>
            
        </div>
    )
}

export default AddParticipant
