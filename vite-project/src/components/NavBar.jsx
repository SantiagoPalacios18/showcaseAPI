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
            <li><Link to="/" style={{textDecoration: 'none', color: 'inherit'}}>Home</Link></li>
            <li>Cartelera</li>
            <li>Eventos</li>
            <li>Sorteos</li>
            <li>Confitería</li>
        </ul>

        </>
    )
}

export default NavBar