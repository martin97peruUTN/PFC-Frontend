import React, {useState, useEffect, useContext} from 'react'

import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { AutoComplete } from 'primereact/autocomplete';

import { FetchContext } from '../../context/FetchContext';
import * as url from '../../util/url';

import CardSecondary from './CardSecondary'

const ProvenanceCard = props => {

    const fetchContext = useContext(FetchContext)

    const [reference, setReference] = useState('')
    const [renspaNumber, setRenspaNumber] = useState('')
    const [locality, setLocality] = useState(null)

    const [filteredLocalityList, setFilteredLocalityList] = useState([])

    useEffect(() => {
        if(props.id){
            setReference(props.reference)
            setRenspaNumber(props.renspaNumber)
            setLocality(props.locality)
        }
    }, [])

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

    const setReferenceHandler = (value) => {
        setReference(value)
        props.updateProvenance(props.id, reference, renspaNumber, locality)
    }

    const setRenspaNumberHandler = (value) => {
        setRenspaNumber(value)
        props.updateProvenance(props.id, reference, renspaNumber, locality)
    }

    const setLocalityHandler = (value) => {
        setLocality(value)
        props.updateProvenance(props.id, reference, renspaNumber, locality)
    }

    return (
        <CardSecondary
            footer={
                <Button className="p-button-danger" icon="pi pi-trash" onClick={() => props.deleteProvenance(props.id)} label="Eliminar"></Button>
            }
        >
            <span className="p-float-label">
                <InputText
                    id="reference"
                    className='w-full' 
                    value={reference} 
                    onChange={e => setReferenceHandler(e.target.value)}
                    disabled={!props.enableEditing}
                />
                <label htmlFor="reference">Nombre</label>
            </span>
            <br/>
            <span className="p-float-label">
                <InputText
                    id="reference"
                    className='w-full' 
                    value={renspaNumber} 
                    onChange={e => setRenspaNumberHandler(e.target.value)}
                    disabled={!props.enableEditing}
                />
                <label htmlFor="reference">Renspa (opcional)</label>
            </span>
            <br/>
            <span className="p-float-label">
                <AutoComplete 
                    id='localityAutocompleteForm'
                    className='w-full'
                    value={locality} 
                    suggestions={filteredLocalityList} 
                    completeMethod={searchLocality} 
                    field="name" 
                    dropdown 
                    forceSelection 
                    onChange={(e) => setLocalityHandler(e.target.value)} 
                    disabled={!props.enableEditing}
                />
                <label htmlFor="localityAutocompleteForm">Localidad</label>
            </span>
        </CardSecondary>
    )
}

export default ProvenanceCard
