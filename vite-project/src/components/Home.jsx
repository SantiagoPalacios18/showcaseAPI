import { Link } from "react-router-dom"
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

import imagenTest from "../media/unnamed.jpg"

function Home(props) {
    const [message, setMessage] = useState("")
    const getMessage = async () => {
        try {
            const response = await api.get("/")
            setMessage(response.data.message)
        } catch (error) {
            setMessage("upsis")
        }
    }
    // Apenas carga la página, el useEffect ejecuta todo lo que tenga adentro
    useEffect(() => {
        getMessage()
    }, [])

    return(
        <div>
            <div>
                <h2>Viví la magia del cine en pantalla gigante</h2>
                <h3>Mensaje dado por el back-end</h3    >

                <p>{message}</p>
            </div>
            <div style={{paddingTop: "50px"}}>
                {props.user ? (<>
                        <p>Bienvenido: {props.user.nombre} {props.user.apellido}</p>
                        <p>Tu email es: {props.user.email}</p>
                        {/*console.log(props.user)*/}
                    </> 
            ) : (<p>Kien so bo </p>)}
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
                        stretch: 50,      // Qué tan encimadas se van a ver (ajusta este número)
                        depth: 500,       // Qué tan "atrás" (pequeñas) se ven las de los costados
                        modifier: 1,      // Multiplicador del efecto
                        slideShadows: true, // Podés ponerlo en true si querés sombra en las de los lados
                    }}
                    className="mi-swiper-cine"
                >
                    <SwiperSlide>
                        <img className="img-carrusel-cine" src={imagenTest} alt="Slide 1" />
                    </SwiperSlide>
                    <SwiperSlide>
                        <img className="img-carrusel-cine" src={imagenTest} alt="Slide 2" />
                    </SwiperSlide>
                    <SwiperSlide>
                        <img className="img-carrusel-cine" src={imagenTest} alt="Slide 3" />
                    </SwiperSlide>
                    <SwiperSlide>
                        <img className="img-carrusel-cine" src={imagenTest} alt="Slide 4" />
                    </SwiperSlide>
                    <SwiperSlide>
                        <img className="img-carrusel-cine" src={imagenTest} alt="Slide 5" />
                    </SwiperSlide>
                    <SwiperSlide>
                        <img className="img-carrusel-cine" src={imagenTest} alt="Slide 6" />
                    </SwiperSlide>
                </Swiper>
                
            </div>
        </div>  /** */
        
    )
    
}

export default Home
