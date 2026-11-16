import { Link, Navigate, useNavigate } from "react-router-dom"
import { useState , useEffect } from "react"
import api from '../api'

import './styles/AdminPanel.css'

function AdminSorteos(props){
    const [msg, setMsg] = useState('')
    const [cantP, setCantP] = useState(1)
    
    const [peliculas, setPeliculas] = useState([])
    
    const [titulo, setTitulo] = useState('')
    const [info, setInfo] = useState('')
    const [premios, setPremios] = useState({})
    const [pelicula, setPelicula] = useState('')
    const [fecha_sor, setFecha_sor] = useState('')
    const [img, setImg] = useState('')

    const getPelis = async ()=>{
        try {
                const response = await api.get('/sorteos')
                console.log(response.data)
                setPeliculas(response.data)
            } catch (error) {
                setMsg('Error con el servidor: ' + error)
            }
    }
 

    const cargarImg = async (e) => {
        e.preventDefault();
        
        if (!img){
            setMsg('Se debe subir una imagen')
            return;
        }

        const fd = new FormData();

        fd.append('pelicula', pelicula);
        fd.append('titulo', titulo);
        fd.append('fecha_sor', fecha_sor);
        fd.append('infoGral', info);
        fd.append('premios', premios);
        fd.append('imagen', img)

        try{
            setMsg('Cargando . . .')
            const response = await api.post('/sorteos/', fd, {
                headers: {}
            })
            if (response.status === 201){
                setMsg('Sorteo cargado con exito en base de datos')
            }else{
                setMsg('Error: ' + response.error)
            }
        }catch(err){
            console.log('error: ' + err)
            setMsg('Error al conectar con el servidor')
        }
    }

    useEffect(()=>{
            getPelis
        },[])

    return(<>
        <form action="" onSubmit={cargarImg} className="img-form">
            <input type="text" placeholder="Titulo" className="minput" required={true} onChange={(e)=>setTitulo(e.target.value)}/>
            <select name="pelicula" id="pelicula" className="mselect" required={true} onChange={(e)=>setPremios(e.target.value)}>
                {peliculas.map(p=>{
                    <option value="p.id_Pelicula">{p.titulo}</option>
                })}
            </select>
            <input type="text" placeholder="Director" className="minput" required={true} onChange={(e)=>setPelicula(e.target.value)}/>
            <input type="number" placeholder="Calificacion" className="minput" required={true} min={1} max={10} onChange={(e)=>setFecha_sor(e.target.value)}/>
            <input type="text" placeholder=""/>
            <input type="file" name="img" id="img" required={true} onChange={(e) => setPoster(e.target.files[0])} accept="image/png, image/jpg, image/jpeg" />
            <label htmlFor="img" className="mbtn" required={true}>{img ? img.name : 'Cargar imagen'}</label>
            <button type="submit" className="mbtn">Subir</button>
            {msg && <p className="mensaje">~{msg}❗</p>}
        </form>
        
    </>)
}

export default AdminSorteos