import { Link, useParams } from "react-router-dom"
import { useState, useEffect } from "react"


// El axios configurado que vamos a usar
import api from "../api"
import imagenTest from "../media/unnamed.jpg"
import './styles/Home.css'
import './styles/peliculaInfo.css'



function peliculaInfo(props) {
    const [pelicula, setPelicula] = useState([])
    const [asientos, setAsientos] = useState([])
    const [peliculaKeys, setPeliculaKeys] = useState([])
    const [funciones, setFunciones] = useState([])
    const [funcion, setFuncion] = useState({})
    const [mostrarReservar, setMostrarReservar] = useState(false)
    const [datosReserva, setDatosReserva] = useState({
        Total: null,
        MetodoPago: null,

    })
    const { id } = useParams(); // Acá extraés el ID directamente de la URL

    const getPeliculaById = async () => {
        try {
            const peli = await api.get(`/peliculas/getByPk/${id}`);
            setPelicula(peli.data);
        } catch (error) {
            console.log({ error });
        }
    }

    const getFuncionesPelicula = async () => {
        try {
            const funcs = await api.get(`/funciones/getByPkPeli/${id}`);

            const formateadas = funcs.data.map(func => ({
                ...func,
                horarioInicio: new Intl.DateTimeFormat('es-AR', {
                    day: 'numeric',
                    month: 'numeric',
                    year: 'numeric',
                    hour: 'numeric',
                    minute: '2-digit',
                    second: '2-digit',
                    hour12: false,
                    timeZone: 'America/Buenos_Aires'
                }).format(new Date(func.horarioInicio)).replace(',', '')
            }));

            setFunciones(formateadas)
        } catch (error) {
            console.log({ error })
        }
    }

    const reservar = async (e) => {
        e.preventDefault()
        try {
            const reserva = api.post('', {
                idCliente: props.user.id_Cliente
            })
        } catch (error) {
            console.log({ error })
        }
        setMostrarReservar(false)
        setFuncion({})
    }

    const consultarAsientos = async () => {
        try {
            if (funcion.id_Funcion) {
                const asientosFuncion = await api.get(`/asientos/getByFuncionPk/${funcion.id_Funcion}`); //pickeo los asientos ya comprados

                const sala = await api.get(`/salas/getByFuncionPk/${funcion.id_sala}`) //pickeo la sala
                let asieTemp = Array.from({length: sala.data.sala.filas}, ()  => Array(sala.data.sala.columnas).fill("LIBRE"))                
                for (let i=1; i < asientosFuncion.data.asientos.length + 1; i++) {
                    console.log(i)  
                }
                console.log(asieTemp)
                console.log(asientosFuncion)
                // console.log(asientosFuncion)
            }
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        getPeliculaById(),
        getFuncionesPelicula()
    }, [])

    useEffect(() => {
        consultarAsientos()
    }, [funcion])

    return (
        <>
            <div id="peliculaInfoDiv">
                <img src={imagenTest} alt={pelicula.titulo} />
                <div id="peliculaInfoDivDiv">
                    {Object.keys(pelicula).filter((key) => key != "imagen").map((key) => (
                        <h1>{pelicula[key]}</h1>
                    ))}
                </div>
            </div>  
            {mostrarReservar == false && (
                <div>
                    <div id="divFunciones">
                        {funciones.map((func) => {
                            return <div onClick={() => {setMostrarReservar(true), setFuncion(func)}}>
                                <h1>Funcion {func.id_Funcion}</h1>
                                <h1>Sala {func.id_sala}</h1>
                                <h1>Horario: {func.horarioInicio}</h1>
                                <h1>Idioma: {func.idioma}</h1>
                                <h1>Proyeccion {func.proyeccion}</h1>
                                <h1>Tecnologia {func.tecnologium.nombre}</h1>
                            </div>
                        })}
                    </div>
                </div>
            )}
            {mostrarReservar == true && (
                <div id="divReserva">
                    <button onClick={() => {setMostrarReservar(false), setFuncion({})}}>⬅️</button>
                    <legend>Reservar para la funcion {funcion.id_Funcion} </legend>
                    <form onSubmit={reservar}>
                        <label> Asientos </label>
                        <ul>
                            {asientos.map((asi) => {
                                return
                                <li>{asi.numero}.{asi.fila}</li>
                            })}
                        </ul>
                        <label> Seleccione su metodo de pago</label>
                        <select>
                            <option value="" disabled selected hidden>Seleccionar Metodo de Pago</option>
                            <option value="Mercado Pago">Mercado Pago</option>
                            <option value="Debito">Debito</option>
                            <option value="Credito">Credito</option>
                        </select>
                        <button type="submit">Reservar</button>
                    </form>
                </div>
            )}

        </>
    )
}


export default peliculaInfo
