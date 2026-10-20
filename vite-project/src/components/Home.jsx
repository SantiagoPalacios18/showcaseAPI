import { Link, useNavigate } from "react-router-dom"
import {useState , useEffect } from "react"
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, EffectCoverflow } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/effect-coverflow'; 

// El axios configurado que vamos a usar
import api from "../api"

import './styles/Home.css'
import 'bootstrap/dist/css/bootstrap.min.css';



import peli1 from '../../../api/SRC/whalefall.jpg'
import peli2 from '../../../api/SRC/Madre Siniestra.webp'
import peli3 from '../../../api/SRC/Street Fighter.webp'
import peli4 from '../../../api/SRC/Verity.jpg'
import peli5 from '../../../api/SRC/Coyote vs Acme.webp'
import peli6 from '../../../api/SRC/Resident Evil Noche Cero.jpg'
import peli7 from '../../../api/SRC/El corazón de la Bestia.jpg'
import peli8 from '../../../api/SRC/La Odisea.webp'
import peli9 from '../../../api/SRC/Quiero tu sexo.jpg'
import peli10 from '../../../api/SRC/La casa.jpg'

const imagenes = {
    'whalefall.jpg': peli1,
    'Madre Siniestra.webp': peli2,
    'Street Fighter.webp': peli3,
    'Verity.jpg': peli4,
    'Coyote vs Acme.webp': peli5,
    'Resident Evil Noche Cero.jpg': peli6,
    'El corazón de la Bestia.jpg': peli7,
    'La Odisea.webp': peli8,
    'Quiero tu sexo.jpg': peli9,
    'La casa.jpg': peli10,
}

const getImagen = (nombre) => imagenes[nombre] ?? imagenTest

// ../../../api/SRC/
import imagenTest from "../media/unnamed.jpg"

const getMinutos = (tiempo = '') => {
    const [h = 0, m = 0] = tiempo.split(':').map(Number)
    return h * 60 + m
} 


function Home(props) {
    const [message, setMessage] = useState("")
    const [peliculas, setPeliculas] = useState([])
    const navigate = useNavigate()
    const getMessage = async () => {
        try {
            const response = await api.get("/")
            setMessage(response.data.message)
        } catch (error) {
            setMessage("upsis")
        }
    }
    const getPeliculas = async () => {
        try {
            const response = await api.get("/peliculas/")   // <-- la misma ruta que usa tu panel admin
            setPeliculas(response.data)
            console.log(response.data)
        } catch (error) {
            console.error("Error al traer películas:", error)
        }
    }




    // Apenas carga la página, el useEffect ejecuta todo lo que tenga adentro
    useEffect(() => {
        getMessage()
        getPeliculas()
    }, [])

/*
            <div style={{paddingTop: "50px"}}>
                {props.user ? (<>
                        <p>Bienvenido: {props.user.nombre} {props.user.apellido}</p>
                        <p>Tu email es: {props.user.email}</p>
                    
                    </> 
            ) : (<p>Kien so bo </p>)}
            </div>
*/
    // las 6 mejores calificaciones
    const recomendadas = [...peliculas].sort((a, b) => b.calificacion - a.calificacion).slice(0, 6)






    return(
        <>
            
            <div>
                <h2>Viví la magia del cine en pantalla gigante</h2>
                {/*<h3>Mensaje dado por el back-end</h3    >

                <p>{message}</p>*/}
            </div>
            

            <div className="contenedor-carrusel-cine">
                <div className="etiqueta-novedades">NOVEDADES</div>
                
                <Swiper
                    effect={'coverflow'}
                    grabCursor={true}
                    centeredSlides={true} // La del medio siempre centrada
                    slidesPerView={2}     // Define cuántas imágenes se asoman a los costados
                    loop={true}           // Carrusel infinito
                    navigation={true}     // Activa las flechas de atrás y adelante
                    modules={[EffectCoverflow, Navigation]}
                    coverflowEffect={{
                        rotate: 0,        // No queremos que las de los lados giren en 3D
                        stretch: 200,      // Qué tan encimadas se van a ver (ajusta este número)
                        depth: 500,       // Qué tan "atrás" (pequeñas) se ven las de los costados
                        modifier: 1,      // Multiplicador del efecto
                        slideShadows: false, // Podés ponerlo en true si querés sombra en las de los lados
                    }}
                    className="mi-swiper-cine"
                >
                    {peliculas.map((peli) => (
                        <SwiperSlide key={peli.id_Pelicula}>
                            <img
                                className="img-carrusel-cine"
                                src={getImagen(peli.imagen)}
                                alt={peli.titulo}
                            />
                        </SwiperSlide>
                    ))}
                </Swiper>
                
            </div>
            <section className="recomendados">
                <h3 className="recomendados-titulo">RECOMENDADOS DE LA SEMANA</h3>

                <div className="recomendados-content">
                    {recomendadas.map((peli) => (
                        <article key={peli.id_Pelicula} className="pelicula">
                            <img src={getImagen(peli.imagen)} alt={peli.titulo} className="peli-img" />
                            <p className="peli-titulo">{peli.titulo}</p>
                            <div className="peli-info">
                                <span>{peli.genero}</span>
                                <span>{getMinutos(peli.duracion)}min</span>
                            </div>
                        </article>
                    ))}
                </div>

                <button className="btn-cartelera" onClick={() => {navigate('/cartelera')}}>
                    CARTELERA
                </button>
            </section>
        </>  /** */
        
    )
    
}

export default Home
