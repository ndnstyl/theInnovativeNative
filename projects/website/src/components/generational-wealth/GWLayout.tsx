import React from "react";
import Head from "next/head";
import Layout from "@/components/layout/Layout";
import PasswordGate from "./PasswordGate";
import GWSidebar from "./GWSidebar";
import GWBottomNav from "./GWBottomNav";
import GWSearchBar from "./GWSearchBar";
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
          <div className="gw-layout__sidebar" data-pagefind-ignore>
            <GWSidebar />
          </div>
          <div className="gw-layout__main">
            <div
              className="gw-layout__content-inner gw-content"
              data-pagefind-body
            >
              <div data-pagefind-ignore>
                <GWSearchBar />
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
              </div>
              {children}
              <div className="gw-layout__disclaimer" data-pagefind-ignore>
                This guide is for informational purposes only. It is not legal,
                financial, or tax advice. Program rules, payment rates, and
                deadlines change — verify everything with the relevant agency or
                a licensed professional before acting.
              </div>
            </div>
          </div>
        </div>
        <div data-pagefind-ignore>
          <GWBottomNav />
        </div>
      </PasswordGate>
    </Layout>
  );
};

export default GWLayout;
