import { Link } from "react-router-dom"
import { useState , useEffect } from "react"

// El axios configurado que vamos a usar
import api from "../api"

//import './styles/AdminPanel.css'

function AdminHome(props) {
    console.log("props.user en AdminHome.jsx:", props.user)
    const [message, setMessage] = useState("")
    const [response, setResponse] = useState("")
    const [tablasDisponibles, setTablasDisponibles] = useState([])
    
    const getMessage = async () => {
        try {
            const response = await api.get("/admin/")
            setMessage(response.data.message)
        } catch (error) {
            setMessage("upsis")
        }
    }
    
    const getTables = async() =>{
        try{
            const response = await api.get("tables/getAllTables")
            setTablasDisponibles(response.data); 
        }catch(error){
            console.error("Error al traer tablas:", error);
        }
    }
    
    // Apenas carga la página, el useEffect ejecuta todo lo que tenga adentro
    useEffect(() => {
        getMessage()
        getTables()
    }, [])

    const [tablaElegida, setTablaElegida] = useState("");

    const createTestUser = async () => {
        try {
            const response = await api.post("/usuarios/test", {});
            setResponse({message: response.data.message, mail: response.data.user.email});
            return;
        } catch (error) {
            console.error("Error al crear usuario de test:", error);
        }
    };

    const getRegisters = async () => {
        try {
            const response = await api.get(`${tablaElegida}/`)
            // Eliminamos el setResponse() vacío que no hacía falta
            setResponse({message: response.data}) 
        } catch (error) {
            console.error("Error al traer registros:", error);
        }
    }

    return(
        <div>
            <div>
                <h2>PANEL ADMINISTRADOR :Vvv:V</h2>
                <h3>Mensaje dado por el back-end</h3>
                <p style={{ color: "whitesmoke" }}>{message}</p>
            </div>
            <div style={{paddingTop: "50px"}}>
                {props.user ? (
                    <>
                        <p>Bienvenido {props.user.nombre} {props.user.apellido}</p>
                    </> 
                ) : (
                    <p>Kien so bo </p>
                )}
            </div>
            <section>
                <h3>Opciones de administrador</h3>
                <button onClick={createTestUser}>Crear usuario de test</button>
                <br />
                <select
                    id="tabla-bds"
                    value={tablaElegida}
                    onChange={(e) => setTablaElegida(e.target.value)}
                >
                    {/* Agregamos una opción por defecto para evitar que mande vacío */}
                    <option value="">Seleccioná una tabla</option>
                    {tablasDisponibles.map((nombreTabla) => (
                        <option key={nombreTabla} value={nombreTabla}>
                            {nombreTabla}
                        </option>
                    ))}
                </select>
                <button onClick={getRegisters}>GET ALL</button>
                <button onClick={getRegisters}>POST</button>
                <button onClick={getRegisters}>EDIT</button>
                <button onClick={getRegisters}>DELETE</button>
                <button onClick={getRegisters}>GET BY PK</button>

                <div style={{ 
                    display: "flex", 
                    flexDirection: "column",
                    width: "600px", 
                    height: "400px",
                    overflowY: "auto",
                    margin: "10px auto 0 auto",
                    backgroundColor: "black", 
                    padding: "15px", 
                    borderRadius: "5px",
                    border: "10px solid gray"
                }}>                    {
                        response.message && (
                            <div style={{ textAlign: "left" }}>
                                <p style={{ color: "whitesmoke", fontWeight: "bold" }}>Respuesta:</p>
                                
                                {/* Usamos <pre> y <code> para darle estructura de código JSON */}
                                <pre style={{ 
                                    color: "#A9FFB3", // Color verd para el texto
                                    fontFamily: "monospace", 
                                    whiteSpace: "pre-wrap", // Hace que si la línea es muy larga, baje sola
                                    wordBreak: "break-all" 
                                }}>
                                    {typeof response.message === 'object' 
                                        ? JSON.stringify(response.message, null, 2) // <-- El '2' es clave: mete 2 espacios de sangría
                                        : response.message}
                                </pre>
                            </div>
                        )
                    }
                    {
                        response.mail && (
                            <p>Usuario de test creado: {response.mail}</p>
                        )
                    }
                </div>
                
                
            </section>
        </div>
    )
}

export default AdminHome
