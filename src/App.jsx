import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Link, Switch } from "react-router-dom";

//Prime React
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import './Components.css'
import PrimeReact from 'primereact/api';

import Menubar from './components/Menubar'
import PageNotFound from './pages/PageNotFound'
import RegistrarCliente from './pages/RegistrarCliente'
import ListadoClientes from './pages/ListadoClientes'
import ListadoPedidos from './pages/ListadoPedidos'
import ListadoPagos from './pages/ListadoPagos'
import RegistrarObra from './pages/RegistrarObra'
import RegistrarMaterial from './pages/RegistrarMaterial'
import RegistrarPedido from './pages/RegistrarPedido'
import RegistrarPago from "./pages/RegistrarPago";
import HomePage from "./pages/HomePage";
import ListadoProductos from "./pages/ListadoProductos"
import ListadosObras from "./pages/ListadoObras"

function App() {

  PrimeReact.ripple = true;

  return (
    <Router>
      <div className="App">
        <Menubar/>
        <div className="mx-1 my-3 sm:mx-6">
          <Switch>
            <Route exact path="/" component={HomePage} />
            <Route exact path="/dan-frontend" component={HomePage} />
            {/*Pongo el exact porque sino la / machea con el resto tambien*/}
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

            {/*Por defecto*/}
            <Route component={PageNotFound} />
          </Switch>
        </div>
      </div>
    </Router>
  )
}

export default App;
