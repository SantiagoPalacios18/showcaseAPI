import { Link, Navigate, useNavigate } from "react-router-dom"
import { useState , useEffect } from "react"
import api from '../api'

import './styles/AdminPanel.css'

function AdminPelis(props){
    const [poster, setPoster] = useState('')
    const [msg, setMsg] = useState('')

    const [titulo, setTitulo] = useState('')
    const [genero, setGenero] = useState('')
    const [origen, setOrigen] = useState('')
    const [director, setDirector] = useState('')
    const [calificacion, setCalificacion] = useState('')
    const [hr, setHr] = useState('')
    const [min, setMin] = useState('')

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
        fd.append('duracion', hr + ':' + min + ':00');
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
            <input type="text" placeholder="titulo" className="minput" required={true} onChange={(e)=>setTitulo(e.target.value)}/>
            <select name="genero" id="genero" className="mselect" required={true} onChange={(e)=>setGenero(e.target.value)}>
                <option value="" selected disabled>Género</option>
                <option value="Acción">Acción</option>
                <option value="Artes marciales">Artes marciales</option>
                <option value="Aventura">Aventura</option>
                <option value="Bélico">Bélico</option>
                <option value="Biografía">Biografía</option>
                <option value="Ciencia ficción">Ciencia ficción</option>
                <option value="Cine negro">Cine negro</option>
                <option value="Comedia">Comedia</option>
                <option value="Comedia dramática">Comedia dramática</option>
                <option value="Comedia romántica">Comedia romántica</option>
                <option value="Crimen">Crimen</option>
                <option value="Deportes">Deportes</option>
                <option value="Documental">Documental</option>
                <option value="Drama">Drama</option>
                <option value="Erótico">Erótico</option>
                <option value="Experimental">Experimental</option>
                <option value="Familiar">Familiar</option>
                <option value="Fantasía">Fantasía</option>
                <option value="Histórico">Histórico</option>
                <option value="Infantil">Infantil</option>
                <option value="Intriga">Intriga</option>
                <option value="Melodrama">Melodrama</option>
                <option value="Misterio">Misterio</option>
                <option value="Musical">Musical</option>
                <option value="Policiaco">Policial</option>
                <option value="Romance">Romance</option>
                <option value="Sátira">Sátira</option>
                <option value="Superhéroes">Superhéroes</option>
                <option value="Suspenso">Suspenso</option>
                <option value="Terror">Terror</option>
                <option value="Thriller">Thriller</option>
                <option value="Western">Western</option>
            </select>
            <select name="origen" id="origen" className="mselect" onChange={(e)=>setOrigen(e.target.value)}>
                <option value="" selected disabled>Origen</option>
                <option value="Afganistán">Afganistán</option>
                <option value="Albania">Albania</option>
                <option value="Alemania">Alemania</option>
                <option value="Andorra">Andorra</option>
                <option value="Angola">Angola</option>
                <option value="Antigua y Barbuda">Antigua y Barbuda</option>
                <option value="Arabia Saudita">Arabia Saudita</option>
                <option value="Argelia">Argelia</option>
                <option value="Argentina">Argentina</option>
                <option value="Armenia">Armenia</option>
                <option value="Australia">Australia</option>
                <option value="Austria">Austria</option>
                <option value="Azerbaiyán">Azerbaiyán</option>
                <option value="Bahamas">Bahamas</option>
                <option value="Bangladés">Bangladés</option>
                <option value="Barbados">Barbados</option>
                <option value="Baréin">Baréin</option>
                <option value="Bélgica">Bélgica</option>
                <option value="Belice">Belice</option>
                <option value="Benín">Benín</option>
                <option value="Bielorrusia">Bielorrusia</option>
                <option value="Birmania (Myanmar)">Birmania (Myanmar)</option>
                <option value="Bolivia">Bolivia</option>
                <option value="Bosnia y Herzegovina">Bosnia y Herzegovina</option>
                <option value="Botsuana">Botsuana</option>
                <option value="Brasil">Brasil</option>
                <option value="Brunéi">Brunéi</option>
                <option value="Bulgaria">Bulgaria</option>
                <option value="Burkina Faso">Burkina Faso</option>
                <option value="Burundi">Burundi</option>
                <option value="Bután">Bután</option>
                <option value="Cabo Verde">Cabo Verde</option>
                <option value="Camboya">Camboya</option>
                <option value="Camerún">Camerún</option>
                <option value="Canadá">Canadá</option>
                <option value="Catar">Catar</option>
                <option value="Chad">Chad</option>
                <option value="Chile">Chile</option>
                <option value="China">China</option>
                <option value="Chipre">Chipre</option>
                <option value="Ciudad del Vaticano">Ciudad del Vaticano</option>
                <option value="Colombia">Colombia</option>
                <option value="Comoras">Comoras</option>
                <option value="Corea del Norte">Corea del Norte</option>
                <option value="Corea del Sur">Corea del Sur</option>
                <option value="Costa de Marfil">Costa de Marfil</option>
                <option value="Costa Rica">Costa Rica</option>
                <option value="Croacia">Croacia</option>
                <option value="Cuba">Cuba</option>
                <option value="Dinamarca">Dinamarca</option>
                <option value="Dominica">Dominica</option>
                <option value="Ecuador">Ecuador</option>
                <option value="Egipto">Egipto</option>
                <option value="El Salvador">El Salvador</option>
                <option value="Emiratos Árabes Unidos">Emiratos Árabes Unidos</option>
                <option value="Eritrea">Eritrea</option>
                <option value="Eslovaquia">Eslovaquia</option>
                <option value="Eslovenia">Eslovenia</option>
                <option value="España">España</option>
                <option value="Estados Unidos">Estados Unidos</option>
                <option value="Estonia">Estonia</option>
                <option value="Esuatini">Esuatini</option>
                <option value="Etiopía">Etiopía</option>
                <option value="Filipinas">Filipinas</option>
                <option value="Finlandia">Finlandia</option>
                <option value="Fiyi">Fiyi</option>
                <option value="Francia">Francia</option>
                <option value="Gabón">Gabón</option>
                <option value="Gambia">Gambia</option>
                <option value="Georgia">Georgia</option>
                <option value="Ghana">Ghana</option>
                <option value="Granada">Granada</option>
                <option value="Grecia">Grecia</option>
                <option value="Guatemala">Guatemala</option>
                <option value="Guinea">Guinea</option>
                <option value="Guinea Ecuatorial">Guinea Ecuatorial</option>
                <option value="Guinea-Bisáu">Guinea-Bisáu</option>
                <option value="Guyana">Guyana</option>
                <option value="Haití">Haití</option>
                <option value="Honduras">Honduras</option>
                <option value="Hungría">Hungría</option>
                <option value="India">India</option>
                <option value="Indonesia">Indonesia</option>
                <option value="Irak">Irak</option>
                <option value="Irán">Irán</option>
                <option value="Irlanda">Irlanda</option>
                <option value="Islandia">Islandia</option>
                <option value="Islas Marshall">Islas Marshall</option>
                <option value="Islas Salomón">Islas Salomón</option>
                <option value="Israel">Israel</option>
                <option value="Italia">Italia</option>
                <option value="Jamaica">Jamaica</option>
                <option value="Japón">Japón</option>
                <option value="Jordania">Jordania</option>
                <option value="Kazajistán">Kazajistán</option>
                <option value="Kenia">Kenia</option>
                <option value="Kirguistán">Kirguistán</option>
                <option value="Kiribati">Kiribati</option>
                <option value="Kuwait">Kuwait</option>
                <option value="Laos">Laos</option>
                <option value="Lesoto">Lesoto</option>
                <option value="Letonia">Letonia</option>
                <option value="Líbano">Líbano</option>
                <option value="Liberia">Liberia</option>
                <option value="Libia">Libia</option>
                <option value="Liechtenstein">Liechtenstein</option>
                <option value="Lituania">Lituania</option>
                <option value="Luxemburgo">Luxemburgo</option>
                <option value="Macedonia del Norte">Macedonia del Norte</option>
                <option value="Madagascar">Madagascar</option>
                <option value="Malasia">Malasia</option>
                <option value="Malaui">Malaui</option>
                <option value="Maldivas">Maldivas</option>
                <option value="Malí">Malí</option>
                <option value="Malta">Malta</option>
                <option value="Marruecos">Marruecos</option>
                <option value="Mauricio">Mauricio</option>
                <option value="Mauritania">Mauritania</option>
                <option value="México">México</option>
                <option value="Micronesia">Micronesia</option>
                <option value="Moldavia">Moldavia</option>
                <option value="Mónaco">Mónaco</option>
                <option value="Mongolia">Mongolia</option>
                <option value="Montenegro">Montenegro</option>
                <option value="Mozambique">Mozambique</option>
                <option value="Namibia">Namibia</option>
                <option value="Nauru">Nauru</option>
                <option value="Nepal">Nepal</option>
                <option value="Nicaragua">Nicaragua</option>
                <option value="Níger">Níger</option>
                <option value="Nigeria">Nigeria</option>
                <option value="Noruega">Noruega</option>
                <option value="Nueva Zelanda">Nueva Zelanda</option>
                <option value="Omán">Omán</option>
                <option value="Países Bajos">Países Bajos</option>
                <option value="Pakistán">Pakistán</option>
                <option value="Palaos">Palaos</option>
                <option value="Palestina">Palestina</option>
                <option value="Panamá">Panamá</option>
                <option value="Papúa Nueva Guinea">Papúa Nueva Guinea</option>
                <option value="Paraguay">Paraguay</option>
                <option value="Perú">Perú</option>
                <option value="Polonia">Polonia</option>
                <option value="Portugal">Portugal</option>
                <option value="Puerto Rico">Puerto Rico</option>
                <option value="Reino Unido">Reino Unido</option>
                <option value="República Centroafricana">República Centroafricana</option>
                <option value="República Checa">República Checa</option>
                <option value="República del Congo">República del Congo</option>
                <option value="República Democrática del Congo">República Democrática del Congo</option>
                <option value="República Dominicana">República Dominicana</option>
                <option value="Ruanda">Ruanda</option>
                <option value="Rumania">Rumania</option>
                <option value="Rusia">Rusia</option>
                <option value="Samoa">Samoa</option>
                <option value="San Cristóbal y Nieves">San Cristóbal y Nieves</option>
                <option value="San Marino">San Marino</option>
                <option value="San Vicente y las Granadinas">San Vicente y las Granadinas</option>
                <option value="Santa Lucía">Santa Lucía</option>
                <option value="Santo Tomé y Príncipe">Santo Tomé y Príncipe</option>
                <option value="Senegal">Senegal</option>
                <option value="Serbia">Serbia</option>
                <option value="Seychelles">Seychelles</option>
                <option value="Sierra Leona">Sierra Leona</option>
                <option value="Singapur">Singapur</option>
                <option value="Siria">Siria</option>
                <option value="Somalia">Somalia</option>
                <option value="Sri Lanka">Sri Lanka</option>
                <option value="Sudáfrica">Sudáfrica</option>
                <option value="Sudán">Sudán</option>
                <option value="Sudán del Sur">Sudán del Sur</option>
                <option value="Suecia">Suecia</option>
                <option value="Suiza">Suiza</option>
                <option value="Surinam">Surinam</option>
                <option value="Tailandia">Tailandia</option>
                <option value="Taiwán">Taiwán</option>
                <option value="Tanzania">Tanzania</option>
                <option value="Tayikistán">Tayikistán</option>
                <option value="Timor Oriental">Timor Oriental</option>
                <option value="Togo">Togo</option>
                <option value="Tonga">Tonga</option>
                <option value="Trinidad y Tobago">Trinidad y Tobago</option>
                <option value="Túnez">Túnez</option>
                <option value="Turkmenistán">Turkmenistán</option>
                <option value="Turquía">Turquía</option>
                <option value="Tuvalu">Tuvalu</option>
                <option value="Ucrania">Ucrania</option>
                <option value="Uganda">Uganda</option>
                <option value="Uruguay">Uruguay</option>
                <option value="Uzbekistán">Uzbekistán</option>
                <option value="Vanuatu">Vanuatu</option>
                <option value="Venezuela">Venezuela</option>
                <option value="Vietnam">Vietnam</option>
                <option value="Yemen">Yemen</option>
                <option value="Yibuti">Yibuti</option>
                <option value="Zambia">Zambia</option>
                <option value="Zimbabue">Zimbabue</option>
            </select>
            <input type="text" placeholder="Director" className="minput" onChange={(e)=>setDirector(e.target.value)}/>
            <input type="number" placeholder="Calificacion" className="minput" min={1} max={10} onChange={(e)=>setCalificacion(e.target.value)}/>
            <label htmlFor="" id="label-duracion">Duracion</label>
            <section id="section-duracion">
                <input type="number" placeholder="hs" className="minput" min={0} max={12} onChange={(e)=>setHr(e.target.value)}/>
                <input type="number" placeholder="min" className="minput" min={0} max={59} onChange={(e)=>setMin(e.target.value)}/>
            </section>
            <input type="file" name="poster" id="poster" onChange={(e) => cambiarImg(e.target.files[0])} accept="image/png, image/jpg, image/jpeg" />
            <label htmlFor="poster" className="mbtn">{poster ? poster.name : 'Cargar poster'}</label>
            <button type="submit" className="mbtn">Subir</button>
            {msg && <p className="mensaje">~{msg}❗</p>}
        </form>
        
    </>)
}

export default AdminPelis