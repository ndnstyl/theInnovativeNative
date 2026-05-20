import React from "react";
import { render, screen } from "@testing-library/react";
import Home from "@/pages/index";

// Mock Layout to just render children (avoids GSAP/VanillaTilt/SplitType issues)
jest.mock("@/components/layout/Layout", () => {
  return function MockLayout({ children }: { children: React.ReactNode }) {
    return <div data-testid="layout">{children}</div>;
  };
});

// Mock HomeOneBanner
jest.mock("@/components/layout/banner/HomeOneBanner", () => {
  return function MockBanner() {
    return <div data-testid="home-banner">HomeOneBanner</div>;
  };
});

// Mock child section components — render as identifiable divs
jest.mock("@/components/containers/home/ChatGptGap", () => {
  return function MockChatGptGap() {
    return <div data-testid="chatgpt-gap">ChatGptGap</div>;
  };
});

jest.mock("@/components/containers/home/ProofSystems", () => {
  return function MockProofSystems() {
    return <div data-testid="proof-systems">ProofSystems</div>;
  };
});

jest.mock("@/components/containers/home/CaseStudies", () => {
  return function MockCaseStudies() {
    return <div data-testid="case-studies">CaseStudies</div>;
  };
});

jest.mock("@/components/containers/home/Testimonials", () => {
  return function MockTestimonials() {
    return <div data-testid="testimonials">Testimonials</div>;
  };
});

jest.mock("@/components/containers/home/HomeOffer", () => {
  return function MockHomeOffer() {
    return <div data-testid="home-offer">HomeOffer</div>;
  };
});

jest.mock("@/components/containers/home/ValueLadder", () => {
  return function MockValueLadder() {
    return <div data-testid="value-ladder">ValueLadder</div>;
  };
});

// Mock next/head to capture meta tags
jest.mock("next/head", () => {
  return function MockHead({ children }: { children: React.ReactNode }) {
    return <div data-testid="head-mock">{children}</div>;
  };
});

// Consultant language that should NOT appear
const CONSULTANT_TERMS = [
  "consultant",
  "consulting",
  "diagnose",
  "structural correction",
  "synergy",
];

describe("Homepage (index)", () => {
  beforeEach(() => {
    (window as any).Calendly = {
      initPopupWidget: jest.fn(),
    };
  });

  it("renders without crashing", () => {
    const { container } = render(<Home />);
    expect(container).toBeTruthy();
  });

  it("contains correct meta title", () => {
    render(<Home />);
    const title = screen.getByText(
      "AI Systems for Business | The Innovative Native"
    );
    expect(title).toBeInTheDocument();
  });

  it("contains correct meta description", () => {
    render(<Home />);
    const metaDesc = document.querySelector(
      'meta[name="description"]'
    ) as HTMLMetaElement | null;
    // Since we mock Head, look for the meta tag in the rendered output
    const { container } = render(<Home />);
    const headMock = container.querySelector('[data-testid="head-mock"]');
    const meta = headMock?.querySelector(
      'meta[name="description"]'
    ) as HTMLMetaElement | null;
    if (meta) {
      expect(meta.getAttribute("content")).toContain(
        "AI infrastructure"
      );
    }
  });

  it("renders all homepage sections in order", () => {
    const { container } = render(<Home />);

    const sectionIds = [
      "home-banner",
      "chatgpt-gap",
      "proof-systems",
      "case-studies",
      "testimonials",
      "home-offer",
      "value-ladder",
    ];

    // Verify all sections exist
    sectionIds.forEach((id) => {
      expect(screen.getByTestId(id)).toBeInTheDocument();
    });

    // Verify order by checking DOM position
    const allTestIds = Array.from(
      container.querySelectorAll("[data-testid]")
    ).map((el) => el.getAttribute("data-testid"));

    let lastIndex = -1;
    sectionIds.forEach((id) => {
      const currentIndex = allTestIds.indexOf(id);
      expect(currentIndex).toBeGreaterThan(lastIndex);
      lastIndex = currentIndex;
    });
  });

  it('CTA section has "Book a Discovery Call" button', () => {
    render(<Home />);
    const ctaButton = screen.getByRole("button", {
      name: /Book a Discovery Call/i,
    });
    expect(ctaButton).toBeInTheDocument();
  });

  it('About section has "THE BUILDER" text', () => {
    render(<Home />);
    expect(screen.getByText("THE BUILDER")).toBeInTheDocument();
  });

  it('About section has "Who Builds This" heading', () => {
    render(<Home />);
    expect(screen.getByText("Who Builds This")).toBeInTheDocument();
  });

  it('About section has "See the Full Background" link', () => {
    render(<Home />);
    const bgLink = screen.getByText("See the Full Background");
    expect(bgLink).toBeInTheDocument();
    expect(bgLink.closest("a")).toHaveAttribute(
      "href",
      "/professionalExperience"
    );
  });

  it("does not contain consultant language anywhere in rendered output", () => {
    const { container } = render(<Home />);
    const textContent = container.textContent?.toLowerCase() || "";

    CONSULTANT_TERMS.forEach((term) => {
      expect(textContent).not.toContain(term.toLowerCase());
    });
  });

  it("CTA section describes what to expect", () => {
    render(<Home />);
    expect(
      screen.getByText(/Let's Build Your AI System/i)
    ).toBeInTheDocument();
  });
});
