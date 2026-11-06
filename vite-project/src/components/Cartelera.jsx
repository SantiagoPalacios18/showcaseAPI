import { Link } from "react-router-dom"
import { useState, useEffect, useRef } from "react"
import { useNavigate } from "react-router-dom"

import api from "../api"
import imagenTest from "../media/unnamed.jpg"
import './styles/Cartelera.css'

function Cartelera(props) {
    const [peliculas, setPeliculas] = useState([])

    const [x, setX] = useState(0)
    const [distX, setDistX] = useState(0)
    const [distY, setDistY] = useState(0)
    const [angulo, setAngulo] = useState(0)
    const [y, setY] = useState(0)
    const [ancho, setAncho] = useState(0)
    const [alto, setAlto] = useState(0)

    const styleVar = {
        '--inclinacion-x': distX,
        '--inclinacion-y': distY
    }

    const Navigate = useNavigate()

    const getPeliculas = async () => {
        try {
            const response = await api.get("/peliculas")
            setPeliculas(response.data)
        } catch (error) {
            console.error("Error al traer las películas:", error)
        }
    }

    

    function handleMousemove(e){
        const element = e.currentTarget;
        
        setX(e.nativeEvent.layerX)
        setY(e.nativeEvent.layerY)

        let mitadAncho = element.getBoundingClientRect().width / 2
        let mitadAlto = element.getBoundingClientRect().height / 2

        console.log(mitadAlto)

        let distanciaX = x < mitadAncho ? - ((mitadAncho - x) / mitadAncho) :  (x - mitadAncho) / mitadAncho;
        let distanciaY = y < mitadAlto ? ((mitadAlto - y) / mitadAlto) : - (y - mitadAlto) / mitadAlto;
        // let angulo = Math.asin(distanciaY / (Math.sqrt(Math.pow(distanciaX, 2) + Math.pow(distanciaY, 2)) / 1)) 
        setDistX(distanciaX)
        setDistY(distanciaY)
        setAngulo(angulo)
    }

    useEffect(() => {
        getPeliculas()
    }, [])

    return (
        <div>
            <p>Inc. X: {distX} Inc. Y: {distY}</p>
            <div>
                <div className="etiqueta-novedades">Cartelera</div>
            </div>
            <div className="contenedor-peliculas">
                {peliculas.map((peli) => (
                    <div className="tarjeta-wrapper" onClick={() => {Navigate(`/peliculaInfo/${peli.id_Pelicula}`)}} onMouseMove={(e)=>{handleMousemove(e)}}>
                        <div key={peli.id_Pelicula} className="tarjeta-pelicula" style={styleVar}>
                            {peli.imagen && (
                                <img src={imagenTest} alt={peli.titulo} />
                            )}
                            <h3 className="titulo">{peli.titulo}</h3>
                            <p>Género: {peli.genero}</p>
                            <p>Duración: {peli.duracion}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Cartelera