import React from "react";
import Link from "next/link";
import { proofSystems } from "@/data/homepage";

interface BrandConnectorProps {
  currentVertical: string;
  showCrossLinks?: boolean;
}

const BrandConnector = ({
  currentVertical,
  showCrossLinks = true,
}: BrandConnectorProps) => {
  const otherSystems = proofSystems.filter(
    (s) => s.vertical !== currentVertical
  );

  return (
    <section
      className="section brand-connector"
      style={{
        background: "#0A0A14",
        padding: "80px 0",
        borderTop: "1px solid rgba(0, 255, 255, 0.12)",
      }}
    >
      <div className="container" style={{ maxWidth: "960px", margin: "0 auto", padding: "0 20px" }}>
        {/* Brand attribution */}
        <div style={{ textAlign: "center", marginBottom: showCrossLinks ? "48px" : "0" }}>
          <Link
            href="/"
            style={{
              display: "inline-block",
              marginBottom: "16px",
            }}
          >
            <img
              src="/images/logo.png"
              alt="The Innovative Native"
              style={{ height: "40px", width: "auto" }}
            />
          </Link>
          <h3
            style={{
              color: "#F5F5F5",
              fontSize: "1.5rem",
              fontWeight: 600,
              margin: "0 0 8px 0",
            }}
          >
            Built by The Innovative Native
          </h3>
          <p
            style={{
              color: "rgba(245, 245, 245, 0.7)",
              fontSize: "1rem",
              margin: 0,
              lineHeight: 1.6,
            }}
          >
            This is one of the AI systems we&apos;ve built. See what else
            we&apos;re deploying.
          </p>
        </div>

        {/* Cross-links to other proof systems */}
        {showCrossLinks && otherSystems.length > 0 && (
          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                otherSystems.length === 1 ? "1fr" : "repeat(auto-fit, minmax(280px, 1fr))",
              gap: "24px",
            }}
          >
            {otherSystems.map((system) => (
              <Link
                key={system.id}
                href={system.href}
                style={{
                  display: "block",
                  background: "rgba(245, 245, 245, 0.04)",
                  border: "1px solid rgba(0, 255, 255, 0.1)",
                  borderRadius: "8px",
                  padding: "24px",
                  textDecoration: "none",
                  transition: "border-color 0.2s ease, background 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "rgba(0, 255, 255, 0.35)";
                  e.currentTarget.style.background = "rgba(245, 245, 245, 0.06)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "rgba(0, 255, 255, 0.1)";
                  e.currentTarget.style.background = "rgba(245, 245, 245, 0.04)";
                }}
              >
                <h4
                  style={{
                    color: "#F5F5F5",
                    fontSize: "1.125rem",
                    fontWeight: 600,
                    margin: "0 0 8px 0",
                  }}
                >
                  {system.name}
                </h4>
                <p
                  style={{
                    color: "rgba(245, 245, 245, 0.6)",
                    fontSize: "0.875rem",
                    lineHeight: 1.5,
                    margin: "0 0 16px 0",
                  }}
                >
                  {system.description}
                </p>
                <span
                  style={{
                    color: "#00FFFF",
                    fontSize: "0.875rem",
                    fontWeight: 500,
                  }}
                >
                  See This System &rarr;
                </span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default BrandConnector;
