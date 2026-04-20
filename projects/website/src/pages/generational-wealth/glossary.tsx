import React, { useState, useMemo } from "react";
import Link from "next/link";
import GWLayout from "@/components/generational-wealth/GWLayout";
import PageCover from "@/components/generational-wealth/PageCover";
import glossaryData from "@/data/gw-glossary.json";

interface GlossaryTerm {
  term: string;
  full: string;
  definition: string;
  pages: string[];
}

const PAGE_LABELS: Record<string, string> = {
  "/generational-wealth/eqip": "EQIP",
  "/generational-wealth/financing": "Financing",
  "/generational-wealth/due-diligence": "Due Diligence",
  "/generational-wealth/contacts": "Contacts",
  "/generational-wealth/timeline": "Timeline",
  "/generational-wealth/building": "Building",
  "/generational-wealth/systems": "Systems",
  "/generational-wealth/food": "Food",
};

const terms: GlossaryTerm[] = (glossaryData as { terms: GlossaryTerm[] }).terms;

export default function GlossaryPage() {
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    if (!q) return terms;
    return terms.filter(
      (t) =>
        t.term.toLowerCase().includes(q) ||
        t.full.toLowerCase().includes(q) ||
        t.definition.toLowerCase().includes(q)
    );
  }, [search]);

  const letters = useMemo(() => {
    const seen = new Set<string>();
    filtered.forEach((t) => seen.add(t.term[0].toUpperCase()));
    return Array.from(seen).sort();
  }, [filtered]);

  const grouped = useMemo(() => {
    const map: Record<string, GlossaryTerm[]> = {};
    filtered.forEach((t) => {
      const letter = t.term[0].toUpperCase();
      if (!map[letter]) map[letter] = [];
      map[letter].push(t);
    });
    return map;
  }, [filtered]);

  return (
    <GWLayout title="Glossary — Every Term in Plain English" lastVerified="April 2026">
      <PageCover imageSrc="/images/generational-wealth/cover-glossary.jpg" imageAlt="Learning and reference materials" videoPlaceholder={false} />
      <h1>Glossary — Every Term in Plain English</h1>
      <p className="gw-lead">
        Every program, agency, and acronym on this site explained in plain English.
        First time you see a term on another page, hover it for a quick definition.
        For the full story, come back here.
      </p>

      <div className="gw-glossary__search-wrap">
        <input
          type="search"
          className="gw-glossary__search"
          placeholder="Search terms, acronyms, definitions…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          aria-label="Search glossary"
        />
      </div>

      {letters.length > 0 && (
        <div className="gw-glossary__alpha-nav">
          {letters.map((letter) => (
            <a key={letter} href={`#letter-${letter}`} className="gw-glossary__alpha-link">
              {letter}
            </a>
          ))}
        </div>
      )}

      {filtered.length === 0 && (
        <p className="gw-glossary__empty">No terms match your search. Try a different word.</p>
      )}

      {letters.map((letter) => (
        <section key={letter} id={`letter-${letter}`} className="gw-glossary__group">
          <h2 className="gw-glossary__letter">{letter}</h2>
          {grouped[letter].map((term) => (
            <div key={term.term} className="gw-glossary__entry">
              <div className="gw-glossary__term-line">
                <strong className="gw-glossary__term">{term.term}</strong>
                {term.full && term.full !== term.term && (
                  <span className="gw-glossary__full"> ({term.full})</span>
                )}
              </div>
              <p className="gw-glossary__definition">{term.definition}</p>
              {term.pages && term.pages.length > 0 && (
                <div className="gw-glossary__links">
                  <span className="gw-glossary__links-label">Used in:</span>
                  {term.pages.map((href) => (
                    <Link key={href} href={href} className="gw-glossary__page-link">
                      {PAGE_LABELS[href] ?? href.split("/").pop()}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </section>
      ))}
    </GWLayout>
  );
}
