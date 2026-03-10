import React from "react";
import { render, screen } from "@testing-library/react";
import ServicesCarousel from "@/components/containers/home/ServicesCarousel";

// Mock Swiper components — use empty deps to avoid infinite loop
jest.mock("swiper/react", () => {
  const ReactMock = require("react");
  return {
    Swiper: ({
      children,
      onSwiper,
    }: {
      children: React.ReactNode;
      onSwiper?: (swiper: any) => void;
    }) => {
      const called = ReactMock.useRef(false);
      ReactMock.useEffect(() => {
        if (onSwiper && !called.current) {
          called.current = true;
          onSwiper({
            slidePrev: jest.fn(),
            slideNext: jest.fn(),
          });
        }
      });
      return <div data-testid="swiper-mock">{children}</div>;
    },
    SwiperSlide: ({ children }: { children: React.ReactNode }) => (
      <div data-testid="swiper-slide-mock">{children}</div>
    ),
  };
});

jest.mock("swiper/modules", () => ({
  Autoplay: jest.fn(),
  Navigation: jest.fn(),
}));

jest.mock("swiper/swiper-bundle.css", () => ({}));

// Consultant language that should NOT appear
const CONSULTANT_TERMS = [
  "consultant",
  "consulting",
  "diagnose",
  "structural correction",
  "synergy",
];

describe("ServicesCarousel", () => {
  it("renders without crashing", () => {
    const { container } = render(<ServicesCarousel />);
    expect(container).toBeTruthy();
  });

  it("renders exactly 3 services (not 7 old categories)", () => {
    render(<ServicesCarousel />);
    const slides = screen.getAllByTestId("swiper-slide-mock");
    expect(slides).toHaveLength(3);
  });

  it('renders "AI System Design" service', () => {
    render(<ServicesCarousel />);
    expect(screen.getByText("AI System Design")).toBeInTheDocument();
  });

  it('renders "Automation Infrastructure" service', () => {
    render(<ServicesCarousel />);
    expect(screen.getByText("Automation Infrastructure")).toBeInTheDocument();
  });

  it('renders "AI Training & Education" service', () => {
    render(<ServicesCarousel />);
    expect(
      screen.getByText("AI Training & Education")
    ).toBeInTheDocument();
  });

  it("services match the expected 3: AI System Design, Automation Infrastructure, AI Training & Education", () => {
    render(<ServicesCarousel />);
    const expectedServices = [
      "AI System Design",
      "Automation Infrastructure",
      "AI Training & Education",
    ];
    expectedServices.forEach((name) => {
      expect(screen.getByText(name)).toBeInTheDocument();
    });
  });

  it("does not contain consultant language", () => {
    const { container } = render(<ServicesCarousel />);
    const textContent = container.textContent?.toLowerCase() || "";

    CONSULTANT_TERMS.forEach((term) => {
      expect(textContent).not.toContain(term.toLowerCase());
    });
  });

  it("each service shows its list items", () => {
    render(<ServicesCarousel />);
    // Spot-check some list items from each service
    expect(
      screen.getByText(
        "Custom AI agents that handle real work, not demos"
      )
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        "n8n workflow builds connecting your entire stack end to end"
      )
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        "AI readiness audits that tell you where you actually stand"
      )
    ).toBeInTheDocument();
  });

  it("renders navigation buttons for prev and next", () => {
    render(<ServicesCarousel />);
    expect(
      screen.getByRole("button", { name: /previous item/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /next item/i })
    ).toBeInTheDocument();
  });

  it("shows numbered labels (01, 02, 03)", () => {
    render(<ServicesCarousel />);
    expect(screen.getByText("01")).toBeInTheDocument();
    expect(screen.getByText("02")).toBeInTheDocument();
    expect(screen.getByText("03")).toBeInTheDocument();
  });
});
