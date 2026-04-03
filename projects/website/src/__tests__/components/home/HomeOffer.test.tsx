import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import HomeOffer from "@/components/containers/home/HomeOffer";
import { serviceOfferings } from "@/data/homepage";
import { CALENDLY_URL } from "@/lib/constants";

// Consultant language that should NOT appear
const CONSULTANT_TERMS = [
  "consultant",
  "consulting",
  "diagnose",
  "structural correction",
  "synergy",
];

describe("HomeOffer", () => {
  beforeEach(() => {
    (window as any).Calendly = {
      initPopupWidget: jest.fn(),
    };
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("renders without crashing", () => {
    const { container } = render(<HomeOffer />);
    expect(container).toBeTruthy();
  });

  it("renders 3 service offerings", () => {
    const { container } = render(<HomeOffer />);
    const offeringCards = container.querySelectorAll(".offer__cta-single");
    expect(offeringCards).toHaveLength(3);
  });

  it("renders each offering name", () => {
    render(<HomeOffer />);
    serviceOfferings.forEach((offering) => {
      expect(screen.getByText(offering.name)).toBeInTheDocument();
    });
  });

  it("each offering shows its capabilities list", () => {
    render(<HomeOffer />);
    serviceOfferings.forEach((offering) => {
      offering.capabilities.forEach((cap) => {
        expect(screen.getByText(cap)).toBeInTheDocument();
      });
    });
  });

  it("does not contain consultant language in any text content", () => {
    const { container } = render(<HomeOffer />);
    const textContent = container.textContent?.toLowerCase() || "";

    CONSULTANT_TERMS.forEach((term) => {
      expect(textContent).not.toContain(term.toLowerCase());
    });
  });

  it("Calendly button is present", () => {
    render(<HomeOffer />);
    const ctaButton = screen.getByRole("button", {
      name: /Book Discovery Call/i,
    });
    expect(ctaButton).toBeInTheDocument();
  });

  it("Calendly button is functional", () => {
    render(<HomeOffer />);
    const ctaButton = screen.getByRole("button", {
      name: /Book Discovery Call/i,
    });
    fireEvent.click(ctaButton);
    expect((window as any).Calendly.initPopupWidget).toHaveBeenCalledWith({
      url: CALENDLY_URL,
    });
  });

  it("displays numbered offerings (01, 02, 03)", () => {
    render(<HomeOffer />);
    expect(screen.getByText("01")).toBeInTheDocument();
    expect(screen.getByText("02")).toBeInTheDocument();
    expect(screen.getByText("03")).toBeInTheDocument();
  });
});
