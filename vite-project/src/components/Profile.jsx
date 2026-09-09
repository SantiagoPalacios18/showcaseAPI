import {useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";


import perfil from '../assets/perfil-default.png'


import './styles/Profile.css'


function Profile(props){
    // Variables del formulario
    const [nombre, setNombre] = useState("");
    const [apellido, setApellido] = useState("");
    const [dni, setDni] = useState("");
    const [email, setEmail] = useState("");
    const [telefono, setTelefono] = useState("");

    // Variables de estado
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState("")

    // Variable booleana param ostrar la ventana emergente
    const [showConfirm, setShowConfirm] = useState("")

    useEffect(() => {
        if (props.user) {
            setNombre(props.user.nombre || "");
            setApellido(props.user.apellido || "");
            setDni(props.user.DNI || "");
            setEmail(props.user.email || "");
            setTelefono(props.user.telefono || "");
        }
    }, [props.user]); // Se ejecuta cada vez que el usuario pasa de null a tener datos

    return(
        <>
            <div className="profile-container">
                <div className="photo">
                    <img src={perfil} alt="Perfil" />
                    <button onClick={() => setShowConfirm(true)}>Cerrar Sesión</button>
                </div>

                <div className="profile-data-section">
                    <span>Nombre: {nombre}</span>
                    <span>Apellido: {apellido}</span>
                    <span>DNI: {dni}</span>
                    <span>Mail: {email}</span>
                    <span>Teléfono {telefono}</span>
                </div>
                {showConfirm && (

                    <div className="overlay">
                        <div className="confirm-panel">
                            <h3>Estas seguro de que quieres cerrar sesión?</h3>
                            <div>
                                <button id="btn-cancel" onClick={() => setShowConfirm(false)}>Cancelar</button>
                                <button id="btn-confirm" onClick={props.onLogout}>Sí, salir</button>
                            </div>
                        </div>
                        
                        
                    </div>
                )}
            </div>

        </>
    )
}



export default Profile