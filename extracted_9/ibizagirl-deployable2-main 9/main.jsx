
import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom/client';
<meta name="juicyads-site-verification" content="57781c218b1d1435f3512464c59cf39b">
<meta name="eroads_" content="5f8afe77e5b70fec960d89b314e045a4" />
  const App = () => {
  const [gallery, setGallery] = useState([]);

  useEffect(() => {
    fetch(import.meta.env.BASE_URL + 'gallery.json')
      .then(res => res.json())
      .then(data => setGallery(data))
      .catch(err => console.error("Error loading gallery.json:", err));
  }, []);

  const decoracion = gallery.filter(item => item.folder === "decoracion.");
  const imagenes = gallery.filter(item => item.type === "image" && item.folder !== "decoracion.");
  const videos = gallery.filter(item => item.type === "video");

  return (
    <div style={{
      minHeight: '100vh',
      backgroundImage: decoracion.length > 0 ? `url(/assets/decoracion./${decoracion[0].file})` : 'none',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      paddingTop: '120px'
    }}>
      {/* Banner rotatorio */}
      {decoracion.length > 1 && (
        <div style={{
          position: 'fixed',
          top: 0,
          width: '100%',
          height: '100px',
          display: 'flex',
          overflowX: 'auto',
          background: '#0008',
          zIndex: 10
        }}>
          {decoracion.map((item, idx) => (
            <img
              key={idx}
              src={`/assets/${item.folder}/${item.file}`}
              alt=""
              style={{ height: '100%', objectFit: 'cover', marginRight: '10px' }}
            />
          ))}
        </div>
      )}

      {/* Contenido en columnas */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        padding: '1rem',
        backdropFilter: 'blur(2px)',
        background: '#00000066'
      }}>
        {/* Columna izquierda: Imágenes */}
        <div style={{ flex: '1', paddingRight: '1rem' }}>
          <h2 style={{ color: 'white' }}>📸 Imágenes</h2>
          {imagenes.map((item, index) => (
            <div key={index} style={{ marginBottom: '1rem' }}>
              <img
                src={`/assets/${item.folder}/${item.file}`}
                alt=""
                style={{
                  width: '240px',
                  borderRadius: '8px',
                  filter: item.folder.includes('censored') ? 'blur(8px)' : 'none'
                }}
              />
            </div>
          ))}
        </div>

        {/* Columna derecha: Videos */}
        <div style={{ flex: '1', paddingLeft: '1rem' }}>
          <h2 style={{ color: 'white' }}>🎥 Vídeos</h2>
          {videos.map((item, index) => (
            <div key={index} style={{ marginBottom: '1rem' }}>
              <video
                width="240"
                height="auto"
                controls
                style={{
                  borderRadius: '8px',
                  filter: item.folder.includes('censored') ? 'blur(8px)' : 'none'
                }}
              >
                <source src={`/assets/${item.folder}/${item.file}`} type="video/mp4" />
              </video>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
