// =============================================================================
// Navigation Data — The Innovative Native
// Single source of truth for site-wide navigation.
// =============================================================================

import { CALENDLY_URL } from '@/lib/constants';

interface NavItem {
  label: string;
  href: string;
  isCta: boolean;
  children: NavItem[] | null;
}

export const navItems: NavItem[] = [
  {
    label: "Portfolio",
    href: "/portfolio",
    isCta: false,
    children: null,
  },
  {
    label: "Blog",
    href: "/blog",
    isCta: false,
    children: null,
  },
  {
    label: "Learn",
    href: "/classroom",
    isCta: false,
    children: null,
  },
  {
    label: "TrendPilot",
    href: "/trendpilot",
    isCta: false,
    children: null,
  },
  {
    label: "Resources",
    href: "/resources",
    isCta: false,
    children: null,
  },
  {
    label: "Experience",
    href: "/professionalExperience",
    isCta: false,
    children: null,
  },
  {
    label: "Newsletter",
    href: "/newsletter",
    isCta: false,
    children: null,
  },
  {
    label: "Login",
    href: "/classroom",
    isCta: false,
    children: null,
  },
  // CTA
  {
    label: "Book a Call",
    href: CALENDLY_URL,
    isCta: true,
    children: null,
  },
];
