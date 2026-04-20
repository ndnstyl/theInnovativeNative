import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";

interface MorePage {
  label: string;
  href: string;
  phase2?: boolean;
}

const MORE_PAGES: MorePage[] = [
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

const PRIMARY_NAV = [
  { label: "EQIP", href: "/generational-wealth/eqip", icon: "fa-solid fa-leaf" },
  { label: "Money", href: "/generational-wealth/financing", icon: "fa-solid fa-dollar-sign" },
  { label: "Checklist", href: "/generational-wealth/due-diligence", icon: "fa-solid fa-list-check" },
  { label: "Contacts", href: "/generational-wealth/contacts", icon: "fa-solid fa-address-book" },
];

const GWBottomNav = () => {
  const [moreOpen, setMoreOpen] = useState(false);
  const router = useRouter();

  const toggleMore = () => setMoreOpen((prev) => !prev);
  const closeMore = () => setMoreOpen(false);

  return (
    <>
      {moreOpen && (
        <>
          <div
            className="gw-bottom-nav__overlay-backdrop"
            onClick={closeMore}
          />
          <div className="gw-bottom-nav__overlay">
            <p className="gw-bottom-nav__overlay-heading">More Pages</p>
            <ul className="gw-bottom-nav__overlay-list">
              {MORE_PAGES.map((page) => (
                <li key={page.href}>
                  {page.phase2 ? (
                    <span className="gw-bottom-nav__overlay-link gw-bottom-nav__overlay-link--disabled">
                      {page.label}{" "}
                      <span style={{ fontSize: "0.7rem", opacity: 0.5 }}>(Coming Soon)</span>
                    </span>
                  ) : (
                    <Link
                      href={page.href}
                      className={`gw-bottom-nav__overlay-link${
                        router.asPath === page.href
                          ? " gw-bottom-nav__overlay-link--active"
                          : ""
                      }`}
                      onClick={closeMore}
                    >
                      {page.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </>
      )}
      <div className="gw-bottom-nav">
        <div className="gw-bottom-nav__items">
          {PRIMARY_NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`gw-bottom-nav__item${
                router.asPath === item.href ? " gw-bottom-nav__item--active" : ""
              }`}
            >
              <i className={`fa-sharp ${item.icon}`} />
              {item.label}
            </Link>
          ))}
          <button
            className={`gw-bottom-nav__item${moreOpen ? " gw-bottom-nav__item--active" : ""}`}
            onClick={toggleMore}
            type="button"
          >
            <i className="fa-sharp fa-solid fa-ellipsis" />
            More
          </button>
        </div>
      </div>
    </>
  );
};

export default GWBottomNav;
