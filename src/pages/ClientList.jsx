import React, {useState, useEffect, useContext} from 'react'
import { useHistory } from "react-router-dom";
import * as url from '../util/url';

import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Skeleton } from 'primereact/skeleton';
import { confirmDialog } from 'primereact/confirmdialog';
import { Paginator } from 'primereact/paginator';
import { ScrollTop } from 'primereact/scrolltop';

import { FetchContext } from '../context/FetchContext';

import Card from '../components/cards/Card'
import SimpleNameCard from '../components/cards/SimpleNameCard'

const ClientList = ({showToast}) => {

    const fetchContext = useContext(FetchContext)
    const history = useHistory();

    const [loadingStart, setLoadingStart] = useState(false)
    
    //uso este estado "comodin" para refrescar la pagina cuando hay un cambio
    const [refresh, setRefresh] = useState(false);

    //Paginator states
    const [paginatorFirst, setPaginatorFirst] = useState(0);
    const [paginatorRows, setPaginatorRows] = useState(10);
    const [paginatorPage, setPaginatorPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    const [itemList, setItemList] = useState([]);

    //Valor de la barra de busqueda
    const [searchValue, setSearchValue] = useState('');

    /*useEffect(() => {
        setLoadingStart(true)
        fetchContext.authAxios.get(`${url.CLIENT_API}?page=${paginatorPage}&limit=${paginatorRows}${searchValue ? `&name=${searchValue}` : ''}`)
        .then(response => {
            setItemList(response.data.content)
            setTotalPages(response.data.totalPages)
            setLoadingStart(false)
        })
        .catch(error => {
            showToast('error', 'Error', 'No se pudo conectar al servidor')
            history.push(url.HOME);
        })
    },[refresh, paginatorFirst, paginatorRows, searchValue])*/

    //PRUEBA //TODO sacar esto
    useEffect(() => {
        setLoadingStart(true)
        fetchContext.authAxios.get(`https://61895cd6d0821900178d795e.mockapi.io/api/client`)
        .then(response => {
            setItemList(response.data)
            //setTotalPages(response.data.totalPages)
            setLoadingStart(false)
        })
        .catch(error => {
            showToast('error', 'Error', 'No se pudo conectar al servidor')
            history.push(url.HOME);
        })
    },[refresh, paginatorFirst, paginatorRows, searchValue])

    const onPaginatorPageChange = (event) => {
        setPaginatorFirst(event.first);
        setPaginatorRows(event.rows);
        setPaginatorPage(event.page);
    }

    const createHandler = () => {
        history.push(url.CLIENT_CRUD)
    }

    const editHandler = (id) => {
        history.push(url.CLIENT_CRUD, {id: id})
    }

    const deleteHandler = (id) => {
        confirmDialog({
            header: 'Confirmación',
            message: `¿Está seguro que desea eliminar el cliente?`,
            acceptLabel: 'Si',
            className: 'w-9 md:w-6',
            rejectLabel: 'No',
            acceptClassName: 'p-button-danger',
            accept: () => {
                fetchContext.authAxios.delete(`${url.CLIENT_API}/${id}`)
                .then(res => {
                    showToast('success', 'Exito', 'El cliente ha sido eliminado')
                    setRefresh(!refresh)
                })
                .catch(err => {
                    showToast('error', 'Error', 'No se pudo eliminar el cliente')
                })
            }
        });
    }

    //Listado de los items a mostrar en pantalla
    const itemCardList = itemList.map((item) => (
        <SimpleNameCard
            key={item.id}
            id={item.id}
            name={item.name}
            editHandler={editHandler}
            deleteHandler={deleteHandler}
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
                    <>{`Clientes`}</>
                    <Button 
                        className="btn btn-primary" 
                        icon="pi pi-plus" 
                        onClick={()=> createHandler()} 
                        label={`Crear cliente`}/>
                    </div>
                }
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
                    <InputText id="search" className='w-full' value={searchValue} onChange={e => setSearchValue(e.target.value)}/>
                    <label htmlFor="search">Buscar</label>
                </span>
                <br/>
                {loadingStart?
                    loadingScreen
                    :
                    itemCardList
                }
            </Card>     
        </>
    )
}

export default ClientList
