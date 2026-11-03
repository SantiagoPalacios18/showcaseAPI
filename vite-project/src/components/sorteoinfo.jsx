import { Link, useNavigate, useParams } from "react-router-dom"
import {useState , useEffect } from "react"


// El axios configurado que vamos a usar
import api from "../api"
import imagenTest from "../media/unnamed.jpg"
import './styles/sorteoInfo.css'
=======
import './styles/Home.css'
import './styles/sorteo.css'

>>>>>>> 8529de4e924d68e06885b7bf954095691824c870

function sorteoinfo(props) {
    const [message, setMessage] = useState("")
    const [sort, setSorteos] = useState([])
    const [premios, setPremios] = useState([])
    const { id } = useParams(); // Acá extraés el ID directamente de la URL
    const [usuario_sort, setusuario_sort ] = useState({})
    const [ganador, setGanador] = useState("")

    const navigate = useNavigate()

    const getMessage = async () => {
        try {
            const response = await api.get("/")
            setMessage(response.data.message)
        } catch (error) {
            setMessage("upsis")
        }
    }


    const getSorteoById = async () => {
        try {
            const algo = api.get
        const sort = await api.get(`/sorteos/getByPk/${id}`, {
            usuarios: algo
        });
        setSorteos(sort.data);
        const premios = sort.data.premio
        console.log(premios)
        setPremios(JSON.parse(premios))
        } catch (error) {
            console.log({error});
        }
    }

    const getUnClienteSorteo = async () => {
        try {
<<<<<<< HEAD
            const usu_sort = await api.get(`/clientes-sorteos/getByPk/${id}/${props.user}`)
=======
            console.log('User Id: '+props.user.id_Usuario)
            const usu_sort = await api.get(`/clientes-sorteos/getById_u/${id}/${props.user.id_Usuario}`)
>>>>>>> 8529de4e924d68e06885b7bf954095691824c870
            if (usu_sort)
                setusuario_sort(usu_sort.data[0])
            console.log(usu_sort)
            console.log(usuario_sort)
        } catch (error) {
            console.log({error})
        }
    }

    const inscribir = async () => {
        try {
            console.log(sort.id_sorteo)
            const usu_sort = await api.post("/clientes-sorteos/",{
                id_sorteo: sort.id_sorteo,
                id_Cliente: props.user.id_Usuario,
                DVH: sort.DVH,
            })
            setusuario_sort(usu_sort.data.clienteSorteo)
            console.log(usu_sort.data.clienteSorteo)
        } catch (error) {   
            console.log({error})
            console.log(usuario_sort)
        } 
    }

    const getElegirGanador = async () => {
        try {
            const ganador = await api.get(`sorteos/getGanador/${id}`)
            setGanador(ganador.data)
        } catch (error) {
            console.log({error})
        }
    }

    useEffect(() => {
        getSorteoById(id),
        getUnClienteSorteo()
    }, [])
<<<<<<< HEAD

    return(
    <div className="sorteo">
        <section className="details">
            <h1>{sort.nombre}</h1>
            <img src={imagenTest} alt="Foto sorteo" />
            <p className="info-gral">{sort.infoGral}</p>
        </section>
        <section className="premios">
            <h2>Premios</h2>
            <ul className="premios-l">
                {Object.values(premios).map(premio => 
                    <li className="premio">
                        {premio}
                    </li>
                )}
            </ul>
        </section>
        <section className="requisitos">
            
            <h2>Requisitos</h2>
            <ul className="req-list">
                <li key={'registrado'} className={props.user ? 'aproved' : 'denied'} onClick={()=>{!props.user && navigate('/login')}}>Estar Registrado {props.user ? '✅' : '❌'}</li>
            </ul>
        </section>
        <section className="btn">
            {!props.user && (
                <button className="boton-s">para participar tenes que estar logueado</button>
            )}
            {props.user && !usuario_sort?.id_Usuario &&  (
                <button className="boton-s" id="btn-logged" onClick={()=>{inscribir()} }  >participar ahora</button>
            )}
            {usuario_sort?.id_Usuario && (
                <h2>ya estas inscripto 🥳</h2>
            )}
        </section>
    </div> 
    )
 }

                          

export default sorteoinfo
