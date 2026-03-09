import React, { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import logo from "public/images/logo.png";
import { navItems } from "@/data/navigation";

interface HeaderProps {
  openNav: boolean;
  setOpenNav: (value: boolean) => void;
}

const Offcanvas = ({ openNav, setOpenNav }: HeaderProps) => {
  // window resize
  useEffect(() => {
    const handleResizeHeader = (): void => {
      setOpenNav(false);
    };

    window.addEventListener("resize", handleResizeHeader);

    return () => {
      window.removeEventListener("resize", handleResizeHeader);
    };
  }, [setOpenNav]);

  const closeNav = () => {
    setOpenNav(false);
  };

  const openCalendly = (url: string) => {
    if (typeof window !== 'undefined' && (window as any).Calendly) {
      (window as any).Calendly.initPopupWidget({ url });
    }
  };

  const regularItems = navItems.filter((item) => !item.isCta);
  const ctaItem = navItems.find((item) => item.isCta);

  return (
    <div className="offcanvas-nav">
      <div
        className={"offcanvas-menu" + (openNav ? " show-offcanvas-menu" : " ")}
      >
        <nav className="offcanvas-menu__wrapper" data-lenis-prevent>
          <div className="offcanvas-menu__header nav-fade">
            <div className="logo">
              <Link href="/">
                <Image src={logo} alt="The Innovative Native" title="The Innovative Native" priority />
              </Link>
            </div>
            <button
              aria-label="close offcanvas menu"
              className="close-offcanvas-menu"
              onClick={closeNav}
            >
              <i className="fa-light fa-xmark-large"></i>
            </button>
          </div>
          <div className="offcanvas-menu__list">
            <div className="navbar__menu">
              <ul>
                {regularItems.map((item) => {
                  const isHash =
                    item.href.startsWith("#") || item.href.startsWith("/#");

                  return (
                    <li key={item.label} className="navbar__item nav-fade">
                      {isHash ? (
                        <a href={item.href} onClick={closeNav}>
                          {item.label}
                        </a>
                      ) : (
                        <Link href={item.href} onClick={closeNav}>
                          {item.label}
                        </Link>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
          <div className="offcanvas-menu__options nav-fade">
            <div className="offcanvas__mobile-options d-flex">
              {ctaItem && (
                ctaItem.href.startsWith("https://calendly") ? (
                  <button
                    onClick={() => {
                      openCalendly(ctaItem.href);
                      closeNav();
                    }}
                    className="btn btn--secondary"
                  >
                    {ctaItem.label}
                  </button>
                ) : (
                  <Link
                    href={ctaItem.href}
                    className="btn btn--secondary"
                    onClick={closeNav}
                  >
                    {ctaItem.label}
                  </Link>
                )
              )}
            </div>
          </div>
          <div className="offcanvas-menu__social social nav-fade">
            <Link
              href="https://www.linkedin.com/in/michael-soto-7134ba158/"
              target="_blank"
              aria-label="connect on LinkedIn"
            >
              <i className="fa-brands fa-linkedin-in"></i>
            </Link>
            <Link
              href="https://www.facebook.com/theinnovativenativellc"
              target="_blank"
              aria-label="visit Facebook"
            >
              <i className="fa-brands fa-facebook-f"></i>
            </Link>
          </div>
        </nav>
      </div>
    </div>
  );
};

export default Offcanvas;
