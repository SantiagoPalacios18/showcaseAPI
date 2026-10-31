import { Link, useNavigate } from "react-router-dom"
import {useState , useEffect } from "react"

// El axios configurado que vamos a usar
import api from "../api"
import imagenTest from "../media/unnamed.jpg"
import './styles/Home.css'
import './styles/sorteo.css'

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


function Sorteos(props) {
    const [message, setMessage] = useState("")
    const [sorteos, setSorteos] = useState([])
    const Navigate = useNavigate()
    console.log({sorteos})
    const getMessage = async () => {
        try {
            const response = await api.get("/")
            setMessage(response.data.message)
        } catch (error) {
            setMessage("upsis")
        }
    }

    const getSorteos = async () => {
        try {
            const sort = await api.get('/sorteos')
            setSorteos(sort.data)
        } catch (error) {
            console.log(error)
        }
    }

    const participarusuario = async (id) => {
        try {
            await api.post("/clientes-sorteos/",{
                id_sorteo:  sor.id_sorteo,
                id_Cliente: props.user.id_Usuario,
                DVH: 1
            })
        } catch (error) {
            console.log(error)
        }
    }


    // Apenas carga la página, el useEffect ejecuta todo lo que tenga adentro
    useEffect(() => {
        getMessage(),
        getSorteos()
    }, [])

return(
    <div>
        <div>
            <h1>¡SORTEOS SUPER CINEFILOS!</h1>
            <h2>Selecciona en que sorteo queres participar WACHIN</h2>
        </div>
        <div className="sorteosLista">
            <ul className="contenedor-sorteos">
                {sorteos.map(sor => 
                    <li key={sor.id}>
                         <div className="organizar-sorteo">
                            <h2>{sor.nombre}</h2>
                            <img onClick={()=> Navigate(`/sorteoinfo/${sor.id_sorteo}`) } src={imagenTest} alt="Elded"/>
                        </div>
                    </li>
                )}
            </ul>
        </div>
        {/* <div className="contenedor-sorteos">
            <div className="organizar-sorteo" id="s-1">
                <h2>sorteo1</h2>
                <img src={imagenTest} alt="Elded" />
                <button className="boton-s">participar ahora</button>
            </div>            
            <div className="organizar-sorteo" id="s-2">
                <h2>sorteo2</h2>
                <img src={imagenTest} alt="Elded" />
                <button className="boton-s">participar ahora</button>
            </div>
            <div className="organizar-sorteo" id="s-3">
                <h2>sorteo3</h2>
                <img src={imagenTest} alt="Elded" />
                <button className="boton-s">participar ahora</button>
            </div>
            <div className="organizar-sorteo" id="s-4">
                <h2>sorteo4</h2>
                <img src={imagenTest} alt="Elded" />
                <button className="boton-s" >participar ahora</button>
            </div>
        </div> */}
    </div>
    )
}

export default Sorteos
