import React, {useContext, useRef} from 'react'

import { Menubar as MenubarPrime } from 'primereact/menubar';
import {Button} from 'primereact/button';
import { AuthContext } from './../context/AuthContext';
import { Avatar } from 'primereact/avatar';
import { Menu } from 'primereact/menu';

import * as url from '../util/url'
import { getInitialLetters } from '../util/miscFunctions'

const Menubar = () => {

    const authContext = useContext(AuthContext);

    const menu = useRef(null);

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
        }
    ];

    if(authContext.isConsignee() || authContext.isAdmin()){
        items.push({
            label: 'Administracion',
            icon: 'pi pi-fw pi-briefcase',
            items: [
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
            ]
        })
    }

    const avatarMenuItems = [
        {
            label: 'Perfil',
            icon: 'pi pi-fw pi-user',
            url: url.PROFILE
        },
        {
            label: 'Salir',
            icon: 'pi pi-fw pi-sign-out',
            command: () => authContext.logout()
        }
    ]

    const end = <Avatar 
        label={getInitialLetters(authContext.getUserInfo().name)} 
        shape="circle"
        style={{ backgroundColor: authContext.getAvatarColor(), color: '#ffffff' }}
        onClick={(e) => menu.current.toggle(e)}
    />

    return (
        <>
            <Menu model={avatarMenuItems} popup ref={menu} className="mt-2"/>
            <MenubarPrime className="sticky top-0 z-5" model={items} end={end} />
        </>
    )
}

export default Menubar
