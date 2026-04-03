import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import ValueLadder from "@/components/containers/home/ValueLadder";
import { valueLadderTiers } from "@/data/homepage";
import { CALENDLY_URL } from "@/lib/constants";

describe("ValueLadder", () => {
  beforeEach(() => {
    (window as any).Calendly = {
      initPopupWidget: jest.fn(),
    };
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("renders without crashing", () => {
    const { container } = render(<ValueLadder />);
    expect(container).toBeTruthy();
  });

  it("renders exactly 4 tiers", () => {
    const { container } = render(<ValueLadder />);
    const tiers = container.querySelectorAll(".value-ladder__tier");
    expect(tiers).toHaveLength(4);
  });

  it("tiers are in correct order (Learn, Deploy, Pilot, Build)", () => {
    const { container } = render(<ValueLadder />);
    const tierNames = container.querySelectorAll(".value-ladder__tier h3");
    const names = Array.from(tierNames).map((el) => el.textContent);
    expect(names).toEqual(["Learn", "Deploy", "Pilot", "Build"]);
  });

  it("Free tier (Learn) has a link CTA, not a Calendly button", () => {
    render(<ValueLadder />);
    // The Learn tier's CTA is "Start Learning" which links to /blog
    const learnLink = screen.getByText("Start Learning");
    expect(learnLink.tagName.toLowerCase()).toBe("a");
    expect(learnLink.getAttribute("href")).toBe("/blog");
  });

  it("Deploy tier has a link CTA to #proof-systems", () => {
    render(<ValueLadder />);
    const deployLink = screen.getByText("Get a Blueprint");
    expect(deployLink.tagName.toLowerCase()).toBe("a");
    expect(deployLink.getAttribute("href")).toBe("#proof-systems");
  });

  it("Pilot tier has a Calendly button", () => {
    render(<ValueLadder />);
    const pilotButton = screen.getByText("Book a Pilot Call");
    expect(pilotButton.tagName.toLowerCase()).toBe("button");
  });

  it("Build tier has a Calendly button", () => {
    render(<ValueLadder />);
    const buildButton = screen.getByText("Book a Discovery Call");
    expect(buildButton.tagName.toLowerCase()).toBe("button");
  });

  it("Calendly button works for Pilot tier", () => {
    render(<ValueLadder />);
    const pilotButton = screen.getByText("Book a Pilot Call");
    fireEvent.click(pilotButton);
    expect((window as any).Calendly.initPopupWidget).toHaveBeenCalledWith({
      url: CALENDLY_URL,
    });
  });

  it("Calendly button works for Build tier", () => {
    render(<ValueLadder />);
    const buildButton = screen.getByText("Book a Discovery Call");
    fireEvent.click(buildButton);
    expect((window as any).Calendly.initPopupWidget).toHaveBeenCalledWith({
      url: CALENDLY_URL,
    });
  });

  it("each tier shows its price range", () => {
    render(<ValueLadder />);
    valueLadderTiers.forEach((tier) => {
      expect(screen.getByText(tier.priceRange)).toBeInTheDocument();
    });
  });

  it("each tier shows its description", () => {
    render(<ValueLadder />);
    valueLadderTiers.forEach((tier) => {
      expect(screen.getByText(tier.description)).toBeInTheDocument();
    });
  });
});
