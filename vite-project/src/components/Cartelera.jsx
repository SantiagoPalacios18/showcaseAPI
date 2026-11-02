import { Link } from "react-router-dom"
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"

import api from "../api"
import imagenTest from "../media/unnamed.jpg"
import './styles/Cartelera.css'

function Cartelera(props) {
    const [peliculas, setPeliculas] = useState([])
    const Navigate = useNavigate()

    const getPeliculas = async () => {
        try {
            const response = await api.get("/peliculas")
            setPeliculas(response.data)
        } catch (error) {
            console.error("Error al traer las películas:", error)
        }
    }

    useEffect(() => {
        getPeliculas()
    }, [])

    return (
        <div>
            <div>
                <div className="etiqueta-novedades">Cartelera</div>
            </div>

            <div className="contenedor-peliculas">
                {peliculas.map((peli) => (
                    <div key={peli.id_Pelicula} className="tarjeta-pelicula" onClick={() => {Navigate(`/peliculaInfo/${peli.id_Pelicula}`)}}>
                        {peli.imagen && (
                            <img src={imagenTest} alt={peli.titulo} />
                        )}
                        <h3 className="titulo">{peli.titulo}</h3>
                        <p>Género: {peli.genero}</p>
                        <p>Duración: {peli.duracion}</p>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Cartelera