import React, { useEffect } from "react";
import Head from "next/head";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import SplitType from "split-type";
import ScrollProgressBtn from "@/components/layout/ScrollProgressBtn";
import HavenHero from "@/components/containers/haven-blueprint/HavenHero";
import ProblemAgitation from "@/components/containers/haven-blueprint/ProblemAgitation";
import SocialProof from "@/components/containers/haven-blueprint/SocialProof";
import SystemReveal from "@/components/containers/haven-blueprint/SystemReveal";
import ModuleBreakdown from "@/components/containers/haven-blueprint/ModuleBreakdown";
import ResultsShowcase from "@/components/containers/haven-blueprint/ResultsShowcase";
import PricingSection from "@/components/containers/haven-blueprint/PricingSection";
import BonusStack from "@/components/containers/haven-blueprint/BonusStack";
import Guarantee from "@/components/containers/haven-blueprint/Guarantee";
import FaqSection from "@/components/containers/haven-blueprint/FaqSection";
import FinalCta from "@/components/containers/haven-blueprint/FinalCta";
import { HAVEN_BLUEPRINT } from "@/data/haven-blueprint";
import BrandConnector from "@/components/common/BrandConnector";

gsap.registerPlugin(ScrollTrigger);

const HavenBlueprint = () => {
  const scrollToCheckout = () => {
    const el = document.getElementById("hb-pricing");
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
        <title>{HAVEN_BLUEPRINT.seo.title}</title>
        <meta name="description" content={HAVEN_BLUEPRINT.seo.description} />
        <meta name="keywords" content={HAVEN_BLUEPRINT.seo.keywords.join(", ")} />

        {/* Open Graph */}
        <meta property="og:title" content={HAVEN_BLUEPRINT.seo.title} />
        <meta property="og:description" content={HAVEN_BLUEPRINT.seo.description} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://theinnovativenative.com/twingen" />
        <meta property="og:image" content={HAVEN_BLUEPRINT.seo.ogImage} />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={HAVEN_BLUEPRINT.seo.title} />
        <meta name="twitter:description" content={HAVEN_BLUEPRINT.seo.description} />
        <meta name="twitter:image" content={HAVEN_BLUEPRINT.seo.ogImage} />

        {/* Schema.org Product */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Product",
              "name": HAVEN_BLUEPRINT.name,
              "description": HAVEN_BLUEPRINT.description,
              "image": HAVEN_BLUEPRINT.seo.ogImage,
              "brand": {
                "@type": "Brand",
                "name": "The Innovative Native"
              },
              "offers": {
                "@type": "Offer",
                "price": HAVEN_BLUEPRINT.price.earlyBird,
                "priceCurrency": HAVEN_BLUEPRINT.price.currency,
                "availability": "https://schema.org/InStock",
                "url": "https://theinnovativenative.com/twingen"
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
                  "name": "Do I need coding experience to build an AI influencer?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "No. n8n is a visual, no-code workflow builder. FFMPEG commands are provided as copy-paste recipes. The Airtable base is pre-built."
                  }
                },
                {
                  "@type": "Question",
                  "name": "How long until I see results?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Most builders generate their first AI content within 48 hours. The full pipeline typically takes 1-2 weeks to deploy."
                  }
                },
                {
                  "@type": "Question",
                  "name": "Can I build an AI influencer for under $100?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Yes. This blueprint ($57) + free tier APIs = $57 total to get started."
                  }
                }
              ]
            })
          }}
        />
      </Head>
      <div className="my-app haven-blueprint-page">
        {/* Minimal Landing Header */}
        <header className="hb-header">
          <nav className="hb-header__nav">
            <a href="/" className="hb-header__logo">
              <img src="/images/logo.png" alt="The Innovative Native" />
            </a>
            <button onClick={scrollToCheckout} className="btn btn--primary">
              Get Access
              <i className="fa-solid fa-arrow-right"></i>
            </button>
          </nav>
        </header>

        <main>
          <HavenHero scrollToCheckout={scrollToCheckout} />
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
          <BrandConnector currentVertical="creative" />
        </main>

        {/* Minimal Footer */}
        <footer className="hb-footer">
          <div className="container text-center">
            <p>&copy; {new Date().getFullYear()} The Innovative Native. All rights reserved.</p>
            <div className="hb-footer__links">
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

export default HavenBlueprint;
