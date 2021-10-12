import React, {useState, useEffect, useRef} from 'react'
import axios from 'axios'
import ClientListCard from '../components/cards/ClientListCard'
import {userService} from '../Url'
import { ProgressSpinner } from 'primereact/progressspinner';
import { Toast } from 'primereact/toast';

const ListadoClientes = ({history}) => {

    const[loading, setLoading] = useState(true)
    const [clientes, setClientes] = useState([])
    const toast = useRef(null);

    const showToast = (summary, message, severity) => {
        toast.current.show({severity:severity, summary: summary, detail:message, life: 3000});
    }

    useEffect(() => {
        axios.get(userService+'/cliente').then((res) => {
            setClientes(res.data);
            setLoading(false)
        })
        .catch((err) => {
            showToast('Error','No se pudieron cargar los clientes, intentelo mas tarde','error')
            setTimeout(() => {
                history.push("/")
            }, 3000);
        })
    }, [])

    const cardsMarkup = clientes.map((cliente,index) => (
        <ClientListCard
            key={cliente.id}
            razonSocial={cliente.razonSocial}
            cuit={cliente.cuit}
            mail={cliente.mail}
            user={cliente.user.user}
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

export default ListadoClientes
