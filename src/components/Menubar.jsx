import React, {useContext, useState, useRef} from 'react'

import { Menubar as MenubarPrime } from 'primereact/menubar';
import {Button} from 'primereact/button';
import { AuthContext } from './../context/AuthContext';
import { Avatar } from 'primereact/avatar';
import { Menu } from 'primereact/menu';
import { Sidebar } from 'primereact/sidebar';

import * as url from '../util/url'

const Menubar = () => {

    const authContext = useContext(AuthContext);

    const avatarMenu = useRef(null);

    const MenubarItems = [
        {
            label: 'Inicio',
            icon: 'pi pi-fw pi-home',
            url: url.HOME
        },
        {separator: true},
        {
            label: 'Remates',
            icon: 'pi pi-fw pi-book',
            items: authContext.isConsignee() || authContext.isAdmin()?[
                {
                    label: 'Nuevo',
                    icon: 'pi pi-fw pi-calendar-plus',
                    url: url.AUCTION_CRUD
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
        {separator: true},
        {
            label: 'Clientes',
            icon: 'pi pi-fw pi-users',
            items: [
                {
                    label: 'Nuevo',
                    icon: 'pi pi-fw pi-user-plus',
                    url: url.CLIENT_CRUD
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
        MenubarItems.push(
        {separator: true},
        {
            label: 'Administración',
            icon: 'pi pi-fw pi-briefcase',
            items: [
                {
                    label: 'Localidades',
                    icon: 'pi pi-fw pi-map',
                    url: url.LOCALITIES
                },
                {
                    label: 'Categorías',
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

    MenubarItems.push(
        {separator: true},
        {separator: true},
        {
            label: 'Cerrar menú',
            icon: 'pi pi-fw pi-arrow-circle-left',
            className: 'menubar-small-screen',
            command: () => setVisible(false)
        }
    )

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
        label={authContext.getUserInfo().name.substring(0,1)+authContext.getUserInfo().lastname.substring(0,1)}
        shape="circle"
        style={{ backgroundColor: authContext.getAvatarColor(), color: '#ffffff' }}
        className="md:mr-1"
        onClick={(e) => avatarMenu.current.toggle(e)}
    />

    const [visible, setVisible] = useState(false);

    const sidebar = (
        <Sidebar visible={visible} blockScroll onHide={() => setVisible(false)}>
            <Menu model={MenubarItems} />
        </Sidebar>
    )
    const openSidebarButton = (
        <Button icon="pi pi-bars" className="sm-menubar-button m-0" onClick={(e) => setVisible(true)}/>
    )

    //El primer menu es para pantallas grandes
    //El segundo para pantallas chicas
    return (
        <>
            <Menu model={avatarMenuItems} popup ref={avatarMenu} className="mt-2"/>
            <div className='md:sticky md:top-0 md:z-5 menubar-big-screen'>
                <MenubarPrime model={MenubarItems} end={end} />
            </div>

            <div className='menubar-small-screen'>
                <MenubarPrime start={openSidebarButton} end={end} />
                {sidebar}
            </div>
        </>
    )
}

export default Menubar
