import React from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useAuth } from "@/contexts/AuthContext";

/** Skool-style community tab navigation data */
const COMMUNITY_TABS = [
  { label: "Community", href: "/community" },
  { label: "Classroom", href: "/classroom" },
  { label: "Calendar", href: "/community/calendar" },
  { label: "Members", href: "/members" },
  { label: "Leaderboards", href: "/community/leaderboard" },
  { label: "About", href: "/community/about" },
] as const;

/**
 * Secondary tab navigation bar (Skool-style).
 * Renders below the primary header for authenticated users only.
 * Active tab determined by current route pathname.
 */
const HeaderTwo = () => {
  const { session } = useAuth();
  const router = useRouter();

  // Only render for authenticated users
  if (!session) return null;

  const currentPath = router.pathname;

  return (
    <nav className="community-tab-nav" aria-label="Community navigation">
      <div className="community-tab-nav__inner" role="tablist">
        {COMMUNITY_TABS.map((tab) => {
          // Determine active state: exact match or starts-with for nested routes
          const isActive =
            currentPath === tab.href ||
            (tab.href !== "/community" && currentPath.startsWith(tab.href)) ||
            (tab.href === "/community" && currentPath === "/community");

          return (
            <Link
              key={tab.href}
              href={tab.href}
              role="tab"
              aria-selected={isActive}
              className={`community-tab-nav__tab${isActive ? " community-tab-nav__tab--active" : ""}`}
            >
              {tab.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default HeaderTwo;
