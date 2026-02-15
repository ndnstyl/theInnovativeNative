// Testimonials Data
// Source: Google Reviews from previous brand
// Last updated: 2026-02-05

export interface Testimonial {
  id: number;
  quote: string;
  author: string;
  role?: string;
  firmType?: string;
  firmSize?: string;
  result?: string;
  platform?: string; // "Google Review" etc.
}

export const testimonials: Testimonial[] = [
  {
    id: 1,
    quote: "They took over our Instagram and in just over 50 days they got us over 3,500+ followers and with their insight they have helped us double our engagement!",
    author: "Sandeep V.",
    role: "Business Owner",
    result: "3,500+ followers in 50 days, 2x engagement",
    platform: "Google Review",
  },
  {
    id: 2,
    quote: "Amazing insight to business! Very professional and easy to work with! I had a great experience and would definitely recommend to anyone looking to build their business!",
    author: "Idalia T.",
    role: "Business Owner",
    platform: "Google Review",
  },
  {
    id: 3,
    quote: "Michael is professional, courteous, competitively priced, prompt, and talented. He has a true passion for his work and his clients. I recommend with the utmost confidence to everyone I know.",
    author: "Margie V.",
    role: "Business Owner",
    platform: "Google Review",
  },
  {
    id: 4,
    quote: "My Instagram is going so crazy I actually turned OFF my notifications!",
    author: "Anil D.",
    role: "Business Owner",
    platform: "Google Review",
  },
];

// Placeholder for future law firm testimonials (anonymized per NDA/NDC)
// Example structure:
// {
//   id: 5,
//   quote: "Finally, an intake system that doesn't require a law degree to configure.",
//   author: "Managing Partner",
//   firmType: "Criminal Defense Firm",
//   firmSize: "12-attorney",
//   result: "4-hour intake (down from 3 days)",
// },
