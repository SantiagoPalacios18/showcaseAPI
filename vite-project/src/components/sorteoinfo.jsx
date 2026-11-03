import { Link, useNavigate, useParams } from "react-router-dom"
import {useState , useEffect } from "react"


// El axios configurado que vamos a usar
import api from "../api"
import imagenTest from "../media/unnamed.jpg"
import './styles/sorteoInfo.css'




function sorteoinfo(props) {
    const [message, setMessage] = useState("")
    const [sort, setSorteos] = useState([])
    const [premios, setPremios] = useState([])
    const { id } = useParams(); // Acá extraés el ID directamente de la URL
    const [usuario_sort, setusuario_sort ] = useState({})
    const [ganador, setGanador] = useState("")
    const [usu_peli, setUsu_peli] = useState("")

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

    const getBuscarUsuarioPelicula = async () => {
        try {
            const usu_peli =await api.get(`/usuarios/${props.user.id_Usuario}`)
            setUsu_peli(usu_peli.data[0])
            console.log(usu_peli)
        } catch (error) {
            console.log({error})   
        }
    }

    const getUnClienteSorteo = async () => {
        try {

            const usu_sort = await api.get(`/clientes-sorteos/getByPk/${id}/${props.user}`)

            console.log('User Id: '+props.user.id_Usuario)
            const usu_sort = await api.get(`/clientes-sorteos/getById_u/${id}/${props.user.id_Usuario}`)

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
            console.log(ganador)
        } catch (error) {
            console.log({error})
        }
    }

    useEffect(() => {
        getSorteoById(id),
        getUnClienteSorteo(),
        getBuscarUsuarioPelicula()
    }, [])
return(
    <div>
        <h1>{sort.nombre}</h1>
        <h2>el premio es: {sort.premio}</h2>
        <p>{sort.infoGral}</p>
        {!props.user && (
            <button className="boton-s">para participar tenes que estar logueado</button>
        )}
        {props.user && !usuario_sort?.id_Usuario &&  (
            <button className="boton-s" onClick={()=>{inscribir()} }  >participar ahora</button>
        )}
        {usuario_sort?.id_Usuario && (
            <h2>ya estas inscripto 🥳</h2>
        )}
        <button onClick={getElegirGanador} >elegir ganador</button>
        <button onClick={getBuscarUsuarioPelicula}>ver si el pibe compro</button>
    </div>  
    )
 }

                          

export default sorteoinfo
