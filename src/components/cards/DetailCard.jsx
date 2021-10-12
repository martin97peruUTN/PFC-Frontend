import React, {useState, useEffect} from 'react'
import CardSecondary from './CardSecondary'
import { Button } from 'primereact/button'
import { InputText } from 'primereact/inputtext';
import { AutoComplete } from 'primereact/autocomplete';


const DetailCard = (props) => {

    const [productoValue, setProductoValue] = useState()
    const [filteredProductos, setFilteredProductos] = useState()

    useEffect(() => {
        if(props.producto){
            const index = props.allProductos.findIndex(p => p.id === props.producto.id)
            setProductoValue(props.allProductos[index])
        }
    }, [])

    const updateProducto = (event) => {
        setProductoValue(event.value)
        props.updateDetail(event, "producto")
    }

    const searchProductos = (event) => {
        let _filteredProductos
        if(!event.query.trim().length){
            _filteredProductos = [...props.allProductos]
        }else{
            _filteredProductos = props.allProductos.filter((producto) => {
                return producto.nombre.startsWith(event.query)
            })
        }
        setFilteredProductos(_filteredProductos)
    }

    return (
        <CardSecondary
            footer={!props.disabled?<Button className="p-button-danger" onClick={props.onDelete}>Borrar detalle</Button>:null}
        >
            {props.disabled?
                <div>
                    <span className="p-float-label">
                        <AutoComplete disabled id="productoAutocomplete" className='w-full' value={productoValue} suggestions={filteredProductos} completeMethod={searchProductos} field="nombre" dropdown forceSelection onChange={(e)=>updateProducto(e)} />
                        <label htmlFor="productoAutocomplete">Producto</label>
                    </span>
                    <br/>
                    <span className="p-float-label">
                        <InputText disabled id={"cantidad-"+props.id} className='w-full' value={props.cantidad} keyfilter="num" onChange={(event) => props.updateDetail(event, "cantidad")} />
                        <label htmlFor={"cantidad-"+props.id}>Cantidad</label>
                    </span>
                    <br/>
                    <span className="p-float-label">
                        <InputText disabled id={"precio-"+props.id} className='w-full' value={props.precio} keyfilter="num" onChange={(event) => props.updateDetail(event, "precio")} />
                        <label htmlFor={"precio-"+props.id}>Precio</label>
                    </span>
                </div>
            :
                <div>
                    <span className="p-float-label">
                        <AutoComplete id="productoAutocomplete" className='w-full' value={productoValue} suggestions={filteredProductos} completeMethod={searchProductos} field="nombre" dropdown forceSelection onChange={(e)=>updateProducto(e)} />
                        <label htmlFor="productoAutocomplete">Producto</label>
                    </span>
                    <br/>
                    <span className="p-float-label">
                        <InputText id={"cantidad-"+props.id} className='w-full' value={props.cantidad} keyfilter="num" onChange={(event) => props.updateDetail(event, "cantidad")} />
                        <label htmlFor={"cantidad-"+props.id}>Cantidad</label>
                    </span>
                    <br/>
                    <span className="p-float-label">
                        <InputText id={"precio-"+props.id} className='w-full' value={props.precio} keyfilter="num" onChange={(event) => props.updateDetail(event, "precio")} />
                        <label htmlFor={"precio-"+props.id}>Precio</label>
                    </span>
                </div>
            }
            
        </CardSecondary>
    )
}

export default DetailCard
