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
   
    console.log(id)


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


    useEffect(() => {
        getSorteoById(id)
    }, [])
return(
    <div>
        <h1>{sort.nombre}</h1>
    </div>
    )
}


export default sorteoinfo
