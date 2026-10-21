import {useState, useEffect } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import ReactCrop from 'react-image-crop'
import convertImage from '../convert'

import api from '../api'    

import './styles/Profile.css'




function Profile(props){
    const {id} = useParams();

    // Variables del formulario
    const [nombre, setNombre] = useState("");
    const [apellido, setApellido] = useState("");
    const [dni, setDni] = useState("");
    const [fechaNacimiento, setFechaNacimiento] = useState("")
    const [email, setEmail] = useState("");
    const [telefono, setTelefono] = useState("");
    const [foto, setFoto] = useState("")
    
    const [Mnombre, setmNombre] = useState("");
    const [Mapellido, setmApellido] = useState("");
    const [Mdni, setmDni] = useState("");
    const [MfechaNacimiento, setmFechaNacimiento] = useState("")

    const [Memail, setmEmail] = useState("");
    const [Mtelefono, setmTelefono] = useState("");
    const [Mfoto, setmFoto] = useState("")

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
    function timeout(delay) {
        return new Promise( res => setTimeout(res, delay) );
    }


    const obtainUser = async(req, res) =>{
        try{
            setLoading(true)
            setError("")
            const response = await api.get('/usuarios/getByPk/' + id)
            setUser(response.data) // Datos del usuario
            console.log(response)
            setLoading(false)
        }catch(error){
            console.log(error)
            setError(error)
        }
    }
    const handleSubmit = async (event) => {
        event.preventDefault() // Evita que se recargue la página, eso hace que las variables se reseteen
        setError("")
        setLoading(true) // Nos sirve para meter un efecto o elemento mientras se procesa

        try {
            const response = await api.patch('usuarios/edit/' + id, {
                Mnombre,
                Mapellido,
                Mdni,
                MfechaNacimiento,
                Memail,
                Mtelefono,
                Mfoto
            })

            setNombre(Mnombre)
            setApellido(Mapellido)
            setDni(Mdni)
            setFechaNacimiento(MfechaNacimiento)
            setEmail(Memail)
            setTelefono(Mtelefono)
            setFoto(Mfoto)

            //await timeout(300);
            setLoading(false)
            setShowEdit(false)
            setMessage(response.data.message)
            
            await timeout(1000);
            setMessage("")

            //navigate("/")
        } catch (err) {
            if (err.response) {
                setError("Error con el guardado, revise los campos y vuelva a intentarlo")
                await timeout(2000);
                setError("")
            } else {
                setError("Error AL HACER LA PETICION (login.jsx)")
                console.log(err)
            }
        } finally {
            setLoading(false) // Tanto si falla o no, igualmente se deja de mostrar el efecto de carga
        }
    }


    useEffect( () => {
        obtainUser();
    }, [id]); // Recarga cuando modificamos el valor del params (si lo haces desde el URL esto no tiene sentido, pero si tocas el boton de tu perfil arriba a la derecha
    // ya estando en /profile/X, no te va a cargar nunca y tenes que hacer f5 manual para que te salga tu perfil,
    // por eso pongo el valor id como el que va a recargar el useEffect)

    useEffect(() => {
        if (User) {
            setNombre(User.nombre || "");
            setApellido(User.apellido || "");
            setDni(User.DNI || "");
            setFechaNacimiento(User.fechaNacimiento || "")
            setEmail(User.email || "");
            setTelefono(User.telefono || "");
            setFoto(User.foto || "")
            setmFoto(User.foto || "")
        }
    }, [User]); // Se ejecuta cada vez que el usuario pasa de null a tener datos*/

    // useEffect(()=>{
    //     console.log("Se modifico un valor temporal")
    // }, [Mnombre, Mapellido, Mdni, Memail, Mtelefono, Mfoto])
    
    // useEffect(()=>{
    //     console.log("Se modifico un valor permanente")
    // }, [nombre, apellido, dni, email, telefono, foto])

    const cambiarImg = async (img) => {
        const base64 = await convertImage(img, setLoading)
        setmFoto(base64)
        setShowPfp(false)
    }

    if(User) {
        return(
            <section className="profile">
                <h1>PERFIL</h1>
                <div className="profile-container">
                    <div className="photo">
                        <div className={`pfp ${showEdit ? 'pfp-edit' : ''}`}>
                            <img src={showEdit ? Mfoto : foto} alt="Perfil" onClick={() => {if(showEdit === true) setShowPfp(true); console.log(showPfp)}}/>
                        </div>
                        
                        {User.email == props.user?.email && <button onClick={() => setShowConfirm(true)}>Cerrar Sesión</button> }
                        {User.email == props.user?.email && <button onClick={() => setShowEdit(true)}>Editar Usuario</button> }
                    </div>
                    { User ? (
                        !showEdit ? (
                            // Sin modo editar
                            <>
                                {message && <p style={{position: "fixed", top: "10px", left: "10px", color: "green", backgroundColor: "lightgreen", padding: "10px", borderRadius: "5px" }}>{message}</p>}

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
                                        <label>Fecha de Nacimiento: </label>
                                        <span>{fechaNacimiento}</span>
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
                            </>
                        ):(
                            // Modo editar
                            <>
                                {error && <p style={{position: "fixed", top: "10px", left: "10px", color: "red", backgroundColor: "#590C0C", padding: "10px", borderRadius: "5px" }}>{error}</p>}

                                <form className="profile-data-section" onSubmit={handleSubmit}>

                                    <div>
                                        <label htmlFor="nombre">Nombre: </label>
                                        <input 
                                            type="text" 
                                            id="nombre"
                                            name="nombre" 
                                            value={Mnombre} 
                                            onChange={(e) => setmNombre(e.target.value)} 
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="apellido">Apellido: </label>
                                        <input 
                                            type="text" 
                                            id="apellido"
                                            name="apellido" 
                                            value={Mapellido} 
                                            onChange={(e) => setmApellido(e.target.value)} 
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="dni">DNI: </label>
                                        <input 
                                            type="text" 
                                            id="dni"
                                            name="dni" 
                                            value={Mdni} 
                                            onChange={(e) => setmDni(e.target.value)} 
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="email">Email: </label>
                                        <input 
                                            type="email" 
                                            id="email"
                                            name="email" 
                                            value={Memail} 
                                            onChange={(e) => setmEmail(e.target.value)} 
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="telefono">Teléfono: </label>
                                        <input 
                                            type="tel" 
                                            id="telefono"
                                            name="telefono" 
                                            value={Mtelefono} 
                                            onChange={(e) => setmTelefono(e.target.value)} 
                                        />
                                    </div>
                                    <div className="profile-buttons">
                                        <button type="submit">Guardar Perfil</button>
                                        <button type="cancel" onClick={() =>
                                        {
                                        setShowEdit(false)
                                        setmNombre(nombre)
                                        setmApellido(apellido)
                                        setmDni(dni)
                                        setmEmail(email)
                                        setmTelefono(telefono)
                                        setmFoto(foto)
                                        } 
                                    }>Cancelar</button>

                                    </div>

                                </form>
                            </>

                            
                        )

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
                                    <input type="file" name="avatar" id="avatar" onChange={(e) => cambiarImg(e.target.files[0])} accept="image/png, image/jpg, image/jpeg" />
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
    else{
        return(
        <section className="user-error">
            <h1>
                404
            </h1>
            <h2>
                El usuario que buscas no existe
            </h2>
        </section>
        )
    } 
}



export default Profile