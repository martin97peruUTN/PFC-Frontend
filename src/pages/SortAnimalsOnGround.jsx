import React, {useState, useEffect, useContext} from 'react';
import { useHistory } from "react-router-dom";

import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

import { Button } from 'primereact/button';
import { Skeleton } from 'primereact/skeleton';
import { confirmDialog } from 'primereact/confirmdialog';
import { OrderList } from 'primereact/orderlist';
import { ScrollPanel } from 'primereact/scrollpanel';
import { Tooltip } from 'primereact/tooltip';

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
            let fetchURL = `${url.ANIMALS_ON_GROUND_API}/by-auction/${auctionId}/allForSort`
            fetchContext.authAxios.get(fetchURL)
            .then(res => {
                setItems(res.data)
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

    //>>>react-beautiful-dnd<<<
    //https://github.com/atlassian/react-beautiful-dnd

    const itemTemplateCard = (item, isDragging) => (
        <div className={isDragging? "background-dragging sort-card shadow-2" : "background-not-dragging sort-card shadow-2"}>
            <b>{`Corral: `}</b>{`${item.corralNumber} - ${item.category.name}`}
            <br/>
            <b>{`Vendedor: `}</b>{`${item.seller.name}`}
            <br/>
            <b>{`Animales totales: `}</b>{`${item.amount} - Vendidos: ${item.soldAmount}`}
        </div>
    )

    const handleOnDragEnd = (result) => {
        if (!result.destination) {
            return;
        }
        const newItems = Array.from(items);
        const [reorderedItem] = newItems.splice(result.source.index, 1);
        newItems.splice(result.destination.index, 0, reorderedItem);
        setItems(newItems);
    }

    const reactBeautifulDnd = (
        <ScrollPanel style={{width: '100%', height: window.innerHeight*0.6}} className="custom-scroll-panel pr-3 md:pr-0">
            <DragDropContext onDragEnd={handleOnDragEnd}>
                <Droppable droppableId="animalsOnGround">
                    {(provided, snapshot) => (
                        <div {...provided.droppableProps} ref={provided.innerRef}>
                            {items.map((item, index) => (
                                <Draggable key={item.id} draggableId={`id-${item.id}`} index={index}>
                                    {(provided, snapshot) => (
                                        <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                                            {itemTemplateCard(item, snapshot.isDragging)}
                                        </div>
                                    )}
                                </Draggable>
                            ))}
                            {provided.placeholder}
                        </div>
                    )}
                </Droppable>
            </DragDropContext>
        </ScrollPanel>
    )

    //>>>termina react-beautiful-dnd<<<

    //Codigo que quedo del uso de OrderList
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
        <>
            <Tooltip target=".help-icon"/>
            <Card
                title={
                    <div>
                        {`Ordenar lotes para venta `}
                        {/*Muestro el tooltip a la derecha en pantalla grande y a abajo en pantalla chica*/}
                        <i 
                            className="pi pi-question-circle help-icon small-screen" 
                            style={{'fontSize': '.8em'}} 
                            data-pr-tooltip="Arrastre las tarjetas hacia arriba o abajo para reordenar los lotes"
                            data-pr-position={"bottom"}
                        />
                        <i 
                            className="pi pi-question-circle help-icon big-screen" 
                            style={{'fontSize': '.8em'}} 
                            data-pr-tooltip="Arrastre las tarjetas hacia arriba o abajo para reordenar los lotes"
                            data-pr-position={"right"}
                        />
                    </div>
                    }
                footer={
                    <div className="flex justify-content-between">
                        <Button label="Cancelar" icon="pi pi-arrow-left" onClick={() => history.goBack()} className="p-button-danger" />
                        <Button label="Guardar" icon="pi pi-check" loading={loadingAccept} onClick={() => saveHandler()} className="btn btn-primary" />
                    </div>
                }
            >
                {/*Codigo que quedo del uso de OrderList
                <OrderList 
                    value={items} 
                    header="Listado de lotes" 
                    dragdrop
                    listStyle={{height:'auto'}} 
                    dataKey="id"
                    itemTemplate={itemTemplate} 
                    onChange={(e) => setItems(e.value)}
                />*/}
                {items.length === 0?
                    <div className="text-2xl flex justify-content-center">No hay lotes para ordenar</div>
                :
                    reactBeautifulDnd
                }
            </Card>
        </>
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
