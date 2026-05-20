import React from "react";
import { render, screen } from "@testing-library/react";
import CaseStudies from "@/components/containers/home/CaseStudies";

// Swiper needs to be mocked since it uses browser APIs
jest.mock("swiper/react", () => ({
  Swiper: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="swiper-mock">{children}</div>
  ),
  SwiperSlide: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="swiper-slide-mock">{children}</div>
  ),
}));

jest.mock("swiper/modules", () => ({
  Autoplay: jest.fn(),
}));

jest.mock("swiper/swiper-bundle.css", () => ({}));

// Consultant language that should NOT appear
const CONSULTANT_TERMS = [
  "diagnose",
  "structural correction",
  "consulting engagement",
];

describe("CaseStudies", () => {
  it("renders without crashing", () => {
    const { container } = render(<CaseStudies />);
    expect(container).toBeTruthy();
  });

  it("renders 4 case study cards", () => {
    const { container } = render(<CaseStudies />);
    const cards = container.querySelectorAll(".portfolio__single");
    expect(cards).toHaveLength(4);
  });

  it("renders case study titles", () => {
    render(<CaseStudies />);
    expect(
      screen.getByText("Automated Acquisition Pipeline")
    ).toBeInTheDocument();
    expect(screen.getByText("Signal Extraction System")).toBeInTheDocument();
    expect(
      screen.getByText("AI-Powered Revenue Recovery")
    ).toBeInTheDocument();
    expect(
      screen.getByText("Workflow Automation Rollout")
    ).toBeInTheDocument();
  });

  it("renders result metrics for each case study", () => {
    render(<CaseStudies />);
    expect(
      screen.getByText("25-30% cost reduction via AI-optimized spend")
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        "65% fewer vanity KPIs, 22% operational efficiency gain"
      )
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        "35% incremental volume from automated detection"
      )
    ).toBeInTheDocument();
    expect(
      screen.getByText("22% efficiency gain in 2 quarters")
    ).toBeInTheDocument();
  });

  it("does not contain consultant language", () => {
    const { container } = render(<CaseStudies />);
    const textContent = container.textContent?.toLowerCase() || "";

    CONSULTANT_TERMS.forEach((term) => {
      expect(textContent).not.toContain(term.toLowerCase());
    });
  });

  it("each case study card has a portfolio link", () => {
    render(<CaseStudies />);
    // There are multiple links per card (image, arrow, title) all pointing to /portfolio
    const portfolioLinks = screen.getAllByRole("link").filter(
      (link) => link.getAttribute("href") === "/portfolio"
    );
    // At least 4 cards with links, plus the swiper "systems deployed" links
    expect(portfolioLinks.length).toBeGreaterThanOrEqual(4);
  });
});
