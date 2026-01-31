import React, { useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import thumbone from "public/images/agency/thumb-one.png";
import thumbtwo from "public/images/agency/thumb-two.png";
import star from "public/images/star.png";
import dotlarge from "public/images/agency/dot-large.png";

gsap.registerPlugin(ScrollTrigger);
const Agency = () => {
  useEffect(() => {
    const percentElements = document.querySelectorAll("[data-percent]");

    percentElements.forEach((el) => {
      const skillBarPercent = el.querySelector(
        ".skill-bar-percent"
      ) as HTMLElement | null;
      const percentValue = el.parentNode?.querySelector(
        ".percent-value"
      ) as HTMLElement | null;

      if (skillBarPercent && percentValue) {
        const percent = el.getAttribute("data-percent") || "0%";
        skillBarPercent.style.width = percent;
        percentValue.textContent = percent;
      }
    });

    const axProgressBar = document.querySelectorAll(".skill-bar-single");
    axProgressBar.forEach((element) => {
      const skillBarPercent = element.querySelector(
        ".skill-bar-percent"
      ) as HTMLElement | null;
      const percentValue = element.querySelector(
        ".percent-value"
      ) as HTMLElement | null;

      if (skillBarPercent && percentValue) {
        const target = percentValue.textContent || "0%";

        const axBarTimeline = gsap.timeline({
          defaults: {
            duration: 2,
          },
          scrollTrigger: {
            trigger: element,
          },
        });

        axBarTimeline.fromTo(
          skillBarPercent,
          {
            width: 0,
          },
          {
            width: target,
          }
        );

        axBarTimeline.from(
          percentValue,
          {
            textContent: "0%",
            snap: {
              textContent: 5,
            },
          },
          "<"
        );
      }
    });
  }, []);

  return (
    <section className="section agency">
      <div className="container">
        <div className="row gaper align-items-center">
          <div className="col-12 col-lg-6">
            <div className="agency__thumb">
              <Image
                src={thumbone}
                alt="Growth System Analysis"
                className="thumb-one fade-left"
                priority
              />
              <Image
                src={thumbtwo}
                alt="Data-Driven Decisions"
                className="thumb-two fade-right"
                priority
              />
            </div>
          </div>
          <div className="col-12 col-lg-6">
            <div className="agency__content section__content">
              <span className="sub-title">
                THE PROBLEM
                <i className="fa-solid fa-arrow-right"></i>
              </span>
              <h2 className="title title-anim">
                Most Teams Don&apos;t Need More Effort. They Need Less Guessing.
              </h2>
              <div className="paragraph">
                <p>
                  When leadership can&apos;t explain why results are changing, the system
                  is no longer under control. Adding budget, tools, or people usually
                  makes the failure more expensive.
                </p>
                <p className="mt-3">
                  <strong>I diagnose where systems are lying:</strong>
                </p>
                <ul className="mt-2" style={{ listStyle: 'disc', paddingLeft: '1.5rem' }}>
                  <li>Where reporting is comforting instead of true</li>
                  <li>Where incentives create self-deception</li>
                  <li>Where legacy wins became emotional anchors</li>
                  <li>Where cosmetic optimization replaced structural correction</li>
                </ul>
              </div>
              <div className="skill-wrap">
                <div className="skill-bar-single">
                  <div className="skill-bar-title">
                    <p className="primary-text">Growth Diagnosis</p>
                  </div>
                  <div className="skill-bar-wrapper" data-percent="90%">
                    <div className="skill-bar">
                      <div className="skill-bar-percent">
                        <span className="percent-value"></span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="skill-bar-single">
                  <div className="skill-bar-title">
                    <p className="primary-text">AI Orchestration</p>
                  </div>
                  <div className="skill-bar-wrapper" data-percent="85%">
                    <div className="skill-bar">
                      <div className="skill-bar-percent">
                        <span className="percent-value"></span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="section__content-cta">
                <Link href="/portfolio" className="btn btn--primary">
                  View Case Studies
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Image src={star} alt="Image" className="star" priority />
      <Image src={dotlarge} alt="Image" className="dot-large" priority />
    </section>
  );
};

export default Agency;
