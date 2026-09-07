import axios from "axios"

// QUE VERGA ES ESTE ARCHIVO????

// Es una instancia de axios a la cual vamos a configurar, pensalo como un axios con mods

// Con nuestro sistema de acces_token y refresh_token, debemos tener una forma de identificar cuándo nos quedamos sin el access_token, y debemos hacer una llamada
// al api/refresh para refrescar el access_token ¿Cómo conchita hacemos eso, cómo sabemos cuándo nos quedamos sin access_token, sin tener que verificar su caducidad en cada endpoint?

// Lo que vamos a hacer es lo siguiente: vamos a identificar, mediante el "status" de las respuestas del back-end, cuándo es un error del sistema (500) y CUANDO ES UN ERROR DE AUTORIZACIÓN (401)
// ESA va a ser SOLO cuando sea un problema de caducidad de token, 



// Esto de abajo nos permite:
const api = axios.create({
  baseURL: "/api", //  1. no tener que poner "api/login", "api/refresh" "api/me", todas van a empezar con "api/", para mayor comodidad
  withCredentials: true // 2. no tener que meter lo de credentials: true (para incluir las cookies) en cada petición que hacemos
  // esto nos ahorra espacio y hace todo más cómodo
})

// Adjuntar el Access Token en cada petición
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("TOKEN")
  if (token) {
    config.headers.Authorization = token
  }
  return config
})
api.interceptors.response.use(
  (response) => response, // si hay un response, lo dejamos pasar sin hacer nada (no hubo error)
  async (error) => {
    const originalRequest = error.config 


    // si el error es 401 y todavía no reintentamos esta petición
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      try {
        const { data } = await axios.post("/api/refresh", {}, {
          withCredentials: true // Cookies
        })

        localStorage.setItem("TOKEN", data.accessToken)
        originalRequest.headers['Authorization'] = data.accessToken;

        return api(originalRequest)
      } catch (refreshError) {
        localStorage.removeItem("TOKEN")
        window.location.href = "/login" // Un navigate pero para js (este archivo no es jsx ya que no contiene XLM, o sea componentes """HTML""" )
        return Promise.reject(refreshError)
      }
    }

    return Promise.reject(error)
  }
)

export default api