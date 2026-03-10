import React from "react";
import { render, screen } from "@testing-library/react";
import ChatGptGap from "@/components/containers/home/ChatGptGap";

// Consultant language that should NOT appear in the component
const CONSULTANT_TERMS = [
  "consultant",
  "consulting",
  "diagnose",
  "structural correction",
  "engagement",
  "deliverable",
  "synergy",
  "leverage your",
];

describe("ChatGptGap", () => {
  it("renders without crashing", () => {
    const { container } = render(<ChatGptGap />);
    expect(container).toBeTruthy();
  });

  it('contains "ChatGPT" related content', () => {
    render(<ChatGptGap />);
    expect(screen.getByText("Using ChatGPT")).toBeInTheDocument();
  });

  it("contains gap-related content about the difference", () => {
    render(<ChatGptGap />);
    expect(screen.getByText("THE DIFFERENCE")).toBeInTheDocument();
    expect(
      screen.getByText(
        /There's a Difference Between Using AI and Having AI Run Your Business/i
      )
    ).toBeInTheDocument();
  });

  it("has exactly 2 comparison columns (ChatGPT vs AI Infrastructure)", () => {
    const { container } = render(<ChatGptGap />);
    // One column has the "basic" class, one has the "infrastructure" class
    const basicColumn = container.querySelector(".chatgpt-gap__basic");
    const infraColumn = container.querySelector(".chatgpt-gap__infrastructure");
    expect(basicColumn).toBeInTheDocument();
    expect(infraColumn).toBeInTheDocument();

    // Verify the two column headers
    expect(screen.getByText("Using ChatGPT")).toBeInTheDocument();
    expect(screen.getByText("AI Infrastructure")).toBeInTheDocument();
  });

  it("shows drawbacks in the ChatGPT column with x-mark icons", () => {
    const { container } = render(<ChatGptGap />);
    const basicColumn = container.querySelector(".chatgpt-gap__basic");
    const xMarks = basicColumn?.querySelectorAll(".fa-xmark");
    expect(xMarks?.length).toBe(5);
  });

  it("shows benefits in the AI Infrastructure column with check icons", () => {
    const { container } = render(<ChatGptGap />);
    const infraColumn = container.querySelector(".chatgpt-gap__infrastructure");
    const checks = infraColumn?.querySelectorAll(".fa-check");
    expect(checks?.length).toBe(5);
  });

  it("does not contain consultant language in rendered output", () => {
    const { container } = render(<ChatGptGap />);
    const textContent = container.textContent?.toLowerCase() || "";

    CONSULTANT_TERMS.forEach((term) => {
      expect(textContent).not.toContain(term.toLowerCase());
    });
  });
});
