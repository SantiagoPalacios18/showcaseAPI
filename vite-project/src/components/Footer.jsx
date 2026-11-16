import { Link } from "react-router-dom"
import './styles/Footer.css'
import showCaseLogo from '../assets/showcase_logo.svg'

function Footer() {
    return (
        <footer className="site-footer">
            <div className="footer-container">
                <div className="footer-col footer-brand">
                    <Link to="/" className="footer-logo">
                        <img src={showCaseLogo} alt="Showcase Cinemas" />
                    </Link>
                    <p>
                        Showcase Cinemas es una de las cadenas líderes en exhibición cinematográfica a nivel mundial. Con más de 70 pantallas distribuidas en las principales plazas de Argentina, ofrecemos la mejor experiencia tecnológica, comodidad y los estrenos más esperados para toda la familia.
                    </p>
                </div>

                <div className="footer-col">
                    <h3>Navegación</h3>
                    <ul>
                        <li><Link to="/">Inicio</Link></li>
                        <li><Link to="/cartelera">Cartelera</Link></li>
                        <li><Link to="/eventos">Eventos</Link></li>
                        <li><Link to="/sorteos">Sorteos</Link></li>
                    </ul>
                </div>

                <div className="footer-col">
                    <h3>Contacto</h3>
                    <p><a href="mailto:info@todoshowcase.com">info@todoshowcase.com</a></p>
                    <p><a href="tel:+5491167676767">+54 9 11 6767 6767</a></p>
                </div>
            </div>

            <div className="footer-bottom">
                <p>© 2026 Showcase Cinemas. Todos los derechos reservados.</p>
            </div>
        </footer>
    )
}

export default Footer
