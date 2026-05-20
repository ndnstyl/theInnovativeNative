import React from "react";
import Image from "next/image";
import star from "public/images/star.png";
import StripeBuyButton from "@/components/templates/StripeBuyButton";
import { VISIONSPARK_RE, includedItems } from "@/data/visionspark-re";

const PricingSection = () => {
  const spotsLeft = VISIONSPARK_RE.scarcity.earlyBirdLimit - VISIONSPARK_RE.scarcity.earlyBirdSold;
  const isEarlyBird = spotsLeft > 0;
  const currentPrice = isEarlyBird ? VISIONSPARK_RE.price.earlyBird : VISIONSPARK_RE.price.full;

  return (
    <section id="vs-pricing" className="section vs-pricing fade-wrapper">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-12 col-lg-8 text-center">
            <span className="sub-title fade-top">
              GET THE BLUEPRINT
              <i className="fa-solid fa-arrow-right"></i>
            </span>
            <h2 className="title title-anim mt-3">
              Everything You Need.<br />
              One Price. Instant Access.
            </h2>
          </div>
        </div>

        <div className="row justify-content-center mt-5">
          <div className="col-12 col-lg-8">
            <div className="vs-pricing__card fade-top">
              {/* Scarcity Counter */}
              {isEarlyBird && (
                <div className="vs-pricing__scarcity">
                  <div className="vs-pricing__scarcity-bar">
                    <div
                      className="vs-pricing__scarcity-fill"
                      style={{ width: `${((VISIONSPARK_RE.scarcity.earlyBirdLimit - spotsLeft) / VISIONSPARK_RE.scarcity.earlyBirdLimit) * 100}%` }}
                    ></div>
                  </div>
                  <p className="vs-pricing__scarcity-text">
                    <i className="fa-solid fa-fire"></i>
                    <strong>{spotsLeft} of {VISIONSPARK_RE.scarcity.earlyBirdLimit} early bird spots remaining</strong>
                    <span> — price increases to ${VISIONSPARK_RE.price.full} after</span>
                  </p>
                </div>
              )}

              {/* Price */}
              <div className="vs-pricing__price">
                {isEarlyBird ? (
                  <>
                    <span className="vs-pricing__price-crossed">${VISIONSPARK_RE.price.full}</span>
                    <span className="vs-pricing__price-current">${currentPrice}</span>
                    <span className="vs-pricing__price-label">early bird pricing — one-time payment</span>
                  </>
                ) : (
                  <>
                    <span className="vs-pricing__price-current">${currentPrice}</span>
                    <span className="vs-pricing__price-label">one-time payment</span>
                  </>
                )}
              </div>

              {/* Product Name */}
              <h3 className="vs-pricing__name">{VISIONSPARK_RE.name}</h3>
              <p className="vs-pricing__tagline">{VISIONSPARK_RE.description}</p>

              {/* Included Items */}
              <ul className="vs-pricing__checklist">
                {includedItems.map((item, index) => (
                  <li key={index}>
                    <i className="fa-solid fa-check-circle"></i>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>

              {/* Stripe Buy Button */}
              <div className="vs-pricing__checkout">
                <StripeBuyButton
                  buyButtonId={VISIONSPARK_RE.stripe.buyButtonId}
                  publishableKey={VISIONSPARK_RE.stripe.publishableKey}
                />
                {/* Fallback CTA for when Stripe Buy Button IDs haven't been configured */}
                <noscript>
                  <a href="#" className="btn btn--primary btn--large">
                    Get Instant Access — ${currentPrice}
                  </a>
                </noscript>
              </div>

              {/* Trust Badges */}
              <div className="vs-pricing__trust">
                <span><i className="fa-solid fa-shield"></i> Secure Checkout</span>
                <span><i className="fa-solid fa-bolt"></i> Instant Access</span>
                <span><i className="fa-solid fa-download"></i> Lifetime Access</span>
              </div>
            </div>

            {/* Done-For-You Add-On */}
            <div className="vs-pricing__upsells fade-top">
              <div className="vs-pricing__upsell-card">
                <div className="vs-pricing__upsell-badge">MOST POPULAR ADD-ON</div>
                <h4>{VISIONSPARK_RE.upsells.doneForYou.name}</h4>
                <p>{VISIONSPARK_RE.upsells.doneForYou.description}</p>
                <div className="vs-pricing__upsell-price">
                  <strong>${VISIONSPARK_RE.upsells.doneForYou.price}</strong>
                  <span>/per listing</span>
                </div>
                <StripeBuyButton
                  buyButtonId={VISIONSPARK_RE.upsells.doneForYou.stripeBuyButtonId}
                  publishableKey={VISIONSPARK_RE.stripe.publishableKey}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <Image src={star} alt="" className="star star-one" aria-hidden="true" />
      <Image src={star} alt="" className="star star-two" aria-hidden="true" />
      <div className="vs-pricing__glow"></div>

      <div className="lines d-none d-lg-flex">
        <div className="line"></div>
        <div className="line"></div>
        <div className="line"></div>
        <div className="line"></div>
        <div className="line"></div>
      </div>
    </section>
  );
};

export default PricingSection;
