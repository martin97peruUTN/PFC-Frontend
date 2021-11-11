import React, {useState, useEffect, useRef, useContext} from 'react';
import { useHistory } from "react-router-dom";
import * as url from '../util/url';

import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { ProgressSpinner } from 'primereact/progressspinner';
import { confirmDialog } from 'primereact/confirmdialog';
import { Dialog } from 'primereact/dialog';
import { Paginator } from 'primereact/paginator';
import { ScrollTop } from 'primereact/scrolltop';

import { FetchContext } from '../context/FetchContext';

import Card from './cards/Card'
import SimpleNameCard from './cards/SimpleNameCard'

const SimpleItemList = (props) => {

    //Aca depende si es localidad o categoria estos valores
    const urlAPI = props.urlAPI;
    const itemNameUppercase = props.itemNameUppercase;
    const itemNameLowercase = props.itemNameLowercase;

    const fetchContext = useContext(FetchContext)
    const history = useHistory();
    const toast = useRef(null);
    const showToast = (severity, summary, message) => {
        toast.current.show({severity:severity, summary: summary, detail:message});
    }

    const [loadingStart, setLoadingStart] = useState(false)
    
    //uso este estado "comodin" para refrescar la pagina cuando hay un cambio
    const [refresh, setRefresh] = useState(false);

    //Mostrar el dialogo de confirmacion o esconderlo
    const [displayDialog, setDisplayDialog] = useState(false);

    //Para mostrar un titulo u otro en el dialogo
    const [isEditing, setIsEditing] = useState(false);

    //Paginator states
    const [paginatorFirst, setPaginatorFirst] = useState(0);
    const [paginatorRows, setPaginatorRows] = useState(10);
    const [totalPages, setTotalPages] = useState(0);

    const [itemList, setItemList] = useState([]);

    //Item que se esta editando o creando (ver el Dialog)
    const [editingItem, setEditingItem] = useState(null);

    useEffect(() => {
        setLoadingStart(true)
        //paginatorFirst es 0, 10, 20, 30, etc, y yo necesito que sea 0, 1, 2, 3, etc, por eso lo divido por paginatorRows
        fetchContext.authAxios.get(`${urlAPI}?page=${paginatorFirst/paginatorRows}&limit=${paginatorRows}`)
        .then(response => {
            setItemList(response.data.content)
            setTotalPages(response.data.totalPages)
            setLoadingStart(false)
        })
        .catch(error => {
            showToast('error', 'Error', 'No se pudo conectar al servidor')
            setTimeout(() => {
                history.push(url.HOME);
            }, 2000);
        })
    }, [refresh, paginatorFirst, paginatorRows, fetchContext.authAxios, history])

    const onPaginatorPageChange = (event) => {
        setPaginatorFirst(event.first);
        setPaginatorRows(event.rows);
    }

    //Se dispara al tocar el boton crear, se abre el dialogo de creacion/edicion
    const createItemHandler = () => {
        setDisplayDialog(true)
        setEditingItem(null)
        setIsEditing(false)
    }

    //Se dispara la tocar el boton editar, abre el dialogo de creacion/edicion y setea editingItem al que corresponde
    const editHandler = (id) => {
        setDisplayDialog(true)
        setEditingItem(itemList.find(item => item.id === id))
        setIsEditing(true)
    }

    //Se dispara al tocar el boton aceptar en el dialogo
    const saveItemHandler = () => {
        if(editingItem && editingItem.name){
            //Si tiene id es que estoy haciendo una edicion, caso contrario, estoy creando uno nuevo
            if(editingItem.id){
                fetchContext.authAxios.patch(`${urlAPI}/${editingItem.id}`, editingItem)
                .then(response => {
                    showToast('success', 'Exito', `${itemNameUppercase} guardada`)
                    setRefresh(!refresh)
                    setDisplayDialog(false)
                    setEditingItem(null)
                })
                .catch(error => {
                    showToast('error', 'Error', `No se pudo guardar la ${itemNameLowercase}`)
                })
            }else{
                fetchContext.authAxios.post(urlAPI, editingItem)
                .then(response => {
                    showToast('success', 'Exito', `${itemNameUppercase} guardada`)
                    setRefresh(!refresh)
                    setDisplayDialog(false)
                    setEditingItem(null)
                })
                .catch(error => {
                    showToast('error', 'Error', `No se pudo guardar la ${itemNameLowercase}`)
                })
            }
        }else{
            showToast('warn', 'Cuidado', 'El campo esta vacio!')
        }
        
    }

    //Se dispara al tocar el boton eliminar, abre un dialogo de confirmacion
    const deleteHandler = (id) => {
        confirmDialog({
            header: 'Confirmación',
            message: `¿Está seguro que desea eliminar la ${itemNameLowercase}?`,
            acceptLabel: 'Si',
            className: 'w-9 md:w-6',
            rejectLabel: 'No',
            acceptClassName: 'p-button-danger',
            accept: () => {
                fetchContext.authAxios.delete(`${urlAPI}/${id}`)
                .then(response => {
                    showToast('success', 'Éxito', `La ${itemNameLowercase} ha sido eliminada`)
                    setRefresh(!refresh)
                })
                .catch(error => {
                    showToast('error', 'Error', `No se pudo eliminar la ${itemNameLowercase}`)
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

    const editDialog = (
        <Dialog
            header={isEditing?`Editar ${itemNameLowercase}`:`Crear ${itemNameLowercase}`}
            visible={displayDialog}
            className="w-11 md:w-6"
            onHide={() => setDisplayDialog(false)}
            footer={
                <div className="">
                    <Button label="Cancelar" icon="pi pi-times" onClick={() => setDisplayDialog(false)} className="p-button-danger" />
                    <Button label="Guardar" icon="pi pi-check" onClick={() => saveItemHandler()} autoFocus className="btn btn-primary" />
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
            <ScrollTop />
            {editDialog}
            {loadingStart?
            <div style={{"display": "flex"}}>
                <ProgressSpinner/>
            </div>
            :
            <Card
                title={
                    <div className="flex justify-content-between">
                    <>{`${itemNameUppercase}${itemNameUppercase==="Localidad"?"es":itemNameUppercase==="Categoria"?"s":null}`}</>
                    <Button className="btn btn-primary" icon="pi pi-plus" onClick={()=> createItemHandler()} label={`Crear ${itemNameLowercase}`}></Button>
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
                {itemCardList}
            </Card>
            }         
        </>
    )
}

export default SimpleItemList
