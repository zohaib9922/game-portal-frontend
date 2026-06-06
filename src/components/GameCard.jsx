// GameCard.jsx
import { useState } from 'react';
import GameModal from './GameModal';

const CATEGORY_COLORS = {
  arcade:    { bg: '#1a0a2e', accent: '#9333ea' },
  puzzle:    { bg: '#0a1a2e', accent: '#3b82f6' },
  strategy:  { bg: '#0a2e1a', accent: '#10b981' },
  word:      { bg: '#2e1a0a', accent: '#f59e0b' },
  card:      { bg: '#2e0a1a', accent: '#ef4444' },
  sports:    { bg: '#0a2e2e', accent: '#06b6d4' },
  adventure: { bg: '#2e2a0a', accent: '#eab308' },
  racing:    { bg: '#2e0a0a', accent: '#f97316' },
  io:        { bg: '#1a2e0a', accent: '#84cc16' },
  action:    { bg: '#2e0a0a', accent: '#ff4757' },
  multiplayer:{ bg: '#0a1a2e', accent: '#1e90ff' },
};

const CATEGORY_ICONS = {
  arcade:    '🕹️',
  puzzle:    '🧩',
  strategy:  '♟️',
  word:      '📝',
  card:      '🃏',
  sports:    '⚽',
  adventure: '🗺️',
  racing:    '🏎️',
  io:        '🌐',
  action:    '⚔️',
  multiplayer:'👥',
};

function PlaceholderThumb({ title, category }) {
  const colors = CATEGORY_COLORS[category] || { bg: '#1a1a2e', accent: '#7c3aed' };
  const icon   = CATEGORY_ICONS[category] || '🎮';
  const short  = title.length > 18 ? title.slice(0, 18) + '…' : title;

  return (
    <div style={{
      width: '100%', height: '100%',
      background: `linear-gradient(135deg, ${colors.bg} 0%, #0d0d1a 100%)`,
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      gap: '8px', borderBottom: `2px solid ${colors.accent}22`,
      position: 'relative', overflow: 'hidden',
    }}>
      <div style={{ position:'absolute', width:'120px', height:'120px', borderRadius:'50%', background:`${colors.accent}11`, top:'-30px', right:'-30px' }} />
      <div style={{ position:'absolute', width:'80px',  height:'80px',  borderRadius:'50%', background:`${colors.accent}0a`, bottom:'-20px', left:'-20px' }} />
      <span style={{ fontSize:'36px', lineHeight:1 }}>{icon}</span>
      <span style={{ fontSize:'12px', fontWeight:600, color:colors.accent, textAlign:'center', padding:'0 12px', letterSpacing:'0.5px' }}>{short}</span>
      <span style={{ fontSize:'10px', color:'#ffffff44', textTransform:'uppercase', letterSpacing:'1px' }}>{category}</span>
    </div>
  );
}

function GameThumb({ game }) {
  const [imgFailed, setImgFailed] = useState(false);
  const hasThumbnail = game.thumbnail && game.thumbnail.trim() !== '' && !imgFailed;

  return (
    <div className="game-card__thumb">
      {hasThumbnail
        ? <img src={game.thumbnail} alt={game.title} onError={() => setImgFailed(true)} />
        : <PlaceholderThumb title={game.title} category={game.category} />
      }
      {game.is_featured && <span className="badge badge--featured">Featured</span>}
      {game.launch_type === 'external' && <span className="badge badge--external">↗ External</span>}
      {game.launch_type === 'emulator'  && <span className="badge badge--emulator">🕹 Emulator</span>}
      <div className="game-card__overlay">
        <span className="play-btn">▶ Play</span>
      </div>
    </div>
  );
}

export default function GameCard({ game }) {
  const [open, setOpen] = useState(false);

  const handleClick = (e) => {
    e.preventDefault();

    if (game.launch_type === 'external') {
      // fire-and-forget play count, then open new tab
      fetch(`${import.meta.env.VITE_API_BASE}/games/${game.id}/play`, { method: 'POST' }).catch(() => {});
      window.open(game.external_url, '_blank', 'noopener,noreferrer');
      return;
    }

    setOpen(true);
  };

  return (
    <>
      {/* Card — plain div, no Link navigation */}
      <div className="game-card" onClick={handleClick} style={{ cursor: 'pointer' }}>
        <GameThumb game={game} />
        <div className="game-card__info">
          <h3 className="game-card__title">{game.title}</h3>
          <div className="game-card__meta">
            <span className="category-pill">{game.category}</span>
            <span className="plays">{game.plays.toLocaleString()} plays</span>
          </div>
          <p className="game-card__desc">{game.description}</p>
        </div>
      </div>

      {/* Modal — mounts only when open */}
      {open && (
        <GameModal game={game} onClose={() => setOpen(false)} />
      )}
    </>
  );
}