import React from 'react'
import Menubar from './components/Menubar'

const AppShell = ({children}) => {
    return (
        <div className="App">
            <Menubar/>
            <div className="mx-1 my-3 sm:mx-6">
                {children}
            </div>
        </div>
    )
}

export default AppShell