import React from 'react';
import { N8nTemplate } from '@/data/templates';
import TemplateCard from './TemplateCard';

interface RelatedTemplatesProps {
  templates: N8nTemplate[];
}

const RelatedTemplates = ({ templates }: RelatedTemplatesProps) => {
  if (templates.length === 0) {
    return null;
  }

  return (
    <section className="related-templates">
      <h2 className="related-templates__title">You Might Also Like</h2>
      <div className="related-templates__grid">
        {templates.map((template) => (
          <TemplateCard key={template.id} template={template} />
        ))}
      </div>
    </section>
  );
};

export default RelatedTemplates;
