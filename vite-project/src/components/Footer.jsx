import { Link } from "react-router-dom"
import {useState , useEffect } from "react"

import './styles/Footer.css'


function Footer(props) {
    return(
        <>
            <footer className="site-footer">
            <div className="footer-container">
                <div className="footer-col">
                <h3>Sobre nosotros</h3>
                <p>Una breve descripción de tu sitio web, proyecto o empresa para los visitantes.</p>
                </div>
                
                <div className="footer-col">
                <h3>Enlaces rápidos</h3>
                <ul>
                    <li><a href="#">Inicio</a></li>
                    <li><a href="#">Servicios</a></li>
                    <li><a href="#">Contacto</a></li>
                </ul>
                </div>
                
                <div className="footer-col">
                <h3>Contacto</h3>
                <p>Email: info@todoshowcase.com</p>
                <p>Teléfono: +54 9 11 6767 6767</p>
                </div>
            </div>
            
            <div className="footer-bottom">
                <p>&copy; 2026 todoshowcase.com. Todos los derechos reservados.</p>
            </div>
            </footer>

        </>
    )
}


export default Footer
