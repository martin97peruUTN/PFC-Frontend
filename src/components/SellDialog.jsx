import React, {useState, useEffect, useRef, useContext} from 'react';

import { InputText } from 'primereact/inputtext';
import { AutoComplete } from 'primereact/autocomplete';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';

const SellDialog = ({sellAnimalsHandler, setDisplayDialog, displayDialog, url, fetchContext, showToast, editingItem, setEditingItem}) => {

    //Para el autocomplete de comprador en el dialogo de vender
    const [filteredClientList, setFilteredClientList] = useState([])

    //Para el autocomplete de comprador en el dialogo de vender
    const searchClient = (event) => {
        fetchContext.authAxios.get(`${url.CLIENT_API}?name=${event.query}`)
        .then(response => {
            setFilteredClientList(response.data.content)
        })
        .catch(error => {
            showToast('error','Error','No se pudo obtener la lista de clientes')
        })
    }

    return (
        <Dialog
            header={`Vender animales`}
            visible={displayDialog}
            className="w-11 md:w-6"
            onHide={() => setDisplayDialog(false)}
            footer={
                <div className="">
                    <Button label="Cancelar" icon="pi pi-times" onClick={() => setDisplayDialog(false)} className="p-button-danger" />
                    <Button label="Aceptar" icon="pi pi-check" onClick={() => sellAnimalsHandler()} autoFocus className="btn btn-primary" />
                </div>
            }
            >
                <br/>
                <span className="p-float-label">
                    <AutoComplete 
                        id='buyerAutocompleteForm'
                        className='w-full'
                        value={editingItem?editingItem.client:null} 
                        suggestions={filteredClientList} 
                        completeMethod={searchClient} 
                        field="name" 
                        dropdown 
                        forceSelection
                        onChange={(e) => setEditingItem({...editingItem, client:e.target.value})}
                    />
                    <label htmlFor="buyerAutocompleteForm">Comprador</label>
                </span>
                <br/>
                <span className="p-float-label">
                    <InputText 
                        id="price" 
                        className='w-full' 
                        value={editingItem?editingItem.price:null}
                        keyfilter="num"
                        onChange={e => setEditingItem({...editingItem, price:e.target.value})}
                    />
                    <label htmlFor="price">Precio</label>
                </span>
                <br/>
                <span className="p-float-label">
                    <InputText 
                        id="amount" 
                        className='w-full' 
                        value={editingItem?editingItem.amount:null}
                        keyfilter="pint"
                        onChange={e => setEditingItem({...editingItem, amount:e.target.value})}
                    />
                    <label htmlFor="amount">Cantidad</label>
                </span>
                <br/>
                <Button 
                    className="btn btn-primary" 
                    icon={editingItem && editingItem.mustWeigh?"pi pi-check-circle":"pi pi-times-circle"}
                    onClick={() => setEditingItem({...editingItem, mustWeigh:!editingItem.mustWeigh})}
                    label={editingItem && editingItem.mustWeigh?"Se pesa":"No se pesa"}
                />
        </Dialog>
    )
}

export default SellDialog
