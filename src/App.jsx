//Parte del codigo tomado del tutorial de Ryan Chenkie: https://github.com/chenkie/orbit

import React, {useContext, useRef} from "react";
import { BrowserRouter as Router, Route, Switch, Redirect } from "react-router-dom";

//Prime React
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import PrimeReact from 'primereact/api';
import './Components.css'

import { FetchProvider } from './context/FetchContext';
import { AuthProvider, AuthContext } from './context/AuthContext';
import * as url from './util/url'

import AppShell from './AppShell'
import HomePage from "./pages/HomePage";
import PageNotFound from './pages/PageNotFound'
import LogIn from "./pages/LogIn";
import Profile from "./pages/Profile";
import PasswordChange from "./pages/PasswordChange";
import LocalityList from "./pages/LocalityList";
import CategoryList from "./pages/CategoryList";
import AuctionCRUD from "./pages/AuctionCRUD";
import Auction from "./pages/Auction";
import UserList from "./pages/UserList";
import UserCRUD from "./pages/UserCRUD";

import { Toast } from 'primereact/toast';

const UnauthenticatedRoutes = ({showToast}) => (
  <div className="mx-3 my-7 md:mx-6">
    <Switch>
      <Route path={url.LOGIN}>
        <LogIn showToast={showToast}/>
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
};

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
//AssistantRoute no hace falta, es lo mismo que el authenticated

function App() {

  PrimeReact.ripple = true;

  const toast = useRef(null);
  const showToast = (severity, summary, message, sticky) => {
    toast.current.show({severity:severity, summary: summary, detail:message, sticky:sticky});
  }

  const AppRoutes = () => (
    <Switch>
      
      <AuthenticatedRoute exact path={url.HOME}>
        <HomePage showToast={showToast}/>
      </AuthenticatedRoute>

      <ConsigneeRoute exact path={url.AUCTION_CRUD}>
        <AuctionCRUD showToast={showToast}/>
      </ConsigneeRoute>
      <AuthenticatedRoute exact path={url.AUCTION_HISTORY}>
        <HomePage showToast={showToast}/>
      </AuthenticatedRoute>
      <AuthenticatedRoute exact path={url.AUCTION}>
        <Auction showToast={showToast}/>
      </AuthenticatedRoute>

      <AuthenticatedRoute exact path={url.CLIENT}>
        <HomePage showToast={showToast}/>
      </AuthenticatedRoute>
      <AuthenticatedRoute exact path={url.CLIENT_LIST}>
        <HomePage showToast={showToast}/>
      </AuthenticatedRoute>

      <AuthenticatedRoute exact path={url.PROFILE}>
        <Profile showToast={showToast}/>
      </AuthenticatedRoute>
      <AuthenticatedRoute exact path={url.PASSWORD_CHANGE}>
        <PasswordChange showToast={showToast}/>
      </AuthenticatedRoute>
      
      <ConsigneeRoute exact path={url.LOCALITIES}>
        <LocalityList showToast={showToast}/>
      </ConsigneeRoute>
      <ConsigneeRoute exact path={url.CATEGORIES}>
        <CategoryList showToast={showToast}/>
      </ConsigneeRoute>
      <ConsigneeRoute exact path={url.USERS}>
        <UserList showToast={showToast}/>
      </ConsigneeRoute>
      <AdminRoute exact path={url.USER_CRUD}>
        <UserCRUD showToast={showToast}/>
      </AdminRoute>

      <UnauthenticatedRoutes showToast={showToast}/>
    </Switch>
  )

  return (
    <Router>
      <AuthProvider>
        <FetchProvider>
          <Toast ref={toast} />
          <AppRoutes />
        </FetchProvider>
      </AuthProvider>
    </Router>
  )
}

export default App;
