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
import api from './api'

function App() {
  
  const [user, setUser] = useState(null)
  const [token, setToken] = useState("")
  const navigate = useNavigate()


  const fetchMe = async () => {
    const storedToken = localStorage.getItem("TOKEN")
    if (!storedToken){
      setToken("")
    }

    try {
        const response = await api.get('/me', {
            headers: { Authorization: storedToken }
        })
        setUser(response.data)
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
    try {
      await api.post("/logout")
    } catch (error) {
      console.log(error)
    }
    localStorage.removeItem("TOKEN")
    setUser(null)
    setToken("")
  }



  return (
    <>
      <div>
        <Routes>
            <Route path="/" element={<Home user={user} />} />
            <Route path="/login" element={<Login onLogin={handleLogin} />} />
            <Route path="/register" element={<Register onLogin={handleLogin} />} /> {/* Tmb se le pone el handleLogin para loggeo automático */}
        </Routes>

        
      </div>
    </>





    /*<>
      <section id="center">
        <div className="hero">
          <img src={heroImg} className="base" width="170" height="179" alt="" />
          <img src={reactLogo} className="framework" alt="React logo" />
          <img src={viteLogo} className="vite" alt="Vite logo" />
        </div>
        <div>
          <h1>Get started</h1>
          <p>
            Edit <code>src/App.jsx</code> and save to test <code>HMR</code>
          </p>
        </div>
        <button
          type="button"
          className="counter"
          onClick={() => setCount((count) => count + 1)}
        >
          Count is {count}
        </button>
      </section>

      <div className="ticks"></div>

      <section id="next-steps">
        <div id="docs">
          <svg className="icon" role="presentation" aria-hidden="true">
            <use href="/icons.svg#documentation-icon"></use>
          </svg>
          <h2>Documentation</h2>
          <p>Your questions, answered</p>
          <ul>
            <li>
              <a href="https://vite.dev/" target="_blank">
                <img className="logo" src={viteLogo} alt="" />
                Explore Vite
              </a>
            </li>
            <li>
              <a href="https://react.dev/" target="_blank">
                <img className="button-icon" src={reactLogo} alt="" />
                Learn more
              </a>
            </li>
          </ul>
        </div>
        <div id="social">
          <svg className="icon" role="presentation" aria-hidden="true">
            <use href="/icons.svg#social-icon"></use>
          </svg>
          <h2>Connect with us</h2>
          <p>Join the Vite community</p>
          <ul>
            <li>
              <a href="https://github.com/vitejs/vite" target="_blank">
                <svg
                  className="button-icon"
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
                  className="button-icon"
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
                  className="button-icon"
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
                  className="button-icon"
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

      <div className="ticks"></div>
      <section id="spacer"></section>
    </>*/
  )
}

export default App
