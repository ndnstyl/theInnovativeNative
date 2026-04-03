import React from "react";
import Image from "next/image";
import Link from "next/link";
import logo from "public/images/logo.png";
import { CALENDLY_URL } from "@/lib/constants";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const openCalendly = () => {
    if (typeof window !== 'undefined' && (window as any).Calendly) {
      (window as any).Calendly.initPopupWidget({
        url: CALENDLY_URL
      });
    }
  };

  return (
    <footer
      className="footer section pb-0"
      style={{ backgroundImage: "url('/images/footer/footer-bg.png')" }}
    >
      <div className="container">
        <div className="row gaper">
          <div className="col-12 col-lg-4 col-xl-4">
            <div className="footer__single">
              <Link href="/" className="logo">
                <Image src={logo} alt="The Innovative Native" />
              </Link>
              <p className="mt-3" style={{ color: '#a0a0a0' }}>
                Building systems that thrive at scale.
              </p>
              <div className="footer__single-meta">
                <Link href="mailto:info@theinnovativenative.com">
                  <i className="fa-sharp fa-solid fa-envelope"></i>
                  info@theinnovativenative.com
                </Link>
              </div>
              <div className="footer__cta text-start">
                <button onClick={openCalendly} className="btn btn--secondary">
                  Book Discovery Call
                </button>
              </div>
            </div>
          </div>
          <div className="col-12 col-lg-2 col-xl-2">
            <div className="footer__single">
              <div className="footer__single-intro">
                <h5>Navigation</h5>
              </div>
              <div className="footer__single-content">
                <ul>
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
          <div className="col-12 col-lg-3 col-xl-3">
            <div className="footer__single">
              <div className="footer__single-intro">
                <h5>Services</h5>
              </div>
              <div className="footer__single-content">
                <ul>
                  <li>
                    <Link href="/#services">Digital Marketing</Link>
                  </li>
                  <li>
                    <Link href="/#services">AI Systems & Automation</Link>
                  </li>
                  <li>
                    <Link href="/#services">AI-First Growth Strategy</Link>
                  </li>
                  <li>
                    <Link href="/#services">Content & Distribution</Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div className="col-12 col-lg-3 col-xl-3">
            <div className="footer__single">
              <div className="footer__single-intro">
                <h5>Connect</h5>
              </div>
              <div className="footer__single-content">
                <ul>
                  <li>
                    <a
                      href="https://www.linkedin.com/in/michael-soto-7134ba158/"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <i className="fa-brands fa-linkedin-in me-2"></i>
                      LinkedIn
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://www.facebook.com/theinnovativenativellc"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <i className="fa-brands fa-facebook-f me-2"></i>
                      Facebook
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div className="row" style={{ marginTop: '20px', paddingTop: '20px', borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
          <div className="col-12">
            <div className="footer__legal" style={{ display: 'flex', justifyContent: 'center', gap: '24px', flexWrap: 'wrap' }}>
              <Link href="/privacy-policy" style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '14px', textDecoration: 'none', transition: 'color 0.2s' }}>Privacy Policy</Link>
              <Link href="/terms-and-conditions" style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '14px', textDecoration: 'none', transition: 'color 0.2s' }}>Terms &amp; Conditions</Link>
              <Link href="/disclaimer" style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '14px', textDecoration: 'none', transition: 'color 0.2s' }}>Disclaimer</Link>
              <Link href="/refund-policy" style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '14px', textDecoration: 'none', transition: 'color 0.2s' }}>Refund Policy</Link>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-12">
            <div className="footer__copyright">
              <div className="row align-items-center gaper">
                <div className="col-12 col-lg-8">
                  <div className="footer__copyright-text text-center text-lg-start">
                    <p>
                      Copyright &copy;
                      <span id="copyYear"> {currentYear}</span> The Innovative Native.
                      All Rights Reserved
                    </p>
                  </div>
                </div>
                <div className="col-12 col-lg-4">
                  <div className="social justify-content-center justify-content-lg-end">
                    <a
                      href="https://www.linkedin.com/in/michael-soto-7134ba158/"
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="LinkedIn"
                    >
                      <i className="fa-brands fa-linkedin-in"></i>
                    </a>
                    <a
                      href="https://www.facebook.com/theinnovativenativellc"
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Facebook"
                    >
                      <i className="fa-brands fa-facebook-f"></i>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
