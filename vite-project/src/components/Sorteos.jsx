import { Link } from "react-router-dom"
import {useState , useEffect } from "react"

// El axios configurado que vamos a usar
import api from "../api"
import imagenTest from "../media/unnamed.jpg"
import './styles/Home.css'


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
        <div>
            <div>
                <h3>sorteo1</h3>
            </div>
            <div>
                <h3>sorteo2</h3>
            </div>
            <div>
                <h3>sorteo3</h3>
            </div>
            <div>
                <h3>sorteo4</h3>
            </div>
        </div>
    </div>

    )
}

export default Sorteos
