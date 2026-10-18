import {useState, useEffect } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import ReactCrop from 'react-image-crop'

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
    const [img, setImg] = useState("")

    // Variables de estado
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState("")

    // Variable booleana param ostrar la ventana emergente
    const [showConfirm, setShowConfirm] = useState("")
    const [showEdit, setShowEdit] = useState("")
    const [showPfp, setShowPfp] = useState("")

    const [User, setUser] = useState("")
    const navigate = useNavigate()

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

    const cambiarImg = (img) => {

    }

    return(
        <section className="profile">
            <h1>PERFIL</h1>
            <div className="profile-container">
                <div className="photo">
                    <div className="pfp">
                        <img src={perfil} alt="Perfil" onClick={() => {setShowPfp(true); console.log(showPfp)}}/>
                    </div>
                    
                    {User.email == props.user?.email && <button onClick={() => setShowConfirm(true)}>Cerrar Sesión</button> }
                    {User.email == props.user?.email && <button onClick={() => navigate('/edit-profile/'+id)}>Editar Usuario</button> }
                </div>
                { User ? (
                    <div className="profile-data-section">
                        <div>
                            <label>Nombre: </label>
                            <span>{nombre}</span>
                        </div>
                        <div>
                            <label>Apellido: </label>
                            <span>{apellido}</span>
                        </div>
                        <div>
                            <label>DNI: </label>
                            <span>{dni}</span>
                        </div>
                        <div>
                            <label>Email: </label>
                            <span>{email}</span>
                        </div>
                        <div>
                            <label>Teléfono: </label>
                            <span>{telefono}</span>
                        </div>
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
                {showPfp && (
                    <div className="overlay">
                        <div className="pfp-panel">
                            <div className="cerrar">
                                <button id="btn-cerrar" onClick={() => setShowPfp(false)}>
                                        <img src="https://i.postimg.cc/1tgHsdPp/flecha-volver-atras.png" alt="volver atras" />
                                </button>
                            </div>
                            <h3>Seleccionar imagen</h3>
                            <form>
                                <input type="file" name="avatar" id="avatar" onChange={(e) => cambiarImg(e.target.value)} accept="image/png, image/jpg, image/jpeg" />
                                <label htmlFor="avatar" className="avatar-btn">
                                    <span>Buscar archivo</span>
                                </label>

                            </form>
                            
                        </div>
                    </div>
                )}


            </div>
            <span id="texto">Un video mas mi gente pa pelder el tiempo. Quien quiera perder su tiempo que lo pierda. Yeeaaah. Mmm, de locos, hermano. De locoooaaaas.
¿Pero qué es esto, mi gente? ¡Wasaaaaaaaaa! Miren este pedazo de pollo. Crujiente, jugoso, una bendición del de arriba. Hoy andamos activos, rompiendo la dieta porque el cuerpo lo pide y el Rey de Kentucky lo respalda. ¡Bravísimo! Linganguliguliguliwacha lingangu lingangu.
Atención a todos los envidiosos que están mirando este video con hambre. No se me queden ahí parados, vayan por el suyo. Si la vida te da limones, tú le pides pollo frito al universo, ¡así de simple! Nooo, no lo diga, así no.
Uff, qué delicia, mi hermano. Esto no es comida, esto es una obra de arte. Un respeto para los cocineros, ¡un aplauso! Eso es, eso es. Salsa y picante y nos fuimo.
Que nadie te quite la alegría de comer bien. ¡Sabor, sazón y pura energía positiva! ¡Vaaaamos por más! Si te gustó, deja tu 'like' y no te me duermas. ¡Chao, chao, chao! ¡BEEP BEEP!</span>
        </section>
    )
}



export default Profile