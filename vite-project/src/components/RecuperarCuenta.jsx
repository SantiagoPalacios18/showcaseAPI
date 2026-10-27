import {useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import './styles/RecuperarCuenta.css'

import api from "../api"

function RecuperarCuenta(props){
    const [contador, setContador] = useState(1)
    const [respuesta, setRespuesta] = useState("")
    const [mail, setMail] = useState("")
    const [numCod, setNumCod] = useState(0)
    const [contra, setContra] = useState(0)
    const [contra2, setContra2] = useState(0)

    const Navigate = useNavigate()

    const mandarCodigo = async (e) => {
        e.preventDefault()
        try {
            const code = await api.post('/codes/solicitar', {
                email: mail
            })
            setRespuesta(code.data.message)
            setContador(contador + 1)
        } catch (error) {
            console.log(error)
        }
    }

    const verificarCodigo = async (e) => {
        e.preventDefault()
        try {
            const validado = await api.post('/codes/verificar', {
                email: mail,
                code: numCod
            })
            setContador(contador + 1)
            setRespuesta(validado.data.message)
        } catch (error) {
            console.log({error})
            setRespuesta(error.response.data.message)
        }
    }
    
    const cambiarContraseña = async (e) => {
        e.preventDefault()
        try {
            if (contra != contra2) return setRespuesta("Las contras no coinciden")
            const cambiado = await api.patch('/codes/restablecer', {
                email: mail,
                code: numCod,
                contraseña: contra
            })
            setContador(1)
            setRespuesta(cambiado.data.message)
            Navigate("/login")
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
                <form action="" onSubmit={verificarCodigo}>
                    <label>Codigo</label>
                    <input type="number" placeholder="Codigo" onChange={(e) => {setNumCod(e.target.value)}}/>
                    <button type="submit">Enviar Codigo</button>
                </form>
            </div>
        )}
        { contador == 3 && (
            <div className="main-content">
                <form action="" onSubmit={cambiarContraseña}>
                    <label>Contraseña</label>
                    <input type="password" placeholder="Contraseña" onChange={(e) => {setContra(e.target.value)}}/>
                    <p></p>
                    <label>Repita Contraseña</label>
                    <input type="password" placeholder="Repita Contraseña" onChange={(e) => {setContra2(e.target.value)}}/>
                    <p></p>
                    <button type="submit">Enviar</button>
                </form>
            </div>
        )}
        <p>{respuesta}</p>
    </>
    )
}

export default RecuperarCuenta