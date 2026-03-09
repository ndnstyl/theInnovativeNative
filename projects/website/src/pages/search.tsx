import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import ClassroomLayout from '@/components/layout/ClassroomLayout';
import { useGlobalSearch } from '@/hooks/useGlobalSearch';

const TYPE_ICONS: Record<string, string> = {
  post: 'fa-solid fa-file-alt',
  member: 'fa-solid fa-user',
  course: 'fa-solid fa-graduation-cap',
  event: 'fa-solid fa-calendar',
};

const TYPE_LABELS: Record<string, string> = {
  post: 'Post',
  member: 'Member',
  course: 'Course',
  event: 'Event',
};

export default function SearchPage() {
  const router = useRouter();
  const { results, loading, search } = useGlobalSearch();
  const [input, setInput] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');

  // Initialize from URL query
  useEffect(() => {
    const q = router.query.q as string;
    if (q) {
      setInput(q);
      search(q, typeFilter);
    }
  }, [router.query.q]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      search(input, typeFilter);
      router.replace({ query: { q: input } }, undefined, { shallow: true });
    }
  };

  return (
    <ClassroomLayout title="Search">
      <div className="global-search">
        <form className="global-search__form" onSubmit={handleSubmit}>
          <div className="global-search__input-wrap">
            <i className="fa-solid fa-search"></i>
            <input
              type="text"
              placeholder="Search posts, members, courses, events..."
              value={input}
              onChange={e => setInput(e.target.value)}
              autoFocus
            />
          </div>
          <div className="global-search__filters">
            {['all', 'post', 'member', 'course', 'event'].map(t => (
              <button
                key={t}
                type="button"
                className={`global-search__filter ${typeFilter === t ? 'active' : ''}`}
                onClick={() => { setTypeFilter(t); if (input.trim()) search(input, t); }}
              >
                {t === 'all' ? 'All' : TYPE_LABELS[t]}
              </button>
            ))}
          </div>
        </form>

        {loading ? (
          <div className="admin-loading"><div className="admin-loading__spinner" /></div>
        ) : results.length === 0 && input ? (
          <div className="global-search__empty">
            <i className="fa-solid fa-search"></i>
            <p>No results for &ldquo;{input}&rdquo;</p>
          </div>
        ) : (
          <div className="global-search__results">
            {results.map(r => (
              <Link key={`${r.result_type}-${r.result_id}`} href={r.url} className="global-search__result">
                <div className="global-search__result-icon">
                  <i className={TYPE_ICONS[r.result_type] || 'fa-solid fa-circle'}></i>
                </div>
                <div className="global-search__result-content">
                  <span className="global-search__result-type">{TYPE_LABELS[r.result_type]}</span>
                  <h4 className="global-search__result-title">{r.title}</h4>
                  {r.snippet && (
                    <p className="global-search__result-snippet" dangerouslySetInnerHTML={{ __html: r.snippet }} />
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </ClassroomLayout>
  );
}
