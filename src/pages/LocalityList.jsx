import React, {useState, useEffect, useRef, useContext} from 'react';
import { useHistory } from "react-router-dom";

import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { ProgressSpinner } from 'primereact/progressspinner';
import { confirmDialog } from 'primereact/confirmdialog';
import { Dialog } from 'primereact/dialog';
import { Paginator } from 'primereact/paginator';

import { FetchContext } from '../context/FetchContext';
import * as url from '../util/url';

import Card from '../components/cards/Card'
import SimpleNameCard from '../components/cards/SimpleNameCard'

const LocalityList = () => {

    const fetchContext = useContext(FetchContext)
    const history = useHistory();
    const toast = useRef(null);
    const showToast = (severity, summary, message) => {
        toast.current.show({severity:severity, summary: summary, detail:message});
    }

    const [loadingStart, setLoadingStart] = useState(false)

    const [localityList, setLocalityList] = useState([]);
    //al poner localityList en el useEffect tira error 429 el server
    //TODO probar si con el backend nuestro anda con localityList
    const [refresh, setRefresh] = useState(false);

    const [displayDialog, setDisplayDialog] = useState(false);
    const [editingItem, setEditingItem] = useState(null);

    //TODO cambiar esta url
    const baseURL = 'https://61895cd6d0821900178d795e.mockapi.io/api/locality'
    //const baseURL = url.LOCALITY_API

    //Paginator states
    const [paginatorFirst, setPaginatorFirst] = useState(0);
    const [paginatorRows, setPaginatorRows] = useState(10);

    const onPaginatorPageChange = (event) => {
        setPaginatorFirst(event.first);
        setPaginatorRows(event.rows);
    }
    
    useEffect(() => {
        setLoadingStart(true)
        fetchContext.authAxios.get(`${baseURL}?limit=${paginatorRows}&offset=${paginatorFirst}`)
        .then(response => {
            setLocalityList(response.data)
            setLoadingStart(false)
        })
        .catch(error => {
            //TODO ver que hacemos con el error
            showToast('error', 'Error', error.message)
            setTimeout(() => {
                history.push(url.HOME);
            }, 2000);
        })
    }, [refresh, paginatorFirst, paginatorRows, fetchContext.authAxios, history])

    //Se dispara al tocar el boton crear localidad, se abre el dialogo de creacion/edicion
    const createLocalityHandler = () => {
        setDisplayDialog(true)
        setEditingItem(null)
    }

    //Se dispara la tocar el boton editar, abre el dialogo de creacion/edicion y setea editingItem al que corresponde
    const editHandler = (id) => {
        setDisplayDialog(true)
        setEditingItem(localityList.find(item => item.id === id))
    }

    //Se dispara al tocar el boton aceptar en el dialogo
    const saveLocalityHandler = () => {
        //Si tiene id es que estoy haciendo una edicion, caso contrario, estoy creando uno nuevo
        if(editingItem.id){
            //TODO cambiar put por patch
            fetchContext.authAxios.put(`${baseURL}/${editingItem.id}`, editingItem)
            .then(response => {
                showToast('success', 'Exito', 'Localidad guardada')
                setRefresh(!refresh)
                setDisplayDialog(false)
                setEditingItem(null)
            })
            .catch(error => {
                showToast('error', 'Error', error.message)
            })
        }else{
            fetchContext.authAxios.post(baseURL, editingItem)
            .then(response => {
                showToast('success', 'Exito', 'Localidad guardada')
                setRefresh(!refresh)
                setDisplayDialog(false)
                setEditingItem(null)
            })
            .catch(error => {
                showToast('error', 'Error', error.message)
            })
        }
    }

    //Se dispara al tocar el boton eliminar, abre un dialogo de confirmacion
    const deleteHandler = (id) => {
        confirmDialog({
            header: 'Confirmación',
            message: '¿Está seguro que desea eliminar la localidad?',
            acceptLabel: 'Si',
            className: 'w-9 md:w-6',
            rejectLabel: 'No',
            acceptClassName: 'p-button-danger',
            accept: () => {
                fetchContext.authAxios.delete(`${baseURL}/${id}`)
                .then(response => {
                    showToast('success', 'Éxito', 'La localidad ha sido eliminada')
                    setRefresh(!refresh)
                })
                .catch(error => {
                    showToast('error', 'Error', error.message)
                    setTimeout(() => {
                        history.push(url.LOCALITIES);
                    }, 2000);
                })
            }
        });
    }

    //Listado de localidades a mostrar en pantalla
    const localityCardList = localityList.map((locality) => (
        <SimpleNameCard
            key={locality.id}
            id={locality.id}
            name={locality.name}
            editHandler={editHandler}
            deleteHandler={deleteHandler}
        />
    ))

    const editDialog = (
        <Dialog
            header={editingItem?"Editar localidad":"Crear localidad"}
            visible={displayDialog}
            className="w-11 md:w-6"
            onHide={() => setDisplayDialog(false)}
            footer={
                <div className="">
                    <Button label="Cancelar" icon="pi pi-times" onClick={() => setDisplayDialog(false)} className="p-button-danger" />
                    <Button label="Guardar" icon="pi pi-check" onClick={() => saveLocalityHandler()} autoFocus className="btn btn-primary" />
                </div>
            }
            >
                <br/>
                <span className="p-float-label">
                    <InputText id="name" className='w-full' value={editingItem?editingItem.name:null} onChange={e => setEditingItem({...editingItem, name:e.target.value})}/>
                    <label htmlFor="name">Nombre</label>
                </span>
        </Dialog>
    )

    return (
        <>
            <Toast ref={toast} />
            {editDialog}
            {
            loadingStart?
            <div style={{"display": "flex"}}>
                <ProgressSpinner/>
            </div>
            :
            <Card
                title={
                    <div className="flex justify-content-between">
                    <>{"Localidades"}</>
                    <Button className="btn btn-primary" icon="pi pi-plus" onClick={()=> createLocalityHandler()} label="Crear localidad"></Button>
                    </div>
                }
                footer={
                    <Paginator
                        first={paginatorFirst}
                        rows={paginatorRows}
                        //TODO cambiar 120 por el total de resultados
                        totalRecords={120}
                        rowsPerPageOptions={[10, 20, 30]}
                        onPageChange={onPaginatorPageChange}
                    ></Paginator>
                }
            >
                {localityCardList}
            </Card>
            }         
        </>
    )
}

export default LocalityList
