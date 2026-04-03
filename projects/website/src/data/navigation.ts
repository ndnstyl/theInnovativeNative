// =============================================================================
// Navigation Data — The Innovative Native
// Single source of truth for site-wide navigation.
// =============================================================================

interface NavItem {
  label: string;
  href: string;
  isCta: boolean;
  children: NavItem[] | null;
}

export const navItems: NavItem[] = [
  {
    label: "How It Works",
    href: "/#chatgpt-gap",
    isCta: false,
    children: null,
  },
  {
    label: "Our Work",
    href: "/portfolio",
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
    label: "Blog",
    href: "/blog",
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
