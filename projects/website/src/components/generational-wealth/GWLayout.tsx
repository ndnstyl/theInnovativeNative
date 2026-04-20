import React from "react";
import Head from "next/head";
import Layout from "@/components/layout/Layout";
import PasswordGate from "./PasswordGate";
import GWSidebar from "./GWSidebar";
import GWBottomNav from "./GWBottomNav";
import JourneyProgress from "./JourneyProgress";
import PrintButton from "./PrintButton";

interface GWLayoutProps {
  children: React.ReactNode;
  title: string;
  lastVerified?: string;
  readingTime?: string;
  printable?: boolean;
}

const GWLayout = ({
  children,
  title,
  lastVerified,
  readingTime,
  printable = false,
}: GWLayoutProps) => {
  return (
    <Layout header={1} footer={1}>
      <Head>
        <title>{title} | Generational Wealth — The Innovative Native</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>
      <PasswordGate>
        <div className="gw-layout">
          <div className="gw-layout__sidebar">
            <GWSidebar />
          </div>
          <div className="gw-layout__main">
            <div className="gw-layout__content-inner gw-content">
              <JourneyProgress />
              {(lastVerified || readingTime || printable) && (
                <div className="gw-layout__meta">
                  {lastVerified && (
                    <span className="gw-layout__meta-item">
                      <i className="fa-sharp fa-solid fa-rotate" />
                      Verified {lastVerified}
                    </span>
                  )}
                  {readingTime && (
                    <span className="gw-layout__meta-item">
                      <i className="fa-sharp fa-solid fa-clock" />
                      {readingTime} read
                    </span>
                  )}
                  {printable && <PrintButton />}
                </div>
              )}
              {children}
              <div className="gw-layout__disclaimer">
                This guide is for informational purposes only. It is not legal,
                financial, or tax advice. Program rules, payment rates, and
                deadlines change — verify everything with the relevant agency or
                a licensed professional before acting.
              </div>
            </div>
          </div>
        </div>
        <GWBottomNav />
      </PasswordGate>
    </Layout>
  );
};

export default GWLayout;
