import { Link } from "react-router-dom"
import {useState , useEffect } from "react"

// El axios configurado que vamos a usar
import api from "../api"
import imagenTest from "../media/unnamed.jpg"
import './styles/Home.css'
import './styles/evento.css'

function Eventos(props) {
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
                <h1>¡eventos!</h1>
                <h2>alquila ya tu espacio</h2>
            </div>
            <div className="e">
                <p id="e-1">seleciona espacio:</p>
                <select id="e-2">
                    <option value="sala1">sala1</option>
                    <option value="sala2">sala1</option>
                </select>
                <p id="e-3">seleciona horario:</p>
                <select id="e-4">
                    <option value="13hs">13hs a 14hs</option>
                    <option value="14hs">14hs a 15hs</option>
                </select>
                <p id="e-5">precio:</p>
                <p id="e-6">valor</p>
            </div>
        </div>  
    )
}

export default Eventos
