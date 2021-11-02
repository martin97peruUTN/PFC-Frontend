import React, {useContext} from 'react'
import { Menubar as MenubarPrime } from 'primereact/menubar';
import {Button} from 'primereact/button';
import { AuthContext } from './../context/AuthContext';

const Menubar = () => {

    const authContext = useContext(AuthContext);

    const items = [
        {
            label: 'Inicio',
            icon: 'pi pi-fw pi-home',
            url: '/'
        },
        {
            label: 'Remates',
            icon: 'pi pi-fw pi-book',
            items: authContext.isConsignee() || authContext.isAdmin()?[
                {
                    label: 'Nuevo',
                    icon: 'pi pi-fw pi-calendar-plus',
                    url: '/remate'
                },
                {
                    label: 'Historial',
                    icon: 'pi pi-fw pi-calendar',
                    url: '/remate-historial'
                }
            ]:[
                {
                    label: 'Historial',
                    icon: 'pi pi-fw pi-calendar',
                    url: '/remate-historial'
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
                    url: '/cliente'
                },
                {
                    label: 'Listado',
                    icon: 'pi pi-fw pi-list',
                    url: '/cliente-listado'
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
                    url: '/perfil'
                },
                {
                    label: 'Localidades',
                    icon: 'pi pi-fw pi-map',
                    url: '/localidades'
                },
                {
                    label: 'Categorias',
                    icon: 'pi pi-fw pi-th-large',
                    url: '/categorias'
                },
                {
                    label: 'Usuarios',
                    icon: 'pi pi-fw pi-id-card',
                    url: '/usuarios'
                }
            ]:[
                {
                    label: 'Perfil',
                    icon: 'pi pi-fw pi-user',
                    url: '/perfil'
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
