// =============================================================================
// Navigation Data — The Innovative Native
// Single source of truth for site-wide navigation.
// =============================================================================

export interface NavItem {
  label: string;
  href: string;
  isCta: boolean;
  children: NavItem[] | null;
}

export const navItems: NavItem[] = [
  // Original pages
  {
    label: "Home",
    href: "/",
    isCta: false,
    children: null,
  },
  {
    label: "Portfolio",
    href: "/portfolio",
    isCta: false,
    children: null,
  },
  {
    label: "Templates",
    href: "/templates",
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
    label: "Experience",
    href: "/professionalExperience",
    isCta: false,
    children: null,
  },
  // New additions
  {
    label: "Proof Systems",
    href: "/#proof-systems",
    isCta: false,
    children: null,
  },
  {
    label: "Classroom",
    href: "/classroom",
    isCta: false,
    children: null,
  },
  // CTA
  {
    label: "Book a Call",
    href: "https://calendly.com/mike-buildmytribe/ai-discovery-call",
    isCta: true,
    children: null,
  },
];
