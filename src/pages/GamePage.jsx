import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useGame } from '../hooks/useGames';

export default function GamePage() {
  const { id } = useParams();
  const { game, loading, recordPlay } = useGame(id);

  const [iframeError, setIframeError] = useState(false);

  useEffect(() => {
    if (game) {
      recordPlay();
      document.title = `${game.title} — GamePortal`;
    }

    return () => {
      document.title = 'GamePortal';
    };
  }, [game]);

  if (loading) {
    return (
      <div className="loading-full">
        <div className="spinner" />
      </div>
    );
  }

  if (!game) {
    return (
      <div className="empty">
        Game not found. <Link to="/">Go home</Link>
      </div>
    );
  }

  const openInNewTab = () => {
    if (game.embed_url) {
      window.open(game.embed_url, '_blank', 'noopener,noreferrer');
    }
  };

  const showIframe =
    game.embed_url &&
    game.embed_url.startsWith('http') &&
    !iframeError;

  return (
    <div className="game-page">

      {/* HEADER */}
      <div className="game-page__header">
        <Link to="/" className="back-link">← Back to games</Link>

        <h1 className="game-page__title">{game.title}</h1>

        <div className="game-page__meta">
          <span className="category-pill">{game.category}</span>
          <span className="plays">
            {game.plays?.toLocaleString?.() || 0} plays
          </span>

          {game.tags?.map(tag => (
            <span key={tag} className="tag-pill">#{tag}</span>
          ))}
        </div>
      </div>

      {/* TOP AD */}
      <div className="ad-slot ad-slot--top">
        <span className="ad-label">Advertisement</span>
        <div className="ad-placeholder">Ad Banner (728×90)</div>
      </div>

      {/* GAME AREA */}
      <div className="game-frame-wrap">

        {showIframe ? (
          <iframe
            src={game.embed_url}
            title={game.title}
            className="game-frame"
            allow="autoplay; fullscreen; gamepad"
            allowFullScreen
            sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
            onError={() => setIframeError(true)}
          />
        ) : (
          <div className="frame-error">
            <h3>⚠️ This game cannot be embedded</h3>
            <p>
              The game provider does not allow iframe embedding.
            </p>

            <button onClick={openInNewTab} className="play-btn">
              ▶ Play in New Tab
            </button>
          </div>
        )}

      </div>

      {/* BOTTOM AD */}
      <div className="ad-slot ad-slot--bottom">
        <span className="ad-label">Advertisement</span>
        <div className="ad-placeholder">Ad Banner (728×90)</div>
      </div>

      {/* DESCRIPTION */}
      <div className="game-page__desc">
        <h2>About {game.title}</h2>
        <p>{game.description}</p>
      </div>

    </div>
  );
}