import {useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import ReactCrop from 'react-image-crop'
import convertImage from '../convert'

import api from '../api'   
import imagenDefault from "../assets/perfil-default.png" 

import './styles/Profile.css'
import './styles/PeliculaInfo.css'




function Profile(props){
    const {id} = useParams();

    // Variables del formulario
    const [nombre, setNombre] = useState("");
    const [apellido, setApellido] = useState("");
    const [alias, setAlias] = useState("");
    const [dni, setDni] = useState("");
    const [fechaNacimiento, setFechaNacimiento] = useState("")
    const [email, setEmail] = useState("");
    const [telefono, setTelefono] = useState("");
    const [foto, setFoto] = useState("")
    
    const [Mnombre, setmNombre] = useState("");
    const [Mapellido, setmApellido] = useState("");
    const [Malias, setmAlias] = useState("");
    const [Mdni, setmDni] = useState("");
    const [MfechaNacimiento, setmFechaNacimiento] = useState("")

    const [proxTickets, setProxTickets] = useState([
        {
            Pelicula: "Verity",
            fecha: "12/12/2026 12:00",
            proyecc: "2D",
            sala: "C",
            asiento: "Asiento: 1-200"
        }, 
        {
            Pelicula: "Coyote vs ACME",
            fecha: "13/12/2026 14:00",
            proyecc: "3D",
            sala: "A",
            asiento: "Asiento: 3-500"
        }
    ])

    const [Memail, setmEmail] = useState("");
    const [Mtelefono, setmTelefono] = useState("");
    const [Mfoto, setmFoto] = useState("")

    // Variables de estado
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(true)
    const [message, setMessage] = useState("")

    // Variable booleana param ostrar la ventana emergente
    const [showConfirm, setShowConfirm] = useState("")
    const [showEdit, setShowEdit] = useState("")
    const [showPfp, setShowPfp] = useState("")
    const [showChangePassword, setMuyLargo] = useState("")

    const [password, setPassword] = useState("")
    const [Mpassword, setmPassword] = useState("")

    const [User, setUser] = useState("")
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
        }catch(error){
            console.log(error)
            setError(error)
        }
        finally{
            setLoading(false)

        }
    }
    const handleSubmit = async (event) => {
        event.preventDefault() // Evita que se recargue la página, eso hace que las variables se reseteen
        setError("")
        setLoading(true) // Nos sirve para meter un efecto o elemento mientras se procesa

        try {
            const datos = {
                nombre: Mnombre,
                apellido: Mapellido,
                alias: Malias,
                DNI: Mdni,
                email: Memail,
                telefono: Mtelefono
            }
            // foto es STRING(200) y el selector deja un base64 que no entra. Solo se manda si cabe.
            if (Mfoto && Mfoto.length <= 200 && !Mfoto.includes("perfil-default")) {
                datos.foto = Mfoto
            }

            const response = await api.patch('usuarios/edit/' + id, datos)

            setNombre(Mnombre)
            setApellido(Mapellido)
            setAlias(Malias)
            setDni(Mdni)
            setEmail(Memail)
            setTelefono(Mtelefono)
            if (datos.foto) setFoto(datos.foto)

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

    function timeout(delay) {
        return new Promise( res => setTimeout(res, delay) );
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
            setAlias(User.alias || "");
            setDni(User.DNI || "");
            setFechaNacimiento(User.fechaNacimiento || "")
            setEmail(User.email || "");
            setTelefono(User.telefono || "");
            setFoto(User.foto || "../assets/perfil-default.png")
            setmNombre(User.nombre || "")
            setmApellido(User.apellido || "")
            setmAlias(User.alias || "")
            setmDni(User.DNI != null ? String(User.DNI) : "")
            setmFechaNacimiento(User.fechaNacimiento || "")
            setmEmail(User.email || "")
            setmTelefono(User.telefono != null ? String(User.telefono) : "")
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

    const cambiarCont = async (e) => {
        e.preventDefault()
        setError("")
        setMessage("")
        if (!password || !Mpassword) {
            setError("Completá la contraseña actual y la nueva")
            return
        }
        try {
            const response = await api.patch(`usuarios/cambiar-contraseña/${id}`,{
                contraseña: password,
                nuevaContraseña: Mpassword
            })
            setPassword("")
            setmPassword("")
            setMuyLargo(false)
            setMessage(response.data.message || "Contraseña modificada correctamente")
            await timeout(2500)
            setMessage("")
        } catch (error) {
            setError(error.response?.data?.message || error.response?.data?.error || "No se pudo cambiar la contraseña")
        }
    }

    // const fetchTickets = async () => {
    //     try {
    //         api.get(`asiento/`)
    //     } catch (error) {
            
    //     }
    // }

    if(loading) return <p>Cargando...</p>
    if(!User) {
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
    }else{
        return(
            <section className="profile">
                <h1>PERFIL</h1>
                <div className="profile-container">
                    <div className="photo">
                        <div className={`pfp ${showEdit ? 'pfp-edit' : ''}`}>
                            <img src={imagenDefault} alt="Perfil" onClick={() => {if(showEdit === true) setShowPfp(true); console.log(showPfp)}}/> {/*{showEdit ? Mfoto : foto}  Para cuando arregle las imgs*/}
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
                                        <label>Alias: </label>
                                        <span>{alias}</span>
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
                                {message && <p style={{position: "fixed", top: "10px", left: "10px", color: "green", backgroundColor: "lightgreen", padding: "10px", borderRadius: "5px" }}>{message}</p>}
                                {error && !showChangePassword && <p style={{position: "fixed", top: "10px", left: "10px", color: "red", backgroundColor: "#590C0C", padding: "10px", borderRadius: "5px" }}>{error}</p>}

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
                                        <label htmlFor="alias">Alias: </label>
                                        <input 
                                            type="text" 
                                            id="alias"
                                            name="alias" 
                                            maxLength={15}
                                            value={Malias} 
                                            onChange={(e) => setmAlias(e.target.value)} 
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
                                    <button className="edit-button" type="button" onClick={()=>{ setError(""); setMuyLargo(true) }}>
                                        Cambiar Contraseña
                                    </button>
                                    <div className="profile-buttons">
                                        <button className="edit-button" type="submit">Guardar Perfil</button>
                                        <button className="edit-button" type="button" onClick={() =>
                                        {
                                        setShowEdit(false)
                                        setmNombre(nombre)
                                        setmApellido(apellido)
                                        setmAlias(alias)
                                        setmDni(dni)
                                        setmEmail(email)
                                        setmTelefono(telefono)
                                        setmFoto(User.foto || "")
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
                                <h3>Cerrar sesión</h3>
                                <p className="confirm-hint">¿Estás seguro de que querés salir?</p>
                                <div className="confirm-actions">
                                    <button id="btn-cancel" type="button" onClick={() => setShowConfirm(false)}>Cancelar</button>
                                    <button id="btn-confirm" type="button" onClick={() => {
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
                                <p className="pfp-hint">PNG, JPG o JPEG</p>
                                <form>
                                    <input type="file" name="avatar" id="avatar" onChange={(e) => cambiarImg(e.target.files[0])} accept="image/png, image/jpg, image/jpeg" />
                                    <label htmlFor="avatar" className="avatar-btn">
                                        <span>Buscar archivo</span>
                                    </label>

                                </form>
                                
                            </div>
                        </div>
                    )}

                    {showChangePassword && (
                        <div className="overlay">
                            <div className="cp-panel">
                                <div className="cerrar">
                                    <button id="btn-cerrar" onClick={() => setMuyLargo(false)}>
                                            <img src="https://i.postimg.cc/1tgHsdPp/flecha-volver-atras.png" alt="volver atras" />
                                    </button>
                                </div>
                                <form onSubmit={cambiarCont}>
                                    {error && <p style={{color: "#ffb4b4"}}>{error}</p>}
                                    <label htmlFor="password">Contraseña actual</label>
                                    <input 
                                    type="password"
                                    id="password"
                                    name="password"
                                    value={password}
                                    onChange={(e)=>setPassword(e.target.value)}
                                    />

                                    <label htmlFor="Mpassword">Nueva contraseña</label>
                                    <input 
                                    type="password"
                                    id="Mpassword"
                                    name="Mpassword"
                                    value={Mpassword}
                                    onChange={(e)=>setmPassword(e.target.value)}
                                    />

                                    <button type="submit">Cambiar Contraseña</button>
                                </form>
                            </div>
                        </div>
                    )}

                </div>
                    <h2>Tickets Proximos</h2>
                    <div id="divFuncionesTicks">
                        {proxTickets.map( (tick) => {
                            return <div>
                                <h1>{tick.Pelicula}</h1>
                                <h1>{tick.fecha}</h1>
                                <h1>Sala {tick.sala}</h1>
                                <h1>{tick.asiento}</h1>
                                <button className="btnCancelar">CANCELAR RESERVA</button>
                            </div>
                        })}
                    </div>
            </section>
        )
    }

}



export default Profile