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
  {
    label: "What We Build",
    href: "/#chatgpt-gap",
    isCta: false,
    children: null,
  },
  {
    label: "Proof Systems",
    href: "/#proof-systems",
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
    label: "About",
    href: "/professionalExperience",
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
