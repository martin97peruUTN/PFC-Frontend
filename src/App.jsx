import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

//Prime React
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import PrimeReact from 'primereact/api';
import './Components.css'

import { FetchProvider } from './context/FetchContext';
import { AuthProvider, AuthContext } from './context/AuthContext';

import Menubar from './components/Menubar'
import HomePage from "./pages/HomePage";
import PageNotFound from './pages/PageNotFound'
import LogIn from "./pages/LogIn";



function App() {

  PrimeReact.ripple = true;

  return (
    <Router>
      <AuthProvider>
        <FetchProvider>
          <div className="App">
            <Menubar/>
            <div className="mx-1 my-3 sm:mx-6">
              <Switch>
                <Route exact path="/" component={HomePage} />
                <Route exact path="/login" component={LogIn} />
                {/*
                <Route exact path="/cliente" component={RegistrarCliente} />
                <Route exact path="/cliente-listado" component={ListadoClientes} />
                <Route exact path="/obra" component={RegistrarObra} />
                <Route exact path="/obra-listado" component={ListadosObras} />
                <Route exact path="/producto" component={RegistrarMaterial} />
                <Route exact path="/producto-listado" component={ListadoProductos} />
                <Route exact path="/pedido" component={RegistrarPedido} />
                <Route exact path="/pedido/:pedidoId" component={RegistrarPedido} />
                <Route exact path="/pedido-listado" component={ListadoPedidos} />
                <Route exact path="/pago" component={RegistrarPago} />
                <Route exact path="/pago/:pagoId" component={RegistrarPago} />
                <Route exact path="/pago-listado" component={ListadoPagos} />
                */}

                <Route component={PageNotFound} />
              </Switch>
            </div>
          </div>
        </FetchProvider>
      </AuthProvider>
    </Router>
  )
}

export default App;
