import React from 'react';
import { useHistory } from "react-router-dom";

import { HOME } from '../util/url'
import Img from '../assets/images/PageNotFound.png';
import { Button } from 'primereact/button'

const PageNotFound = () => {
    let history = useHistory();

    return (
        <>
            <div className="flex justify-content-center">
                <img src={Img} alt="Logo" />
            </div>
            <br/>
            <div className="flex justify-content-center">
                <Button label='Volver' className="btn btn-primary" icon="pi pi-arrow-left" onClick={() => history.push(HOME)}></Button>
            </div>
        </>
    )
}

export default PageNotFound
