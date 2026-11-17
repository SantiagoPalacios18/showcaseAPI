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
    const [stagedAsientos, setStagedAsientos] = useState([])
    const [peliculaKeys, setPeliculaKeys] = useState([])
    const [funciones, setFunciones] = useState([])
    const [funcion, setFuncion] = useState({})
    const [mostrarReservar, setMostrarReservar] = useState(false)
    const [metodoPago, setMetodoPago] = useState()
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
            if (stagedAsientos.length == 0) return alert("No seleccionaste asientos")
            if (!metodoPago) return alert("No seleccionaste metodo de pago")

            console.log(
                props.user.id_Usuario, 
                funcion.id_Funcion, 
                stagedAsientos,
                funcion.precio,
                funcion.precio * stagedAsientos.length,
                metodoPago
            )
            
            const reserva = await api.post('/usuarios/registrarse', {
                idCliente: props.user.id_Usuario, 
                id_Funcion: funcion.id_Funcion, 
                asientos: stagedAsientos,
                precioUnidad: funcion.precio,
                total: funcion.precio * stagedAsientos.length,
                MetodoPago: metodoPago
            })
        } catch (error) {
            console.log({ error })
        }
        setMostrarReservar(false)
        setFuncion({})
        setStagedAsientos([])
    }

    const consultarAsientos = async () => {
        try {
            if (funcion.id_Funcion) {
                const asientosFuncion = await api.get(`/asientos/getByFuncionPk/${funcion.id_Funcion}`); //pickeo los asientos ya comprados
                const sala = await api.get(`/salas/getByFuncionPk/${funcion.id_sala}`) //pickeo la sala
                let asieTemp = Array.from({length: sala.data.sala.filas}, ()  => Array(sala.data.sala.columnas).fill("LIBRE")) //Genero un array de filas x columnas       
                for (let i=0; i < asientosFuncion.data.asientos.length; i++) {
                    asieTemp[asientosFuncion.data.asientos[i].fila / 100][asientosFuncion.data.asientos[i].columna] = "OCUPADO"
                }
                for (let i=0; i < asieTemp.length; i++) {
                    for (let j=0; j < asieTemp[i].length; j++) {
                        if (asieTemp[i][j] == "OCUPADO") console.log(i, j)
                    }
                }
                setAsientos(asieTemp)
            }
        } catch (error) {
            console.log(error)
        }
    }

    const añadirStagedAsiento = (fila, columna, e) => {
        try {
            let temp = [...stagedAsientos] //Usamos los ... para crear un NUEVO array, sin los puntitos temp apunta al mismo array y al setearlo no nota un cambio, por ende no rerenderiza los botones y no los cambia a naranja

            if (temp.includes(`${fila}-${columna}`)) temp = temp.filter(asiento => asiento !== `${fila}-${columna}`);
            else temp.push(fila+ "-" + columna)

            setStagedAsientos(temp)
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
        <button onClick={()=>{console.log(metodoPago)}}>sakdjfa</button>
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
                    <button onClick={() => {setFuncion({}), setMostrarReservar(false), setStagedAsientos([])}}>⬅️</button>
                    <legend>Reservar para la funcion {funcion.id_Funcion} </legend>
                    <form onSubmit={reservar}>
                        <label> PANTALLA </label>
                        
                        <table id="tablaAsientos"> 
                            <thead>
                                <tr>
                                    <th></th>
                                    {asientos[0]?.map((_, columna) => (
                                        <th>{columna+1}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {asientos?.map((fila, i) => (
                                        <tr>
                                            <td>{(i + 1) * 100}</td>
                                            {fila.map((asiento, j) => ( 
                                                <td>
                                                    <button
                                                        type="button"
                                                        disabled = {asiento == "OCUPADO"}
                                                        className = { stagedAsientos.includes(`${i}-${j}`)? "seleccionado" : asiento == "OCUPADO"? "ocupado":"libre"}
                                                        onClick={()=>{añadirStagedAsiento(i, j), setMostrarReservar(false), setMostrarReservar(true)}}
                                                    >{i+1}.{j+1}  {asiento === "LIBRE" ? "✓" : "X"}</button>
                                                </td>
                                            ))}
                                        </tr>
                                    ))}
                            </tbody>
                        </table>

                        <label> Seleccione su metodo de pago</label>
                        <select onChange={(e) => setMetodoPago(e.target.value)}>
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
