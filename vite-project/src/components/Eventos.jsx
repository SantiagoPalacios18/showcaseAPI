import { useState, useEffect } from "react"
import api from "../api"
import './styles/Home.css'
import './styles/evento.css'

function Eventos(props) {
    // 1. Estados básicos del formulario
    const [tipoEvento, setTipoEvento] = useState("Grupal")
    const [idFuncion, setIdFuncion] = useState(1)
    const [idEspacio, setIdEspacio] = useState(1)
    const [fechaHora, setFechaHora] = useState("")
    const [cantidadPersonas, setCantidadPersonas] = useState(1)
    const [detalleComida, setDetalleComida] = useState("")
    const [montoTotal, setMontoTotal] = useState(0)

    // 2. Listas para los selects y mensajes
    const [funciones, setFunciones] = useState([])
    const [salas, setSalas] = useState([])
    const [mensaje, setMensaje] = useState("")
    const [cargando, setCargando] = useState(false)

    // Cargar las funciones y salas al abrir la página
    useEffect(() => {
        const cargarDatos = async () => {
            try {
                const resFunciones = await api.get("/funciones")
                setFunciones(resFunciones.data)

                const resSalas = await api.get("/salas")
                setSalas(resSalas.data)
            } catch (error) {
                console.log("Error al cargar catálogos:", error)
            }
        }
        cargarDatos()
    }, [])

    // Cálculo dinámico de precio según tipo y cantidad de personas
    useEffect(() => {
        const personas = parseInt(cantidadPersonas) || 1
        let calculo = 0

        if (tipoEvento === "Grupal") {
            const PRECIO_TICKET = 5000
            calculo = personas * PRECIO_TICKET

            // Descuento del 10% si supera los 25 asistentes
            if (personas > 25) {
                calculo = calculo * 0.90
            }
        } else if (tipoEvento === "Corporativo") {
            const BASE_CORPORATIVO = 100000
            const ADICIONAL_PERSONA = 2000
            calculo = BASE_CORPORATIVO + (personas * ADICIONAL_PERSONA)
        } else if (tipoEvento === "Cumpleaños") {
            const BASE_CUMPLE = 60000
            const ADICIONAL_PERSONA = 1500
            calculo = BASE_CUMPLE + (personas * ADICIONAL_PERSONA)
        }

        setMontoTotal(calculo)
    }, [tipoEvento, cantidadPersonas])

    // Enviar el formulario al backend
    const handleSubmit = async (e) => {
        e.preventDefault()
        setCargando(true)
        setMensaje("")

        const payload = {
            id_Usuario: props.id_Usuario || 1,
            id_Funcion: tipoEvento === "Grupal" ? parseInt(idFuncion) : null,
            id_Espacio: tipoEvento !== "Grupal" ? parseInt(idEspacio) : null,
            tipo: tipoEvento,
            cantidad_personas: parseInt(cantidadPersonas),
            detalle_comida_bebida: tipoEvento !== "Grupal" ? detalleComida : null,
            fecha_hora_reserva: fechaHora || new Date(),
            monto_total: parseFloat(montoTotal),
            DVH: "ABC123"
        }

        try {
            const response = await api.post("/compras-eventos", payload)
            setMensaje("¡Reserva creada con éxito!")
        } catch (error) {
            setMensaje("Error al crear la reserva. Intente de nuevo.")
            console.log(error)
        } finally {
            setCargando(false)
        }
    }

    return (
        <div className="eventos-wrapper">
            <div className="eventos-header">
                <h1>Gestión de Reservas</h1>
            </div>

            <form onSubmit={handleSubmit} className="e">
                {/* Selector de Tipo de Evento */}
                <label>Tipo de Reserva:</label>
                <select value={tipoEvento} onChange={(e) => setTipoEvento(e.target.value)}>
                    <option value="Grupal">Salida Grupal (Cine)</option>
                    <option value="Corporativo">Evento Corporativo</option>
                    <option value="Cumpleaños">Cumpleaños</option>
                </select>

                {/* Campos condicionales según el tipo */}
                {tipoEvento === "Grupal" ? (
                    <>
                        <label>Función de Cine:</label>
                        <select value={idFuncion} onChange={(e) => setIdFuncion(e.target.value)}>
                            {funciones.map((f) => (
                                <option key={f.id} value={f.id}>
                                    Función #{f.id}
                                </option>
                            ))}
                        </select>
                    </>
                ) : (
                    <>
                        <label>Sala / Espacio:</label>
                        <select value={idEspacio} onChange={(e) => setIdEspacio(e.target.value)}>
                            {salas.map((s) => (
                                <option key={s.id} value={s.id}>
                                    {s.nombre || `Sala #${s.id}`}
                                </option>
                            ))}
                        </select>

                        <label>Fecha y Hora:</label>
                        <input 
                            type="datetime-local" 
                            value={fechaHora} 
                            onChange={(e) => setFechaHora(e.target.value)} 
                            required 
                        />

                        <label>Detalle de Comida:</label>
                        <textarea 
                            value={detalleComida} 
                            onChange={(e) => setDetalleComida(e.target.value)}
                            placeholder="Opcional..."
                        />
                    </>
                )}

                <label>Cantidad de Personas:</label>
                <input 
                    type="number" 
                    min="1" 
                    value={cantidadPersonas} 
                    onChange={(e) => setCantidadPersonas(e.target.value)} 
                    required 
                />

                <label>Precio Total Estimado:</label>
                <p id="e-6" style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>
                    ${montoTotal.toLocaleString('es-AR')} 
                    {cantidadPersonas > 25 && tipoEvento === "Grupal" && " (¡10% de descuento aplicado!)"}
                </p>

                <button type="submit" disabled={cargando}>
                    {cargando ? "Guardando..." : "Confirmar Reserva"}
                </button>

                {mensaje && <p style={{ marginTop: "10px", color: "green" }}>{mensaje}</p>}
            </form>
        </div>
    )
}

export default Eventos