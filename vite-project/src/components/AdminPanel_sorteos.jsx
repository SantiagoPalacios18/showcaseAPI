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
    const [premios, setPremios] = useState([])
    const [pelicula, setPelicula] = useState('')
    const [fecha_sor, setFecha_sor] = useState('')
    const [img, setImg] = useState('')

    function managePremios(prem, key){
        setPremios(oldPremios=>{
            const newPremios = [...oldPremios];
            newPremios[key] = prem;
            console.log(newPremios)
            return newPremios;
        })
    }

    function handleDeleteP(key){
        setPremios(oldPremios=>{
            const newPremios = [...oldPremios];
            if (cantP>1){ 
                newPremios.splice(key, 1);
            }
            return newPremios;
        })
    }

    const getPelis = async ()=>{
        try {
                const response = await api.get('/peliculas')
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

        const premiosObj = premios.reduce((a, p, i)=>{
            console.log(p)
            a[`premio${i+1}`]=p
            console.log(a['premio1'])
            console.log(a.premio1)
            return(a)
        }, {});

        console.log(premiosObj)

        const fd = new FormData();

        fd.append('id_Pelicula', pelicula);
        fd.append('nombre', titulo);
        fd.append('fecha_sor', fecha_sor);
        fd.append('infoGral', info);
        fd.append('premio', JSON.stringify(premiosObj));
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
            getPelis()
        },[])

    return(<>
        <form action="" onSubmit={cargarImg} className="img-form">
            <input type="text" placeholder="Titulo" className="minput" required={true} minLength={1} maxLength={30} onChange={(e)=>setTitulo(e.target.value)}/>
            <select name="pelicula" id="pelicula" className="mselect" required={true} onChange={(e)=>setPelicula(e.target.value)}>
                <option key="default" value="" selected disabled>Pelicula</option>
                {peliculas && peliculas.map(p=>
                    <option key={p.id_Pelicula} value={p.id_Pelicula}>{p.titulo}</option>
                )}
            </select>
            <label htmlFor="fecha" id="fecha-label">Fecha de finalizacion</label>
            <input type="date" className="minput" required={true} id="fecha" onChange={(e)=>setFecha_sor(e.target.value)}/>
            <textarea type="text" placeholder="Info General" className="minput" id="info-gral" required={true} minLength={10} maxLength={120} onChange={(e)=>setInfo(e.target.value)}/>
            <section className="admin-premios">
                <p>Premios</p>
                <ul id="lista-premios">
                    {cantP>0 && Array.from({length: cantP}).map((_, index)=>(
                            <li>
                                <input type="text" key={index} value={premios[index]} onChange={(e)=>managePremios(e.target.value, index)}/>
                                <div id='eliminar-p' onClick={()=>{handleDeleteP(index); if(cantP>1){setCantP(cp=>{return cp-1})}}}></div>
                            </li>
                    ))}
                </ul>
                <div className="agregar" id='agregar-p' onClick={()=>setCantP(oldCantP => {return oldCantP + 1})}>Agregar +</div>
            </section>
            <input type="file" name="img" id="img" required={true} onChange={(e) => setImg(e.target.files[0])} accept="image/png, image/jpg, image/jpeg" />
            <label htmlFor="img" className="mbtn" required={true}>{img ? img.name : 'Cargar imagen'}</label>
            <button type="submit" className="mbtn">Subir</button>
            {msg && <p className="mensaje">~{msg}❗</p>}
        </form>
        
    </>)
}

export default AdminSorteos