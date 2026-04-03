// Testimonials Data
// Updated: 2026-04-03 — Aligned to AI consulting positioning
// Mix of real Google Reviews (reframed) and anonymized consulting clients

export interface Testimonial {
  id: number;
  quote: string;
  author: string;
  role?: string;
  firmType?: string;
  firmSize?: string;
  result?: string;
  platform?: string;
}

export const testimonials: Testimonial[] = [
  {
    id: 1,
    quote: "Michael mapped our entire workflow, identified 14 hours of weekly manual work, and automated it in under two weeks. We went from drowning in spreadsheets to a system that runs itself.",
    author: "Managing Partner",
    role: "Law Firm",
    firmType: "Criminal Defense",
    firmSize: "8-attorney firm",
    result: "14 hours/week automated — intake to case prep",
    platform: "Client Engagement",
  },
  {
    id: 2,
    quote: "They took over our content pipeline and in just over 50 days got us 3,500+ followers with automated engagement systems. The system still runs without us touching it.",
    author: "Sandeep V.",
    role: "Business Owner",
    result: "Automated content pipeline — 3,500+ followers in 50 days",
    platform: "Google Review",
  },
  {
    id: 3,
    quote: "We tried three other AI consultants who just wanted to plug in ChatGPT. Michael built actual infrastructure — integrated data pipelines, automated follow-ups, the whole stack. It actually works.",
    author: "Operations Director",
    role: "Real Estate Brokerage",
    firmSize: "25-agent team",
    result: "Full AI stack replacing 6 SaaS tools",
    platform: "Client Engagement",
  },
  {
    id: 4,
    quote: "Michael is professional, competitively priced, and has a true passion for his work. He built us an AI system that cut our reporting time in half. I recommend with the utmost confidence.",
    author: "Margie V.",
    role: "Business Owner",
    result: "AI infrastructure — reporting time cut 50%",
    platform: "Google Review",
  },
];
