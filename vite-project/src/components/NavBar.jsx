import { Link } from "react-router-dom"
import { useState , useEffect } from "react"
import './styles/NavBar.css'


function NavBar(props) {
    return(

        <>
        <h1 id="title">SHOWCASE</h1>
        <ul>
            <li>Home</li>
            <li>Cartelera</li>
            <li>Eventos</li>
            <li>Sorteos</li>
            <li>Confitería</li>
        </ul>

        </>
    )
}

export default NavBar