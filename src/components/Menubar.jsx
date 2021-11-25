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
        MenubarItems.push(
        {separator: true},
        {
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

    //992 es el breakpoint de primereact parece
    if(window.screen.width < 992){
        MenubarItems.push(
            {separator: true},
            {separator: true},
            {
                label: 'Cerrar menu',
                icon: 'pi pi-fw pi-arrow-circle-left',
                command: () => setVisible(false)
            }
        )
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
            <div className='hidden lg:block lg:sticky lg:top-0 lg:z-5'>
                <MenubarPrime model={MenubarItems} end={end} />
            </div>

            <div className='block lg:hidden'>
                <MenubarPrime start={openSidebarButton} end={end} />
                {sidebar}
            </div>
        </>
    )
}

export default Menubar
