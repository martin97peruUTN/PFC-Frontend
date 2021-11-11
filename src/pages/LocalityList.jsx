import React from 'react'
import * as url from '../util/url';
import SimpleItemList from '../components/SimpleItemList';

const LocalityList = () => {
    return (
        <SimpleItemList
            urlAPI = {url.LOCALITY_API}
            itemNameUppercase = 'Localidad'
            itemNameLowercase = 'localidad'
        />
    )
}

export default LocalityList
