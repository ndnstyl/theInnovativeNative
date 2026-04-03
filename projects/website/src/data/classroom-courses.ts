export interface CoursePreview {
  id: string;
  title: string;
  thumbnail: string;
  href: string;
}

// IDs must match Supabase courses.id UUIDs so [courseSlug] routing works.
// Thumbnail mapping verified against actual image content 2026-04-03.
export const classroomCourses: CoursePreview[] = [
  { id: 'e0000000-0000-0000-0000-000000000001', title: 'Brand Vibe - START HERE', thumbnail: '/images/classroom/course-brand-vibe.jpg', href: '/classroom/e0000000-0000-0000-0000-000000000001' },
  { id: 'e0000000-0000-0000-0000-000000000002', title: 'Chaos to Clarity: AI-First Systems', thumbnail: '/images/classroom/course-chaos-to-clarity.jpg', href: '/classroom/e0000000-0000-0000-0000-000000000002' },
  { id: 'e0000000-0000-0000-0000-000000000003', title: 'n8n Templates', thumbnail: '/images/classroom/course-n8n-templates.jpg', href: '/classroom/e0000000-0000-0000-0000-000000000003' },
  { id: 'e0000000-0000-0000-0000-000000000004', title: 'Glossary & Resources', thumbnail: '/images/classroom/course-glossary.jpg', href: '/classroom/e0000000-0000-0000-0000-000000000004' },
  { id: 'e0000000-0000-0000-0000-000000000005', title: 'YouTube Workflows', thumbnail: '/images/classroom/course-resources.jpg', href: '/classroom/e0000000-0000-0000-0000-000000000005' },
  { id: 'e0000000-0000-0000-0000-000000000006', title: 'AI Fluency Weekend Build', thumbnail: '/images/classroom/course-templates.jpg', href: '/classroom/e0000000-0000-0000-0000-000000000006' },
  { id: 'e0000000-0000-0000-0000-000000000007', title: 'Growth Marketing Masterclass', thumbnail: '/images/classroom/course-n8n-templates.jpg', href: '/classroom/e0000000-0000-0000-0000-000000000007' },
  { id: 'e0000000-0000-0000-0000-000000000008', title: 'TwinGen', thumbnail: '/images/twingen/cover.png', href: '/classroom/e0000000-0000-0000-0000-000000000008' },
];
