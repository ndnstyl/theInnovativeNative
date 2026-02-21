import React from "react";
import Image from "next/image";
import star from "public/images/star.png";
import StripeBuyButton from "@/components/templates/StripeBuyButton";
import { HAVEN_BLUEPRINT, includedItems } from "@/data/haven-blueprint";

const PricingSection = () => {
  const spotsLeft = HAVEN_BLUEPRINT.scarcity.earlyBirdLimit - HAVEN_BLUEPRINT.scarcity.earlyBirdSold;
  const isEarlyBird = spotsLeft > 0;
  const currentPrice = isEarlyBird ? HAVEN_BLUEPRINT.price.earlyBird : HAVEN_BLUEPRINT.price.full;

  return (
    <section id="hb-pricing" className="section hb-pricing fade-wrapper">
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
            <div className="hb-pricing__card fade-top">
              {/* Scarcity Counter */}
              {isEarlyBird && (
                <div className="hb-pricing__scarcity">
                  <div className="hb-pricing__scarcity-bar">
                    <div
                      className="hb-pricing__scarcity-fill"
                      style={{ width: `${((HAVEN_BLUEPRINT.scarcity.earlyBirdLimit - spotsLeft) / HAVEN_BLUEPRINT.scarcity.earlyBirdLimit) * 100}%` }}
                    ></div>
                  </div>
                  <p className="hb-pricing__scarcity-text">
                    <i className="fa-solid fa-fire"></i>
                    <strong>{spotsLeft} of {HAVEN_BLUEPRINT.scarcity.earlyBirdLimit} early bird spots remaining</strong>
                    <span> — price increases to ${HAVEN_BLUEPRINT.price.full} after</span>
                  </p>
                </div>
              )}

              {/* Price */}
              <div className="hb-pricing__price">
                {isEarlyBird ? (
                  <>
                    <span className="hb-pricing__price-crossed">${HAVEN_BLUEPRINT.price.full}</span>
                    <span className="hb-pricing__price-current">${currentPrice}</span>
                    <span className="hb-pricing__price-label">early bird pricing — one-time payment</span>
                  </>
                ) : (
                  <>
                    <span className="hb-pricing__price-current">${currentPrice}</span>
                    <span className="hb-pricing__price-label">one-time payment</span>
                  </>
                )}
              </div>

              {/* Product Name */}
              <h3 className="hb-pricing__name">{HAVEN_BLUEPRINT.name}</h3>
              <p className="hb-pricing__tagline">{HAVEN_BLUEPRINT.description}</p>

              {/* Included Items */}
              <ul className="hb-pricing__checklist">
                {includedItems.map((item, index) => (
                  <li key={index}>
                    <i className="fa-solid fa-check-circle"></i>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>

              {/* Stripe Buy Button */}
              <div className="hb-pricing__checkout">
                <StripeBuyButton
                  buyButtonId={HAVEN_BLUEPRINT.stripe.buyButtonId}
                  publishableKey={HAVEN_BLUEPRINT.stripe.publishableKey}
                />
                {/* Fallback CTA for when Stripe Buy Button IDs haven't been configured */}
                <noscript>
                  <a href="#" className="btn btn--primary btn--large">
                    Get Instant Access — ${currentPrice}
                  </a>
                </noscript>
              </div>

              {/* Trust Badges */}
              <div className="hb-pricing__trust">
                <span><i className="fa-solid fa-shield"></i> Secure Checkout</span>
                <span><i className="fa-solid fa-bolt"></i> Instant Access</span>
                <span><i className="fa-solid fa-download"></i> Lifetime Access</span>
              </div>
            </div>

            {/* Inner Circle Add-On */}
            <div className="hb-pricing__upsells fade-top">
              <div className="hb-pricing__upsell-card">
                <div className="hb-pricing__upsell-badge">MOST POPULAR ADD-ON</div>
                <h4>{HAVEN_BLUEPRINT.upsells.innerCircle.name}</h4>
                <p>{HAVEN_BLUEPRINT.upsells.innerCircle.description}</p>
                <div className="hb-pricing__upsell-price">
                  <strong>${HAVEN_BLUEPRINT.upsells.innerCircle.price}</strong>
                  <span>/month</span>
                </div>
                <a
                  href={HAVEN_BLUEPRINT.upsells.innerCircle.stripeLink}
                  className="btn btn--tertiary"
                >
                  Join the Inner Circle
                  <i className="fa-solid fa-arrow-right"></i>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Image src={star} alt="" className="star star-one" aria-hidden="true" />
      <Image src={star} alt="" className="star star-two" aria-hidden="true" />
      <div className="hb-pricing__glow"></div>

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
