import React from "react";
import Link from "next/link";
import Image from "next/image";
import logo from "public/images/logo.png";

interface HeaderLandingProps {
  openCalendly: () => void;
}

const HeaderLanding = ({ openCalendly }: HeaderLandingProps) => {
  return (
    <header className="header header-landing">
      <div className="primary-navbar">
        <div className="container">
          <div className="row">
            <div className="col-12">
              <nav className="navbar p-0 navbar-landing">
                <div className="navbar__logo">
                  <Link href="/" aria-label="go to home">
                    <Image src={logo} alt="The Innovative Native" priority />
                  </Link>
                </div>
                <div className="navbar__cta">
                  <button
                    onClick={openCalendly}
                    className="btn btn--primary"
                  >
                    Discovery Call
                    <i className="fa-solid fa-arrow-right"></i>
                  </button>
                </div>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default HeaderLanding;
