import React, {useState, useEffect, useRef, useContext} from 'react';
import { useHistory } from "react-router-dom";

import { Button } from 'primereact/button';
import { Skeleton } from 'primereact/skeleton';
import { ScrollTop } from 'primereact/scrolltop';
import { Menu } from 'primereact/menu';
import { Dialog } from 'primereact/dialog';
import { Checkbox } from 'primereact/checkbox';

import { FetchContext } from '../context/FetchContext';
import * as url from '../util/url';
import { isSmallScreen } from '../util/miscFunctions'

import Card from '../components/cards/Card'

const ReportPage = ({showToast}) => {

    const fetchContext = useContext(FetchContext)
    const history = useHistory();

    const menu = useRef(null);

    const [loadingStart, setLoadingStart] = useState(false)

    const [displayPrintDialog, setDisplayPrintDialog] = useState(false)
    const [wantsCategoryInfoInPdf, setWantsCategoryInfoInPdf] = useState(true)
    const [wantsSoldBatchListInPdf, setWantsSoldBatchListInPdf] = useState(true)

    const [generalInfo, setGeneralInfo] = useState({})
    const [categoryInfo, setCategoryInfo] = useState([])

    useEffect(() => {
        setLoadingStart(true)
        if(!history.location.state){
            showToast('error', 'Error', 'No se encontro el remate')
            history.goBack();
        }else{
            const {auctionId} = history.location.state
            fetchContext.authAxios.get(url.REPORT_API+"/"+auctionId)
            .then(res => {
                setGeneralInfo(res.data.generalInfo)
                setCategoryInfo(res.data.categoryInfo)
                setLoadingStart(false)
            })
            .catch(error => {
                showToast('error', 'Error', error.response.data.errorMsg)
                //TODO history.goBack();
                setLoadingStart(false)
            })
        }
    },[])

    const printBillHandler = () => {
        fetchContext.authAxios.get(`${url.PDF_API}/report/${history.location.state.auctionId}?withCategoryInfo=${wantsCategoryInfoInPdf}&withSoldBatchList=${wantsSoldBatchListInPdf}`)
        .then(res => {
            window.open("").document.write(
                "<iframe width='100%' height='100%' src='data:application/pdf;base64, " +
                encodeURI(res.data) + "'></iframe>"
            )
        })
        .catch(error => {
            showToast('error', 'Error', error.response.data.errorMsg)
        })
        .finally(() => {
            setDisplayPrintDialog(false)
        })
    }

    const infoScreen = (
        <></>
    )

    const topButtons = (
        <div>
            <Button 
                icon="pi pi-arrow-left"
                label="Volver"
                className="btn btn-primary mr-3"
                onClick={() => history.goBack()}
            />
            <Button 
                label="Imprimir" 
                icon="pi pi-print" 
                className="btn btn-primary"
                onClick={() => setDisplayPrintDialog(true)}
            />
        </div>
    )

    const menuItems = [
        {
            icon: "pi pi-arrow-left",
            label: "Volver",
            command: () => history.goBack()
        },
        {
            icon: "pi pi-print",
            label: "Imprimir",
            command: () => setDisplayPrintDialog(true)
        }
    ]

    const printDialog = (
        <Dialog
            header="Imprimir"
            visible={displayPrintDialog}
            className="w-11 md:w-6"
            onHide={() => setDisplayPrintDialog(false)}
            footer={
                <div>
                    <Button label="Cancelar" icon="pi pi-times" onClick={() => setDisplayPrintDialog(false)} className="p-button-danger" />
                    <Button label="Aceptar" icon="pi pi-check" onClick={() => printBillHandler()} autoFocus className="btn btn-primary" />
                </div>
            }
        >
            <label>Se generará un archivo con la información general del remate</label>
            <br/><br/>
            <label>Agregar la informacion por categoria</label>
            <br/><br/>
            <div className="field-checkbox">
                <Checkbox inputId="categoryInfoPdf" checked={wantsCategoryInfoInPdf} onChange={e => setWantsCategoryInfoInPdf(e.checked)} />
                <label htmlFor="categoryInfoPdf">{wantsCategoryInfoInPdf ? 'Si' : 'No'}</label>
            </div>
            <label>Agregar un listado con los lotes vendidos</label>
            <br/><br/>
            <div className="field-checkbox">
                <Checkbox inputId="soldBatchListPdf" checked={wantsSoldBatchListInPdf} onChange={e => setWantsSoldBatchListInPdf(e.checked)} />
                <label htmlFor="soldBatchListPdf">{wantsSoldBatchListInPdf ? 'Si' : 'No'}</label>
            </div>
        </Dialog>
    )

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
            {printDialog}
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
                        <>{isSmallScreen()?"Resumen":"Resumen del remate"}</>
                        {!isSmallScreen()?//Pantalla grande: botones a la derecha del titulo
                            topButtons
                        ://Pantalla chica: menu desplegable
                            <Button 
                                icon="pi pi-bars"
                                label="Menu"
                                className="sm-menubar-button m-0"
                                onClick={(event) => menu.current.toggle(event)}
                            />
                        }
                    </div>
                }
            >
                {loadingStart?
                    loadingScreen
                :
                    infoScreen
                }
            </Card>
        </>
    )
};

export default ReportPage;
