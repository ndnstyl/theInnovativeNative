import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head />
      <body>
        {/* GTM noscript iframe removed from _document.tsx.
            It was firing unconditionally, bypassing cookie consent.
            The AnalyticsProvider handles GTM loading after consent. */}
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
