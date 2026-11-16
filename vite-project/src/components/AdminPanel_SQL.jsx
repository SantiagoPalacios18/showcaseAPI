import React, { useState, useRef, useEffect } from 'react';
import api from '../api';

const AYUDA = [
  'MySQL sobre la base showcase. Una consulta por Enter.',
  'Ejemplos: SHOW TABLES;    DESCRIBE usuarios;    SELECT * FROM peliculas LIMIT 5;',
  'clear limpia la pantalla.',
  'INSERT, UPDATE y DELETE se confirman al instante y después se recalcula el DVH.'
].join('\n');

function textoCelda(valor) {
  if (valor === null || valor === undefined) return 'NULL';
  const texto = typeof valor === 'object' ? JSON.stringify(valor) : String(valor);
  return texto.length > 200 ? texto.slice(0, 197) + '...' : texto;
}

function formatearFilas(data) {
  if (!data.filas?.length) return '0 filas.';
  const columnas = data.columnas;
  const celdas = data.filas.map((fila) => columnas.map((columna) => textoCelda(fila[columna])));
  const anchos = columnas.map((columna, i) => Math.max(columna.length, ...celdas.map((fila) => fila[i].length)));
  const linea = (valores) => valores.map((valor, i) => valor.padEnd(anchos[i])).join('  ');
  const separador = anchos.map((ancho) => '-'.repeat(ancho)).join('  ');
  const tabla = [linea(columnas), separador, ...celdas.map(linea)].join('\n');
  const resumen = data.total > data.mostradas
    ? `${data.mostradas} de ${data.total} filas. Usá LIMIT para ver el resto.`
    : `${data.total} fila(s).`;
  return `${tabla}\n${resumen}`;
}

export default function TerminalSQL() {
  const [input, setInput] = useState('');
  const [ocupado, setOcupado] = useState(false);
  const [historial, setHistorial] = useState([
    { tipo: 'sistema', texto: 'Terminal lista. Escribí "help" para ver comandos disponibles.' }
  ]);
  
  const historialRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current?.focus();
    const caja = historialRef.current;
    if (caja) caja.scrollTop = caja.scrollHeight;
  }, [historial]);

  const ejecutar = async (comando) => {
    const linea = { tipo: 'comando', texto: `> ${comando}` };

    if (comando.toLowerCase() === 'clear') {
      setHistorial([]);
      setInput('');
      return;
    }
    if (comando.toLowerCase() === 'help') {
      setHistorial((anterior) => [...anterior, linea, { tipo: 'respuesta', texto: AYUDA }]);
      setInput('');
      return;
    }

    setHistorial((anterior) => [...anterior, linea]);
    setInput('');
    setOcupado(true);
    inputRef.current?.focus();
    try {
      const { data } = await api.post('/sql', { consulta: comando });
      const texto = data.tipo === 'filas'
        ? formatearFilas(data)
        : [data.mensaje, data.aviso].filter(Boolean).join('\n');
      setHistorial((anterior) => [...anterior, { tipo: 'respuesta', texto }]);
    } catch (err) {
      const message = err.response?.data?.message || 'No se pudo ejecutar la consulta';
      setHistorial((anterior) => [...anterior, { tipo: 'error', texto: message }]);
    } finally {
      setOcupado(false);
    }
  };

  const manejarEnter = (e) => {
    if (e.key !== 'Enter' || ocupado || input.trim() === '') return;
    e.preventDefault();
    ejecutar(input.trim());
  };

  return (
    <div className="sql-screen">
      <div className="sql-terminal" onClick={() => inputRef.current?.focus()}>
        <p className="sql-titulo">SQL:</p>

        <div className="sql-historial" ref={historialRef}>
          {historial.map((item, index) => (
            <pre key={index} className={`sql-linea sql-linea-${item.tipo}`}>
              {item.texto}
            </pre>
          ))}
        </div>

        <div className="sql-prompt">
          <span>{">"}</span>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={manejarEnter}
            autoFocus
          />
        </div>
      </div>
    </div>
  );
}
