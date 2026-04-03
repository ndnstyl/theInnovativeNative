export interface CoursePreview {
  id: string;
  title: string;
  thumbnail: string;
  href: string;
}

// IDs and slugs must match Supabase courses table.
// Slugs are used for URLs, IDs for enrollment/checkout lookups.
// Verified against live Supabase query 2026-04-03.
export const classroomCourses: CoursePreview[] = [
  { id: 'e0000000-0000-0000-0000-000000000001', title: 'Brand Vibe - START HERE', thumbnail: '/images/classroom/course-brand-vibe.jpg', href: '/classroom/brand-vibe-start-here' },
  { id: 'e0000000-0000-0000-0000-000000000002', title: 'Chaos to Clarity: AI-First Systems', thumbnail: '/images/classroom/course-chaos-to-clarity.jpg', href: '/classroom/chaos-to-clarity-ai-first-systems' },
  { id: 'e0000000-0000-0000-0000-000000000003', title: 'n8n Templates', thumbnail: '/images/classroom/course-n8n-templates.jpg', href: '/classroom/n8n-templates' },
  { id: 'e0000000-0000-0000-0000-000000000004', title: 'Glossary & Resources', thumbnail: '/images/classroom/course-glossary.jpg', href: '/classroom/glossary-resources' },
  { id: 'e0000000-0000-0000-0000-000000000005', title: 'YouTube Workflows', thumbnail: '/images/classroom/course-resources.jpg', href: '/classroom/youtube-workflows' },
  { id: 'e0000000-0000-0000-0000-000000000006', title: 'AI Fluency Weekend Build', thumbnail: '/images/classroom/course-templates.jpg', href: '/classroom/ai-fluency-weekend-build' },
  { id: 'e0000000-0000-0000-0000-000000000007', title: 'Growth Marketing Masterclass', thumbnail: '/images/classroom/course-n8n-templates.jpg', href: '/classroom/growth-marketing-masterclass' },
];
