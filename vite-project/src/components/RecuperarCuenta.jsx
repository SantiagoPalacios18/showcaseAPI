import {useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import './styles/RecuperarCuenta.css'

import api from "../api"

function RecuperarCuenta(props){
    const [contador, SetContador] = useState(1)
    const [respuesta, setRespuesta] = useState("")
    const [mail, setMail] = useState("")

    const mandarCodigo = async (e) => {
        e.preventDefault()
        try {
            const code = await api.post('/codes/solicitar', {
                email: mail
            })
            setRespuesta(code.data.message)
            SetContador(contador + 1)
        } catch (error) {
            console.log(error)
        }
    }

    return(
    <>
        { contador == 1 && (
            <div className="main-content">
                <form action="" onSubmit={mandarCodigo}>
                    <label>Email</label>
                    <input type="text" placeholder="Email" onChange={(e) => {setMail(e.target.value)}}/>
                    <button type="submit">Enviar Codigo</button>
                </form>
            </div>
        )}
        { contador == 2 && (
            <div className="main-content">
                <form action="" onSubmit={mandarCodigo}>
                    <label>Email</label>
                    <input type="text" placeholder="Email" onChange={(e) => {setMail(e.target.value)}}/>
                    <button type="submit">Enviar Codigo</button>
                </form>
            </div>
        )}
        <p>{respuesta}</p>
    </>
    )
}

export default RecuperarCuenta