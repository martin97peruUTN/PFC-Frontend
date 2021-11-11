import React from 'react'
import * as url from '../util/url';
import SimpleItemList from '../components/SimpleItemList';

const CategoryList = () => {
    return (
        <SimpleItemList
            urlAPI = {url.CATEGORY_API}
            itemNameUppercase = 'Categoria'
            itemNameLowercase = 'categoria'
        />
    )
}

export default CategoryList
