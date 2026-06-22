import { useState, useEffect } from 'react';

/**
 * Custom hook to load the content-map.json.
 */
export function useContentMap() {
  const [contentMap, setContentMap] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadContent() {
      try {
        const response = await fetch('/content/content-map.json');
        if (!response.ok) {
          throw new Error('Failed to load content map');
        }
        const data = await response.json();
        setContentMap(data);
      } catch (err) {
        setError(err);
        console.error('Error fetching content-map.json:', err);
      } finally {
        setLoading(false);
      }
    }

    loadContent();
  }, []);

  return { contentMap, loading, error };
}
