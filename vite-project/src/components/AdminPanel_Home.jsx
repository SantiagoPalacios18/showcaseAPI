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

    // Para la ventana emergente de CRUD:
    const [showCRUDForm, setShowCRUDForm] = useState(false)
    const [campos, setCampos] = useState([])
    const [data, setData] = useState({})
    const [originalData, setOriginalData] = useState({})// Version antigua de los datos
    const [editId, setEditId] = useState("") //PK del registro que se edita
    const [errorForm, setErrorForm] = useState("")


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
            if (!id){return alert("Se debe ingresar un valor de PK")}
            const response = await api.get(`${tablaElegida}/getByPk/${id}`)
            setResponse({message: response.data})
            console.log({message: response.data})
        }catch(error){
            console.log("Error al buscar el registro", error)
            alert(error.response?.data?.message || "Error al buscar el registro")
        }
    }

    /*const postRegister = async () =>{
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
    }*/

    // Traducción de lenguaje SQL a html para el input correspondiente para el form
    const inputFor = (campo) => {
        const t = campo.type
        const n = campo.name.toLowerCase()
        if (n.includes("password") || n.includes("contraseña")) return "password"
        if (t.includes("TINYINT(1)") || t.includes("BOOL")) return "checkbox"
        if (t.includes("TEXT")) return "textarea"
        if (t.includes("DATETIME") || t.includes("TIMESTAMP")) return "datetime-local"
        if (t.includes("DATE")) return "date"
        if (/INT|DECIMAL|FLOAT|DOUBLE|NUMERIC/.test(t)) return "number"
        return "text"
    }
    const openForm = async (mode) => { // Esta función va a funcar para 2 modos: POST y EDIT
        if (!tablaElegida) return alert("Seleccioná una tabla primero")
        if (mode === "edit" && !id) return alert("Ingresá la PK del registro a editar")

        try {
            const { data: camposData } = await api.get(`tables/getTableFields/${tablaElegida}`) // Esto nos crea una constante llamada camposData, así no tengo q agarrar el .data siempre

            let dataOriginal = {}
            if (mode === "edit") {
                const { data: registro } = await api.get(`${tablaElegida}/getByPk/${id}`) // Esto noes crea la constante registro
                for (const c of camposData) {
                    let v = registro[c.name] // Se agarra el valor del campo asignado (c) del registro
                    if (v == null) continue
                    const tipo = inputFor(c) 
                    if (tipo === "password") continue // si es la contraseña, no la mostramos
                    if (tipo === "datetime-local") v = String(v).slice(0, 16)// "2025-01-31T10:30"
                    else if (tipo === "date") v = String(v).slice(0, 10)// "2025-01-31"
                    dataOriginal[c.name] = v
                }
            }

            setCampos(camposData)
            setData(dataOriginal)
            setOriginalData(dataOriginal)
            setEditId(id)
            setErrorForm("")
            setShowCRUDForm(mode)
        } catch (error) {
            alert(error.response?.data?.message || "No se pudo abrir el formulario")
        }
    }
    // Para subir formulario de POST o EDIT
    const submitForm = async (e) => {
        e.preventDefault()
        setErrorForm("")

        const body = {}
        for (const campo of campos) {
            const v = data[campo.name]
            const tipo = inputFor(campo)

            if (showCRUDForm === "create") {
                if (v === undefined || v === "") continue
                body[campo.name] = tipo === "number" ? Number(v) : v
            } else {
                // En edición solo mandamos lo que cambió
                if (v === originalData[campo.name]) continue
                if (v === undefined || v === "") {
                    // Había un valor y lo borraron → lo mandamos como null
                    if (originalData[campo.name] !== undefined) body[campo.name] = null
                    continue
                }
                body[campo.name] = tipo === "number" ? Number(v) : v
            }
        }

        if (showCRUDForm === "edit" && Object.keys(body).length === 0) {
            return setErrorForm("No modificaste ningún campo")
        }

        try {
            const { data: respuesta } = showCRUDForm === "create"
                ? await api.post(`${tablaElegida}/`, body)
                : await api.patch(`${tablaElegida}/edit/${editId}`, body)

            setResponse({ message: respuesta })
            setShowCRUDForm(null)
        } catch (error) {
            setErrorForm(error.response?.data?.message || "Error al guardar el registro")
        }
    }
    const handleFormChange = (campo, e) => {
        const valor = inputFor(campo) === "checkbox" ? e.target.checked : e.target.value
        setData(prev => ({ ...prev, [campo.name]: valor }))
    }

    const postRegister = () => openForm("create")
    const modifyRegister = () => openForm("edit")

    const deleteRegister = async () => {
        if (!tablaElegida) return alert("Seleccioná una tabla primero")
        if (!id) return alert("Ingresá la PK del registro a borrar")
        if (!window.confirm(`¿Borrar el registro ${id} de "${tablaElegida}"?`)) return
        try {
            const { data } = await api.delete(`${tablaElegida}/${id}`)
            setResponse({ message: data })
        } catch (error) {
            alert(error.response?.data?.message || "Error al borrar el registro")
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
                    onChange={(e) => {
                        setTablaElegida(e.target.value)
                        setShowCRUDForm(null)   // cierra el formulario si estaba abierto
                    }}
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
            {showCRUDForm && (
                <div className="modal-overlay" onClick={() => setShowCRUDForm(null)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <h3>
                            {showCRUDForm === "create"
                                ? `Crear registro en "${tablaElegida}"`
                                : `Editar registro ${editId} de "${tablaElegida}"`}
                        </h3>

                        <form onSubmit={submitForm}>
                            {campos.map((campo) => {
                                const tipo = inputFor(campo)
                                // Al editar, la contraseña es opcional (vacía = no se cambia)
                                const requerido = campo.required && !(showCRUDForm === "edit" && tipo === "password")
                                return (
                                    <div key={campo.name} className="form-field">
                                        <label>
                                            {campo.name}{requerido && " *"}
                                            <small> ({campo.type})</small>
                                        </label>

                                        {tipo === "textarea" ? (
                                            <textarea
                                                required={requerido}
                                                value={data[campo.name] ?? ""}
                                                onChange={(e) => handleFormChange(campo, e)}
                                            />
                                        ) : tipo === "checkbox" ? (
                                            <input
                                                type="checkbox"
                                                checked={!!data[campo.name]}
                                                onChange={(e) => handleFormChange(campo, e)}
                                            />
                                        ) : (
                                            <input
                                                type={tipo}
                                                required={requerido}
                                                value={data[campo.name] ?? ""}
                                                onChange={(e) => handleFormChange(campo, e)}
                                                placeholder={
                                                    showCRUDForm === "edit" && tipo === "password"
                                                        ? "Dejar vacío para no cambiarla"
                                                        : ""
                                                }
                                            />
                                        )}
                                    </div>
                                )
                            })}

                            {errorForm && <p style={{ color: "tomato" }}>{errorForm}</p>}

                            <div className="form-actions">
                                <button type="button" onClick={() => setShowCRUDForm(null)}>Cancelar</button>
                                <button type="submit">
                                    {showCRUDForm === "create" ? "Crear" : "Guardar cambios"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}

export default AdminHome
