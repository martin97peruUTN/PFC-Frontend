import React, {useState, useRef, useEffect} from 'react'
import ConstructionCard from '../components/cards/ConstructionCard'
import Card from '../components/cards/Card'
import axios from 'axios'
import {userService} from '../Url'
import { Button } from 'primereact/button'
import { Toast } from 'primereact/toast';
import { AutoComplete } from 'primereact/autocomplete';
import { ProgressSpinner } from 'primereact/progressspinner';

const RegistrarObra = ({history}) => {

    const[loadingSubmit, setLoadingSubmit] = useState(false)
    const toast = useRef(null);
    const[loadingStart, setLoadingStart] = useState(true)

    const [allClientes, setAllClientes] = useState([])
    const [filteredClientes, setFilteredClientes] = useState([])
    const [selectedCliente, setSelectedCliente] = useState(null)

    const [obra, setObra] = useState({
        "tipo":{
            "descripcion":""
        },
        "cliente":{}
    })

    useEffect(() => {
        setLoadingStart(true)
        axios.get(userService+'/cliente').then((res) => {
            setAllClientes(res.data);
            setLoadingStart(false)
        })
        .catch(function (error) {
            showToast('Error','No se pudieron cargar los clientes, intentelo mas tarde','error')
            setTimeout(() => {
                history.push("/")
            }, 3000);
        })
    }, [])

    const showToast = (summary, message, severity) => {
        toast.current.show({severity:severity, summary: summary, detail:message, life: 3000});
    }

    const searchClientes = (event) => {
        let _filteredClientes;
        if(!event.query.trim().length){
            _filteredClientes = [...allClientes];
        }else{
            _filteredClientes = allClientes.filter((cliente) => {
                return cliente.razonSocial.startsWith(event.query)
            })
        }
        setFilteredClientes(_filteredClientes);
    }

    const updateObra = (event, prop) => {
        const obraCopy = {...obra}
        if(prop==="tipo"){
            obraCopy["tipo"] = {"descripcion": event.target.value};
        }else{
            obraCopy[prop] = event.target.value;
        }
        setObra(obraCopy)
        //console.log(obra)
    }

    const validObra = () => {
        return obra.descripcion && obra.latitud && obra.longitud && obra.direccion && obra.superficie && obra.tipo.descripcion && selectedCliente
    }

    const setClienteEnObra = (value) => {
        setSelectedCliente(value)
        setObra({...obra, "cliente":selectedCliente})
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        //setObra({...obra, "cliente":selectedCliente})
        //console.log(obra)
        if(validObra()){
            setLoadingSubmit(true);
            axios.post(userService+'/obra', obra)
            .then(function (response) {
                console.log(response);
                setLoadingSubmit(false);
                showToast('Exito!','Cliente creado correctamente','success')
                history.push("/obra-listado")
            })
            .catch(function (error) {
                console.log(error);
                showToast('Error','No se pudo guardar la obra, intentelo mas tarde','error')
                setLoadingSubmit(false);
            })
        }else{
            showToast('Error','FALTAN LLENAR CAMPOS','warn')
        }
    }

    const handleCancel = (event) => {
        event.preventDefault();
        history.goBack()
    }

    return (
        loadingStart?
        <div style={{"display": "flex"}}>
            <Toast ref={toast} />
            <ProgressSpinner/>
        </div>
        :
        <Card title="Registrar una obra"
        footer = {
            <div className="d-flex justify-content-between">
                <Button className="p-button-danger" onClick={(event)=> handleCancel(event)} label="Cancelar"></Button>
                <Button type="submit" className="btn btn-primary" onClick={(event)=>handleSubmit(event)} icon="pi pi-check" label="Guardar" loading={loadingSubmit}></Button>
            </div>
        }>
            <Toast ref={toast} />
            <span className="p-float-label">
                <AutoComplete id="clienteAutocomplete" className='w-full' value={selectedCliente} suggestions={filteredClientes} completeMethod={searchClientes} field="razonSocial" dropdown forceSelection onChange={(e)=>setClienteEnObra(e.value)} />
                <label htmlFor="clienteAutocomplete">Cliente</label>
            </span>
            <br/>
            <ConstructionCard
                updateObra = {(event, prop) => updateObra(event, prop)}
            />
        </Card>
    )
}

export default RegistrarObra
