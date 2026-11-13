import { Link, useNavigate } from "react-router-dom"
import { useState , useEffect } from "react"
import './styles/NavBar.css'

import showCaseLogo from '../assets/showcase_logo.svg'

function NavBar(props) {
    return(

        <>
        <div className="title-container">
            <Link to="/">
                <img src={showCaseLogo} alt="" />
            </Link>

        </div>
        <ul>
            <li><Link to="/" >Home</Link></li>
            <li><Link to="/cartelera">Cartelera</Link></li>
            <li><Link to="/eventos">Eventos</Link></li>
            <li><Link to="/sorteos">Sorteos</Link></li>
            <li><Link to="confiteria">Confitería</Link></li>
        </ul>

        </>
    )
}

export default NavBar