import React from "react";
import { render, screen } from "@testing-library/react";
import BrandConnector from "@/components/common/BrandConnector";
import { proofSystems } from "@/data/homepage";

describe("BrandConnector", () => {
  it("renders without crashing", () => {
    const { container } = render(
      <BrandConnector currentVertical="legal" />
    );
    expect(container).toBeTruthy();
  });

  it("renders links to other proof system pages (excluding current vertical)", () => {
    render(<BrandConnector currentVertical="legal" />);
    // When current vertical is "legal", the other 2 systems should show
    const otherSystems = proofSystems.filter((s) => s.vertical !== "legal");
    otherSystems.forEach((system) => {
      expect(screen.getByText(system.name)).toBeInTheDocument();
    });
  });

  it("each cross-link has a valid href", () => {
    render(<BrandConnector currentVertical="legal" />);
    const otherSystems = proofSystems.filter((s) => s.vertical !== "legal");
    otherSystems.forEach((system) => {
      const link = screen.getByText(system.name).closest("a");
      expect(link).toHaveAttribute("href", system.href);
    });
  });

  it("does not show the current vertical's system in cross-links", () => {
    render(<BrandConnector currentVertical="legal" />);
    const legalSystem = proofSystems.find((s) => s.vertical === "legal");
    // The legal system name should NOT appear as a cross-link card title
    // (it might appear in the main brand text, so check specifically in the grid)
    if (legalSystem) {
      const linkCards = screen.queryAllByText(legalSystem.name);
      // If it appears, it should not be inside a cross-link <a> tag
      linkCards.forEach((card) => {
        const parentLink = card.closest("a");
        if (parentLink) {
          expect(parentLink.getAttribute("href")).not.toBe(legalSystem.href);
        }
      });
    }
  });

  it('shows "Built by The Innovative Native" brand attribution', () => {
    render(<BrandConnector currentVertical="legal" />);
    expect(
      screen.getByText("Built by The Innovative Native")
    ).toBeInTheDocument();
  });

  it('has a "back to main" link pointing to /', () => {
    render(<BrandConnector currentVertical="legal" />);
    const logo = screen.getByAltText("The Innovative Native");
    const homeLink = logo.closest("a");
    expect(homeLink).toHaveAttribute("href", "/");
  });

  it('each cross-link shows "See This System" text', () => {
    render(<BrandConnector currentVertical="legal" />);
    const otherSystems = proofSystems.filter((s) => s.vertical !== "legal");
    const seeLinks = screen.getAllByText(/See This System/);
    expect(seeLinks).toHaveLength(otherSystems.length);
  });

  it("hides cross-links when showCrossLinks is false", () => {
    render(
      <BrandConnector currentVertical="legal" showCrossLinks={false} />
    );
    const otherSystems = proofSystems.filter((s) => s.vertical !== "legal");
    otherSystems.forEach((system) => {
      expect(screen.queryByText(system.name)).not.toBeInTheDocument();
    });
  });

  it("shows descriptions for each cross-linked system", () => {
    render(<BrandConnector currentVertical="creative" />);
    const otherSystems = proofSystems.filter(
      (s) => s.vertical !== "creative"
    );
    otherSystems.forEach((system) => {
      expect(screen.getByText(system.description)).toBeInTheDocument();
    });
  });
});
