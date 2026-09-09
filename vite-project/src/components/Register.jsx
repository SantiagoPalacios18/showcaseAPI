import { useState } from "react"
import axios from "axios"
import { useNavigate } from "react-router-dom"

// El axios configurado que vamos a usar
import api from "../api"


function Register(props) {
    // Variables del formulario
    const [nombre, setNombre] = useState("")
    const [apellido, setApellido] = useState("")
    const [email, setEmail] = useState("")
    const [contraseña, setContraseña] = useState("")
    const [confirmarContraseña, setConfirmPassword] = useState("")

    // Variables de estado
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState("")

    // Para redireccionar
    const navigate = useNavigate()
    
    // Source - https://stackoverflow.com/a/63006702
    // Posted by Ronit Roy, modified by community. See post 'Timeline' for change history
    // Retrieved 2026-09-05, License - CC BY-SA 4.0

    function timeout(delay) {
        return new Promise( res => setTimeout(res, delay) );
    }


    const handleSubmit = async (event) => {
        event.preventDefault()
        setError("")
        setLoading(true)
        

        try {
            await api.post('/register', {
                nombre,
                apellido,
                email,
                contraseña,
                confirmarContraseña
            },{
                withCredentials: true // Necesario para que se envien las cookies al backend
            })

            const response = await api.post('/login', {
                email,
                contraseña
            },{
                withCredentials: true // Necesario para que se envien las cookies al backend
            })
            props.onLogin(response.data.user, response.data.accessToken /*, response.data.refreshToken*/)

            await timeout(300);
            setLoading(false)
            setMessage("Login exitoso, redireccionando...")
            await timeout(300);

            navigate("/")
        } catch (err) {
            if (err.response) {
                setError(err.response.data.message)
            } else {
                setError("Error de conexión con el servidor")
                console.log(err)
            }
        } finally {
            setLoading(false)
        }
    }
    
    return(
        <div>
            <h1>Register</h1>
            <form onSubmit={handleSubmit}>
                <input 
                    type="text"
                    name="nombre"
                    placeholder="Nombre"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)} />
                <input 
                    type="text"
                    name="apellido"
                    placeholder="Apellido"
                    value={apellido}
                    onChange={(e) => setApellido(e.target.value)} />
                <input 
                    type="text"
                    name="email"
                    placeholder="Correo Electrónico"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)} />
                <input 
                    type="password"
                    name="password"
                    placeholder="Contraseña"
                    value={contraseña}
                    onChange={(e) => setContraseña(e.target.value)} />
                <input 
                    type="password"
                    name="confirmPassword"
                    placeholder="Confirmar Contraseña"
                    value={confirmarContraseña}
                    onChange={(e) => setConfirmPassword(e.target.value)} />
                <button type="submit">Register</button>
            </form>
            {loading && <p>Cargando...</p>}
            {error && <p style={{ color: "red" }}>{error}</p>}
            {message && <p style={{ color: "green" }}>{message}</p>}
        </div>
    )

}

export default Register