import { Link, Navigate, useNavigate } from "react-router-dom"
import { useState , useEffect } from "react"
import api from '../api'

import './styles/AdminPanel.css'

function AdminPelis(props){
    const [poster, setPoster] = useState('')
    const [msg, setMsg] = useState('HOLA')

    const [titulo, setTitulo] = useState('')
    const [genero, setGenero] = useState('')
    const [origen, setOrigen] = useState('')
    const [director, setDirector] = useState('')
    const [calificacion, setCalificacion] = useState('')

    function cambiarImg(img){
        setPoster(img)
    }

    const cargarImg = async (e) => {
        e.preventDefault();
        
        if (!poster){
            setMsg('Se debe subir una imagen')
            return;
        }

        const fd = new FormData();

        fd.append('titulo', titulo);
        fd.append('genero', genero);
        fd.append('origen', origen);
        fd.append('director', director);
        fd.append('calificacion', calificacion);
        fd.append('poster', poster)

        console.log(fd)

        try{
            setMsg('Cargando . . .')
            const response = await api.post('/peliculas/', fd, {
                headers: {}
            })
            if (response.status === 201){
                setMsg('Pelicula cargada con exito en base de datos')
            }else{
                setMsg('Error: ' + response.error)
            }
        }catch(err){
            console.log('error: ' + err)
            setMsg('Error al conectar con el servidor')
        }
    }


    return(<>
        <form action="" onSubmit={cargarImg} className="img-form">

            <input type="text" placeholder="titulo" className="minput" onChange={(e)=>setTitulo(e.target.value)}/>
            <select name="genero" id="genero" required={true}>
                <option value="none">Genero</option>
                <option value="Terror">Terror</option>
                <option value="Comedia">Comedia</option>
            </select>
            <input type="file" name="poster" id="poster" onChange={(e) => cambiarImg(e.target.files[0])} accept="image/png, image/jpg, image/jpeg" />
            <label htmlFor="poster" className="mbtn">{poster ? poster.name : 'Cargar poster'}</label>
            <button type="submit" className="mbtn">Subir</button>
            {msg && <p className="mensaje">❌ ~{msg}❗</p>}
        </form>
        
    </>)
}

export default AdminPelis