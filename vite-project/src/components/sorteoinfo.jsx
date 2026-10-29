import { Link, useParams } from "react-router-dom"
import {useState , useEffect } from "react"


// El axios configurado que vamos a usar
import api from "../api"
import imagenTest from "../media/unnamed.jpg"
import './styles/Home.css'
import './styles/sorteo.css'




function sorteoinfo(props) {
    const [message, setMessage] = useState("")
    const [sort, setSorteos] = useState([])
    const { id } = useParams(); // Acá extraés el ID directamente de la URL
    const [usuario_sort, setusuario_sort ] = useState({})

    const getMessage = async () => {
        try {
            const response = await api.get("/")
            setMessage(response.data.message)
        } catch (error) {
            setMessage("upsis")
        }
    }


    const getSorteoById = async (id) => {
        try {
        const sort = await api.get(`/sorteos/getByPk/${id}`);
        console.log(sort)
        setSorteos(sort.data);
        } catch (error) {
        console.log(error);
        }
    }

    const getUsuariosBySorteoId = async () => {
        try {
            const usu_sort = await api.get('/clientes-sorteos/getByPk/{1}/{1}')
            if (usu_sort)
                setusuario_sort(usu_sort.data)
        } catch (error) {
            console.log(error)
        }
    }

    const inscribir = async () => {
        try {
            console.log(sort.id_sorteo)
            const usu_sort = await api.post("/clientes-sorteos/",{
                id_sorteo: sort.id_sorteo,
                id_Cliente: props.user.id_Usuario,
                DVH: sort.DVH
            })
            setusuario_sort(usu_sort.data.clienteSorteo)
            console.log(usu_sort.data.clienteSorteo)
        } catch (error) {   
            console.log({error})
            console.log(usuario_sort)
        } 
    }

    useEffect(() => {
        getSorteoById(id)
    }, [])
return(
    <div>
        <h1>{sort.nombre}</h1>
        <h2>el premio es: {sort.premio}</h2>
        <p>{sort.infoGral}</p>
        {!props.user && (
            <button className="boton-s">para participar tenes que estar logueado</button>
        )}
        {props.user && (
            <button className="boton-s" onClick={()=>{inscribir()}}>participar ahora</button>
        )}
        {usuario_sort?.id_Usuario && (
            <h2>ya estas inscripto 🥳</h2>
        )}
    </div>  
    )
}
                          

export default sorteoinfo
