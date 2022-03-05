import React, {useState} from 'react';

import { InputText } from 'primereact/inputtext';
import { AutoComplete } from 'primereact/autocomplete';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';

const EditAnimalOnGroundDialog = ({acceptHandler, setDisplayDialog, displayDialog, url, fetchContext, showToast, editingItem, setEditingItem}) => {

    //Para el autocomplete de comprador en el dialogo de vender
    const [filteredCategoryList, setFilteredCategoryList] = useState([])

    const searchCategory = (event) => {
        fetchContext.authAxios.get(`${url.CATEGORY_API}?name=${event.query}`)
        .then(response => {
            setFilteredCategoryList(response.data.content)
        })
        .catch(error => {
            showToast('error','Error','No se pudo obtener la lista de categorias')
        })
    }

    return (
        <Dialog
            header={(editingItem && editingItem.id)?`Editar animales`:`Agregar animales`}
            visible={displayDialog}
            className="w-11 md:w-6"
            onHide={() => setDisplayDialog(false)}
            footer={
                <div className="">
                    <Button label="Cancelar" icon="pi pi-times" onClick={() => setDisplayDialog(false)} className="p-button-danger" />
                    <Button label="Guardar" icon="pi pi-check" onClick={() => acceptHandler()} autoFocus className="btn btn-primary" />
                </div>
            }
            >
                <br/>
                <span className="p-float-label mb-4 p-fluid">
                    <AutoComplete 
                        id='categoryAutocompleteForm'
                        className='w-full'
                        value={editingItem?editingItem.category:null} 
                        suggestions={filteredCategoryList} 
                        completeMethod={searchCategory} 
                        field="name" 
                        //dropdown 
                        forceSelection 
                        onChange={(e) => setEditingItem({...editingItem, category:e.target.value})}
                    />
                    <label htmlFor="categoryAutocompleteForm">Categoria</label>
                </span>
                <span className="p-float-label">
                    <InputText 
                        id="amount" 
                        className='w-full'
                        keyfilter="int" 
                        value={editingItem?editingItem.amount:''} 
                        onChange={e => setEditingItem({...editingItem, amount:e.target.value})}
                    />
                    <label htmlFor="amount">Cantidad</label>
                </span>
        </Dialog>
    )
}

export default EditAnimalOnGroundDialog
