import React, { useState } from "react";

interface ContactCardProps {
  name: string;
  agency?: string;
  phone?: string;
  address?: string;
  website?: string;
  description: string;
  category: string;
}

const CategoryBadge = ({ category }: { category: string }) => {
  const slug = category.toLowerCase().replace(/\s+/g, "-");
  return (
    <span className={`gw-contact-card__category gw-contact-card__category--${slug}`}>
      {category}
    </span>
  );
};

const ContactCard = ({
  name,
  agency,
  phone,
  address,
  website,
  description,
  category,
}: ContactCardProps) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    const parts: string[] = [name];
    if (agency) parts.push(agency);
    if (phone) parts.push(`Phone: ${phone}`);
    if (address) parts.push(`Address: ${address}`);
    if (website) parts.push(`Website: ${website}`);
    navigator.clipboard.writeText(parts.join("\n")).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="gw-contact-card">
      <div className="gw-contact-card__header">
        <div>
          <div className="gw-contact-card__name">{name}</div>
          {agency && <div className="gw-contact-card__agency">{agency}</div>}
        </div>
        <CategoryBadge category={category} />
      </div>

      <p className="gw-contact-card__description">{description}</p>

      {(phone || address || website) && (
        <div className="gw-contact-card__details">
          {phone && (
            <div className="gw-contact-card__detail">
              <i className="fa-sharp fa-solid fa-phone" />
              <a href={`tel:${phone.replace(/\D/g, "")}`} className="gw-contact-card__phone-link">
                {phone}
              </a>
            </div>
          )}
          {address && (
            <div className="gw-contact-card__detail">
              <i className="fa-sharp fa-solid fa-location-dot" />
              <span>{address}</span>
            </div>
          )}
          {website && (
            <div className="gw-contact-card__detail">
              <i className="fa-sharp fa-solid fa-globe" />
              <a
                href={website}
                target="_blank"
                rel="noopener noreferrer"
                className="gw-contact-card__website-link"
              >
                {website.replace(/^https?:\/\//, "")}
              </a>
            </div>
          )}
        </div>
      )}

      <div className="gw-contact-card__actions">
        <button
          className={`gw-contact-card__copy-btn${copied ? " gw-contact-card__copy-btn--copied" : ""}`}
          onClick={handleCopy}
          type="button"
        >
          <i className={`fa-sharp fa-solid fa-${copied ? "check" : "copy"}`} />
          {" "}
          {copied ? "Copied!" : "Copy Info"}
        </button>
      </div>
    </div>
  );
};

export default ContactCard;
