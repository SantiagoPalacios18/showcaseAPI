import { Link, useNavigate } from "react-router-dom"
import {useState , useEffect } from "react"

// El axios configurado que vamos a usar
import api from "../api"
import imagenTest from "../media/unnamed.jpg"
import './styles/sorteo.css'


const getImagen = (nombre) => imagenTest

function Sorteos(props) {
    const [message, setMessage] = useState("")
    const [sorteos, setSorteos] = useState([])

    const [distX, setDistX] = useState(0)
    const [distY, setDistY] = useState(0)
    const [angulo, setAngulo] = useState(0)


    const Navigate = useNavigate()

    const styleVar = {
        '--inclinacion-x': distX,
        '--inclinacion-y': distY,
        '--angulo-mouse': angulo + 'rad'
    }

    function handleMousemove(e){
        const element = e.currentTarget;
        
        let x = e.nativeEvent.layerX
        let y = e.nativeEvent.layerY

        let mitadAncho = element.getBoundingClientRect().width / 2
        let mitadAlto = element.getBoundingClientRect().height / 2

        let distanciaX = x < mitadAncho ? - ((mitadAncho - x) / mitadAncho) :  (x - mitadAncho) / mitadAncho;
        let distanciaY = y < mitadAlto ? ((mitadAlto - y) / mitadAlto) : - (y - mitadAlto) / mitadAlto;
        let angulo = Math.atan2(distanciaY, distanciaX) 
        setDistX(distanciaX)
        setDistY(distanciaY)
        setAngulo(angulo)
    }

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
            console.log({error})
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
        </div>
        <div className="sorteosLista">
            <ul className="contenedor-sorteos">
                {sorteos.map(sor => 
                    <li key={sor.id} className="organizar-sorteo">
                        <div className="tarjeta-sorteo" style={styleVar}>
                            <h2>{sor.nombre}</h2>
                            <div className="imagen" onMouseMove={(e)=>{handleMousemove(e)}}>
                                <img onClick={()=> Navigate(`/sorteoinfo/${sor.id_sorteo}`) } src={getImagen(sor.imagen)} alt={sor.nombre}/>
                            </div>
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
