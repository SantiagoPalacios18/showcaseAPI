import { Link } from "react-router-dom"
import {useState , useEffect } from "react"

// El axios configurado que vamos a usar
import api from "../api"

import './styles/Home.css'

import perfil from '../assets/perfil-default.png'

function Home(props) {
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
                <h2>Viví la magia del cine en pantalla gigante</h2>
                <h3>Mensaje dado por el back-end</h3    >

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
            <br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br />            <br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br />            <br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br />
        </div>  
    )
}

export default Home
