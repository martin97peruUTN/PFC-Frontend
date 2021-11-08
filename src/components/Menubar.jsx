import React, {useContext} from 'react'
import { Menubar as MenubarPrime } from 'primereact/menubar';
import {Button} from 'primereact/button';
import { AuthContext } from './../context/AuthContext';
import * as url from '../util/url'

const Menubar = () => {

    const authContext = useContext(AuthContext);

    const items = [
        {
            label: 'Inicio',
            icon: 'pi pi-fw pi-home',
            url: url.HOME
        },
        {
            label: 'Remates',
            icon: 'pi pi-fw pi-book',
            items: authContext.isConsignee() || authContext.isAdmin()?[
                {
                    label: 'Nuevo',
                    icon: 'pi pi-fw pi-calendar-plus',
                    url: url.AUCTION
                },
                {
                    label: 'Historial',
                    icon: 'pi pi-fw pi-calendar',
                    url: url.AUCTION_HISTORY
                }
            ]:[
                {
                    label: 'Historial',
                    icon: 'pi pi-fw pi-calendar',
                    url: url.AUCTION_HISTORY
                } 
            ]
        },
        {
            label: 'Clientes',
            icon: 'pi pi-fw pi-users',
            items: [
                {
                    label: 'Nuevo',
                    icon: 'pi pi-fw pi-user-plus',
                    url: url.CLIENT
                },
                {
                    label: 'Listado',
                    icon: 'pi pi-fw pi-list',
                    url: url.CLIENT_LIST
                }
            ]
        },
        {
            label: 'Administracion',
            icon: 'pi pi-fw pi-briefcase',
            items: authContext.isConsignee() || authContext.isAdmin()?[
                {
                    label: 'Perfil',
                    icon: 'pi pi-fw pi-user',
                    url: url.PROFILE
                },
                {
                    label: 'Localidades',
                    icon: 'pi pi-fw pi-map',
                    url: url.LOCALITIES
                },
                {
                    label: 'Categorias',
                    icon: 'pi pi-fw pi-th-large',
                    url: url.CATEGORIES
                },
                {
                    label: 'Usuarios',
                    icon: 'pi pi-fw pi-id-card',
                    url: url.USERS
                }
            ]:[
                {
                    label: 'Perfil',
                    icon: 'pi pi-fw pi-user',
                    url: url.PROFILE
                }
            ]
        }
    ];

    const end = <Button className="btn-primary" label="Salir" icon="pi pi-sign-out" onClick={() => authContext.logout()} />;

    return (
        <MenubarPrime className="sticky top-0 z-5" model={items} end={end} />
    )
}

export default Menubar
