import { Link } from "react-router-dom"
import {useState , useEffect } from "react"

// El axios configurado que vamos a usar
import api from "../api"



//import './styles/AdminPanel.css'

function AdminHome(props) {
    console.log("props.user en AdminHome.jsx:", props.user)
    const [message, setMessage] = useState("")
    const [response, setResponse] = useState("")
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

    const createTestUser = async () => {
        try {
            const response = await api.post("/users/test", {});
            setResponse({message: response.data.message, mail: response.data.user.email});
            return;
        } catch (error) {
            console.error("Error al crear usuario de test:", error);
        }
        
    };

return(
        <div>
            <div>
                <h2>PANEL ADMINISTRADOR :Vvv:V</h2>
                <h3>Mensaje dado por el back-end</h3>

                <p style={{ color: "whitesmoke" }}>{message}</p>
            </div>
            <div style={{paddingTop: "50px"}}>
                {props.user ? (<>
                        <p>Bienvenido {props.user.nombre} {props.user.apellido}</p>
                        {/*console.log(props.user)*/}
                    </> 
            ) : (<p>Kien so bo </p>)}
            </div>
            <section>
                <h3>Opciones de administrador</h3>
                <button onClick={createTestUser}>Crear usuario de test</button>
                <div>
                    {
                        response && <>
                            <p style={{ color: "whitesmoke" }}> {response.message}</p>
                            <p>Usuario de test creado: {response.mail}</p> : null
                        </>
                    }
                </div>
            </section>
        </div>  
    )
}

export default AdminHome
