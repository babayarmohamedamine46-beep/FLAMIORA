import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useI18n } from '@/i18n/I18nContext';
import { searchProducts } from '@/services/products';
import ProductCard from '@/features/products/ProductCard';
import LoadingState from '@/components/LoadingState';
import type { Product } from '@/types/product';

export default function SearchPage() {
  const { t } = useI18n();
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const initialQ = params.get('q') || '';
  const [term, setTerm] = useState(initialQ);
  const [results, setResults] = useState<Product[] | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setTerm(initialQ);
  }, [initialQ]);

  useEffect(() => {
    if (!term.trim()) {
      setResults([]);
      return;
    }
    setLoading(true);
    const handle = setTimeout(async () => {
      const r = await searchProducts(term);
      setResults(r);
      setLoading(false);
    }, 300); // debounce
    return () => clearTimeout(handle);
  }, [term]);

  const onChange = (v: string) => {
    setTerm(v);
    navigate(`/search?q=${encodeURIComponent(v)}`, { replace: true });
  };

  return (
    <div className="flm-container flm-section">
      <input
        type="search"
        className="flm-search-input-full"
        value={term}
        onChange={(e) => onChange(e.target.value)}
        placeholder={t('header.searchPlaceholder')}
        autoFocus
      />

      {loading && <LoadingState />}

      {!loading && term.trim() && results?.length === 0 && (
        <p className="flm-empty-state">{t('search.noResults')}</p>
      )}

      {!loading && results && results.length > 0 && (
        <>
          <p className="flm-results-count">{t('search.resultsCount', { count: results.length })}</p>
          <div className="flm-products-grid">
            {results.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

