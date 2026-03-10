import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import ProofSystems from "@/components/containers/home/ProofSystems";
import { proofSystems } from "@/data/homepage";

describe("ProofSystems", () => {
  beforeEach(() => {
    (window as any).Calendly = {
      initPopupWidget: jest.fn(),
    };
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("renders without crashing", () => {
    const { container } = render(<ProofSystems />);
    expect(container).toBeTruthy();
  });

  it("renders 3 proof system cards (matching data)", () => {
    render(<ProofSystems />);
    // Each proof system has a name rendered as an h3
    proofSystems.forEach((system) => {
      expect(screen.getByText(system.name)).toBeInTheDocument();
    });
    expect(proofSystems).toHaveLength(3);
  });

  it("each card has a link with correct href", () => {
    render(<ProofSystems />);
    proofSystems.forEach((system) => {
      const link = screen.getAllByText("See How It Works →").find((el) => {
        return el.closest("a")?.getAttribute("href") === system.href;
      });
      expect(link).toBeTruthy();
    });
  });

  it("each card shows a price", () => {
    render(<ProofSystems />);
    proofSystems.forEach((system) => {
      expect(screen.getByText(system.price)).toBeInTheDocument();
    });
  });

  it("CTA card exists with the correct heading", () => {
    render(<ProofSystems />);
    expect(
      screen.getByText(/Don't See Your Vertical\?/i)
    ).toBeInTheDocument();
  });

  it("CTA card has a Calendly button", () => {
    render(<ProofSystems />);
    const ctaButton = screen.getByRole("button", {
      name: /Book a Discovery Call/i,
    });
    expect(ctaButton).toBeInTheDocument();
  });

  it("Calendly.initPopupWidget is called on CTA button click", () => {
    render(<ProofSystems />);
    const ctaButton = screen.getByRole("button", {
      name: /Book a Discovery Call/i,
    });
    fireEvent.click(ctaButton);
    expect((window as any).Calendly.initPopupWidget).toHaveBeenCalledWith({
      url: "https://calendly.com/mike-buildmytribe/ai-discovery-call",
    });
  });

  it("renders the section heading", () => {
    render(<ProofSystems />);
    expect(
      screen.getByText(/Here's What AI Infrastructure Actually Looks Like/i)
    ).toBeInTheDocument();
  });
});
