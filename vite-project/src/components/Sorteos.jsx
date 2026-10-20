import { Link } from "react-router-dom"
import {useState , useEffect } from "react"

// El axios configurado que vamos a usar
import api from "../api"
import imagenTest from "../media/unnamed.jpg"
import './styles/Home.css'
import './styles/sorteo.css'


function Sorteos(props) {
    const [message, setMessage] = useState("")
    const getMessage = async () => {
        try {
            const response = await api.get("/")
            setMessage(response.data.message)
        } catch (error) {
            setMessage("upsis")
        }
    }
    // Apenas carga la página, el useEffect ejecuta todo lo que tenga adentro
    useEffect(() => {
        getMessage()
    }, [])

return(
    <div>
        <div>
            <h1>¡SORTEOS SUPER CINEFILOS!</h1>
            <h2>Selecciona en que sorteo queres participar WACHIN</h2>
        </div>
        <div className="contenedor-sorteos">
            <div className="organizar-sorteo" id="s-1">
                <h2>sorteo1</h2>
                <img src={imagenTest} alt="Elded" />
                <button className="boton-s">participar ahora</button>
            </div>            
            <div className="organizar-sorteo" id="s-2">
                <h2>sorteo2</h2>
                <img src={imagenTest} alt="Elded" />
                <button className="boton-s">participar ahora</button>
            </div>
            <div className="organizar-sorteo" id="s-3">
                <h2>sorteo3</h2>
                <img src={imagenTest} alt="Elded" />
                <button className="boton-s">participar ahora</button>
            </div>
            <div className="organizar-sorteo" id="s-4">
                <h2>sorteo4</h2>
                <img src={imagenTest} alt="Elded" />
                <button className="boton-s">participar ahora</button>
            </div>
        </div>
    </div>
    )
}

export default Sorteos
