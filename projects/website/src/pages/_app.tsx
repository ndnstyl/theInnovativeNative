import React, { Suspense, useEffect } from "react";
import type { AppProps } from "next/app";
import Head from "next/head";
import Script from "next/script";
import { useRouter } from "next/router";
import { AuthProvider } from "@/contexts/AuthContext";
import { ToastProvider } from "@/components/common/ToastProvider";
import ErrorBoundary from "@/components/common/ErrorBoundary";
import OfflineBanner from "@/components/common/OfflineBanner";
import AnalyticsProvider from "@/components/common/AnalyticsProvider";
import CookieConsent from "@/components/common/CookieConsent";
import { logger } from "@/lib/logger";
import OrganizationSchema from "@/components/common/OrganizationSchema";

// bootstrap
import "bootstrap/dist/css/bootstrap.min.css";

// font awesome 6
import "public/icons/font-awesome/css/all.css";

// custom icons
import "public/icons/glyphter/css/xpovio.css";

// main scss
import "@/styles/main.scss";

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();

  // Global error handlers
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Clean up stale auth key from previous config
    localStorage.removeItem('tin-auth');

    // Catch unhandled promise rejections
    const handleRejection = (event: PromiseRejectionEvent) => {
      logger.error('Global', 'unhandledRejection', event.reason, { url: window.location.pathname });
    };

    window.addEventListener('unhandledrejection', handleRejection);
    return () => window.removeEventListener('unhandledrejection', handleRejection);
  }, []);

  // Global: detect Supabase recovery tokens and redirect to reset-password page
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const hash = window.location.hash;
    if (hash && hash.includes('type=recovery') && !router.pathname.includes('reset-password')) {
      window.location.href = '/auth/reset-password' + hash;
    }
  }, [router.pathname]);

  return (
    <ToastProvider>
      <AuthProvider>
        <ErrorBoundary>
          <a href="#main-content" className="skip-to-content">Skip to content</a>
          <OfflineBanner />
          <AnalyticsProvider>
            <Suspense fallback={<div>Loading...</div>}>
          <Head>
            {/* Calendly CSS */}
            <link
              href="https://assets.calendly.com/assets/external/widget.css"
              rel="stylesheet"
            />
          </Head>
          {/* Calendly Script */}
          <Script
            src="https://assets.calendly.com/assets/external/widget.js"
            strategy="lazyOnload"
          />
          <OrganizationSchema />
          <Component {...pageProps} />
          <CookieConsent />
        </Suspense>
          </AnalyticsProvider>
        </ErrorBoundary>
      </AuthProvider>
    </ToastProvider>
  );
}
