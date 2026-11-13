import { useState, useEffect} from "react"
import { useNavigate } from "react-router-dom"
import {getPaletteSync} from 'colorthief'
//  Una idea es que cada tarjeta tenga los colores predominantes de su paleta, para lograrlo 
// necesito modularizar la interfaz, separando la tarjeta de la cartelera, asi cada tarjeta
// puede guardar un valor permanente para las variables de su style y los colores no se pisan
// entre si.
//  Lo voy a intentar dsp de que haga el FTP

import api from "../api"

import imagenTest1 from "../media/poster-placeholder.jpg"
import imagenTest2 from "../media/poster-placeholder2.jpg"
import imagenTest3 from "../media/poster-placeholder3.jpg"


import './styles/Cartelera.css'

function Cartelera(props) {
    const [peliculas, setPeliculas] = useState([])
    
    const [x, setX] = useState(0)
    const [y, setY] = useState(0)
    const [distX, setDistX] = useState(0)
    const [distY, setDistY] = useState(0)
    const [angulo, setAngulo] = useState(0)
    
    const imagenes = [imagenTest1, imagenTest2, imagenTest3]
    
    const styleVar = {
        '--inclinacion-x': distX,
        '--inclinacion-y': distY,
        '--angulo-mouse': angulo + 'rad'
    }


    const Navigate = useNavigate()

    const getPoster = () => {
        const poster = Math.floor(Math.random() * 3)
        return imagenes[poster]
    }

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
        let angulo = Math.atan2(distanciaY, distanciaX) 
        setDistX(distanciaX)
        setDistY(distanciaY)
        setAngulo(angulo)
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
                    <div className="tarjeta-wrapper" onClick={() => {Navigate(`/peliculaInfo/${peli.id_Pelicula}`)}} onMouseMove={(e)=>{handleMousemove(e)}}>
                        <div key={peli.id_Pelicula} className="tarjeta-pelicula" style={styleVar}>
                            {peli.imagen && (
                                
                                <img src={imagenes[(peli.id_Pelicula - 1) % 3]} alt={peli.titulo} />
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