import {useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom"


import perfil from '../assets/perfil-default.png'


import './styles/SessionManagement.css'


function SessionManagement(props){
    const isAdmin = props.user?.patentes?.some(p => p.nombre === "ADMIN_HOME")


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
                        {isAdmin && <Link to="/admin" style={{ height: "40px", marginTop: "22px", marginRight: "10px" }}>Panel Admin</Link>}
                        <Link id='profile-pic' to={`/profile/${props.user.id_Usuario}`} ><img src={perfil} alt="Perfil" /></Link>
                        
                    </>
                )}
            </div>
        
        </>
    )
}


export default SessionManagement