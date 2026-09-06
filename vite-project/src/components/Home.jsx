import { Link } from "react-router-dom"
import {useState , useEffect } from "react"
import axios from "axios"

// El axios configurado que vamos a usar
import api from "../api"


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
        <div >
            <h1>SHOWCASE</h1>
            <div style={{ position: "absolute", top: 0, right: 0, padding: "10px" }}>
                <Link to="/login" style={{ marginRight: "10px" }}>Login</Link>
                <Link to="/register">Register</Link>
            </div>
            <div>
                <h2>Mensaje dado por el back-end</h2>

                <p>{message}</p>
            </div>
            <div style={{paddingTop: "50px"}}>
                {props.user ? (<>
                        <p>Bienvenido: {props.user.nombre} {props.user.apellido}</p>
                        <p>Tu email es: {props.user.email}</p>
                        {console.log(props.user)}
                    </> 
            ) : (<p>Kien so bo </p>)}
            </div>
        </div>
    )
}

export default Home
