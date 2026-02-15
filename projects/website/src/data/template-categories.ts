export interface TemplateCategory {
  id: string;
  label: string;
  slug: string;
  icon: string;
  description: string;
}

export const templateCategories: TemplateCategory[] = [
  {
    id: 'all',
    label: 'All Templates',
    slug: 'all',
    icon: 'fa-solid fa-grid-2',
    description: 'Browse all available n8n workflow templates',
  },
  {
    id: 'scraping',
    label: 'Web Scraping',
    slug: 'scraping',
    icon: 'fa-solid fa-spider-web',
    description: 'Extract data from websites and APIs automatically',
  },
  {
    id: 'social-media',
    label: 'Social Media',
    slug: 'social-media',
    icon: 'fa-solid fa-share-nodes',
    description: 'Automate social media workflows and data collection',
  },
  {
    id: 'lead-gen',
    label: 'Lead Generation',
    slug: 'lead-gen',
    icon: 'fa-solid fa-bullseye',
    description: 'Automate prospecting and lead qualification',
  },
  {
    id: 'ai-automation',
    label: 'AI Automation',
    slug: 'ai-automation',
    icon: 'fa-solid fa-brain',
    description: 'AI-powered workflows with LLMs and machine learning',
  },
  {
    id: 'data-pipeline',
    label: 'Data Pipelines',
    slug: 'data-pipeline',
    icon: 'fa-solid fa-diagram-project',
    description: 'ETL workflows and data transformation pipelines',
  },
  {
    id: 'notifications',
    label: 'Notifications',
    slug: 'notifications',
    icon: 'fa-solid fa-bell',
    description: 'Alert and notification automation workflows',
  },
];
