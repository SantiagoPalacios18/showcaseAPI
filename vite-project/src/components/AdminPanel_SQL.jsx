import React, { useState, useRef, useEffect } from 'react';

export default function TerminalSQL() {
  const [input, setInput] = useState('');
  const [historial, setHistorial] = useState([
    { tipo: 'sistema', texto: 'Terminal lista. Escribí "help" para ver comandos disponibles.' }
  ]);
  
  const finalTerminalRef = useRef(null);
  const inputRef = useRef(null);
  // Baja el scroll automáticamente cada vez que hay un mensaje nuevo
  /*useEffect(() => {
    finalTerminalRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [historial]);
    */

  const enfocarInput = () => {
    inputRef.current?.focus();
  };

  const manejarEnter = (e) => {
    if (e.key === 'Enter' && input.trim() !== '') {
      const comando = input.trim();
      const nuevoHistorial = [...historial, { tipo: 'comando', texto: `> ${comando}` }];

      if (comando.toLowerCase() === 'clear') {
        setHistorial([]);
        setInput('');
        return;
      } else if (comando.toLowerCase() === 'help') {
        nuevoHistorial.push({ tipo: 'respuesta', texto: 'Comandos disponibles: revisa la documentacion de mysql papi' });
      } else {
        nuevoHistorial.push({ 
          tipo: 'respuesta', 
          texto: JSON.stringify({ status: '404', error: 'Comando inválido (porque no hay ninguno jaja caiste viejo)' }, null, 2) 
        });
      }

      setHistorial(nuevoHistorial);
      setInput('');
    }
  };

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      width: '100vw',
    }}>
      <div 
        onClick={enfocarInput}
        style={{ 
          display: 'block', 
          flexDirection: 'column', 
          width: '700px', 
          height: '450px', 
          overflowY: 'auto', 
          backgroundColor: 'black', 
          padding: '15px', 
          borderRadius: '5px', 
          border: '5px solid gray',
          fontFamily: 'monospace',
          cursor: 'text'
        }}
      >
        <p style={{ color: 'whitesmoke', fontWeight: 'bold', margin: '0 0 10px 0' }}>
          SQL:
        </p>

        {historial.map((item, index) => (
          <pre 
            key={index} 
            style={{ 
              color: item.tipo === 'comando' ? '#FFFFFF' : '#A9FFB3', 
              fontFamily: 'monospace', 
              whiteSpace: 'pre-wrap', 
              wordBreak: 'break-all',
              margin: '4px 0',
              textAlign: 'left'
            }}
          >
            {item.texto}
          </pre>
        ))}

        <div style={{ display: 'flex', alignItems: 'center', marginTop: '5px' }}>
          <span style={{ color: '#A9FFB3', marginRight: '8px' }}>{">"}</span>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={manejarEnter}
            autoFocus
            style={{
              backgroundColor: 'transparent',
              border: 'none',
              color: '#A9FFB3',
              fontFamily: 'monospace',
              fontSize: '14px',
              outline: 'none',
              width: '100%'
            }}
          />
        </div>

        <div ref={finalTerminalRef} />
      </div>
    </div>
  );
}
