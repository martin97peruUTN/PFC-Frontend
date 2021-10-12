import React, {useState, useRef} from 'react'
import MaterialCard from '../components/cards/MaterialCard'
import Card from '../components/cards/Card'
import axios from 'axios'
import {productService} from '../Url'
import { Button } from 'primereact/button'
import { Toast } from 'primereact/toast';

const RegistrarMaterial = ({history}) => {

    const[loading, setLoading] = useState(false)
    const toast = useRef(null);

    const[material, setMaterial] = useState({
        'unidad':{
            'descripcion':''
        }
    })

    const showToast = (summary, message, severity) => {
        toast.current.show({severity:severity, summary: summary, detail:message, life: 3000});
    }

    const validMaterial = () => {
        return material.nombre && material.descripcion && material.precio && material.stockActual && material.stockMinimo && material.unidad
    }

    const saveUnidad = (value) => {
        let unidad = {...material.unidad}
        unidad.descripcion = value
        setMaterial({...material, unidad})
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        console.log(material)
        if(validMaterial()){
            setLoading(true);
            axios.post(productService+'/material', material)
            .then(function (response) {
                //Ver que hago aca
                console.log(response);
                setLoading(false);
                showToast('Exito!','Producto creado correctamente','success')
                history.push("/producto-listado")
            })
            .catch(function (error) {
                //ver que hacer en este caso
                console.log(error);
                showToast('Error','No se pudo guardar el material, intentelo mas tarde','error')
                setLoading(false);
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
        <Card title='Registrar un nuevo material'
        footer={
            <div className="d-flex justify-content-between">
                <Button className="p-button-danger" onClick={(event)=> handleCancel(event)} label="Cancelar"></Button>
                <Button type="submit" className="btn btn-primary" onClick={(event)=>handleSubmit(event)} icon="pi pi-check" label="Guardar" loading={loading}></Button>
            </div>
        }>
            <Toast ref={toast} />
            <MaterialCard
                updateMaterial = {(event, prop) => prop==="unidad"?saveUnidad(event.target.value):setMaterial({...material, [prop]:event.target.value})}
            />
            
        </Card>
    )
}

export default RegistrarMaterial
