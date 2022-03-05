import React, {useState, useContext} from 'react'

import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { AutoComplete } from 'primereact/autocomplete';

import { FetchContext } from '../../context/FetchContext';
import * as url from '../../util/url';

import CardSecondary from './CardSecondary'

const ProvenanceCard = props => {

    const fetchContext = useContext(FetchContext)

    const [filteredLocalityList, setFilteredLocalityList] = useState([])

    //Busqueda de localidades por nombre para el autocomplete
    const searchLocality = (event) => {
        fetchContext.authAxios.get(`${url.LOCALITY_API}?name=${event.query}`)
        .then(response => {
            setFilteredLocalityList(response.data.content)
        })
        .catch(error => {
            props.showToast('error','Error','No se pudo obtener la lista de localidades')
        })
    }

    return (
        <CardSecondary
            footer={
                props.enableEditing?
                    <Button className="p-button-danger" icon="pi pi-trash" onClick={props.deleteProvenance} label="Eliminar"></Button>
                    :
                    null
            }
        >
            <span className="p-float-label">
                <InputText
                    id="reference"
                    className='w-full' 
                    value={props.reference} 
                    onChange={e => props.updateProvenance(e.target.value, 'reference')}
                    disabled={!props.enableEditing}
                />
                <label htmlFor="reference">Nombre/Referencia</label>
            </span>
            <br/>
            <span className="p-float-label">
                <InputText
                    id="renspaNumber"
                    className='w-full' 
                    value={props.renspaNumber} 
                    onChange={e => props.updateProvenance(e.target.value, 'renspaNumber')}
                    disabled={!props.enableEditing}
                />
                <label htmlFor="renspaNumber">Renspa (opcional)</label>
            </span>
            <br/>
            <span className="p-float-label p-fluid">
                <AutoComplete 
                    id='localityAutocompleteForm'
                    className='w-full'
                    value={props.locality} 
                    suggestions={filteredLocalityList} 
                    completeMethod={searchLocality} 
                    field="name" 
                    //dropdown 
                    forceSelection 
                    onChange={(e) => props.updateProvenance(e.target.value, 'locality')} 
                    disabled={!props.enableEditing}
                />
                <label htmlFor="localityAutocompleteForm">Localidad</label>
            </span>
        </CardSecondary>
    )
}

export default ProvenanceCard
