import React from "react";
import Link from "next/link";
import { useRouter } from "next/router";

interface NavPage {
  label: string;
  href: string;
  phase2?: boolean;
}

const PAGES: NavPage[] = [
  { label: "Dashboard", href: "/generational-wealth" },
  { label: "EQIP", href: "/generational-wealth/eqip" },
  { label: "Financing", href: "/generational-wealth/financing" },
  { label: "Due Diligence", href: "/generational-wealth/due-diligence" },
  { label: "Contacts", href: "/generational-wealth/contacts" },
  { label: "Timeline", href: "/generational-wealth/timeline" },
  { label: "Glossary", href: "/generational-wealth/glossary" },
  { label: "Building", href: "/generational-wealth/building", phase2: true },
  { label: "Systems", href: "/generational-wealth/systems", phase2: true },
  { label: "Food Production", href: "/generational-wealth/food", phase2: true },
  { label: "Legal", href: "/generational-wealth/legal", phase2: true },
  { label: "Tax Strategy", href: "/generational-wealth/tax", phase2: true },
  { label: "Estate Planning", href: "/generational-wealth/estate", phase2: true },
  { label: "Insurance", href: "/generational-wealth/insurance", phase2: true },
  { label: "Business Structures", href: "/generational-wealth/business", phase2: true },
];

interface GWSidebarProps {
  className?: string;
}

const GWSidebar = ({ className }: GWSidebarProps) => {
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
          if (page.phase2) {
            return (
              <li key={page.href} className="gw-sidebar__item">
                <span className="gw-sidebar__link gw-sidebar__link--disabled">
                  {page.label}
                  <span className="gw-sidebar__coming-soon">(Coming Soon)</span>
                </span>
              </li>
            );
          }
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
