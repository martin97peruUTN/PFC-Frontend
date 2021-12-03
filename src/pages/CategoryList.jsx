import React from 'react'
import * as url from '../util/url';
import SimpleItemList from '../components/SimpleItemList';

const CategoryList = ({showToast}) => {
    return (
        <SimpleItemList
            urlAPI = {url.CATEGORY_API}
            itemNameUppercase = 'Categoria'
            itemNameLowercase = 'categoria'
            showToast = {showToast}
        />
    )
}

export default CategoryList
