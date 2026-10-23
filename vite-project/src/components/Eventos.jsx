import { useState, useEffect } from "react"
import api from "../api"
import './styles/Home.css'
import './styles/evento.css'

function Eventos(props) {
    const [message, setMessage] = useState("")
    
    // Estados del formulario unificado
    const [tipoEvento, setTipoEvento] = useState("Grupal") // "Grupal", "Corporativo", "Cumpleaños"
    const [idFuncion, setIdFuncion] = useState("1")
    const [idEspacio, setIdEspacio] = useState("1")
    const [fechaHora, setFechaHora] = useState("")
    const [cantidadPersonas, setCantidadPersonas] = useState(1)
    const [detalleComida, setDetalleComida] = useState("")
    const [montoTotal, setMontoTotal] = useState(15000) 
    const [cargando, setCargando] = useState(false)
    const [resultado, setResultado] = useState(null)

    const getMessage = async () => {
        try {
            const response = await api.get("/")
            setMessage(response.data.message)
        } catch (error) {
            setMessage("upsis")
        }
    }

    useEffect(() => {
        getMessage()
    }, [])

    const handleSubmitReserva = async (e) => {
        e.preventDefault()
        setCargando(true)
        setResultado(null)

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
                DVH: "ABC123" // Dígito Verificador Horizontal (CU04)
            }

            const response = await api.post("/compras-eventos", payload)
            setResultado({ ok: true, mensaje: response.data.message })
        } catch (error) {
            setResultado({ 
                ok: false, 
                mensaje: error.response?.data?.error || "Error al procesar la reserva (sistema no disponible)." 
            })
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
                        <label>Selecciona la función (Película, fecha y hora):</label>
                        <select 
                            value={idFuncion} 
                            onChange={(e) => setIdFuncion(e.target.value)}
                        >
                            <option value="1">Spider-Man: Función 18:00hs (2D)</option>
                            <option value="2">Avatar 2: Función 21:30hs (3D)</option>
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
                            <option value="1">Sala 1 (Privada)</option>
                            <option value="2">Sala 2 (VIP)</option>
                            <option value="3">SUM / Espacio Social</option>
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
                            placeholder="Ej: 3 combos de snacks, gaseosas..."
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
                    <div style={{ marginTop: '15px', color: resultado.ok ? '#10b981' : '#ef4444' }}>
                        <p>{resultado.mensaje}</p>
                    </div>
                )}
            </form>
        </div>  
    )
}

export default Eventos