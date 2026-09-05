import {useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";


function Login(props) {
    const [email, setEmail] = useState("");
    const [contraseña, setContraseña] = useState("");


    // Source - https://stackoverflow.com/a/63006702
    // Posted by Ronit Roy, modified by community. See post 'Timeline' for change history
    // Retrieved 2026-09-05, License - CC BY-SA 4.0

    function timeout(delay) {
        return new Promise( res => setTimeout(res, delay) );
    }


    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const navigate = useNavigate(); 
    const handleSubmit = async (event) => {
        event.preventDefault() // Evita que se recargue la página, eso hace que las variables se reseteen
        setError("")
        setLoading(true) // Nos sirve para meter un efecto o elemento mientras se procesa

        try {
            const response = await axios.post('http://localhost:3000/login', {
                email,
                contraseña
            })

            props.onLogin(response.data.user, response.data.accessToken, response.data.refreshToken)

            await timeout(1000);
            setLoading(false)
            setMessage("Login exitoso, redireccionando...")
            await timeout(1000);


            navigate("/")
        } catch (err) {
            if (err.response) {
                setError(err.response.data.message)
            } else {
                setError("Error AL HACER LA PETICION (login.jsx)")
                console.log(err)
            }
        } finally {
            setLoading(false) // Tanto si falla o no, igualmente se deja de mostrar el efecto de carga
        }
    }

    return(
        <div>
            <h1>Login</h1>
            <form onSubmit={handleSubmit}>
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
                <button type="submit">Login</button>
            </form>
            {loading && <p>Cargando...</p>}
            {error && <p style={{ color: "red" }}>{error}</p>}
            {message && <p style={{ color: "green" }}>{message}</p>}
        </div>
    )

}

export default Login