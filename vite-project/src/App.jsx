import { useState, useEffect } from 'react'

/*
import heroImg from './assets/hero.png'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
*/
import './App.css'
import { Routes, Route, useNavigate } from 'react-router-dom'
import Home from './components/Home'
import Login from './components/Login'
import Register from './components/Register'
import NavBar from './components/NavBar'
import Footer from './components/Footer'
import Profile from './components/Profile'
import SessionManagement from './components/SessionManagement'
import AdminHome from './components/AdminPanel_Home'




//import {Home, Login, Register, NavBar, Footer, Profile} from './components/index.js'
 
import api from './api'
function App() {
  
  const [user, setUser] = useState(null)
  const [token, setToken] = useState("")
  const navigate = useNavigate()
  

  const fetchMe = async () => {
    const storedToken = localStorage.getItem("TOKEN")
    if (!storedToken){
      setToken("")
      return // EL MALVADO RETURN, ME VIOLA EL ANO
      // SIN ESTE SE HACE UN CICLO INFINITO:
      // 1. llega al /me de abajo
      // 2. el /me ejecuta su middleware antes
      // 3. el middleware ve de que está el token undefined, lanza error 401
      // 4. el interceptor api.js hace un post a /refresh al ver de que hubo un error 401
      // 5. como TAMPOCO TENGO LA COOKIE, me lanza OTRO error 401
      // 6. se ejecuta el window.location.href = "/login"
      // 7. el redireccionamiento a /login hace de que se vuelva a recargar el app.jsx ☠️
      // 8. El app.jsx ejecuta el fetchMe denuevo y me viola el ano denuevo ☠️☠️☠️☠️☠️☠️☠️
      // NUNCA MAS NO QUIERO MÁS DEJAMEEEEEE
    }

    try {
        const response = await api.get('/me', {
            headers: { Authorization: storedToken }
        })
        setUser(response.data)
        console.log(response.data)
        setToken(storedToken)
    } catch (error) { 
        console.log("Token inválido, eliminandolo del localStorage")
        localStorage.removeItem("TOKEN")
        // localStorage.removeItem("REFRESH_TOKEN")
        setUser(null)
        setToken("")
    }
  }

  useEffect(() => {
      fetchMe()
  }, [])

  // Funcion que va a utilizar Login.jsx para guardar el usuario y los tokens
  const handleLogin = (userData, accessToken /*, refreshToken*/ ) => {
      localStorage.setItem("TOKEN", accessToken)
      // localStorage.setItem("REFRESH_TOKEN", refreshToken) // Sujeto a cambios, se debe guardar como cookie httpOnly
      setUser(userData)
      setToken(accessToken)
  }


  // Funcione que se va a usar en un boton de cerrar sesión, limpia el token y el usuario
  const handleLogout = async () => {
    localStorage.removeItem("TOKEN")
    setUser(null)
    setToken("")
    navigate('/login')
    try {
      await api.post("/logout")
    } catch (error) {
      console.log(error)
    }

  }

  // 1. Checkeo si tiene el rol de admin
  // 2. Si tiene, dejo de verificar en cada cosa que hace para no tener que hacer una llamada a la BDs cada que el usuario haga otra accion
  // 3. Si NO TIENE, reviso si tiene una patente que le permita el ver el panel, y para cada acción que tome, verifico si tiene el panel correspondiente a ESA NUEVA ACCIÓN



  return (
    <>
      <div>
        <NavBar></NavBar> {/* Barra de navegación */}
        <SessionManagement user={user} ></SessionManagement> {/* Donde estaran los botones de login y register / la foto de perfil*/}

        <Routes>
            <Route path="/" element={<Home user={user} />} />
            <Route path="/login" element={<Login onLogin={handleLogin} />} />
            <Route path="/register" element={<Register onLogin={handleLogin} />} /> {/* Tmb se le pone el handleLogin para loggeo automático */}
            <Route path='/profile/:id' element={<Profile user={user} onLogout={handleLogout}/>}></Route>

            <Route path='/admin/' element={<AdminHome></AdminHome>}></Route>
        </Routes>
        <Footer></Footer>
        
      </div>
    </>





    /*<>
      <section id="center">
        <div classNameName="hero">
          <img src={heroImg} classNameName="base" width="170" height="179" alt="" />
          <img src={reactLogo} classNameName="framework" alt="React logo" />
          <img src={viteLogo} classNameName="vite" alt="Vite logo" />
        </div>
        <div>
          <h1>Get started</h1>
          <p>
            Edit <code>src/App.jsx</code> and save to test <code>HMR</code>
          </p>
        </div>
        <button
          type="button"
          classNameName="counter"
          onClick={() => setCount((count) => count + 1)}
        >
          Count is {count}
        </button>
      </section>

      <div classNameName="ticks"></div>

      <section id="next-steps">
        <div id="docs">
          <svg classNameName="icon" role="presentation" aria-hidden="true">
            <use href="/icons.svg#documentation-icon"></use>
          </svg>
          <h2>Documentation</h2>
          <p>Your questions, answered</p>
          <ul>
            <li>
              <a href="https://vite.dev/" target="_blank">
                <img classNameName="logo" src={viteLogo} alt="" />
                Explore Vite
              </a>
            </li>
            <li>
              <a href="https://react.dev/" target="_blank">
                <img classNameName="button-icon" src={reactLogo} alt="" />
                Learn more
              </a>
            </li>
          </ul>
        </div>
        <div id="social">
          <svg classNameName="icon" role="presentation" aria-hidden="true">
            <use href="/icons.svg#social-icon"></use>
          </svg>
          <h2>Connect with us</h2>
          <p>Join the Vite community</p>
          <ul>
            <li>
              <a href="https://github.com/vitejs/vite" target="_blank">
                <svg
                  classNameName="button-icon"
                  role="presentation"
                  aria-hidden="true"
                >
                  <use href="/icons.svg#github-icon"></use>
                </svg>
                GitHub
              </a>
            </li>
            <li>
              <a href="https://chat.vite.dev/" target="_blank">
                <svg
                  classNameName="button-icon"
                  role="presentation"
                  aria-hidden="true"
                >
                  <use href="/icons.svg#discord-icon"></use>
                </svg>
                Discord
              </a>
            </li>
            <li>
              <a href="https://x.com/vite_js" target="_blank">
                <svg
                  classNameName="button-icon"
                  role="presentation"
                  aria-hidden="true"
                >
                  <use href="/icons.svg#x-icon"></use>
                </svg>
                X.com
              </a>
            </li>
            <li>
              <a href="https://bsky.app/profile/vite.dev" target="_blank">
                <svg
                  classNameName="button-icon"
                  role="presentation"
                  aria-hidden="true"
                >
                  <use href="/icons.svg#bluesky-icon"></use>
                </svg>
                Bluesky
              </a>
            </li>
          </ul>
        </div>
      </section>

      <div classNameName="ticks"></div>
      <section id="spacer"></section>
    </>*/
  )
}

export default App
