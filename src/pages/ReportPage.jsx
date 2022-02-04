import React, {useState, useEffect, useRef, useContext} from 'react';
import { useHistory } from "react-router-dom";

import { Button } from 'primereact/button';
import { Skeleton } from 'primereact/skeleton';
import { ScrollTop } from 'primereact/scrolltop';
import { Menu } from 'primereact/menu';
import { Dialog } from 'primereact/dialog';
import { Checkbox } from 'primereact/checkbox';
import { Accordion, AccordionTab } from 'primereact/accordion';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Divider } from 'primereact/divider';

import { FetchContext } from '../context/FetchContext';
import * as url from '../util/url';
import { isSmallScreen, parseDateToShow, parseDateTimeToShow, arrayToStringSeparatedByComma } from '../util/miscFunctions'

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

    const [activeIndexArray, setActiveIndexArray] = useState([])

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
                setCategoryInfo(res.data.categoryList)
                setLoadingStart(false)
                setActiveIndexArray(activeIndexArray.push(0))
            })
            .catch(error => {
                showToast('error', 'Error', error.response.data.errorMsg)
                history.goBack();
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

    const AccordionTabContent = ({category}) => (
        <>
            <>{`Cantidad de animales vendidos: ${category.totalAnimalsSold}`}</>
            <br/>
            <>{`Cantidad de animales no vendidos: ${category.totalAnimalsNotSold}`}</>
            <br/>
            <>{`Total de dinero generado: ${category.totalMoneyIncome}`}</>
            <br/>
            <br/>
            {/* Selles table */}
            <DataTable 
                header="Vendedores" 
                value={category.sellers} 
                showGridlines 
                responsiveLayout="scroll"
            >
                <Column field="name" header="Nombre" sortable style={{width:'40%'}}/>
                <Column field="totalAnimalsSold" header="Animales vendidos" sortable style={{width:'20%'}}/>
                <Column field="totalAnimalsNotSold" header="Animales no vendidos" sortable style={{width:'20%'}}/>
                <Column field="totalMoneyIncome" header="Dinero generado" sortable style={{width:'20%'}}/>
            </DataTable>
            <br/>
            {/* Buyers table */}
            {category.buyers.length > 0 ?
                <DataTable 
                    header="Compradores" 
                    value={category.buyers} 
                    showGridlines 
                    responsiveLayout="scroll"
                >
                    <Column field="name" header="Nombre" sortable style={{width:'60%'}}/>
                    <Column field="totalBought" header="Animales vendidos" sortable style={{width:'20%'}}/>
                    <Column field="totalMoneyInvested" header="Dinero invertido" sortable style={{width:'20%'}}/>
                </DataTable>
            :
                <DataTable 
                    header="No hay compradores"
                />
            }
        </>
    )

    const generalInfoToShow = (
        <div className="text-lg">
            <div>{`Numero de Senasa: ${generalInfo.senasaNumber}`}</div>
            <div>{`Localidad: ${generalInfo.locality}`}</div>
            <div>{`Fecha: ${parseDateToShow(generalInfo.date)} - ${parseDateTimeToShow(generalInfo.date)}`}</div>
            <div>{"Participantes:"}</div>
            <>{`Consignatario${generalInfo.consignees && generalInfo.consignees.length>1?"s":""}: `}</>
            <>{generalInfo.consignees?arrayToStringSeparatedByComma(generalInfo.consignees):null}</>
            <br/>
            {generalInfo.assistants && generalInfo.assistants.length===0?
                <div>{"Sin asistentes"}</div>
            :
                <>{`Asistente${generalInfo.assistants && generalInfo.assistants.length>1?"s":""}: `}</>
            }
            {generalInfo.assistants?arrayToStringSeparatedByComma(generalInfo.assistants):null}
            <div>{`Cantidad de vendedores: ${generalInfo.totalSeller}`}</div>
            <div>{`Cantidad de compradores: ${generalInfo.totalBuyers}`}</div>
            <div>{`Cantidad de lotes (por corral) que entraron: ${generalInfo.totalBatchesForSell}`}</div>
            <div>{`Lotes (por corral) totalmente vendidos: ${generalInfo.totalCompletelySoldBatches}`}</div>
        </div>
    )

    const mainScreen = (
        <>
            <Accordion
                multiple
                activeIndex={activeIndexArray}
            >
                <AccordionTab header={"Informacion general"}>
                    {generalInfoToShow}
                    <Divider/>
                    <AccordionTabContent
                        category={generalInfo.commonInfo}
                    />
                </AccordionTab>
                {categoryInfo.map(category => (
                    <AccordionTab header={category.name} key={category.name}>
                        <AccordionTabContent
                            category={category}
                        />
                    </AccordionTab>
                ))}
            </Accordion>
        </>
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
                    mainScreen
                }
            </Card>
        </>
    )
};

export default ReportPage;
