import React from "react";
import Image from "next/image";
import star from "public/images/star.png";

const Guarantee = () => {
  return (
    <section className="section hb-guarantee fade-wrapper">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-12 col-lg-8 text-center">
            <div className="hb-guarantee__badge fade-top">
              <div className="hb-guarantee__badge-icon">
                <i className="fa-solid fa-lock"></i>
              </div>
              <h3>No Refunds. Here&apos;s Why.</h3>
            </div>

            <div className="hb-guarantee__content fade-top">
              <p className="hb-guarantee__emphasis">
                <strong>This is a digital product. All sales are final.</strong>
              </p>
              <p>
                The moment you purchase, you get instant access to every workflow file,
                every prompt template, every system document. That&apos;s intellectual property
                you can download, duplicate, and keep forever. There&apos;s no way to &ldquo;return&rdquo; that.
              </p>
              <p>
                I&apos;m not here to take your money. I&apos;m here to hand you the exact system
                I use every single day to produce content for aSliceOfHaven. These aren&apos;t
                theoretical frameworks from someone who read a blog post. These are
                production workflows running right now.
              </p>
              <p>
                <strong>If you&apos;re not ready to do the work — do not buy this.</strong> Seriously.
                I would rather you wait until you&apos;re committed than purchase and let it
                collect dust. I don&apos;t want customers. I want builders.
              </p>
              <p className="hb-guarantee__closing">
                But if you&apos;re ready to build? Everything you need is inside.
              </p>
            </div>
          </div>
        </div>
      </div>

      <Image src={star} alt="" className="star" aria-hidden="true" />
    </section>
  );
};

export default Guarantee;
