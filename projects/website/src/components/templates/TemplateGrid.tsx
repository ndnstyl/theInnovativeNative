import React from 'react';
import { N8nTemplate } from '@/data/templates';
import TemplateCard from './TemplateCard';

interface TemplateGridProps {
  templates: N8nTemplate[];
}

const TemplateGrid = ({ templates }: TemplateGridProps) => {
  if (templates.length === 0) {
    return (
      <div className="template-grid-empty">
        <i className="fa-solid fa-inbox"></i>
        <h3>No templates found</h3>
        <p>Try adjusting your filters or check back later for new templates.</p>
      </div>
    );
  }

  return (
    <div className="template-grid">
      {templates.map((template) => (
        <TemplateCard key={template.id} template={template} />
      ))}
    </div>
  );
};

export default TemplateGrid;
