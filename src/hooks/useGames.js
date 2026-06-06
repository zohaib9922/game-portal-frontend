import { useState, useEffect, useCallback } from 'react';

const API_BASE = 'https://game-portal-backend-production.up.railway.app/api';

console.log("API BASE:", API_BASE);

async function apiFetch(path, options = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    ...options,
  });
  if (!res.ok) throw new Error(`API error ${res.status}`);
  return res.json();
}

export function useGames({ category = 'all', search = '', page = 1 } = {}) {
  const [games, setGames]     = useState([]);
  const [meta, setMeta]       = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams({ page, per_page: 12 });
    if (category && category !== 'all') params.set('category', category);
    if (search) params.set('search', search);

    apiFetch(`/games?${params}`)
      .then(data => {
        setGames(data.data);
        setMeta({ current_page: data.current_page, last_page: data.last_page, total: data.total });
        setError(null);
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [category, search, page]);

  return { games, meta, loading, error };
}

export function useFeaturedGames() {
  const [games, setGames]     = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiFetch('/games/featured')
      .then(setGames)
      .finally(() => setLoading(false));
  }, []);

  return { games, loading };
}

export function useCategories() {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    apiFetch('/games/categories').then(setCategories);
  }, []);

  return categories;
}

export function useGame(id) {
  const [game, setGame]       = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    apiFetch(`/games/${id}`)
      .then(setGame)
      .finally(() => setLoading(false));
  }, [id]);

  const recordPlay = useCallback(() => {
    if (!id) return;
    apiFetch(`/games/${id}/play`, { method: 'POST' });
  }, [id]);

  return { game, loading, recordPlay };
}
