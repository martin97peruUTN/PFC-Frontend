import React from 'react'
import { Link, NavLink, withRouter } from 'react-router-dom'
import '../Components.css'

const Navbar = () => {

    return (
    <nav className="navbar navbar-expand-lg sticky-top navbar-light bg-light">
        <div className="container-fluid">
            <NavLink className="navbar-brand" to="/">Inicio</NavLink>
            <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarSupportedContent">
                <ul className="navbar-nav justify-content-center me-auto mb-0 mb-lg-0">
                    <li class="nav-item dropdown">
                        <a class="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                            Clientes
                        </a>
                        <ul class="dropdown-menu" aria-labelledby="navbarDropdown">
                            <li className="dropdown-item">
                                <NavLink className="nav-link" to="/cliente-nuevo">Nuevo</NavLink>
                            </li>
                            <li className="dropdown-item">
                                <NavLink className="nav-link" to="/cliente-listado">Listado</NavLink>
                            </li>
                        </ul>
                    </li>
                    <li class="nav-item dropdown">
                        <a class="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                            Obras
                        </a>
                        <ul class="dropdown-menu" aria-labelledby="navbarDropdown">
                            <li className="dropdown-item">
                                <NavLink className="nav-link" to="/obra-nueva">Registrar nueva</NavLink>
                            </li>
                        </ul>
                    </li>
                    <li class="nav-item dropdown">
                        <a class="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                            Productos
                        </a>
                        <ul class="dropdown-menu" aria-labelledby="navbarDropdown">
                            <li className="dropdown-item">
                                <NavLink className="nav-link" to="/producto-nuevo">Alta</NavLink>
                            </li>
                        </ul>
                    </li>
                    <li class="nav-item dropdown">
                        <a class="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                            Pedidos
                        </a>
                        <ul class="dropdown-menu" aria-labelledby="navbarDropdown">
                            <li className="dropdown-item">
                                <NavLink className="nav-link" to="/pedido-nuevo">Nuevo</NavLink>
                            </li>
                            <li className="dropdown-item">
                                <NavLink className="nav-link" to="/pedido-listado">Listado</NavLink>
                            </li>
                        </ul>
                    </li>
                    <li class="nav-item dropdown">
                        <a class="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                            Pagos
                        </a>
                        <ul class="dropdown-menu" aria-labelledby="navbarDropdown">
                            <li className="dropdown-item">
                                <NavLink className="nav-link" to="/pago-nuevo">Registrar</NavLink>
                            </li>
                            <li className="dropdown-item">
                                <NavLink className="nav-link" to="/pago-listado">Listado</NavLink>
                            </li>
                        </ul>
                    </li>
                </ul>
                <button className="btn navbar-btn">Salir</button>
            </div>
        </div>
    </nav>
    )
}

export default withRouter(Navbar)