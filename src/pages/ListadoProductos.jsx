import React, {useState, useEffect, useRef} from 'react'
import axios from 'axios'
import MaterialListCard from '../components/cards/MaterialListCard'
import {productService} from '../Url'
import { ProgressSpinner } from 'primereact/progressspinner';
import { Toast } from 'primereact/toast';

const ListadoProductos = (props) => {

    const[loading, setLoading] = useState(true)
    const [productos, setProductos] = useState([])
    const toast = useRef(null);

    const showToast = (summary, message, severity) => {
        toast.current.show({severity:severity, summary: summary, detail:message, life: 3000});
    }

    useEffect(() => {
        axios.get(productService+'/material').then((res) => {
            setProductos(res.data);
            setLoading(false)
        })
        .catch((err) => {
            showToast('Error','No se pudieron cargar los productos, intentelo mas tarde','error')
            setTimeout(() => {
                props.history.push("/")
            }, 3000);
        })
    }, [])

    const cardsMarkup = productos.map((producto,index) => (
        <MaterialListCard
            key={producto.id}
            nombre={producto.nombre}
            descripcion={producto.descripcion}
            precio={producto.precio}
            stockActual={producto.stockActual}
            stockMinimo={producto.stockMinimo}
            unidad={producto.unidad.descripcion}
        />
    ))

    return (
        loading?
        <div style={{"display": "flex"}}>
            <Toast ref={toast} />
            <ProgressSpinner/>
        </div>
        :
        <div>
            {cardsMarkup}
        </div>
    )
}

export default ListadoProductos
