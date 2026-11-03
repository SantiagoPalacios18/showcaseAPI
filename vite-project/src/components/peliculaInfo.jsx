import { Link, useParams } from "react-router-dom"
import { useState, useEffect } from "react"


// El axios configurado que vamos a usar
import api from "../api"
import imagenTest from "../media/unnamed.jpg"
import './styles/Home.css'
import './styles/peliculaInfo.css'



function peliculaInfo(props) {
    const [pelicula, setPelicula] = useState([])
    const [peliculaKeys, setPeliculaKeys] = useState([])
    const [mostrarReservar, setMostrarReservar] = useState(false)
    const [mostrarFunciones, setMostrarFunciones] = useState(false)
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

    const reservar = async (e) => {
        e.preventDefault()
        setMostrarReservar(false)
        try {
            const reserva = api.post('', {
                idCliente: props.user.id_Cliente
            })
        } catch (error) {
            console.log({error})
        }
    }

    useEffect(() => {
        getPeliculaById()
    }, [])

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

            {mostrarFunciones==false && (
                <button onClick={()=>{setMostrarReservar(true)}}>Comprar tickets</button>
            )}
            {mostrarReservar==true && (
                <h1>kjfgasdlafsdfk</h1>
            )}
            {mostrarReservar==false && (
                <button onClick={()=>{setMostrarReservar(true)}}>Comprar tickets</button>
            )}
            {mostrarReservar==true && (
                <div id="divReserva">
                    <legend>Reservar</legend>
                    <form onSubmit={reservar}>
                        <label> Asientos</label>
                        <input type="text" placeholder="Cuantos asientos quiere?" />
                        <label> Seleccione su metodo de pago</label>
                        <select>
                            <option value="">Seleccionar Metodo de Pago</option>
                            <option value="Mercado Pago">Mercado Pago</option>
                            <option value="Debito">Debito</option>
                            <option value="Credito">Credito</option>
                            <option value="Colita">Colita</option>
                        </select>
                        <button type="submit">Reservar</button>
                    </form>
                </div>
            )}

        </>
    )
}


export default peliculaInfo
