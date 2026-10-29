import { Link } from "react-router-dom"
import { useState , useEffect } from "react"

// El axios configurado que vamos a usar
import api from "../api"

import './styles/AdminPanel.css'

function AdminHome(props) {
    //console.log("props.user en AdminHome.jsx:", props.user)
    const [message, setMessage] = useState("")
    const [response, setResponse] = useState("")
    const [tablasDisponibles, setTablasDisponibles] = useState([])
    const [id, setId] = useState("") 
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

    const getData = async () => {
        try {
            const response = await api.get(`${tablaElegida}/`)
            setResponse({message: response.data}) 
        } catch (error) {
            console.error("Error al traer registros:", error);
        }
    }
    // Los 4 de abajo necesitan la id
    const getRegisterByPk = async () => {
        try{
            console.log("PK ingresada: "+id)
            if (!id){alert("Se debe ingresar un valor de PK")}
            const response = await api.get(`${tablaElegida}/getByPk/${id}`)
            setResponse({message: response.data})
            console.log({message: response.data})
        }catch(error){
            console.log("Error al buscar el registro", error)
            alert(error.response?.data?.message || "Error al buscar el registro")
        }
    }

    const modifyRegister = async ( ) =>{
        console.log("MODIFY REGISTRO ANDANDO, SE REQUIRIÓ PATENTE ESPECIFICA")

    }

    const deleteRegister = async ( ) =>{
        console.log("DELETE REGISTRO ANDANDO, SE REQUIRIÓ PATENTE ESPECIFICA")

    }
    const postRegister = async () =>{
        try{
            console.log("PK ingresada: "+id)
            //if (!id){alert("Se debe ingresar un valor de PK")}
            const response = await api.post(`${tablaElegida}/`,{
                id_Usuario: 999,
                DNI : 123345678,
                email: 'asdasdasd@a.com' 
            })
            setResponse({message: response.data})
            console.log({message: response.data})
        }catch(error){
            console.log("Error al buscar el registro", error)
            alert(error.response?.data?.message || "Error al postear el registro")

        }
        console.log("POST REGISTRO ANDANDO, SE REQUIRIÓ PATENTE ESPECIFICA")
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
                <div style={{
                    display: "flex", 
                    flexDirection: "row",
                    alignItems: "flex-start",
                    justifyContent: "center",
                    gap: "20px",
                    width: "100%",
                    boxSizing: "border-box"
                    }}>

                    <div style={{ 
                        display: "flex", 
                        flexDirection: "column",
                        width: "700px", 
                        height: "450px",
                        overflowY: "auto",
                        margin: "10px 0",
                        backgroundColor: "black", 
                        padding: "15px", 
                        borderRadius: "5px",
                        border: "5px solid gray",
                        flexShrink: 0,
                    }}>                    {
                            response.message && (
                                <div style={{ textAlign: "left" }}>
                                    <p style={{ color: "whitesmoke", fontWeight: "bold" }}>Respuesta:</p>
                                    
                                    {/* para darle estructura de JSON */}
                                    <pre style={{ 
                                        color: "#A9FFB3",
                                        fontFamily: "monospace", 
                                        whiteSpace: "pre-wrap", // Si la linea es larga, baja sola
                                        wordBreak: "break-all" 
                                    }}>
                                        {typeof response.message === 'object' 
                                            ? JSON.stringify(response.message, null, 2)
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
                    <div
                        style={{
                            display: "flex", 
                            flexDirection: "column",
                            width: "280px",
                            flexShrink: 0,
                        }}>

                    
                        <input
                        placeholder="Inserte la Clave Primaria"
                        onChange={(e) => setId(e.target.value)}
                        ></input>
                        <div className="admin-crud-buttons">
                        
                            <button className="btn-admin-crud" onClick={getData}>GET ALL</button>
                            <button className="btn-admin-crud" onClick={postRegister}>POST</button>
                            <button className="btn-admin-crud" onClick={modifyRegister}>EDIT</button>
                            <button className="btn-admin-crud" onClick={deleteRegister}>DELETE</button>
                            <button className="btn-admin-crud" onClick={getRegisterByPk}>GET BY PK</button>

                        </div>
                    </div>
                </div>
                
            </section>
            <div>
                <div className="emergent-CRUD">
                        
                </div>
            </div>
        </div>
    )
}

export default AdminHome
