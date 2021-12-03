import React from 'react'
import * as url from '../util/url';
import SimpleItemList from '../components/SimpleItemList';

const ClientList = ({showToast}) => {
    return (
        <SimpleItemList
            urlAPI = {url.CLIENT_API}
            itemNameUppercase = 'Cliente'
            itemNameLowercase = 'cliente'
            showToast ={showToast}
        />
    )
}

export default ClientList
