import { Link } from "react-router-dom"
import {useState , useEffect } from "react"

// El axios configurado que vamos a usar
import api from "../api"
import imagenTest from "../media/unnamed.jpg"
import './styles/Home.css'


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
                <h2>de</h2>

            </div>
            <img src={imagenTest} alt="Elded" />
        </div>  
    )
}

export default Eventos
