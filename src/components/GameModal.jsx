// GameModal.jsx
import { useEffect, useRef } from 'react';

export default function GameModal({ game, onClose }) {
  const scriptRef   = useRef(null);
  const mountedRef  = useRef(false); // prevent double-mount in React StrictMode
  const iframeSrc = import.meta.env.DEV
  ? `${import.meta.env.VITE_APP_URL}/game-proxy/${game.id}`
  : game.embed_url;
  
  // Close on Escape
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  // Boot EmulatorJS — only for emulator games, only once
  useEffect(() => {
    if (game.launch_type !== 'emulator') return;
    if (mountedRef.current) return; // Fix Error 2: prevent double init
    mountedRef.current = true;

    // Fix Error 3: force English locale that actually exists
    window.EJS_language        = 'en-US';

    window.EJS_player           = '#ejs-container';
    window.EJS_core             = game.emulator_core;
    window.EJS_gameUrl          = game.rom_url;
    window.EJS_pathtodata       = 'https://cdn.emulatorjs.org/stable/data/';
    window.EJS_startOnLoad      = true;
    window.EJS_fullscreenOnLoad = false;

    // Fix Error 1: suppress WakeLock errors gracefully
    window.EJS_onGameStart = () => {
      // Re-request WakeLock only after user interacts with the iframe
      const iframe = document.querySelector('#ejs-container iframe');
      if (iframe) {
        iframe.addEventListener('click', () => {
          navigator.wakeLock?.request('screen').catch(() => {
            // Silently ignore — non-critical
          });
        }, { once: true });
      }
    };

    // Remove any leftover script from a previous modal open
    document.querySelectorAll('script[data-ejs]').forEach(s => s.remove());

    const script        = document.createElement('script');
    script.src          = 'https://cdn.emulatorjs.org/stable/data/loader.js';
    script.async        = true;
    script.dataset.ejs  = 'true'; // mark it so we can find & remove it
    document.body.appendChild(script);
    scriptRef.current = script;

    return () => {
      mountedRef.current = false;

      // Clean up script
      scriptRef.current?.remove();

      // Clean up ALL EJS globals so next open starts fresh (fixes Error 2)
      const ejsGlobals = [
        'EJS_player', 'EJS_core', 'EJS_gameUrl', 'EJS_pathtodata',
        'EJS_startOnLoad', 'EJS_fullscreenOnLoad', 'EJS_language',
        'EJS_onGameStart', 'EJS_emulator', 'EJS_STORAGE',
        'EJS_Settings', 'EJS_Buttons', 'EJS_AdUrl',
      ];
      ejsGlobals.forEach(k => { try { delete window[k]; } catch(_) {} });
    };
  }, [game]);

  // Record play count
  useEffect(() => {
    if (game.launch_type === 'external') return;
    fetch(`${import.meta.env.VITE_API_BASE}/games/${game.id}/play`, { method: 'POST' }).catch(() => {});
  }, [game]);

  if (!game) return null;

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 1000,
        background: 'rgba(0,0,0,0.85)',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '90vw', maxWidth: '1100px', height: '85vh',
          background: '#0d0d1a', borderRadius: '12px',
          overflow: 'hidden', display: 'flex', flexDirection: 'column',
          boxShadow: '0 0 60px rgba(0,0,0,0.8)',
        }}
      >
        {/* Header */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '12px 16px', background: '#111122',
          borderBottom: '1px solid #ffffff11', flexShrink: 0,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '13px', fontWeight: 600, color: '#fff' }}>{game.title}</span>
            <span style={{
              fontSize: '11px', padding: '2px 8px', borderRadius: '999px',
              background: '#ffffff11', color: '#ffffff88', textTransform: 'capitalize',
            }}>{game.category}</span>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              color: '#ffffff66', fontSize: '22px', lineHeight: 1, padding: '0 4px',
            }}
          >×</button>
        </div>

        {/* Content */}
        <div style={{ flex: 1, overflow: 'hidden', position: 'relative' }}>
             <div style={{ color: 'white', padding: 10, fontSize: 12 }}>
    launch_type: "{game.launch_type}" | embed_url: "{game.embed_url}"
  </div>
            {(game.launch_type === 'embed' || game.launch_type === '') && game.embed_url && (
                <iframe
                    src={iframeSrc}
                    title={game.title}
                    style={{ width: '100%', height: '100%', border: 'none', display: 'block' }}
                    allow="autoplay; fullscreen; pointer-lock; gamepad"
                    allowFullScreen
                />
            )}

            {game.launch_type === 'iframe' && !game.embed_url && (
                <div style={{ color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                No embed URL found for this game.
                </div>
            )}

          {game.launch_type === 'emulator' && (
            <div
              id="ejs-container"
              style={{ width: '100%', height: '100%' }}
            />
          )}

        </div>
      </div>

      <p style={{ color: '#ffffff33', fontSize: '12px', marginTop: '12px' }}>
        Press ESC or click outside to close
      </p>
    </div>
  );
}