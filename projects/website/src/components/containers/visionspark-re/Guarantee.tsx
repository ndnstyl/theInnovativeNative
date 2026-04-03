import React from "react";
import Image from "next/image";
import star from "public/images/star.png";

const Guarantee = () => {
  return (
    <section className="section vs-guarantee fade-wrapper">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-12 col-lg-8 text-center">
            <div className="vs-guarantee__badge fade-top">
              <div className="vs-guarantee__badge-icon">
                <i className="fa-solid fa-lock"></i>
              </div>
              <h3>30-Day Money-Back Guarantee</h3>
            </div>

            <div className="vs-guarantee__content fade-top">
              <p className="vs-guarantee__emphasis">
                <strong>This is a 30-day build-it-or-get-your-money-back guarantee.</strong>
              </p>
              <p>
                The moment you purchase, you get instant access to every workflow file,
                every prompt template, and every system document behind the listing video pipeline.
                That includes the AI staging workflows, the Veo 3.1 walkthrough generation setup,
                and the branded reel assembly — all of it.
              </p>
              <p>
                This isn&apos;t theory from someone who watched a YouTube video. This is a production
                pipeline that generates real listing content right now. The staging photos, the
                generative walkthroughs, the branded reels with disclosure overlays — it all runs.
              </p>
              <p>
                If you do the work and don&apos;t see a clear path to producing AI listing content
                at a fraction of traditional staging costs — email me and I&apos;ll refund every penny.
              </p>
              <p className="vs-guarantee__closing">
                But if you&apos;re ready to transform your listing marketing? Everything you need is inside.
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
