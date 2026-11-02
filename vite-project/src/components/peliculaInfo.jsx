import { Link, useParams } from "react-router-dom"
import {useState , useEffect } from "react"


// El axios configurado que vamos a usar
import api from "../api"
import imagenTest from "../media/unnamed.jpg"
import './styles/Home.css'
import './styles/sorteo.css'



function peliculaInfo(props) {
    const [pelicula, setPelicula] = useState([])
    const { id } = useParams(); // Acá extraés el ID directamente de la URL

    const getPeliculaById = async (id) => {
        try {
            const peli = await api.get(`/peliculas/getByPk/${id}`);
            setPelicula(peli.data);
            console.log(peli, pelicula)
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(()=>{
        getPeliculaById
    }, [])

    return(
        <>
            <h1>akjdfls</h1>
            <h1>{id}</h1>
            <h1>{pelicula}</h1>
        </>
        )
}
                          

export default peliculaInfo
