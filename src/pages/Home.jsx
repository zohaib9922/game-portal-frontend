import { useState } from 'react';
import GameCard from '../components/GameCard';
import { useGames, useFeaturedGames, useCategories } from '../hooks/useGames';

export default function Home() {
  const [category, setCategory] = useState('all');
  const [search, setSearch]     = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [page, setPage]         = useState(1);

  const { games, meta, loading } = useGames({ category, search, page });
  const { games: featured }      = useFeaturedGames();
  const categories               = useCategories();

  function handleSearch(e) {
    e.preventDefault();
    setSearch(searchInput);
    setPage(1);
  }

  function handleCategory(cat) {
    setCategory(cat);
    setPage(1);
    setSearch('');
    setSearchInput('');
  }

  return (
    <div className="home">

      <section className="hero">
        <h1 className="hero__title">Play Free Games</h1>
        <p className="hero__sub">Hundreds of browser games — no download, no login.</p>
        <form className="search-bar" onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="Search games..."
            value={searchInput}
            onChange={e => setSearchInput(e.target.value)}
          />
          <button type="submit">Search</button>
        </form>
      </section>

      {!search && category === 'all' && featured.length > 0 && (
        <section className="section">
          <h2 className="section__title">Featured</h2>
          <div className="game-grid game-grid--featured">
            {featured.map(g => <GameCard key={g.id} game={g} />)}
          </div>
        </section>
      )}

      <section className="section">
        <div className="filter-bar">
          {['all', ...categories].map(cat => (
            <button
              key={cat}
              className={`filter-btn ${category === cat ? 'filter-btn--active' : ''}`}
              onClick={() => handleCategory(cat)}
            >
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="loading-grid">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="skeleton" />
            ))}
          </div>
        ) : games.length === 0 ? (
          <div className="empty">No games found. Try a different search.</div>
        ) : (
          <div className="game-grid">
            {games.map(g => <GameCard key={g.id} game={g} />)}
          </div>
        )}

        {meta && meta.last_page > 1 && (
          <div className="pagination">
            <button disabled={page === 1} onClick={() => setPage(p => p - 1)}>← Prev</button>
            <span>{page} / {meta.last_page}</span>
            <button disabled={page === meta.last_page} onClick={() => setPage(p => p + 1)}>Next →</button>
          </div>
        )}
      </section>

    </div>
  );
}
