import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import logo from "public/images/logo.png";
import gsap from "gsap";
import chroma from "chroma-js";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);
const FooterFive = () => {
  const currentYear = new Date().getFullYear();

  const animatedTextRef = useRef<any>(null);
  const [animatedTextContent, setAnimatedTextContent] = useState("");

  const openCalendly = () => {
    if (typeof window !== 'undefined' && (window as any).Calendly) {
      (window as any).Calendly.initPopupWidget({
        url: 'https://calendly.com/mike-buildmytribe/ai-discovery-call'
      });
    }
  };

  useEffect(() => {
    const animatedChars = document.querySelectorAll(".animated-char");

    if (animatedChars.length > 0) {
      const folksBD = gsap.timeline({
        repeat: -1,
        delay: 0.5,
        scrollTrigger: {
          trigger: ".animated-text",
          start: "bottom 100%-=50px",
        },
      });

      const folksGradient = chroma.scale(["#00FFFF", "#ffffff"]);

      animatedChars.forEach((charElement, index) => {
        const delay = index * 0.04;

        folksBD.to(
          charElement,
          {
            duration: 0.5,
            scaleY: 0.6,
            ease: "power3.out",
            transformOrigin: "center bottom",
          },
          delay
        );

        folksBD.to(
          charElement,
          {
            yPercent: -20,
            ease: "elastic",
            duration: 0.8,
          },
          delay + 0.5
        );

        folksBD.to(
          charElement,
          {
            scaleY: 1,
            ease: "elastic.out(2.5, 0.2)",
            duration: 1.5,
          },
          delay + 0.5
        );

        folksBD.to(
          charElement,
          {
            color: () => {
              return folksGradient(index / animatedChars.length).hex();
            },
            ease: "power2.out",
            duration: 0.3,
          },
          delay + 0.5
        );

        folksBD.to(
          charElement,
          {
            yPercent: 0,
            ease: "back",
            duration: 0.8,
          },
          delay + 0.7
        );

        folksBD.to(
          charElement,
          {
            color: "#ffffff",
            duration: 1.4,
          },
          delay + 0.9
        );
      });
    }
  }, [animatedTextContent]);

  useEffect(() => {
    const animatedText = animatedTextRef.current;
    const textContent = animatedTextRef.current?.textContent;
    if (textContent) {
      setAnimatedTextContent(textContent);
      animatedText.innerHTML = "";
    }
  }, []);

  return (
    <footer className="footer-two footer-cmn section pb-0">
      <div className="container">
        <div className="row gaper">
          <div className="col-12 col-lg-5 col-xl-4">
            <div className="footer-two__left">
              <div className="logo">
                <Link href="/">
                  <Image src={logo} priority alt="The Innovative Native" />
                </Link>
              </div>
              <div className="paragraph">
                <p>
                  AI systems that replace fragmented SaaS stacks.
                  System design, workflow automation, and AI training.
                </p>
              </div>
              <div className="section__content-cta">
                <h2>
                  <Link
                    href="mailto:info@theinnovativenative.com"
                    className="folks-text animated-text"
                    ref={animatedTextRef}
                    style={{ color: '#00FFFF' }}
                  >
                    info@theinnovativenative.com
                    {animatedTextContent.split("").map((char, index) => (
                      <span
                        aria-hidden="true"
                        className="animated-char"
                        key={index}
                      >
                        {char}
                      </span>
                    ))}
                  </Link>
                </h2>
              </div>
            </div>
          </div>
          <div className="col-12 col-lg-7 col-xl-7 offset-xl-1 col-xxl-5 offset-xxl-3">
            <div className="footer-two__right">
              <div className="social justify-content-start justify-content-lg-start">
                <Link href="https://www.linkedin.com/in/michael-soto-7134ba158/" target="_blank">
                  <i className="fa-brands fa-linkedin-in"></i>
                  <span>LinkedIn</span>
                </Link>
                <Link href="https://www.facebook.com/theinnovativenativellc" target="_blank">
                  <i className="fa-brands fa-facebook-f"></i>
                  <span>Facebook</span>
                </Link>
              </div>
              <div className="footer__single-meta section__content-cta">
                <Link href="mailto:info@theinnovativenative.com">
                  <i className="fa-sharp fa-solid fa-envelope"></i>
                  info@theinnovativenative.com
                </Link>
                <button
                  onClick={openCalendly}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'inherit',
                    cursor: 'pointer',
                    padding: 0,
                    font: 'inherit',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px'
                  }}
                >
                  <i className="fa-sharp fa-solid fa-calendar"></i>
                  Book Discovery Call
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="footer__copyright">
        <div className="container">
          <div className="row align-items-center gaper">
            <div className="col-12 col-xl-6">
              <div className="footer__copyright-text text-center text-xl-start">
                <p>
                  Copyright &copy;
                  <span id="copyYear"> {currentYear}</span> The Innovative Native.
                  All Rights Reserved
                </p>
              </div>
            </div>
            <div className="col-12 col-xl-6">
              <ul className="justify-content-center justify-content-xl-end">
                <li>
                  <Link href="/">Home</Link>
                </li>
                <li>
                  <Link href="/portfolio">Portfolio</Link>
                </li>
                <li>
                  <Link href="/professionalExperience">Experience</Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default FooterFive;
