import {useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

import api from '../api'
import perfil from '../assets/perfil-default.png'


import './styles/Profile.css'


function EditProfile(props){
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
            //console.log(response)
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

    const handleSubmit = async (event) => {
        event.preventDefault() // Evita que se recargue la página, eso hace que las variables se reseteen
        setError("")
        setLoading(true) // Nos sirve para meter un efecto o elemento mientras se procesa

        try {
            const response = await api.patch('/edit-profile', {
                nombre,
                apellido,
                dni,
                email,
                telefono,

            })

            //await timeout(300);
            setLoading(false)
            setMessage("Se ha modificado los datos con exito")
            await timeout(300);
            setMessage("")

            //navigate("/")
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
        <section className="profile">
            <h1>EDITAR PERFIL</h1>
            <div className="profile-container">
                <div className="photo">
                    <img src={perfil} alt="Perfil" />
                    {User.email == props.user?.email && <button onClick={() => setShowConfirm(true)}>Cerrar Sesión</button> }
                    {User.email == props.user?.email && <button onClick={() => setShowEdit(true)}>Editar Usuario</button> }
                </div>
                { User ? (
                    <form className="profile-data-section" onSubmit={handleSubmit}>
                        <div>
                            <label htmlFor="nombre">Nombre: </label>
                            <input 
                                type="text" 
                                id="nombre"
                                name="nombre" 
                                value={nombre} 
                                onChange={(e) => setNombre(e.target.value)} 
                            />
                        </div>
                        <div>
                            <label htmlFor="apellido">Apellido: </label>
                            <input 
                                type="text" 
                                id="apellido"
                                name="apellido" 
                                value={apellido} 
                                onChange={(e) => setApellido(e.target.value)} 
                            />
                        </div>
                        <div>
                            <label htmlFor="dni">DNI: </label>
                            <input 
                                type="text" 
                                id="dni"
                                name="dni" 
                                value={dni} 
                                onChange={(e) => setDni(e.target.value)} 
                            />
                        </div>
                        <div>
                            <label htmlFor="email">Email: </label>
                            <input 
                                type="email" 
                                id="email"
                                name="email" 
                                value={email} 
                                onChange={(e) => setEmail(e.target.value)} 
                            />
                        </div>
                        <div>
                            <label htmlFor="telefono">Teléfono: </label>
                            <input 
                                type="tel" 
                                id="telefono"
                                name="telefono" 
                                value={telefono} 
                                onChange={(e) => setTelefono(e.target.value)} 
                            />
                        </div>
                        <button type="submit">Guardar Perfil</button>

                    </form>
                
                

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
            <span id="texto">Un video mas mi gente pa pelder el tiempo. Quien quiera perder su tiempo que lo pierda. Yeeaaah. Mmm, de locos, hermano. De locoooaaaas.
¿Pero qué es esto, mi gente? ¡Wasaaaaaaaaa! Miren este pedazo de pollo. Crujiente, jugoso, una bendición del de arriba. Hoy andamos activos, rompiendo la dieta porque el cuerpo lo pide y el Rey de Kentucky lo respalda. ¡Bravísimo! Linganguliguliguliwacha lingangu lingangu.
Atención a todos los envidiosos que están mirando este video con hambre. No se me queden ahí parados, vayan por el suyo. Si la vida te da limones, tú le pides pollo frito al universo, ¡así de simple! Nooo, no lo diga, así no.
Uff, qué delicia, mi hermano. Esto no es comida, esto es una obra de arte. Un respeto para los cocineros, ¡un aplauso! Eso es, eso es. Salsa y picante y nos fuimo.
Que nadie te quite la alegría de comer bien. ¡Sabor, sazón y pura energía positiva! ¡Vaaaamos por más! Si te gustó, deja tu 'like' y no te me duermas. ¡Chao, chao, chao! ¡BEEP BEEP!</span>
        </section>
    )
}



export default EditProfile