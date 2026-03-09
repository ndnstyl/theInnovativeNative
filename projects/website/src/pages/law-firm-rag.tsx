import React, { useEffect } from "react";
import Head from "next/head";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import SplitType from "split-type";
import HeaderLanding from "@/components/layout/header/HeaderLanding";
import ScrollProgressBtn from "@/components/layout/ScrollProgressBtn";
import LawFirmRagHero from "@/components/containers/law-firm-rag/LawFirmRagHero";
import ProblemAgitation from "@/components/containers/law-firm-rag/ProblemAgitation";
import SolutionOverview from "@/components/containers/law-firm-rag/SolutionOverview";
import CaseStudyProof from "@/components/containers/law-firm-rag/CaseStudyProof";
import FeaturesBenefits from "@/components/containers/law-firm-rag/FeaturesBenefits";
import TrustIndicators from "@/components/containers/law-firm-rag/TrustIndicators";
import LegalFaq from "@/components/containers/law-firm-rag/LegalFaq";
import FinalCta from "@/components/containers/law-firm-rag/FinalCta";
import RoiCalculatorSection from "@/components/containers/law-firm-rag/RoiCalculatorSection";
import BrandConnector from "@/components/common/BrandConnector";

gsap.registerPlugin(ScrollTrigger);

const LawFirmRag = () => {
  const openCalendly = () => {
    if (typeof window !== 'undefined' && (window as any).Calendly) {
      (window as any).Calendly.initPopupWidget({
        url: 'https://calendly.com/mike-buildmytribe/ai-discovery-call'
      });
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
        <title>Private Legal RAG | Your Firm&apos;s Second Brain | The Innovative Native</title>
        <meta
          name="description"
          content="Enterprise AI trains on everyone's law. Your advantage is in your cases. Build a private legal RAG trained on your briefs, your outcomes, your institutional intelligence."
        />
        <meta
          name="keywords"
          content="legal research AI, law firm AI assistant, legal document retrieval, Westlaw alternative, legal knowledge management, bankruptcy legal research, RAG legal, AI legal research"
        />

        {/* Open Graph */}
        <meta property="og:title" content="Private Legal RAG | Your Firm's Second Brain" />
        <meta property="og:description" content="Enterprise AI trains on everyone's law. Your advantage is in your cases. Build institutional intelligence from your own briefs and outcomes." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://theinnovativenative.com/law-firm-rag" />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Private Legal RAG | Your Firm's Second Brain" />
        <meta name="twitter:description" content="Enterprise AI trains on everyone's law. Your advantage is in your cases. Build institutional intelligence from your own briefs and outcomes." />

        {/* Schema.org SoftwareApplication */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "SoftwareApplication",
              "name": "Law Firm RAG",
              "applicationCategory": "LegalSoftware",
              "operatingSystem": "Cloud-based",
              "description": "AI-powered legal research engine with authority-aware retrieval from firm documents",
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "USD",
                "description": "Pilot program available"
              },
              "featureList": [
                "100% Citation Integrity",
                "Authority-Aware Ranking",
                "Full Audit Trail",
                "Criminal Defense Coverage",
                "Bankruptcy Law Coverage"
              ]
            })
          }}
        />
      </Head>
      <div className="my-app landing-page">
        <HeaderLanding openCalendly={openCalendly} />
        <main>
          <LawFirmRagHero openCalendly={openCalendly} />
          <ProblemAgitation openCalendly={openCalendly} />
          <SolutionOverview />
          <CaseStudyProof />
          <FeaturesBenefits />
          <RoiCalculatorSection openCalendly={openCalendly} />
          <TrustIndicators />
          <LegalFaq />
          <FinalCta openCalendly={openCalendly} />
          <BrandConnector currentVertical="legal" />
        </main>
        <ScrollProgressBtn />
      </div>
    </>
  );
};

export default LawFirmRag;
