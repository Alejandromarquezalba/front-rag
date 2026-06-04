import { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import './App.css'

interface Mensaje {
  tipo: 'bot' | 'usuario';
  texto: string;
}

function App() {
  const [input, setInput] = useState('');
  const [mensajes, setMensajes] = useState<Mensaje[]>([
    { tipo: 'bot', texto: 'Hola, soy el asistente virtual de Farmacia Ejemplo. ¿En qué puedo ayudarte hoy? Podés contarme tus síntomas o preguntarme por algún medicamento.' }
  ]);
  const [cargando, setCargando] = useState(false);
  const [asistenteAbierto, setAsistenteAbierto] = useState(false);
  const chatRef = useRef<HTMLDivElement>(null);

  const API_URL = 'https://back-rag-2tqi.onrender.com/chat';

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [mensajes]);

  const preguntar = async () => {
    if (!input.trim() || cargando) return;
    const textoUsuario = input;
    setInput('');
    setMensajes(prev => [...prev, { tipo: 'usuario', texto: textoUsuario }]);
    setCargando(true);

    try {
      const { data } = await axios.post(API_URL, { mensaje: textoUsuario });
      setMensajes(prev => [...prev, { tipo: 'bot', texto: data.respuesta || 'No se obtuvo respuesta' }]);
    } catch {
      setMensajes(prev => [...prev, { tipo: 'bot', texto: 'Error al conectar. Render puede estar despertando (30-50s), intentá de nuevo.' }]);
    }
    setCargando(false);
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f5f5f5', fontFamily: 'Segoe UI, sans-serif' }}>

      {/* Header */}
      <header style={{
        backgroundColor: '#2c7a4d',
        color: 'white',
        padding: '15px 30px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
      }}>
        <h1 style={{ margin: 0, fontSize: '1.4rem', fontWeight: 700 }}>🏥 Farmacia Ejemplo</h1>
        <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
          <button type="button" style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', fontSize: '0.95rem' }}>Inicio</button>
          <button type="button" style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', fontSize: '0.95rem' }}>Productos</button>
          <button type="button" style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', fontSize: '0.95rem' }}>Login</button>
          <button type="button" style={{ background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.3)', color: 'white', cursor: 'pointer', fontSize: '0.95rem', padding: '6px 14px', borderRadius: '20px' }}>🛒 Carrito</button>
        </div>
      </header>

      {/* Hero banner */}
      <div style={{
        background: 'linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%)',
        textAlign: 'center',
        padding: '50px 20px',
        margin: '25px',
        borderRadius: '12px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
      }}>
        <h2 style={{ color: '#2c7a4d', fontSize: '1.8rem', marginBottom: '10px' }}>💊 20% OFF en medicamentos de venta libre</h2>
        <p style={{ color: '#555', margin: 0 }}>Válido hasta el 30 de junio · Consultá con nuestro asistente virtual</p>
      </div>

      {/* Product grid */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px 25px' }}>
        <h3 style={{ color: '#333', marginBottom: '20px' }}>Productos destacados</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '18px' }}>
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(i => (
            <div key={i} style={{
              backgroundColor: 'white',
              padding: '18px',
              borderRadius: '10px',
              textAlign: 'center',
              boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
              transition: 'transform 0.2s',
              cursor: 'pointer'
            }}>
              <div style={{ fontSize: '40px', marginBottom: '8px' }}>💊</div>
              <h4 style={{ margin: '0 0 6px', fontSize: '0.95rem', color: '#333' }}>Producto {i}</h4>
              <p style={{ color: '#888', margin: '0 0 12px', fontSize: '0.9rem' }}>$ 2.500</p>
              <button style={{
                backgroundColor: '#2c7a4d',
                color: 'white',
                border: 'none',
                padding: '7px 16px',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '0.85rem'
              }}>Ver más</button>
            </div>
          ))}
        </div>
        <p style={{ textAlign: 'center', marginTop: '20px', color: '#aaa', fontSize: '0.85rem' }}>
          ⬆️ Productos de ejemplo — no funcionales
        </p>
      </div>

      {/* Botón flotante */}
      {!asistenteAbierto && (
        <button
          onClick={() => setAsistenteAbierto(true)}
          style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            backgroundColor: '#2c7a4d',
            color: 'white',
            border: 'none',
            borderRadius: '50px',
            padding: '14px 22px',
            cursor: 'pointer',
            boxShadow: '0 4px 15px rgba(44,122,77,0.4)',
            fontSize: '15px',
            fontWeight: 600
          }}
        >
          💬 ¿Necesitás ayuda?
        </button>
      )}

      {/* Ventana del asistente */}
      {asistenteAbierto && (
        <div style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          width: '360px',
          backgroundColor: 'white',
          borderRadius: '14px',
          boxShadow: '0 8px 30px rgba(0,0,0,0.18)',
          overflow: 'hidden',
          zIndex: 1000,
          display: 'flex',
          flexDirection: 'column',
          maxHeight: '500px'
        }}>

          {/* Header del chat */}
          <div style={{
            backgroundColor: '#2c7a4d',
            color: 'white',
            padding: '14px 16px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexShrink: 0
          }}>
            <div>
              <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>🤖 Asistente Farma</div>
              <div style={{ fontSize: '0.75rem', opacity: 0.8 }}>Powered by IA · En línea</div>
            </div>
            <button onClick={() => setAsistenteAbierto(false)} style={{ background: 'none', border: 'none', color: 'white', fontSize: '20px', cursor: 'pointer', lineHeight: 1 }}>✕</button>
          </div>

          {/* Mensajes */}
          <div
            ref={chatRef}
            style={{
              padding: '14px',
              overflowY: 'auto',
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              gap: '10px'
            }}
          >
            {mensajes.map((m, i) => (
              <div key={i} style={{
                display: 'flex',
                justifyContent: m.tipo === 'usuario' ? 'flex-end' : 'flex-start'
              }}>
                <div style={{
                  backgroundColor: m.tipo === 'usuario' ? '#2c7a4d' : '#f0f7f2',
                  color: m.tipo === 'usuario' ? 'white' : '#333',
                  padding: '9px 13px',
                  borderRadius: m.tipo === 'usuario' ? '14px 14px 4px 14px' : '14px 14px 14px 4px',
                  maxWidth: '85%',
                  fontSize: '0.83rem',
                  lineHeight: '1.5'
                }}>
                  {m.texto}
                </div>
              </div>
            ))}
            {cargando && (
              <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                <div style={{ backgroundColor: '#f0f7f2', padding: '9px 13px', borderRadius: '14px 14px 14px 4px', fontSize: '0.83rem', color: '#888' }}>
                  Escribiendo...
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <div style={{
            padding: '12px',
            borderTop: '1px solid #eee',
            display: 'flex',
            gap: '8px',
            flexShrink: 0
          }}>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && preguntar()}
              placeholder="Ej: me duele la cabeza..."
              style={{
                flex: 1,
                padding: '9px 13px',
                borderRadius: '20px',
                border: '1px solid #ddd',
                fontSize: '0.85rem',
                outline: 'none'
              }}
            />
            <button
              onClick={preguntar}
              disabled={cargando}
              style={{
                padding: '9px 16px',
                backgroundColor: cargando ? '#aaa' : '#2c7a4d',
                color: 'white',
                border: 'none',
                borderRadius: '20px',
                cursor: cargando ? 'not-allowed' : 'pointer',
                fontSize: '0.85rem',
                fontWeight: 600
              }}
            >
              {cargando ? '...' : 'Enviar'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
