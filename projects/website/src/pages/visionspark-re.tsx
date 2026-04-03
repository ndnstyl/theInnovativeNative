import React, { useEffect } from "react";
import Head from "next/head";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import SplitType from "split-type";
import ScrollProgressBtn from "@/components/layout/ScrollProgressBtn";
import VisionSparkHero from "@/components/containers/visionspark-re/VisionSparkHero";
import ProblemAgitation from "@/components/containers/visionspark-re/ProblemAgitation";
import SocialProof from "@/components/containers/visionspark-re/SocialProof";
import SystemReveal from "@/components/containers/visionspark-re/SystemReveal";
import ModuleBreakdown from "@/components/containers/visionspark-re/ModuleBreakdown";
import ResultsShowcase from "@/components/containers/visionspark-re/ResultsShowcase";
import PricingSection from "@/components/containers/visionspark-re/PricingSection";
import BonusStack from "@/components/containers/visionspark-re/BonusStack";
import Guarantee from "@/components/containers/visionspark-re/Guarantee";
import FaqSection from "@/components/containers/visionspark-re/FaqSection";
import FinalCta from "@/components/containers/visionspark-re/FinalCta";
import { VISIONSPARK_RE } from "@/data/visionspark-re";
import BrandConnector from "@/components/common/BrandConnector";

gsap.registerPlugin(ScrollTrigger);

const VisionSparkRE = () => {
  const scrollToCheckout = () => {
    const el = document.getElementById("vs-pricing");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Fade animation
  useEffect(() => {
    const fadeWrapperRefs = document.querySelectorAll(".fade-wrapper");

    fadeWrapperRefs.forEach((fadeWrapperRef) => {
      const fadeItems = fadeWrapperRef.querySelectorAll(".fade-top");

      fadeItems.forEach((element, index) => {
        const delay = index * 0.15;

        gsap.set(element, {
          opacity: 0,
          y: 100,
        });

        ScrollTrigger.create({
          trigger: element,
          start: "top 100%",
          end: "bottom 20%",
          scrub: 0.5,
          onEnter: () => {
            gsap.to(element, {
              opacity: 1,
              y: 0,
              duration: 1,
              delay: delay,
            });
          },
          once: true,
        });
      });
    });
  }, []);

  // Split text animation
  useEffect(() => {
    const myText = new SplitType(".title-anim");
    const titleAnims = document.querySelectorAll(".title-anim");

    titleAnims.forEach((titleAnim) => {
      const charElements = titleAnim.querySelectorAll(".char");

      charElements.forEach((char, index) => {
        const tl2 = gsap.timeline({
          scrollTrigger: {
            trigger: char,
            start: "top 90%",
            end: "bottom 60%",
            scrub: false,
            markers: false,
            toggleActions: "play none none none",
          },
        });

        const charDelay = index * 0.03;

        tl2.from(char, {
          duration: 0.8,
          x: 70,
          delay: charDelay,
          autoAlpha: 0,
        });
      });
    });
  }, []);

  return (
    <>
      <Head>
        <meta httpEquiv="X-UA-Compatible" content="ie=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="shortcut icon" href="/images/favicon.png" type="image/x-icon" />
        <title>{VISIONSPARK_RE.seo.title}</title>
        <meta name="description" content={VISIONSPARK_RE.seo.description} />
        <meta name="keywords" content={VISIONSPARK_RE.seo.keywords.join(", ")} />

        {/* Open Graph */}
        <meta property="og:title" content={VISIONSPARK_RE.seo.title} />
        <meta property="og:description" content={VISIONSPARK_RE.seo.description} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://theinnovativenative.com/visionspark-re" />
        <meta property="og:image" content={VISIONSPARK_RE.seo.ogImage} />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={VISIONSPARK_RE.seo.title} />
        <meta name="twitter:description" content={VISIONSPARK_RE.seo.description} />
        <meta name="twitter:image" content={VISIONSPARK_RE.seo.ogImage} />

        {/* Schema.org Product */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Product",
              "name": VISIONSPARK_RE.name,
              "description": VISIONSPARK_RE.description,
              "image": VISIONSPARK_RE.seo.ogImage,
              "brand": {
                "@type": "Brand",
                "name": "The Innovative Native"
              },
              "offers": {
                "@type": "Offer",
                "price": VISIONSPARK_RE.price.earlyBird,
                "priceCurrency": VISIONSPARK_RE.price.currency,
                "availability": "https://schema.org/InStock",
                "url": "https://theinnovativenative.com/visionspark-re"
              }
            })
          }}
        />

        {/* FAQ Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FAQPage",
              "mainEntity": [
                {
                  "@type": "Question",
                  "name": "Do I need technical experience to use the Listing Video Blueprint?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "No. n8n is a visual, no-code workflow builder. FFMPEG commands are provided as copy-paste recipes. The Airtable base is pre-built."
                  }
                },
                {
                  "@type": "Question",
                  "name": "How is this different from other AI staging tools?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Other tools do photo staging only. This Blueprint gives you staged photos AND true Veo 3.1 generative video AND branded reel assembly AND compliance overlays — all from one pipeline."
                  }
                },
                {
                  "@type": "Question",
                  "name": "Is AI staging legal in real estate?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Yes, AI staging is legal in every U.S. state, but disclosure requirements vary. Module 6 covers state-by-state requirements and the pipeline bakes disclosure overlays into every output."
                  }
                }
              ]
            })
          }}
        />
      </Head>
      <div className="my-app visionspark-re-page">
        {/* Minimal Landing Header */}
        <header className="vs-header">
          <nav className="vs-header__nav">
            <a href="/" className="vs-header__logo">
              <img src="/images/logo.png" alt="The Innovative Native" />
            </a>
            <button onClick={scrollToCheckout} className="btn btn--primary">
              Get Access
              <i className="fa-solid fa-arrow-right"></i>
            </button>
          </nav>
        </header>

        <main>
          <VisionSparkHero scrollToCheckout={scrollToCheckout} />
          <ProblemAgitation />
          <SocialProof />
          <SystemReveal />
          <ModuleBreakdown />
          <ResultsShowcase />
          <PricingSection />
          <BonusStack />
          <Guarantee />
          <FaqSection />
          <FinalCta scrollToCheckout={scrollToCheckout} />
          <BrandConnector currentVertical="real-estate" />
        </main>

        {/* Minimal Footer */}
        <footer className="vs-footer">
          <div className="container text-center">
            <p>&copy; {new Date().getFullYear()} The Innovative Native. All rights reserved.</p>
            <div className="vs-footer__links">
              <a href="/templates/terms">Terms</a>
              <a href="/templates/refund-policy">Refund Policy</a>
            </div>
          </div>
        </footer>

        <ScrollProgressBtn />
      </div>
    </>
  );
};

export default VisionSparkRE;
