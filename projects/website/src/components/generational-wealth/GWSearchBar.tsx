import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";

interface SubResult {
  url: string;
  title: string;
  excerpt: string;
  isSub: boolean;
}

interface LiveResult {
  pageTitle: string;
  pageUrl: string;
  items: SubResult[];
}

const DEBOUNCE_MS = 120;
const MIN_CHARS = 2;
const MAX_RESULTS = 5;

const GWSearchBar = () => {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<LiveResult[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [indexMissing, setIndexMissing] = useState(false);

  const pagefindRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const loadPagefind = async () => {
    if (pagefindRef.current) return pagefindRef.current;
    try {
      // Cache-bust per build so CDN can never pin a stale 404 against this URL.
      // PAGEFIND_BUILD_ID is injected by next.config.js at build time.
      const buildId = (process.env.NEXT_PUBLIC_PAGEFIND_BUILD_ID || "dev") as string;
      const pf = await import(
        /* webpackIgnore: true */ `/gw-search/pagefind.js?v=${buildId}` as any
      );
      await pf.options({ baseUrl: "/" });
      pagefindRef.current = pf;
      return pf;
    } catch (err) {
      setIndexMissing(true);
      return null;
    }
  };

  useEffect(() => {
    if (query.length < MIN_CHARS) {
      setResults([]);
      return;
    }
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      setLoading(true);
      const pf = await loadPagefind();
      if (!pf) {
        setLoading(false);
        return;
      }
      const response = await pf.search(query);
      const top = response.results.slice(0, MAX_RESULTS);
      const data = await Promise.all(top.map((r: any) => r.data()));
      const grouped: LiveResult[] = data.map((d: any) => {
        const subs: SubResult[] = (d.sub_results && d.sub_results.length > 0)
          ? d.sub_results.slice(0, 3).map((s: any) => ({
              url: s.url,
              title: s.title || d.meta?.title || "Untitled",
              excerpt: s.excerpt,
              isSub: true,
            }))
          : [{
              url: d.url,
              title: d.meta?.title || "Untitled",
              excerpt: d.excerpt,
              isSub: false,
            }];
        return {
          pageTitle: d.meta?.title || "Untitled",
          pageUrl: d.url,
          items: subs,
        };
      });
      setResults(grouped);
      setLoading(false);
    }, DEBOUNCE_MS);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query]);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim().length < MIN_CHARS) return;
    setOpen(false);
    router.push(`/generational-wealth/search?q=${encodeURIComponent(query.trim())}`);
  };

  const handleResultClick = () => {
    setOpen(false);
    setQuery("");
  };

  const flatCount = results.reduce((acc, r) => acc + r.items.length, 0);

  return (
    <div ref={containerRef} className="gw-search" data-pagefind-ignore>
      <form onSubmit={handleSubmit} className="gw-search__form">
        <i className="fa-sharp fa-solid fa-magnifying-glass gw-search__icon" />
        <input
          type="search"
          className="gw-search__input"
          placeholder="Search anything in this guide&hellip;"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => {
            loadPagefind();
            if (query.length >= MIN_CHARS) setOpen(true);
          }}
          aria-label="Search Generational Wealth"
        />
        {query.length > 0 && (
          <button
            type="button"
            className="gw-search__clear"
            onClick={() => {
              setQuery("");
              setResults([]);
            }}
            aria-label="Clear search"
          >
            <i className="fa-sharp fa-solid fa-xmark" />
          </button>
        )}
      </form>

      {open && query.length >= MIN_CHARS && (
        <div className="gw-search__dropdown" role="listbox">
          {indexMissing && (
            <div className="gw-search__status">
              Search index isn&rsquo;t built yet. Run <code>npm run build</code> to enable search locally.
            </div>
          )}
          {loading && !indexMissing && (
            <div className="gw-search__status">Searching&hellip;</div>
          )}
          {!loading && !indexMissing && flatCount === 0 && (
            <div className="gw-search__status">
              No matches for &ldquo;{query}&rdquo;. Try a broader term.
            </div>
          )}
          {!loading && flatCount > 0 && (
            <>
              <ul className="gw-search__results">
                {results.map((group) =>
                  group.items.map((item, idx) => (
                    <li key={`${group.pageUrl}-${idx}`} className="gw-search__result">
                      <Link
                        href={item.url}
                        className="gw-search__result-link"
                        onClick={handleResultClick}
                      >
                        <span className="gw-search__result-page">{group.pageTitle}</span>
                        {item.isSub && item.title !== group.pageTitle && (
                          <span className="gw-search__result-section">
                            <i className="fa-sharp fa-solid fa-angle-right" />
                            {item.title}
                          </span>
                        )}
                        <span
                          className="gw-search__result-snippet"
                          dangerouslySetInnerHTML={{ __html: item.excerpt }}
                        />
                      </Link>
                    </li>
                  ))
                )}
              </ul>
              <Link
                href={`/generational-wealth/search?q=${encodeURIComponent(query.trim())}`}
                className="gw-search__see-all"
                onClick={handleResultClick}
              >
                See all results for &ldquo;{query}&rdquo; &rarr;
              </Link>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default GWSearchBar;
