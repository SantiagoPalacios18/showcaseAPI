import { Link, Navigate, useNavigate } from "react-router-dom"
import { useState , useEffect } from "react"

// El axios configurado que vamos a usar
import api from "../api"

import './styles/AdminPanel.css'

function AdminHome(props) {
    //console.log("props.user en AdminHome.jsx:", props.user)
    const [message, setMessage] = useState("")
    const [response, setResponse] = useState("")
    const [recursos, setRecursos] = useState([])
    const [id, setId] = useState("") 

    // Para la ventana emergente de CRUD:
    const [showCRUDForm, setShowCRUDForm] = useState(false)
    const [campos, setCampos] = useState([])
    const [data, setData] = useState({})
    const [originalData, setOriginalData] = useState({})// Version antigua de los datos
    const [editId, setEditId] = useState("") //PK del registro que se edita
    const [errorForm, setErrorForm] = useState("")
    const navigate = useNavigate()


    
    const getTables = async() =>{
        try{
            const response = await api.get("tables/getAllTables")
            const lista = Array.isArray(response.data) ? response.data : []
            setRecursos(lista.map((item) => (
                typeof item === "string" ? { ruta: item, tabla: item, pks: [] } : item
            )))
        }catch(error){
            console.error("Error al traer tablas:", error);
        }
    }
    
    // Apenas carga la página, el useEffect ejecuta todo lo que tenga adentro
    useEffect(() => {
        getTables()
    }, [])

    const [tablaElegida, setTablaElegida] = useState("");
    const recursoActual = recursos.find((recurso) => recurso.ruta === tablaElegida)
    const tablaSql = recursoActual?.tabla || ""
    const pkHint = Array.isArray(recursoActual?.pks) ? recursoActual.pks.join("/") : ""

    const pkPath = () => String(id || "").trim().replace(/^\/+|\/+$/g, "")

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

    const verBitacora = async () => {
        try {
            const { data } = await api.get("bitacora")
            setResponse({ message: data })
        } catch (error) {
            alert(error.response?.data?.message || "No se pudo leer la bitácora")
        }
    }

    const verificarIntegridad = async () => {
        try {
            const { data } = await api.get("integridad/verificar")
            setResponse({ message: data })
        } catch (error) {
            alert(error.response?.data?.message || "No se pudo verificar la integridad")
        }
    }
    // Los 4 de abajo necesitan la id
    const getRegisterByPk = async () => {
        try{
            const pk = pkPath()
            console.log("PK ingresada: "+pk)
            if (!pk){return alert("Se debe ingresar un valor de PK")}
            const response = await api.get(`${tablaElegida}/getByPk/${pk}`)
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
        const pk = pkPath()
        if (mode === "edit" && !pk) return alert("Ingresá la PK del registro a editar")

        try {
            const { data: camposData } = await api.get(`tables/getTableFields/${encodeURIComponent(tablaSql)}`) // Esto nos crea una constante llamada camposData, así no tengo q agarrar el .data siempre

            let dataOriginal = {}
            if (mode === "edit") {
                const { data: respuestaRegistro } = await api.get(`${tablaElegida}/getByPk/${pk}`) // Esto noes crea la constante registro
                let registro = respuestaRegistro
                if (Array.isArray(registro)) {
                    if (registro.length === 1) registro = registro[0]
                    else {
                        alert(pkHint
                            ? `Esta tabla tiene clave compuesta. Ingresala como ${pkHint}`
                            : "Esta tabla tiene clave compuesta. Separá los valores con /")
                        return
                    }
                }
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
            setEditId(pk)
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
            if (campo.name === "DVH") continue
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
        const pk = pkPath()
        if (!pk) return alert("Ingresá la PK del registro a borrar")
        if (!window.confirm(`¿Borrar el registro ${pk} de "${tablaElegida}"?`)) return
        try {
            const { data } = await api.delete(`${tablaElegida}/${pk}`)
            setResponse({ message: data })
        } catch (error) {
            alert(error.response?.data?.message || "Error al borrar el registro")
        }
    }
    
    const openSQLZone = async () =>{
        navigate('/admin/sql/')
    }


    return(
        <div className="admin-home">
            <div className="admin-header">
                <h2>Panel Administrador</h2>
                <button className="admin-sql-btn" onClick={() => {openSQLZone()}}>SQL</button>

            </div>

            <div className="admin-welcome">
                {props.user ? (
                    <>
                        <p>Bienvenido {props.user.nombre} {props.user.apellido}</p>
                    </> 
                ) : (
                    <p>Kien so bo </p>
                )}
            </div>
            <section className="admin-section">
                <h3>Opciones de administrador</h3>
                <button className="admin-test-btn" onClick={createTestUser}>Crear usuario de test</button>
                <select
                    id="tabla-bds"
                    className="admin-table-select"
                    value={tablaElegida}
                    onChange={(e) => {
                        setTablaElegida(e.target.value)
                        setShowCRUDForm(null)   // cierra el formulario si estaba abierto
                    }}
                >
                    {/* Agregamos una opción por defecto para evitar que mande vacío */}
                    <option value="">Seleccioná una tabla</option>
                    {recursos.map((recurso) => (
                        <option key={recurso.ruta} value={recurso.ruta}>
                            {recurso.tabla && recurso.tabla !== recurso.ruta
                                ? `${recurso.ruta} (${recurso.tabla})`
                                : recurso.ruta}
                        </option>
                    ))}
                </select>
                <div className="admin-workspace">

                    <div className="admin-output">                    {
                            response.message && (
                                <div>
                                    <p>Respuesta:</p>
                                    
                                    {/* para darle estructura de JSON */}
                                    <pre>
                                        {typeof response.message === 'object' 
                                            ? JSON.stringify(response.message, null, 2)
                                            : response.message}
                                    </pre>
                                </div>
                            )
                        }
                        {
                            response.mail && (
                                <p className="admin-mail">Usuario de test creado: {response.mail}</p>
                            )
                        }
                    </div>

                    <div className="admin-controls">

                    
                        <input
                        className="admin-pk"
                        placeholder={pkHint ? `PK: ${pkHint}` : "Inserte la Clave Primaria"}
                        onChange={(e) => setId(e.target.value)}
                        ></input>
                        <div className="admin-crud-buttons">
                        
                            <button className="btn-admin-crud" onClick={getData}>GET ALL</button>
                            <button className="btn-admin-crud" onClick={postRegister}>POST</button>
                            <button className="btn-admin-crud" onClick={modifyRegister}>EDIT</button>
                            <button className="btn-admin-crud" onClick={deleteRegister}>DELETE</button>
                            <button className="btn-admin-crud" onClick={getRegisterByPk}>GET BY PK</button>

                        </div>
                        <div className="admin-auditoria">
                            <button type="button" className="btn-admin-crud" onClick={verBitacora}>BITÁCORA</button>
                            <button type="button" className="btn-admin-crud" onClick={verificarIntegridad}>VERIFICAR DVV</button>
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
                                if (campo.name === "DVH") {
                                    return (
                                        <div key={campo.name} className="form-field">
                                            <label>
                                                DVH <small>(lo calcula el servidorr)</small>
                                            </label>
                                            <input value={data[campo.name] ?? ""} disabled />
                                        </div>
                                    )
                                }
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
