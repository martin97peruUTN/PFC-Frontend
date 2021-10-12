import React, {useState, useEffect, useRef} from 'react'
import axios from 'axios'
import ObraListCard from '../components/cards/ObraListCard'
import {userService} from '../Url'
import { ProgressSpinner } from 'primereact/progressspinner';
import { Toast } from 'primereact/toast';

const ListadoObras = (props) => {

    const[loading, setLoading] = useState(true)
    const [obras, setObras] = useState([])
    const toast = useRef(null);

    const showToast = (summary, message, severity) => {
        toast.current.show({severity:severity, summary: summary, detail:message, life: 3000});
    }

    useEffect(() => {
        /*axios.get(userService+'/obra').then((res) => {
            setObras(res.data);
            setLoading(false)
        })
        .catch((err) => {
            showToast('Error','No se pudieron cargar las obras, intentelo mas tarde','error')
            setTimeout(() => {
                props.history.push("/")
            }, 3000);
        })*/
        axios.get(userService+'/cliente').then((res) => {
            let allObras = []
            res.data.forEach((cliente) => {
                allObras.push(...[...cliente.obras])
            })
            setObras(allObras)
            setLoading(false)
        })
        .catch((err) => {
            showToast('Error','No se pudieron cargar las obras, intentelo mas tarde','error')
            setTimeout(() => {
                props.history.push("/")
            }, 3000);
        })
    }, [])

    const cardsMarkup = obras.map((obra,index) => (
        <ObraListCard
            key={obra.id}
            descripcion={obra.descripcion}
            direccion={obra.direccion}
            tipo={obra.tipo.descripcion}
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

export default ListadoObras
