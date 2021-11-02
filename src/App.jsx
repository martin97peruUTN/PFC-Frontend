//Parte del codigo tomado del tutorial de Ryan Chenkie: https://github.com/chenkie/orbit

import React, {useContext} from "react";
import { BrowserRouter as Router, Route, Switch, Redirect } from "react-router-dom";

//Prime React
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import PrimeReact from 'primereact/api';
import './Components.css'

import { FetchProvider } from './context/FetchContext';
import { AuthProvider, AuthContext } from './context/AuthContext';

import AppShell from './AppShell'
import HomePage from "./pages/HomePage";
import PageNotFound from './pages/PageNotFound'
import LogIn from "./pages/LogIn";
import Profile from "./pages/Profile";
import PasswordChange from "./pages/PasswordChange";

const UnauthenticatedRoutes = () => (
  <div className="mx-3 my-7 sm:mx-6">
    <Switch>
      <Route path="/login">
        <LogIn />
      </Route>
      <Route path="*">
        <PageNotFound />
      </Route>
    </Switch>
  </div>
);

const AuthenticatedRoute = ({ children, ...rest }) => {
  const auth = useContext(AuthContext);
  return (
    <Route
      {...rest}
      render={() =>
        auth.isAuthenticated() ? (
          <AppShell>{children}</AppShell>
        ) : (
          <Redirect to="/login" />
        )
      }
    ></Route>
  );
};

const AdminRoute = ({ children, ...rest }) => {
  const auth = useContext(AuthContext);
  return (
    <Route
      {...rest}
      render={() =>
        auth.isAuthenticated() && auth.isAdmin() ? (
          <AppShell>{children}</AppShell>
        ) : (
          <Redirect to="/login" />
        )
      }
    ></Route>
  );
};//por el momento no se usa, pero lo dejo a futuro

const ConsigneeRoute = ({ children, ...rest }) => {
  const auth = useContext(AuthContext);
  return (
    <Route
      {...rest}
      render={() =>
        auth.isAuthenticated() && (auth.isAdmin() || auth.isConsignee()) ? (
          <AppShell>{children}</AppShell>
        ) : (
          <Redirect to="/" />
        )
      }
    ></Route>
  );
};
//Assistant no hace falta, es lo mismo que el authenticated

function App() {

  PrimeReact.ripple = true;

  const AppRoutes = () => (
    <Switch>
      
      <AuthenticatedRoute exact path="/">
        <HomePage />
      </AuthenticatedRoute>

      <ConsigneeRoute exact path="/remate">
        <HomePage />
      </ConsigneeRoute>
      <AuthenticatedRoute exact path="/remate-historial">
        <HomePage />
      </AuthenticatedRoute>

      <AuthenticatedRoute exact path="/cliente">
        <HomePage />
      </AuthenticatedRoute>
      <AuthenticatedRoute exact path="/cliente-listado">
        <HomePage />
      </AuthenticatedRoute>

      <AuthenticatedRoute exact path="/perfil">
        <Profile />
      </AuthenticatedRoute>
      <AuthenticatedRoute exact path="/password-change">
        <PasswordChange/>
      </AuthenticatedRoute>
      
      <ConsigneeRoute exact path="/localidades">
        <HomePage />
      </ConsigneeRoute>
      <ConsigneeRoute exact path="/categorias">
        <HomePage />
      </ConsigneeRoute>
      <ConsigneeRoute exact path="/usuarios">
        <HomePage />
      </ConsigneeRoute>

      <UnauthenticatedRoutes />
    </Switch>
  )

  return (
    <Router>
      <AuthProvider>
        <FetchProvider>
          <AppRoutes />
        </FetchProvider>
      </AuthProvider>
    </Router>
  )
}

export default App;
