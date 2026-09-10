import {useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom"


import perfil from '../assets/perfil-default.png'


import './styles/SessionManagement.css'


function SessionManagement(props){


    return(
        <>
            <div className="session-management" style={{ position: "absolute", top: 0, right: 0, padding: "10px" }}>

                { !props.user ? (
                    <>
                        <Link to="/login" style={{ marginRight: "10px" }}>Login</Link>
                        <Link to="/register">Register</Link>
                    
                    </>
                ):(
                    <>
                        <Link id='profile-pic' to={`/profile/${props.user.id_Usuario}`} ><img src={perfil} alt="Perfil" /></Link>
                        
                    </>
                )}
            </div>
        
        </>
    )
}


export default SessionManagement