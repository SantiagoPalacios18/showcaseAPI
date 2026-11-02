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
    const { id } = useParams(); // Acá extraés el ID directamente de la URL
    
    const getPeliculaById = async () => {
        try {
            const peli = await api.get(`/peliculas/getByPk/${id}`);
            setPelicula(peli.data);
        } catch (error) {
            console.log({ error });
        }
    }

    const reservar = async () => {
        try {
            const reserva = api.
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
            <button onClick={()=>{reservar}}>Comprar tickets</button>
        </>
    )
}


export default peliculaInfo
