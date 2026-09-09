import { Link } from "react-router-dom"
import {useState , useEffect } from "react"

// El axios configurado que vamos a usar
import api from "../api"

import './styles/Home.css'

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
            <div class="session-management" style={{ position: "absolute", top: 0, right: 0, padding: "10px" }}>

                { !props.user ? (
                    <>
                        <Link to="/login" style={{ marginRight: "10px" }}>Login</Link>
                        <Link to="/register">Register</Link>
                    
                    </>
                ):(
                    <>
                        <button onClick={props.onLogout} >Cerrar Sesion</button>
                        
                    </>
                )}
            </div>
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
