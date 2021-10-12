import React, {useState, useEffect, useRef} from 'react'
import axios from 'axios'
import { ProgressSpinner } from 'primereact/progressspinner';
import { Toast } from 'primereact/toast';
import {orderService} from '../Url'
import PedidoListCard from '../components/cards/PedidoListCard'

const ListadoPedidos = (props) => {

    const[loading, setLoading] = useState(true)
    const toast = useRef(null);
    const [pedidos, setPedidos] = useState([])

    const showToast = (summary, message, severity) => {
        toast.current.show({severity:severity, summary: summary, detail:message, life: 3000});
    }

    useEffect(() => {
        axios.get(orderService+'/pedido').then((res) => {
            setPedidos(res.data);
            setLoading(false)
        })
        .catch((err) => {
            showToast('Error','No se pudieron cargar los pedidos, intentelo mas tarde','error')
            setTimeout(() => {
                props.history.push("/")
            }, 3000);
        })
    }, [pedidos])

    const parseDate = (dateJson) => {
        const date = new Date(JSON.parse(`"${dateJson}"`));
        return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`
    }

    const handleDelete = (id) => {
        //event.preventDefault();
        axios.delete(orderService+'/pedido/'+id).then((res) => {
            showToast('Exito!','Producto eliminado correctamente','success')
            console.log('delete pedido '+id)
        })
        .catch((err) => {
            console.log('error delete pedido '+id)
        })
    }

    const handleEdit = (id) => {
        //event.preventDefault();
        props.history.push("/pedido/"+id)
    }

    const cardsMarkup = pedidos.map((pedido) => (
        <PedidoListCard
            key = {pedido.id}
            id = {pedido.id}
            obra = {pedido.obra.descripcion}
            fechaPedido = {parseDate(pedido.fechaPedido)}
            estado = {pedido.estado.estado}
            handleDelete = {() => handleDelete(pedido.id)}
            handleEdit = {() => handleEdit(pedido.id)}
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
            <Toast ref={toast} />
            {cardsMarkup}
        </div>
    )
}

export default ListadoPedidos
