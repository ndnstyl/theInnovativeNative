import React, { Suspense } from "react";
import type { AppProps } from "next/app";
import Head from "next/head";
import Script from "next/script";

// bootstrap
import "bootstrap/dist/css/bootstrap.min.css";

// font awesome 6
import "public/icons/font-awesome/css/all.css";

// custom icons
import "public/icons/glyphter/css/xpovio.css";

// main scss
import "@/styles/main.scss";

export default function App({ Component, pageProps }: AppProps) {
  return (
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
      <Component {...pageProps} />
    </Suspense>
  );
}
