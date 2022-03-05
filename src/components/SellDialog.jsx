import React, {useState} from 'react';

import { InputText } from 'primereact/inputtext';
import { AutoComplete } from 'primereact/autocomplete';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';

//Mas alla del nombre, este dialogo se usa tanto en la pantalla Auction para vender como en la FinalBatches para editar

const SellDialog = ({isCreating, acceptHandler, setDisplayDialog, displayDialog, url, fetchContext, showToast, editingItem, setEditingItem}) => {

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
            header={isCreating?`Vender animales`:`Editar lote`}
            visible={displayDialog}
            className="w-11 md:w-6"
            onHide={() => setDisplayDialog(false)}
            footer={
                <div className="">
                    <Button label="Cancelar" icon="pi pi-times" onClick={() => setDisplayDialog(false)} className="p-button-danger" />
                    <Button label="Aceptar" icon="pi pi-check" onClick={() => acceptHandler()} autoFocus className="btn btn-primary" />
                </div>
            }
            >
                <span className="p-float-label my-4 p-fluid">
                    <AutoComplete 
                        id='buyerAutocompleteForm'
                        className='w-full'
                        //Por tema de nombres, si esta creando trabajo con client, si esta editando, con buyer
                        value={editingItem?(isCreating?editingItem.client:editingItem.buyer):null}
                        suggestions={filteredClientList} 
                        completeMethod={searchClient} 
                        field="name" 
                        //dropdown 
                        forceSelection
                        onChange={(e) => setEditingItem(isCreating?{...editingItem, client:e.target.value}:{...editingItem, buyer:e.target.value})}
                    />
                    <label htmlFor="buyerAutocompleteForm">Comprador</label>
                </span>
                <div className="p-inputgroup mb-4">
                    <span className="p-inputgroup-addon">{editingItem && editingItem.mustWeigh ? `$/Kg` : `$/Cabeza`}</span>
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
                </div>
                <span className="p-float-label mb-4">
                    <InputText 
                        id="amount" 
                        className='w-full' 
                        value={editingItem?editingItem.amount:null}
                        keyfilter="pint"
                        onChange={e => setEditingItem({...editingItem, amount:e.target.value})}
                    />
                    <label htmlFor="amount">Cantidad</label>
                </span>
                <div className="p-inputgroup mb-4">
                    <span className="p-float-label">
                        <InputText 
                            id="term" 
                            className='w-full' 
                            value={editingItem?editingItem.paymentTerm:null}
                            keyfilter="pint"
                            onChange={e => setEditingItem({...editingItem, paymentTerm:e.target.value})}
                        />
                        <label htmlFor="term">Plazo (opcional)</label>
                    </span>
                    <span className="p-inputgroup-addon">dias</span>
                </div>
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
