import React from "react";
import Link from "next/link";
import { useRouter } from "next/router";

interface NavPage {
  label: string;
  href: string;
}

const PAGES: NavPage[] = [
  { label: "Dashboard", href: "/generational-wealth" },
  { label: "EQIP & Cost-Share", href: "/generational-wealth/eqip" },
  { label: "Financing", href: "/generational-wealth/financing" },
  { label: "Due Diligence", href: "/generational-wealth/due-diligence" },
  { label: "Legal Structure", href: "/generational-wealth/legal-structure" },
  { label: "Timber as Asset", href: "/generational-wealth/timber" },
  { label: "Finding Land", href: "/generational-wealth/find-land" },
  { label: "The Vision", href: "/generational-wealth/vision" },
  { label: "Building", href: "/generational-wealth/building" },
  { label: "Systems", href: "/generational-wealth/systems" },
  { label: "Cooling", href: "/generational-wealth/cooling" },
  { label: "Food Production", href: "/generational-wealth/food" },
  { label: "The Compound", href: "/generational-wealth/compound" },
  { label: "OK vs TX", href: "/generational-wealth/oklahoma-vs-texas" },
  { label: "Risks", href: "/generational-wealth/risks" },
  { label: "Contacts", href: "/generational-wealth/contacts" },
  { label: "Timeline", href: "/generational-wealth/timeline" },
  { label: "Glossary", href: "/generational-wealth/glossary" },
];

const GWSidebar = ({ className }: { className?: string }) => {
  const router = useRouter();

  return (
    <nav className={`gw-sidebar${className ? ` ${className}` : ""}`}>
      <Link href="/generational-wealth" className="gw-sidebar__back">
        <i className="fa-sharp fa-solid fa-arrow-left" />
        Back to Dashboard
      </Link>
      <div className="gw-sidebar__divider" />
      <span className="gw-sidebar__label">Pages</span>
      <ul className="gw-sidebar__list">
        {PAGES.map((page) => {
          const isActive = router.asPath === page.href;
          return (
            <li key={page.href} className="gw-sidebar__item">
              <Link
                href={page.href}
                className={`gw-sidebar__link${isActive ? " gw-sidebar__link--active" : ""}`}
              >
                {page.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

export default GWSidebar;
