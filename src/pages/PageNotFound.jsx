import React, {useEffect} from 'react';
import { useHistory } from "react-router-dom";
import Img from '../assets/images/PageNotFound.png';

const PageNotFound = () => {
    let history = useHistory();
    useEffect(() => {
        setTimeout(() => {
            history.push('/')
        }, 2000);
    }, [])

    return (
        <div className="flex justify-content-center">
            <img src={Img} alt="Logo" />
        </div>
    )
}

export default PageNotFound
