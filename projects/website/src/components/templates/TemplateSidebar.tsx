import React, { useState } from 'react';
import { N8nTemplate } from '@/data/templates';
import StripeBuyButton from './StripeBuyButton';

interface TemplateSidebarProps {
  template: N8nTemplate;
}

const disclaimerItems = [
  'I have a running n8n instance (self-hosted or cloud)',
  'I will configure my own API credentials',
  'I understand this is a workflow template, not a managed service',
  'I have basic n8n knowledge',
];

const TemplateSidebar = ({ template }: TemplateSidebarProps) => {
  const [accepted, setAccepted] = useState(false);

  const priceDisplay = template.price.minimum === 0
    ? 'Pay what you want'
    : `$${template.price.suggested}`;

  return (
    <aside className="template-sidebar">
      <div className="template-sidebar__card">
        <div className="template-sidebar__price">
          <span className="template-sidebar__price-amount">{priceDisplay}</span>
        </div>

        <div className="template-sidebar__divider"></div>

        <div className="template-sidebar__section">
          <h4 className="template-sidebar__section-title">What&apos;s Included</h4>
          <ul className="template-sidebar__features">
            <li>
              <i className="fa-solid fa-check"></i>
              <span>Complete n8n workflow JSON</span>
            </li>
            <li>
              <i className="fa-solid fa-check"></i>
              <span>Step-by-step setup guide</span>
            </li>
            <li>
              <i className="fa-solid fa-check"></i>
              <span>Troubleshooting tips</span>
            </li>
            <li>
              <i className="fa-solid fa-check"></i>
              <span>Lifetime updates</span>
            </li>
          </ul>
        </div>

        <div className="template-sidebar__divider"></div>

        <div className="template-sidebar__section">
          <h4 className="template-sidebar__section-title">Before You Buy</h4>
          <div className={`template-sidebar__disclaimer-row${!accepted ? ' template-sidebar__disclaimer-row--attention' : ''}`}>
            {!accepted && (
              <span className="template-sidebar__attention-arrow">
                <i className="fa-solid fa-arrow-right"></i>
              </span>
            )}
            <label className="template-sidebar__disclaimer-single">
              <input
                type="checkbox"
                checked={accepted}
                onChange={() => setAccepted(!accepted)}
                className="template-sidebar__checkbox"
              />
              <span className="template-sidebar__checkbox-custom">
                {accepted && <i className="fa-solid fa-check"></i>}
              </span>
              <span className="template-sidebar__disclaimer-text">
                I confirm the following:
              </span>
            </label>
          </div>
          <ul className="template-sidebar__disclaimer-list">
            {disclaimerItems.map((item, i) => (
              <li key={i}>
                <i className="fa-solid fa-chevron-right"></i>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className={`template-sidebar__buy-gate${accepted ? ' template-sidebar__buy-gate--active' : ''}`}>
          {accepted ? (
            <>
              <StripeBuyButton
                buyButtonId={template.stripeBuyButtonId}
                publishableKey={template.stripePublishableKey}
              />
              <div className="template-sidebar__trust-badge">
                <div className="template-sidebar__trust-row">
                  <i className="fa-solid fa-lock" style={{ fontSize: 12, color: '#6772E5' }}></i>
                  <span>Secure checkout powered by</span>
                  <i className="fa-brands fa-stripe" style={{ fontSize: 28, color: '#6772E5' }}></i>
                </div>
                <div className="template-sidebar__trust-icons">
                  <i className="fa-brands fa-cc-visa"></i>
                  <i className="fa-brands fa-cc-mastercard"></i>
                  <i className="fa-brands fa-cc-amex"></i>
                  <i className="fa-brands fa-cc-apple-pay"></i>
                </div>
              </div>
            </>
          ) : (
            <div className="template-sidebar__buy-locked">
              <i className="fa-solid fa-lock"></i>
              <span>Check the box above to purchase</span>
            </div>
          )}
        </div>

        <div className="template-sidebar__divider"></div>

        <div className="template-sidebar__section">
          <h4 className="template-sidebar__section-title">Requirements</h4>
          <ul className="template-sidebar__features">
            {template.walkthrough.requirements.map((req, index) => (
              <li key={index}>
                <i className="fa-solid fa-circle" style={{ fontSize: 6, marginTop: 8 }}></i>
                <span>{req}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </aside>
  );
};

export default TemplateSidebar;
