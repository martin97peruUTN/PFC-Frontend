import React from 'react'
import Menubar from './components/Menubar'

const AppShell = ({children}) => {
    return (
        <div className="App">
            <Menubar/>
            <div className="mx-1 my-3 xl:mx-8">{/*TODO ver bien esto */}
                {children}
            </div>
        </div>
    )
}
//Menubar superior y div que envuelve todas las paginas salvo LogIn

export default AppShell
