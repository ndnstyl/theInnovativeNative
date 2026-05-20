import React from "react";
import Image from "next/image";
import star from "public/images/star.png";
import trustVaultImage from "public/images/law-firm-rag/trust-vault-shield.jpg";

const trustBadges = [
  {
    icon: "fa-shield-check",
    title: "SOC2 Ready Architecture",
    description: "Infrastructure designed for SOC2 Type II compliance. Audit trails, access controls, and encryption at rest and in transit."
  },
  {
    icon: "fa-user-lock",
    title: "No PII Training",
    description: "Your documents are never used to train models. Client data stays client data. Period."
  },
  {
    icon: "fa-server",
    title: "Self-Hosted Option",
    description: "For firms requiring complete data sovereignty, on-premise deployment is available. Your servers. Your control."
  }
];

const TrustIndicators = () => {
  return (
    <section className="section lfr-trust fade-wrapper">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-12 col-lg-8 text-center">
            <span className="sub-title fade-top">
              SECURITY & TRUST
              <i className="fa-solid fa-arrow-right"></i>
            </span>
            <h2 className="title title-anim mt-3">
              Your Documents Stay Yours
            </h2>
            <p className="lfr-trust__subtitle fade-top">
              We understand that client confidentiality isn&apos;t negotiable.
              Our security architecture reflects that reality.
            </p>
          </div>
        </div>

        <div className="row gaper mt-5">
          {trustBadges.map((badge, index) => (
            <div key={index} className="col-12 col-md-4">
              <div className="lfr-trust__badge fade-top">
                <div className="lfr-trust__badge-icon">
                  <i className={`fa-solid ${badge.icon}`}></i>
                </div>
                <h4>{badge.title}</h4>
                <p>{badge.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Additional Trust Messaging */}
        <div className="row justify-content-center align-items-center mt-5">
          {/* Vault Image - Desktop only */}
          <div className="col-12 col-lg-4 d-none d-lg-block">
            <div className="lfr-trust__image fade-top">
              <Image
                src={trustVaultImage}
                alt="Enterprise-grade security: vault protection for your data"
                width={400}
                height={400}
                style={{ width: '100%', height: 'auto', borderRadius: '12px' }}
              />
            </div>
          </div>
          <div className="col-12 col-lg-6">
            <div className="lfr-trust__message fade-top">
              <div className="trust-icon d-lg-none">
                <i className="fa-solid fa-lock"></i>
              </div>
              <div className="trust-content">
                <h4>Enterprise-Grade Security</h4>
                <ul>
                  <li>
                    <i className="fa-solid fa-check"></i>
                    End-to-end encryption (AES-256)
                  </li>
                  <li>
                    <i className="fa-solid fa-check"></i>
                    Role-based access controls
                  </li>
                  <li>
                    <i className="fa-solid fa-check"></i>
                    Complete audit logging
                  </li>
                  <li>
                    <i className="fa-solid fa-check"></i>
                    Data residency options (US, EU)
                  </li>
                  <li>
                    <i className="fa-solid fa-check"></i>
                    Regular third-party security audits
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Image src={star} alt="" className="star" aria-hidden="true" />
    </section>
  );
};

export default TrustIndicators;
