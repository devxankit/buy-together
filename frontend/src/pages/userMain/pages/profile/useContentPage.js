import { useState, useEffect } from 'react';
import { getContentPage } from '../../../../services/contentPage.api';

/**
 * Fetches an admin-managed content page by slug for the consumer app's static
 * screens (terms, privacy, community-guidelines, about, help-center). Returns
 * the page document plus loading/error state. The content is seeded via
 * `npm run seed:content` and editable from the admin Content Pages console.
 */
export const useContentPage = (slug) => {
  const [page, setPage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError('');
    getContentPage(slug)
      .then(({ data }) => {
        if (active) setPage(data);
      })
      .catch((err) => {
        if (active) setError(err.response?.data?.message || 'Failed to load this page.');
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => { active = false; };
  }, [slug]);

  return { page, loading, error };
};

export default useContentPage;
