import { Link } from 'react-router-dom';

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
};

function PlaceholderThumb({ title, category }) {
  const colors = CATEGORY_COLORS[category] || { bg: '#1a1a2e', accent: '#7c3aed' };
  const icon   = CATEGORY_ICONS[category] || '🎮';
  const short  = title.length > 18 ? title.slice(0, 18) + '…' : title;

  return (
    <div style={{
      width: '100%',
      height: '100%',
      background: `linear-gradient(135deg, ${colors.bg} 0%, #0d0d1a 100%)`,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '8px',
      borderBottom: `2px solid ${colors.accent}22`,
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* decorative circles */}
      <div style={{
        position: 'absolute',
        width: '120px',
        height: '120px',
        borderRadius: '50%',
        background: `${colors.accent}11`,
        top: '-30px',
        right: '-30px',
      }} />
      <div style={{
        position: 'absolute',
        width: '80px',
        height: '80px',
        borderRadius: '50%',
        background: `${colors.accent}0a`,
        bottom: '-20px',
        left: '-20px',
      }} />
      <span style={{ fontSize: '36px', lineHeight: 1 }}>{icon}</span>
      <span style={{
        fontSize: '12px',
        fontWeight: 600,
        color: colors.accent,
        textAlign: 'center',
        padding: '0 12px',
        letterSpacing: '0.5px',
        fontFamily: 'Inter, sans-serif',
      }}>{short}</span>
      <span style={{
        fontSize: '10px',
        color: '#ffffff44',
        textTransform: 'uppercase',
        letterSpacing: '1px',
      }}>{category}</span>
    </div>
  );
}

export default function GameCard({ game }) {
  const hasThumbnail = game.thumbnail && game.thumbnail.trim() !== '';

  return (
    <Link to={`/game/${game.id}`} className="game-card">
      <div className="game-card__thumb">
        {hasThumbnail ? (
          <img
            src={game.thumbnail}
            alt={game.title}
            onError={e => {
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'flex';
            }}
          />
        ) : null}
        <div style={{ display: hasThumbnail ? 'none' : 'flex', width: '100%', height: '100%', position: hasThumbnail ? 'absolute' : 'relative', inset: 0 }}>
          <PlaceholderThumb title={game.title} category={game.category} />
        </div>
        {game.is_featured && <span className="badge badge--featured">Featured</span>}
        <div className="game-card__overlay">
          <span className="play-btn">▶ Play</span>
        </div>
      </div>
      <div className="game-card__info">
        <h3 className="game-card__title">{game.title}</h3>
        <div className="game-card__meta">
          <span className="category-pill">{game.category}</span>
          <span className="plays">{game.plays.toLocaleString()} plays</span>
        </div>
        <p className="game-card__desc">{game.description}</p>
      </div>
    </Link>
  );
}