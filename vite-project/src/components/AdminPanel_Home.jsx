import { Link } from "react-router-dom"
import {useState , useEffect } from "react"

// El axios configurado que vamos a usar
import api from "../api"

import './styles/Home.css'

function AdminHome(props) {
    const [message, setMessage] = useState("")
    const getMessage = async () => {
        try {
            const response = await api.get("/admin/")
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
                <h1>PANEL ADMINISTRADOR :Vvv:V</h1>
                <h3>Mensaje dado por el back-end</h3>

                <p>{message}</p>
            </div>
            <div style={{paddingTop: "50px"}}>
                {props.user ? (<>
                        <p>Bienvenido: {props.user.nombre} {props.user.apellido}</p>
                        <p>Tu email es: {props.user.email}</p>
                        {/*console.log(props.user)*/}
                    </> 
            ) : (<p>Kien so bo </p>)}
            </div>
        </div>  
    )
}

export default AdminHome
