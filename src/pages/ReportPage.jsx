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
                showToast('warn', 'Error', error.response.data.errorMsg)
                history.goBack();
            })
        }
    },[])

    const downloadReportPdf = () => {
        fetchContext.authAxios.get(`${url.PDF_API}/report/${history.location.state.auctionId}?withCategoryInfo=${wantsCategoryInfoInPdf}&withSoldBatchList=${wantsSoldBatchListInPdf}`)
        .then(res => {
            /* Codigo para imprimir pdf
            window.open("").document.write(
                "<iframe width='100%' height='100%' src='data:application/pdf;base64, " +
                encodeURI(res.data) + "'></iframe>"
            )
            
            Codigo para descargar pdf */
            var a = window.document.createElement('a');
            a.href = `data:application/octet-stream;charset=utf-8;base64,${res.data}`
            a.download = "ResumenDeRemate.pdf";
            a.target='_blank'
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
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
                    <Button label="Aceptar" icon="pi pi-check" onClick={() => downloadReportPdf()} autoFocus className="btn btn-primary" />
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

    const priceBodyTemplateMoneyIncome = (rowData) => {
        return `$${rowData.totalMoneyIncome}`
    }

    const priceBodyTemplateMoneyInvested = (rowData) => {
        return `$${rowData.totalMoneyInvested}`
    }

    const AccordionTabContent = ({category}) => (
        <>
            <><b>{`Cantidad de animales vendidos: `}</b>{`${category.totalAnimalsSold}`}</>
            <br/>
            <><b>{`Cantidad de animales no vendidos: `}</b>{`${category.totalAnimalsNotSold}`}</>
            <br/>
            <><b>{`Total de dinero generado: `}</b>{`$${category.totalMoneyIncome}`}</>
            <br/>
            <br/>
            {/* Selles table */}
            {category.sellers.length > 0 ?
                <DataTable 
                    header="Vendedores" 
                    value={category.sellers} 
                    showGridlines 
                    responsiveLayout="scroll"
                    scrollable={isSmallScreen()?true:false}
                    scrollDirection="horizontal"
                >
                    <Column field="name" header="Nombre" sortable style={{ minWidth: '300px' }}/>
                    <Column field="totalAnimalsSold" header="Animales vendidos" sortable style={{ minWidth: '100px' }}/>
                    <Column field="totalAnimalsNotSold" header="Animales no vendidos" sortable style={{ minWidth: '100px' }}/>
                    <Column field="totalMoneyIncome" body={priceBodyTemplateMoneyIncome} header="Dinero generado" sortable style={{ minWidth: '100px' }}/>
                </DataTable>
            :
                <DataTable 
                    header="No hay vendedores"
                />
            }
            <br/>
            {/* Buyers table */}
            {category.buyers.length > 0 ?
                <DataTable 
                    header="Compradores" 
                    value={category.buyers} 
                    showGridlines 
                    responsiveLayout="scroll"
                    scrollable={isSmallScreen()?true:false}
                    scrollDirection="horizontal"
                >
                    <Column field="name" header="Nombre" sortable style={{ minWidth: '300px' }}/>
                    <Column field="totalBought" header="Animales comprados" sortable style={{ minWidth: '100px' }}/>
                    <Column field="totalMoneyInvested" body={priceBodyTemplateMoneyInvested} header="Dinero invertido" sortable style={{ minWidth: '100px' }}/>
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
            <div><b>{`Numero de Senasa: `}</b>{`${generalInfo.senasaNumber}`}</div>
            <div><b>{`Localidad: `}</b>{`${generalInfo.locality}`}</div>
            <div><b>{`Fecha: `}</b>{`${parseDateToShow(generalInfo.date)} - ${parseDateTimeToShow(generalInfo.date)}`}</div>
            <div><b>{"Participantes: "}</b></div>
            {/*Si la pantalla es chica los muestro uno por renglon, sino seguidos separados por comas*/}
            {generalInfo.consignees && generalInfo.consignees.length===0 ?
                <div className="ml-4"><b>{`Sin consignatarios`}</b></div>
            :
                <div className="ml-4">
                    <b>{`Consignatario${generalInfo.consignees && generalInfo.consignees.length>1?"s":""}: `}</b>
                    {isSmallScreen() ?
                        <>
                            {generalInfo.consignees?
                                generalInfo.consignees.map((consignee, index) => (
                                    <div key={index}>{consignee.name}</div>
                                ))
                            :
                                null
                            }
                        </>
                    :
                        <>
                            <>{generalInfo.consignees?arrayToStringSeparatedByComma(generalInfo.consignees):null}</>
                            <br/>
                        </>
                    }
                </div>
            }
            
            {/*Si la pantalla es chica los muestro uno por renglon, sino seguidos separados por comas*/}
            {generalInfo.assistants && generalInfo.assistants.length===0?
                <div className="ml-4"><b>{"Sin asistentes"}</b></div>
            :
                <div className="ml-4">
                    <>{`Asistente${generalInfo.assistants && generalInfo.assistants.length>1?"s":""}: `}</>
                    {isSmallScreen() ?
                        <>
                            {generalInfo.assistants?
                                generalInfo.assistants.map((assistant, index) => (
                                    <div key={index}>{assistant.name}</div>
                                ))
                            :
                                null
                            }
                        </>
                    :
                        generalInfo.assistants?arrayToStringSeparatedByComma(generalInfo.assistants):null
                    }
                </div>
            }
            
            <div><b>{`Cantidad de vendedores: `}</b>{`${generalInfo.totalSeller}`}</div>
            <div><b>{`Cantidad de compradores: `}</b>{`${generalInfo.totalBuyers}`}</div>
            <div><b>{`Cantidad de lotes (por corral) que entraron: `}</b>{`${generalInfo.totalBatchesForSell}`}</div>
            <div><b>{`Lotes (por corral) totalmente vendidos: `}</b>{`${generalInfo.totalCompletelySoldBatches}`}</div>
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
                    !isSmallScreen()?mainScreen:null
                }
            </Card>
            {isSmallScreen()?<div className="card">{mainScreen}</div>:null}
        </>
    )
};

export default ReportPage;
