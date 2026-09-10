import {useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

import api from '../api'
import perfil from '../assets/perfil-default.png'


import './styles/Profile.css'


function Profile(props){
    const {id} = useParams();

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
    const [User, setUser] = useState("")
    const obtainUser = async(req, res) =>{
        try{
            setLoading(true)
            setError("")
            const response = await api.get('/users/getById/' + id)
            setUser(response.data) // Datos del usuario
            console.log(response)
            setLoading(false)
        }catch(error){
            console.log(error)
            setError(error)
        }
    }


    useEffect(() => {
        obtainUser();
    }, [id]); // Recarga cuando modificamos el valor del params (si lo haces desde el URL esto no tiene sentido, pero si tocas el boton de tu perfil arriba a la derecha
    // ya estando en /profile/X, no te va a cargar nunca y tenes que hacer f5 manual para que te salga tu perfil,
    // por eso pongo el valor id como el que va a recargar el useEffect)

    useEffect(() => {
        if (User) {
            setNombre(User.nombre || "");
            setApellido(User.apellido || "");
            setDni(User.DNI || "");
            setEmail(User.email || "");
            setTelefono(User.telefono || "");
        }
    }, [User]); // Se ejecuta cada vez que el usuario pasa de null a tener datos*/

    return(
        <>
            <h1>PERFIL</h1>
            <div className="profile-container">
                <div className="photo">
                    <img src={perfil} alt="Perfil" />
                    {User.email == props.user?.email && <button onClick={() => setShowConfirm(true)}>Cerrar Sesión</button> }
                </div>
                { User ? (
                    <div className="profile-data-section">
                        <span>Nombre: {nombre}</span>
                        <span>Apellido: {apellido}</span>
                        <span>DNI: {dni}</span>
                        <span>Mail: {email}</span>
                        <span>Teléfono {telefono}</span>
                    </div>
                ) : (
                    <>
                        { loading && <p>Cargando...</p>}
                        { error &&  <p>{error}</p> }
                    </>
                ) }

                {showConfirm && (

                    <div className="overlay">
                        <div className="confirm-panel">
                            <h3>Estas seguro de que quieres cerrar sesión?</h3>
                            <div>
                                <button id="btn-cancel" onClick={() => setShowConfirm(false)}>Cancelar</button>
                                <button id="btn-confirm" onClick={() => {
                                    setShowConfirm(false);
                                    props.onLogout();
                                }}>Sí, salir</button>
                            </div>
                        </div>
                        
                        
                    </div>
                )}
            </div>

        </>
    )
}



export default Profile