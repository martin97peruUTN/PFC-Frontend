import React, {useState, useEffect, useContext} from 'react';
import { useHistory } from "react-router-dom";

import { Button } from 'primereact/button';
import { Skeleton } from 'primereact/skeleton';
import { confirmDialog } from 'primereact/confirmdialog';
import { OrderList } from 'primereact/orderlist';

import { FetchContext } from '../context/FetchContext';

import Card from '../components/cards/Card'

import * as url from '../util/url';

const SortAnimalsOnGround = ({showToast}) => {

    const fetchContext = useContext(FetchContext)
    const history = useHistory();

    const [loadingStart, setLoadingStart] = useState(false)
    const [loadingAccept, setLoadingAccept] = useState(false)

    const [auctionId, setAuctionId] = useState()

    const [items, setItems] = useState([]);

    useEffect(() => {
        setLoadingStart(true)
        if(!history.location.state){
            showToast('error', 'Error', 'No se encontro el remate')
            history.goBack();
        }else{
            const {auctionId} = history.location.state
            setAuctionId(auctionId)
            //url de los "para venta", le puse 10000 como para que sea un numero grande
            let fetchURL = `${url.ANIMALS_ON_GROUND_API}/by-auction/${auctionId}?limit=${10000}&page=${0}&sold=false&notSold=false`
            fetchContext.authAxios.get(fetchURL)
            .then(res => {
                setItems(res.data.content)
                setLoadingStart(false)
            })
            .catch(error => {
                showToast('error', 'Error', 'No se pudo obtener los lotes del remate')
                history.goBack();
            })
        }
    },[])

    const saveHandler = () => {
        confirmDialog({
            message: '¿Esta seguro de que desea proceder?',
            header: 'Reordenar lotes',
            icon: 'pi pi-exclamation-circle',
            acceptLabel: 'Si',
            accept: () => {
                setLoadingAccept(true)
                let data = []
                let i = 0
                for(const item of items){
                    data.push({"id": item.id, "startingOrder": i})
                    i++
                }
                fetchContext.authAxios.patch(`${url.ANIMALS_ON_GROUND_API}/sort/${auctionId}`, data)
                .then(response => {
                    showToast('success', 'Exito', 'Se guardaron los cambios')
                    history.goBack();
                })
                .catch(error => {
                    showToast('error', 'Error', 'No se pudo guardar los cambios')
                })
                .finally(() => {
                    setLoadingAccept(false)
                })
            }
        });
    }

    const itemTemplate = (item) => (
        <div className="order-list-item">
            {`Corral: ${item.corralNumber} - ${item.category.name}`}
            <br/>
            {`Vendedor: ${item.seller.name}`}
            <br/>
            {`Animales totales: ${item.amount} - Vendidos: ${item.soldAmount}`}
        </div>
    )

    const body = (
        <Card
            title="Ordenar lotes para venta"
            footer={
                <div className="flex justify-content-between">
                    <Button label="Cancelar" icon="pi pi-arrow-left" onClick={() => history.goBack()} className="p-button-danger" />
                    <Button label="Guardar" icon="pi pi-check" loading={loadingAccept} onClick={() => saveHandler()} className="btn btn-primary" />
                </div>
            }
        >
            <OrderList 
                value={items} 
                header="Listado de lotes" 
                dragdrop
                listStyle={{height:'auto'}} 
                dataKey="id"
                itemTemplate={itemTemplate} 
                onChange={(e) => setItems(e.value)}
            />
        </Card>
    )
    
    const loadingScreen = (
        <div>
            <Skeleton width="100%" height="35rem"/>
        </div>
    )

    return (
        <>
        {loadingStart? 
            loadingScreen
        :
            body}
        </>
    )
}

export default SortAnimalsOnGround
