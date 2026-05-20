import React from "react";
import Image from "next/image";
import star from "public/images/star.png";
import { bonuses } from "@/data/haven-blueprint";

const bonusIcons = ["fa-compass", "fa-sliders", "fa-arrows-rotate"];

const BonusStack = () => {
  const totalValue = bonuses.reduce((sum, b) => sum + b.value, 0);

  return (
    <section className="section hb-bonuses fade-wrapper">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-12 col-lg-8 text-center">
            <span className="sub-title fade-top">
              FREE BONUSES
              <i className="fa-solid fa-arrow-right"></i>
            </span>
            <h2 className="title title-anim mt-3">
              But Wait — There&apos;s More.<br />
              (Seriously Though.)
            </h2>
            <p className="hb-bonuses__subtitle fade-top">
              These bonuses are included free with your purchase.
              They&apos;re not filler — they solve real problems you&apos;ll hit after setup.
            </p>
          </div>
        </div>

        <div className="row gaper mt-5">
          {bonuses.map((bonus, index) => (
            <div key={index} className="col-12 col-md-4">
              <div className="hb-bonuses__card fade-top">
                <div className="hb-bonuses__card-badge">
                  <span>FREE</span>
                </div>
                <div className="hb-bonuses__card-icon">
                  <i className={`fa-solid ${bonusIcons[index]}`}></i>
                </div>
                <h4>{bonus.name}</h4>
                <p>{bonus.description}</p>
                <div className="hb-bonuses__card-value">
                  <span>${bonus.value} value</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="row justify-content-center mt-4">
          <div className="col-12 text-center">
            <div className="hb-bonuses__total fade-top">
              <p>Total bonus value: <strong>${totalValue}</strong> — included free with your purchase.</p>
            </div>
          </div>
        </div>
      </div>

      <Image src={star} alt="" className="star" aria-hidden="true" />
    </section>
  );
};

export default BonusStack;
