import { Link, useNavigate } from "react-router-dom"
import { useState , useEffect } from "react"
import './styles/NavBar.css'


function NavBar(props) {
    return(

        <>
        <div className="title-container">
            <Link to="/"><h1 id="title">SHOWCASE</h1></Link>

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