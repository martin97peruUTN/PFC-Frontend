import React, {useState, useEffect, useRef, useContext} from 'react';
import { useHistory } from "react-router-dom";
import * as url from '../util/url';
import { ADMIN_ROLE } from '../util/constants';

import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { Skeleton } from 'primereact/skeleton';
import { confirmDialog } from 'primereact/confirmdialog';
import { Paginator } from 'primereact/paginator';
import { ScrollTop } from 'primereact/scrolltop';

import { FetchContext } from '../context/FetchContext';
import { AuthContext } from '../context/AuthContext';

import Card from '../components/cards/Card'
import UserCard from '../components/cards/UserCard'

const UserList = () => {

    const fetchContext = useContext(FetchContext)
    const authContext = useContext(AuthContext)
    const history = useHistory();
    const toast = useRef(null);
    const showToast = (severity, summary, message) => {
        toast.current.show({severity:severity, summary: summary, detail:message});
    }

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

    useEffect(() => {
        setLoadingStart(true);
        fetchContext.authAxios.get(`${url.USER_API}/user-list?page=${paginatorPage}&limit=${paginatorRows}${searchValue ? `&name=${searchValue}` : ''}`)
        .then(res => {
            setItemList(res.data.content)
            setTotalPages(res.data.totalPages)
            setLoadingStart(false)
        })
        .catch(err => {
            showToast('error', 'Error', 'No se pudo conectar al servidor')
            setTimeout(() => {
                history.push(url.HOME);
            }, 2000);
        })
    }, [refresh, searchValue, paginatorFirst, paginatorRows, paginatorPage])

    const onPaginatorPageChange = (event) => {
        setPaginatorFirst(event.first);
        setPaginatorRows(event.rows);
        setPaginatorPage(event.page);
    }

    //Se dispara al tocar el boton crear
    const createItemHandler = () => {
        if(authContext.isAdmin()){
            history.push(url.USER_CRUD);
        }else{
            showToast("error", "Error", "No tiene permisos para crear usuarios")
        }
    }

    const editHandler = (id) => {
        if(authContext.isAdmin()){
            history.push(url.USER_CRUD, {userId: id});
        }else{
            showToast("error", "Error", "No tiene permisos para editar usuarios")
        }
    }

    const deleteHandler = (id, rol) => {
        //No deberia llegar a disparar esto igual, este if es solo por las dudas
        if(authContext.isAdmin() && rol!==ADMIN_ROLE){
            confirmDialog({
                header: 'Confirmación',
                message: `¿Está seguro que desea eliminar el usuario?`,
                acceptLabel: 'Si',
                className: 'w-9 md:w-6',
                rejectLabel: 'No',
                acceptClassName: 'p-button-danger',
                accept: () => {
                    fetchContext.authAxios.delete(`${url.USER_API}/${id}`)
                    .then(res => {
                        showToast('success', 'Exito', 'El usuario ha sido eliminado')
                        setRefresh(!refresh)
                    })
                    .catch(err => {
                        showToast('error', 'Error', 'No se pudo eliminar el usuario')
                    })
                }
            });
        }else{
            showToast("error", "Error", "No tiene permisos para eliminar usuarios")
        }
    }

    //Listado de los items a mostrar en pantalla
    const itemCardList = itemList.map((item) => (
        <UserCard
            key={item.id}
            id={item.id}
            name={item.name}
            lastname={item.lastname}
            username={item.username}
            rol={item.rol}
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
            <Toast ref={toast} />
            <ScrollTop />
            <Card
                title={
                    <div className="flex justify-content-between">
                    <>{"Usuarios"}</>
                    {
                    authContext.isAdmin() ?
                    <Button 
                        className="btn btn-primary" 
                        icon="pi pi-plus" 
                        onClick={()=> createItemHandler()} 
                        label={`Crear usuario`}
                    />
                    :
                    null
                    }
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

export default UserList
