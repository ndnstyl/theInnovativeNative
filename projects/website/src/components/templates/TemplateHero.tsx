import React from 'react';
import Link from 'next/link';
import { N8nTemplate } from '@/data/templates';

interface TemplateHeroProps {
  template: N8nTemplate;
}

const TemplateHero = ({ template }: TemplateHeroProps) => {
  const difficultyColors: Record<string, string> = {
    beginner: '#4ade80',
    intermediate: '#fbbf24',
    advanced: '#f87171',
  };

  return (
    <div className="template-hero">
      <div className="template-hero__breadcrumb">
        <Link href="/templates">Templates</Link>
        <i className="fa-solid fa-chevron-right"></i>
        <span>{template.title}</span>
      </div>

      <div className="template-hero__content">
        <div className="template-hero__main">
          <h1 className="template-hero__title">{template.title}</h1>
          <p className="template-hero__tagline">{template.tagline}</p>

          <div className="template-hero__categories">
            {template.categories.map((cat) => (
              <span key={cat} className="template-hero__category">
                {cat.replace('-', ' ')}
              </span>
            ))}
          </div>

          <div className="template-hero__meta">
            <div className="template-hero__meta-item">
              <span
                className="template-hero__difficulty"
                style={{ color: difficultyColors[template.difficulty] }}
              >
                <i className="fa-solid fa-signal"></i>
                {template.difficulty}
              </span>
            </div>
            <div className="template-hero__meta-item">
              <i className="fa-solid fa-code-branch"></i>
              <span>v{template.meta.version}</span>
            </div>
            <div className="template-hero__meta-item">
              <i className="fa-solid fa-calendar"></i>
              <span>Updated {new Date(template.meta.lastUpdated).toLocaleDateString()}</span>
            </div>
            <div className="template-hero__meta-item">
              <i className="fa-solid fa-download"></i>
              <span>{template.meta.downloads} downloads</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TemplateHero;
