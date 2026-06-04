import { useState } from 'react';
import axios from 'axios';
import './App.css'

function App() {
  const [mensaje, setMensaje] = useState('');
  const [respuesta, setRespuesta] = useState('');
  const [cargando, setCargando] = useState(false);
  const [asistenteAbierto, setAsistenteAbierto] = useState(false);

  const API_URL = 'https://back-rag-2tqi.onrender.com/chat';

  const preguntar = async () => {
    if (!mensaje.trim()) return;
    setCargando(true);
    setRespuesta('');
    
    try {
      const { data } = await axios.post(API_URL, { mensaje });
      setRespuesta(data.respuesta || 'No se obtuvo respuesta');
    } catch (error) {
      console.error('Error:', error);
      setRespuesta('Error al conectar. Render puede estar despertando (30-50s).');
    }
    setCargando(false);
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
      {/* Header */}
      <header style={{
        backgroundColor: '#2c7a4d',
        color: 'white',
        padding: '15px 20px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <h1 style={{ margin: 0, fontSize: '1.5rem' }}>🏥 Farmacia ejemplo</h1>
        <div>
          <button 
            type="button"
            style={{ background: 'none', border: 'none', color: 'white', marginRight: '15px', cursor: 'pointer' }}
          >
            Login
          </button>
          <button 
            type="button"
            style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}
          >
            🛒 Carrito
          </button>
        </div>
      </header>

      {/* Hero banner (placeholder) */}
      <div style={{
        backgroundColor: '#e8f5e9',
        textAlign: 'center',
        padding: '40px 20px',
        margin: '20px',
        borderRadius: '10px'
      }}>
        <h2>💊 20% OFF en medicamentos de venta libre</h2>
        <p>Válido hasta el 30 de junio</p>
      </div>

      {/* Product grid (placeholder, no funcional) */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
        <h3>Productos destacados</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(i => (
            <div key={i} style={{ backgroundColor: 'white', padding: '15px', borderRadius: '8px', textAlign: 'center', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}>
              <div style={{ fontSize: '48px' }}>💊</div>
              <h4>Producto {i}</h4>
              <p style={{ color: '#888' }}>$ 2.500</p>
              <button style={{ backgroundColor: '#2c7a4d', color: 'white', border: 'none', padding: '8px 15px', borderRadius: '5px', cursor: 'pointer' }}>Ver más</button>
            </div>
          ))}
        </div>
        <p style={{ textAlign: 'center', marginTop: '20px', color: '#888' }}>⬆️ Estos productos son de ejemplo (no funcional) ⬆️</p>
      </div>

      {/* Botón flotante del asistente */}
      {!asistenteAbierto && (
        <button
          onClick={() => setAsistenteAbierto(true)}
          style={{
            position: 'fixed',
            bottom: '20px',
            right: '420px',
            backgroundColor: '#2c7a4d',
            color: 'white',
            border: 'none',
            borderRadius: '50px',
            padding: '12px 20px',
            cursor: 'pointer',
            boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
            fontSize: '16px'
          }}
        >
          💬 ¿No encuentras algo en específico?. ¿Necesitas ayuda?
        </button>
      )}

      {/* Ventana emergente del asistente */}
      {asistenteAbierto && (
        <div style={{
          position: 'fixed',
          bottom: '20px',
          right: '420px',
          width: '350px',
          backgroundColor: 'white',
          borderRadius: '10px',
          boxShadow: '0 5px 20px rgba(0,0,0,0.3)',
          overflow: 'hidden',
          zIndex: 1000
        }}>
          {/* Header del asistente */}
          <div style={{
            backgroundColor: '#2c7a4d',
            color: 'white',
            padding: '12px 15px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <span>🧠 Asistente IA Virtual</span>
            <button
              onClick={() => setAsistenteAbierto(false)}
              style={{ background: 'none', border: 'none', color: 'white', fontSize: '18px', cursor: 'pointer'}}
            >
              ✕
            </button>
          </div>

          {/* Cuerpo del chat */}
          <div style={{ padding: '15px' }}>
            <div style={{ marginBottom: '15px' }}>
              <div style={{ backgroundColor: '#e8f5e9', padding: '10px', borderRadius: '10px', marginBottom: '10px' }}>
                🤖 Hola, soy la IA asistente de Farmacia ejemplo. ¿Buscas algo en específico?. ¿Qué sintomas tienes?.
              </div>
              
              {respuesta && (
                <div style={{ backgroundColor: '#e8f5e9', padding: '10px', borderRadius: '10px', marginTop: '10px' }}>
                  🤖 {respuesta}
                </div>
              )}
            </div>

            {/* Input del usuario */}
            <div style={{ display: 'flex', gap: '10px' }}>
              <input
                type="text"
                value={mensaje}
                onChange={(e) => setMensaje(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && preguntar()}
                placeholder="Ej: ¿Tienen paracetamol?"
                style={{
                  flex: 1,
                  padding: '10px',
                  borderRadius: '5px',
                  border: '1px solid #ccc'
                }}
              />
              <button
                onClick={preguntar}
                disabled={cargando}
                style={{
                  padding: '10px 15px',
                  backgroundColor: '#2c7a4d',
                  color: 'white',
                  border: 'none',
                  borderRadius: '5px',
                  cursor: 'pointer'
                }}
              >
                {cargando ? '...' : 'Enviar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;