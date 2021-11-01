import React from 'react'
import { Menubar as MenubarPrime } from 'primereact/menubar';
import {Button} from 'primereact/button';

const Menubar = () => {
    //TODO conditional display
    const items = [
        {
            label: 'Inicio',
            icon: 'pi pi-fw pi-home',
            url: '/'
        },
        {
            label: 'Remates',
            icon: 'pi pi-fw pi-book',
            items: [
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
            items: [
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
            ]
        }
    ];

    const end = <Button className="btn-primary" label="Salir" icon="pi pi-sign-out"/>;

    return (
        <MenubarPrime className="sticky top-0 z-5" model={items} end={end} />
    )
}

export default Menubar
