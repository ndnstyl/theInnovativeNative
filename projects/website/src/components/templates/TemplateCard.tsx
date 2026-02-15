import React from 'react';
import Link from 'next/link';
import { N8nTemplate } from '@/data/templates';

interface TemplateCardProps {
  template: N8nTemplate;
}

const TemplateCard = ({ template }: TemplateCardProps) => {
  const priceDisplay = template.price.minimum === 0
    ? 'Pay what you want'
    : `$${template.price.suggested}`;

  const difficultyColors: Record<string, string> = {
    beginner: '#4ade80',
    intermediate: '#fbbf24',
    advanced: '#f87171',
  };

  return (
    <Link href={`/templates/${template.slug}`} className="template-card">
      <div className="template-card__thumbnail">
        {template.thumbnail ? (
          <img src={template.thumbnail} alt={template.title} loading="lazy" />
        ) : (
          <div className="template-card__placeholder">
            <i className="fa-solid fa-diagram-project"></i>
          </div>
        )}
      </div>
      <div className="template-card__content">
        <div className="template-card__categories">
          {template.categories.map((cat) => (
            <span key={cat} className="template-card__category">
              {cat.replace('-', ' ')}
            </span>
          ))}
        </div>
        <h3 className="template-card__title">{template.title}</h3>
        <p className="template-card__tagline">{template.tagline}</p>
        <div className="template-card__footer">
          <span
            className="template-card__difficulty"
            style={{ color: difficultyColors[template.difficulty] }}
          >
            {template.difficulty}
          </span>
          <span className="template-card__price">{priceDisplay}</span>
        </div>
      </div>
    </Link>
  );
};

export default TemplateCard;
