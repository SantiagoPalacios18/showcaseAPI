import { useState, useEffect } from "react"
import api from "../api"
import './styles/Home.css'
import './styles/evento.css'

function Eventos(props) {
    const [message, setMessage] = useState("")
    
    // Estados para catálogos desde la BD
    const [funcionesDisponibles, setFuncionesDisponibles] = useState([])
    const [espaciosDisponibles, setEspaciosDisponibles] = useState([])

    // Estados del formulario unificado
    const [tipoEvento, setTipoEvento] = useState("Grupal") // "Grupal", "Corporativo", "Cumpleaños"
    const [idFuncion, setIdFuncion] = useState("")
    const [idEspacio, setIdEspacio] = useState("")
    const [fechaHora, setFechaHora] = useState("")
    const [cantidadPersonas, setCantidadPersonas] = useState(1)
    const [detalleComida, setDetalleComida] = useState("")
    const [montoTotal, setMontoTotal] = useState(15000) 
    const [cargando, setCargando] = useState(false)
    const [resultado, setResultado] = useState(null)
    const [error, setError] = useState("")

    // Cargar datos iniciales y catálogos de la BD al montar el componente
    useEffect(() => {
        const fetchData = async () => {
            try {
                const resMsg = await api.get("/")
                setMessage(resMsg.data.message)

                // Obtener funciones reales de la BD para Salidas Grupales
                const resFunciones = await api.get("/funciones")
                setFuncionesDisponibles(resFunciones.data)
                if (resFunciones.data.length > 0) {
                    setIdFuncion(resFunciones.data[0].id_Funcion || resFunciones.data[0].id)
                }

                // Obtener salas / espacios reales de la BD para Corporativos y Cumpleaños
                const resSalas = await api.get("/salas")
                setEspaciosDisponibles(resSalas.data)
                if (resSalas.data.length > 0) {
                    setIdEspacio(resSalas.data[0].id_Sala || resSalas.data[0].id)
                }

            } catch (err) {
                console.error("Error al cargar los datos iniciales:", err)
                setError("No se pudieron cargar los datos del servidor.")
            }
        }
        fetchData()
    }, [])

    const handleSubmitReserva = async (e) => {
        e.preventDefault()
        setCargando(true)
        setResultado(null)
        setError("")

        try {
            const payload = {
                id_Usuario: props.id_Usuario || 1,
                id_Funcion: tipoEvento === "Grupal" ? parseInt(idFuncion) : null,
                id_Espacio: tipoEvento !== "Grupal" ? parseInt(idEspacio) : null,
                tipo: tipoEvento, 
                cantidad_personas: parseInt(cantidadPersonas),
                detalle_comida_bebida: tipoEvento !== "Grupal" ? detalleComida : null,
                fecha_hora_reserva: fechaHora || new Date(),
                monto_total: parseFloat(montoTotal),
                DVH: "ABC123" // Dígito Verificador Horizontal
            }

            const response = await api.post("/compras-eventos", payload)
            setResultado(response.data.message || "¡Reserva realizada con éxito!")
        } catch (err) {
            console.error(err)
            setError(err.response?.data?.error || "Error al procesar la reserva.")
        } finally {
            setCargando(false)
        }
    }

    return (
        <div className="eventos-wrapper">
            <div className="eventos-header">
                <h1>¡Gestión de Reservas!</h1>
                <h2>Salidas Grupales, Eventos Corporativos y Cumpleaños</h2>
                {message && <p className="text-muted">Estado API: {message}</p>}
            </div>

            <form onSubmit={handleSubmitReserva} className="e">
                {error && <p style={{ color: "#ef4444", fontSize: "14px", marginBottom: "10px" }}>{error}</p>}

                <label>Tipo de reserva:</label>
                <select 
                    value={tipoEvento} 
                    onChange={(e) => setTipoEvento(e.target.value)}
                >
                    <option value="Grupal">Salida Grupal (Cine)</option>
                    <option value="Corporativo">Evento Corporativo</option>
                    <option value="Cumpleaños">Cumpleaños</option>
                </select>

                {/* Renderizado condicional según el tipo elegido */}
                {tipoEvento === "Grupal" ? (
                    <>
                        <label>Selecciona la función:</label>
                        <select 
                            value={idFuncion} 
                            onChange={(e) => setIdFuncion(e.target.value)}
                        >
                            {funcionesDisponibles.map((funcion) => (
                                <option key={funcion.id_Funcion || funcion.id} value={funcion.id_Funcion || funcion.id}>
                                    {funcion.pelicula?.titulo || `Función ID: ${funcion.id_Funcion || funcion.id}`} - {funcion.horario || funcion.fecha_hora}
                                </option>
                            ))}
                        </select>

                        <label>Cantidad de tickets {cantidadPersonas > 25 && "(¡Descuento grupal aplicado >25!):"}</label>
                        <input 
                            type="number" 
                            min="1" 
                            value={cantidadPersonas}
                            onChange={(e) => setCantidadPersonas(e.target.value)}
                            required
                        />
                    </>
                ) : (
                    <>
                        <label>Selecciona espacio a alquilar:</label>
                        <select 
                            value={idEspacio} 
                            onChange={(e) => setIdEspacio(e.target.value)}
                        >
                            {espaciosDisponibles.map((espacio) => (
                                <option key={espacio.id_Sala || espacio.id} value={espacio.id_Sala || espacio.id}>
                                    {espacio.nombre || `Sala ID: ${espacio.id_Sala || espacio.id}`}
                                </option>
                            ))}
                        </select>

                        <label>Selecciona fecha y horario:</label>
                        <input 
                            type="datetime-local" 
                            value={fechaHora}
                            onChange={(e) => setFechaHora(e.target.value)}
                            required
                        />

                        <label>Cantidad de personas:</label>
                        <input 
                            type="number" 
                            min="1" 
                            value={cantidadPersonas}
                            onChange={(e) => setCantidadPersonas(e.target.value)}
                            required
                        />

                        <label>Detalle de comida y bebida:</label>
                        <textarea 
                            placeholder="Ej: Combos de snacks, gaseosas..."
                            value={detalleComida}
                            onChange={(e) => setDetalleComida(e.target.value)}
                        />
                    </>
                )}

                <label>Precio total:</label>
                <p id="e-6">${montoTotal} {cantidadPersonas > 25 && tipoEvento === "Grupal" && "(Con descuento aplicado)"}</p>

                <button type="submit" disabled={cargando}>
                    {cargando ? "Procesando..." : "Confirmar y Pagar Reserva"}
                </button>

                {resultado && (
                    <div style={{ marginTop: '15px', color: '#10b981', fontSize: '14px' }}>
                        <p>{resultado}</p>
                    </div>
                )}
            </form>
        </div>  
    )
}

export default Eventos