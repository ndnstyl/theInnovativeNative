import React, { useState } from "react";
import Layout from "@/components/layout/Layout";
import CmnBanner from "@/components/layout/banner/CmnBanner";

// Resume section types
type SectionId = 'summary' | 'experience' | 'skills' | 'achievements' | 'strengths' | 'mytime' | 'education';

interface ExperienceRole {
  title: string;
  company: string;
  dates: string;
  bullets: string[];
  tech?: string[];
}

interface SkillCategory {
  name: string;
  percentage: number;
  details: string[];
}

interface TimeCategory {
  letter: string;
  name: string;
  percentage: number;
  description: string;
}

interface RoleMatch {
  title: string;
  tagline: string;
  keyResponsibilities: string[];
  experienceMatch: string[];
}

// Resume Data
const experienceRoles: ExperienceRole[] = [
  {
    title: "Senior AI & Growth Strategist",
    company: "Automation Station",
    dates: "02/2024 - Present",
    bullets: [
      "Architected automated lead nurturing systems generating $1.2M+ incremental revenue in first year",
      "Built end-to-end attribution pipeline using n8n, Airtable, HubSpot—reducing reporting time 80%",
      "Improved lead-to-close rate 4X through automated qualification workflows",
    ],
    tech: ["n8n", "Supabase", "Airtable", "Gemini", "HubSpot", "Twilio"],
  },
  {
    title: "Digital Media Consultant",
    company: "The Innovative Native",
    dates: "04/2015 - Present",
    bullets: [
      "Drove 300% increase in qualified leads in 90 days for SaaS client through integrated PPC/SEO strategy",
      "Managed $250K-$500K monthly ad budgets across Google, Meta, LinkedIn",
      "Designed customer journey maps and retargeting frameworks",
      "Scaled client portfolio 5.3x ($225K → $1.2M/month) via value-based pricing and data infrastructure",
    ],
  },
  {
    title: "Growth Marketing Manager",
    company: "Lawclerk",
    dates: "01/2022 - 09/2024",
    bullets: [
      "Owned $70K/month per platform budget (Google, LinkedIn, Meta, YouTube) for B2B SaaS legal marketplace",
      "Achieved 10%+ month-over-month growth for 12+ consecutive months while reducing CPA by 52%",
      "Led cross-functional growth initiatives across product, sales, and content teams",
      "Named Employee of the Month 5 times",
    ],
  },
  {
    title: "Marketing Director",
    company: "Performax Labs",
    dates: "01/2018 - 03/2020",
    bullets: [
      "Directed full digital presence for sports nutrition CPG across paid, organic, and social channels",
      "Built A/B testing frameworks for landing pages and creative",
      "Produced all photo/video content in-house",
    ],
  },
];

const skillCategories: SkillCategory[] = [
  {
    name: "Growth Strategy & Experimentation",
    percentage: 95,
    details: [
      "Full-funnel growth architecture from awareness to retention",
      "Running 25+ tests monthly across acquisition and activation",
      "Experiment design, statistical significance, cohort analysis",
      "Product-led growth, viral loops, referral programs",
    ],
  },
  {
    name: "A/B Testing & CRO",
    percentage: 90,
    details: [
      "Landing page optimization achieving 28% CPA reduction",
      "Creative testing frameworks at scale",
      "Multivariate testing, personalization, behavioral targeting",
      "Tools: Optimizely, VWO, custom frameworks",
    ],
  },
  {
    name: "Paid Media (Google, Meta, LinkedIn)",
    percentage: 95,
    details: [
      "Managed $50M+ lifetime media spend",
      "Google Ads (Search, Display, YouTube, PMax), Meta, LinkedIn, Programmatic",
      "Scaled campaigns 3-4x while maintaining efficiency",
      "40% ROAS improvement through AI-optimized bidding",
    ],
  },
  {
    name: "Attribution & Full-Funnel Analytics",
    percentage: 90,
    details: [
      "Multi-touch attribution modeling",
      "Server-side tracking improving accuracy 40%",
      "Marketing mix modeling, incrementality testing",
      "Tools: GA4, Mixpanel, Amplitude, Looker Studio, BigQuery",
    ],
  },
  {
    name: "Marketing Automation (n8n, HubSpot)",
    percentage: 95,
    details: [
      "n8n as control plane (queue mode, workers, error handling)",
      "Automated 90% of lead-to-delivery pipelines",
      "CRM automation reducing manual effort 60%",
      "HubSpot, Marketo, Customer.io, Pardot integration",
    ],
  },
  {
    name: "AI-Powered Campaign Systems",
    percentage: 90,
    details: [
      "LLM integration (GPT-4, Claude, Gemini 2.5 Pro)",
      "RAG systems for contextual intelligence",
      "AI lead scoring increasing sales efficiency 40%",
      "Prompt engineering, evaluation pipelines, multi-agent orchestration",
    ],
  },
];

const timeCategories: TimeCategory[] = [
  {
    letter: "A",
    name: "Systems Diagnosis",
    percentage: 25,
    description: "Pattern recognition across growth systems. Identifying structural vs. tactical issues. Separating signal from noise in reporting. Finding what's actually driving results.",
  },
  {
    letter: "B",
    name: "Economic Modeling",
    percentage: 15,
    description: "Unit economics, marginal CPA analysis. Revenue attribution and incrementality. Forecasting and scenario planning. ROI frameworks for decision-making.",
  },
  {
    letter: "C",
    name: "Re-Architecture",
    percentage: 20,
    description: "Rebuilding systems that have reached structural limits. Designing scalable automation infrastructure. Creating systems that survive without tribal knowledge. Production-grade workflow design.",
  },
  {
    letter: "D",
    name: "Decision Empowerment",
    percentage: 15,
    description: "Enabling leadership to make confident calls. Translating data into actionable insights. Building dashboards that drive decisions, not just display data. Stakeholder alignment and communication.",
  },
  {
    letter: "E",
    name: "Executive Oversight",
    percentage: 10,
    description: "Strategic advisory and fractional CMO work. Board-level reporting and communication. Team leadership and capability building. P&L ownership and accountability.",
  },
  {
    letter: "F",
    name: "Feedback & Control Loops",
    percentage: 15,
    description: "Implementing measurement systems. Building error handling and recovery paths. Creating human-in-the-loop checkpoints. Continuous improvement frameworks.",
  },
];

const roleMatches: RoleMatch[] = [
  {
    title: "Fractional CMO",
    tagline: "Strategic leadership for organizations needing structural correction, not incremental optimization.",
    keyResponsibilities: [
      "Lead marketing strategy and team direction at the executive level",
      "Diagnose systemic issues in growth systems and implement corrective architecture",
      "Own P&L accountability and board-level reporting",
      "Build and mentor high-performing marketing teams",
      "Align marketing efforts with business objectives and revenue targets",
    ],
    experienceMatch: [
      "Scaled portfolio 5.3x ($225K → $1.2M/mo) through structural improvements",
      "Led cross-functional initiatives across product, sales, and content",
      "Managed $50M+ lifetime media spend with full budget ownership",
      "Cut 120 KPIs to ~45 while improving efficiency 18-22%",
    ],
  },
  {
    title: "Sr. Growth & Performance Marketing",
    tagline: "Full-funnel growth strategy with deep paid media expertise across Google, Meta, and LinkedIn.",
    keyResponsibilities: [
      "Design and execute full-funnel growth strategies from awareness to retention",
      "Manage large-scale paid media campaigns ($100K-$500K/mo budgets)",
      "Build experimentation frameworks and A/B testing programs",
      "Develop attribution models and performance measurement systems",
      "Optimize CAC, LTV, and ROAS across channels",
    ],
    experienceMatch: [
      "Achieved 10%+ MoM growth for 12+ consecutive months while reducing CPA 52%",
      "Drove 300% increase in qualified leads in 90 days via integrated PPC/SEO",
      "40% ROAS improvement through AI-optimized bidding strategies",
      "Built A/B testing frameworks for landing pages and creative at scale",
    ],
  },
  {
    title: "AI Automation Engineer",
    tagline: "Production-grade workflow development integrating LLMs into real business operations.",
    keyResponsibilities: [
      "Architect and deploy AI-powered automation systems using n8n, Make, or similar",
      "Integrate LLMs (GPT-4, Claude, Gemini) into business workflows",
      "Build data pipelines connecting CRMs, databases, and external APIs",
      "Design error handling, retry logic, and human-in-the-loop checkpoints",
      "Create RAG systems and multi-agent orchestration patterns",
    ],
    experienceMatch: [
      "Architected lead nurturing systems generating $1.2M+ incremental revenue",
      "Built end-to-end attribution pipeline reducing reporting time 80%",
      "Improved lead-to-close rate 4X through automated qualification workflows",
      "Automated 90% of lead-to-delivery pipelines with production-grade reliability",
    ],
  },
];

// Top row - scrolls left (Tools & Platforms)
const toolsRow = [
  "n8n", "OpenAI / GPT-4", "Claude / Anthropic", "Airtable", "Google Ads",
  "Meta Ads", "LinkedIn Ads", "Google Analytics", "HubSpot", "Salesforce",
  "Tableau", "SQL", "JavaScript", "Python", "HTML/CSS", "WordPress",
  "Shopify", "Adobe Creative Suite", "Canva", "Make (Integromat)",
  "Supabase", "Zapier", "Hootsuite", "Pardot", "Salesforce Marketing Cloud"
];

// Bottom row - scrolls right (Skills & Competencies)
const skillsRow = [
  "AI Automation", "Marketing Strategy", "Performance Marketing", "PPC Campaign Management",
  "SEO", "SEM", "Lead Generation", "Conversion Rate Optimization", "A/B Testing",
  "Marketing Analytics", "Team Management", "P&L Management", "Growth Marketing",
  "Digital Marketing", "Content Strategy", "Email Marketing", "Data Analytics",
  "Project Management", "Brand Strategy", "Customer Acquisition", "Marketing Automation",
  "Revenue Growth", "Business Development", "Copywriting", "Video Production"
];

// Skill Bar Component
const SkillBar = ({ name, percentage }: { name: string; percentage: number }) => (
  <div style={{ marginBottom: '12px' }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
      <span style={{ color: '#fff', fontSize: '13px' }}>{name}</span>
      <span style={{ color: '#00FFFF', fontSize: '12px' }}>{percentage}%</span>
    </div>
    <div style={{
      height: '6px',
      background: 'rgba(255,255,255,0.1)',
      borderRadius: '3px',
      overflow: 'hidden',
    }}>
      <div style={{
        width: `${percentage}%`,
        height: '100%',
        background: 'linear-gradient(90deg, #00FFFF, #00CCCC)',
        borderRadius: '3px',
        transition: 'width 0.5s ease-out',
      }} />
    </div>
  </div>
);

// Hexagon Diagram Component
const HexagonDiagram = () => {
  const size = 160;
  const centerX = size / 2;
  const centerY = size / 2;
  const radius = size * 0.35;

  // Generate hexagon points
  const hexPoints = timeCategories.map((_, i) => {
    const angle = (i * 60 - 90) * (Math.PI / 180);
    return {
      x: centerX + radius * Math.cos(angle),
      y: centerY + radius * Math.sin(angle),
    };
  });

  const hexPath = hexPoints.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ') + ' Z';

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {/* Hexagon outline */}
      <path
        d={hexPath}
        fill="rgba(0, 255, 255, 0.1)"
        stroke="#00FFFF"
        strokeWidth="2"
      />
      {/* Letter labels */}
      {timeCategories.map((cat, i) => {
        const angle = (i * 60 - 90) * (Math.PI / 180);
        const labelRadius = radius + 20;
        const x = centerX + labelRadius * Math.cos(angle);
        const y = centerY + labelRadius * Math.sin(angle);
        return (
          <text
            key={cat.letter}
            x={x}
            y={y}
            fill="#00FFFF"
            fontSize="14"
            fontWeight="bold"
            textAnchor="middle"
            dominantBaseline="middle"
          >
            {cat.letter}
          </text>
        );
      })}
    </svg>
  );
};

// Resume Section Card Component
const ResumeCard = ({
  title,
  children,
  onClick,
}: {
  title: string;
  children: React.ReactNode;
  onClick: () => void;
}) => (
  <div
    onClick={onClick}
    style={{
      background: 'rgba(255,255,255,0.03)',
      border: '1px solid rgba(255,255,255,0.1)',
      borderRadius: '12px',
      padding: '20px',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
    }}
    className="resume-card-hover"
  >
    <h4 style={{
      color: '#00FFFF',
      fontSize: '12px',
      textTransform: 'uppercase',
      letterSpacing: '1.5px',
      marginBottom: '16px',
      fontWeight: 600,
    }}>
      {title}
    </h4>
    {children}
    <div style={{
      marginTop: '12px',
      color: 'rgba(255,255,255,0.4)',
      fontSize: '11px',
      display: 'flex',
      alignItems: 'center',
      gap: '4px',
    }}>
      <span>Click to expand</span>
      <i className="fa-solid fa-arrow-right" style={{ fontSize: '10px' }}></i>
    </div>
  </div>
);

// Modal Component
const ResumeModal = ({
  isOpen,
  onClose,
  title,
  children,
}: {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}) => {
  if (!isOpen) return null;

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.85)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          backgroundColor: '#1a1a1a',
          borderRadius: '16px',
          maxWidth: '800px',
          width: '100%',
          maxHeight: '90vh',
          overflow: 'auto',
          position: 'relative',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
        }}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            background: 'rgba(255, 255, 255, 0.1)',
            border: 'none',
            borderRadius: '50%',
            width: '40px',
            height: '40px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            fontSize: '20px',
            zIndex: 10,
          }}
        >
          <i className="fa-light fa-xmark"></i>
        </button>

        {/* Modal Content */}
        <div style={{ padding: '40px' }}>
          <h2 style={{
            color: '#00FFFF',
            fontSize: '14px',
            textTransform: 'uppercase',
            letterSpacing: '2px',
            marginBottom: '24px',
            fontWeight: 600,
          }}>
            {title}
          </h2>
          {children}
        </div>
      </div>
    </div>
  );
};

const ProfessionalExperience = () => {
  const [activeModal, setActiveModal] = useState<SectionId | null>(null);

  const openCalendly = () => {
    if (typeof window !== 'undefined' && (window as any).Calendly) {
      (window as any).Calendly.initPopupWidget({
        url: 'https://calendly.com/mike-buildmytribe/ai-discovery-call'
      });
    }
  };

  const styles = `
    @keyframes scrollLeft {
      0% { transform: translateX(0); }
      100% { transform: translateX(-50%); }
    }
    @keyframes scrollRight {
      0% { transform: translateX(-50%); }
      100% { transform: translateX(0); }
    }
    .marquee-container {
      overflow: hidden;
      width: 100%;
      mask-image: linear-gradient(to right, transparent, black 10%, black 90%, transparent);
      -webkit-mask-image: linear-gradient(to right, transparent, black 10%, black 90%, transparent);
    }
    .marquee-left {
      display: flex;
      animation: scrollLeft 30s linear infinite;
    }
    .marquee-right {
      display: flex;
      animation: scrollRight 30s linear infinite;
    }
    .marquee-left:hover, .marquee-right:hover {
      animation-play-state: paused;
    }
    .skill-tag {
      background: rgba(255,255,255,0.1);
      padding: 10px 20px;
      border-radius: 25px;
      font-size: 14px;
      color: #fff;
      white-space: nowrap;
      margin: 0 8px;
      flex-shrink: 0;
    }
    .resume-card-hover:hover {
      border-color: rgba(0, 255, 255, 0.4) !important;
      box-shadow: 0 0 20px rgba(0, 255, 255, 0.15);
      transform: translateY(-2px);
    }
    .experience-item {
      border-left: 2px solid rgba(0, 255, 255, 0.3);
      padding-left: 16px;
      margin-bottom: 20px;
    }
    .experience-item:last-child {
      margin-bottom: 0;
    }
    .role-card {
      background: rgba(255,255,255,0.03);
      border: 1px solid rgba(255,255,255,0.1);
      border-radius: 12px;
      padding: 24px;
      height: 100%;
      transition: all 0.3s ease;
    }
    .role-card:hover {
      border-color: rgba(0, 255, 255, 0.3);
      box-shadow: 0 0 15px rgba(0, 255, 255, 0.1);
    }
  `;

  // Modal content components
  const renderSummaryModal = () => (
    <div>
      <p style={{ color: '#d0d0d0', lineHeight: 1.8, marginBottom: '24px', fontSize: '16px' }}>
        Senior Growth Marketing leader with 19+ years of experience. I&apos;m typically brought in when leadership senses something is wrong but cannot articulate why.
      </p>

      <h4 style={{ color: '#00FFFF', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '12px' }}>
        Philosophy
      </h4>
      <p style={{ color: '#d0d0d0', lineHeight: 1.8, marginBottom: '24px' }}>
        I&apos;m not interested in cosmetic improvement. I&apos;m interested in whether a system can survive contact with reality.
      </p>

      <h4 style={{ color: '#00FFFF', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '12px' }}>
        Three Assumptions
      </h4>
      <p style={{ color: '#d0d0d0', lineHeight: 1.8, marginBottom: '8px' }}>
        I enter systems assuming:
      </p>
      <ol style={{ color: '#d0d0d0', lineHeight: 1.8, paddingLeft: '20px', marginBottom: '24px' }}>
        <li style={{ marginBottom: '8px' }}>Some parts are working for reasons no one fully understands</li>
        <li style={{ marginBottom: '8px' }}>Some parts are protected because they feel validating, not because they perform</li>
        <li>Most reporting tells a comforting story instead of a true one</li>
      </ol>

      <h4 style={{ color: '#00FFFF', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '12px' }}>
        Value Proposition
      </h4>
      <p style={{ color: '#d0d0d0', lineHeight: 1.8, marginBottom: '24px' }}>
        Pattern recognition across growth systems—identifying what&apos;s actually causal vs. what merely appears productive. My job is to identify which is which.
      </p>

      <div style={{
        background: 'rgba(0, 255, 255, 0.05)',
        padding: '16px',
        borderRadius: '8px',
        borderLeft: '3px solid #00FFFF',
      }}>
        <h4 style={{ color: '#00FFFF', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>
          Recent Focus
        </h4>
        <p style={{ color: '#d0d0d0', lineHeight: 1.7 }}>
          Last 3+ years: exclusive focus on production-grade AI systems—integrating LLMs into real business workflows, not demos.
        </p>
      </div>
    </div>
  );

  const renderExperienceModal = () => (
    <div>
      {experienceRoles.map((role, idx) => (
        <div key={idx} style={{
          marginBottom: idx < experienceRoles.length - 1 ? '32px' : 0,
          paddingBottom: idx < experienceRoles.length - 1 ? '32px' : 0,
          borderBottom: idx < experienceRoles.length - 1 ? '1px solid rgba(255,255,255,0.1)' : 'none',
        }}>
          <div style={{ marginBottom: '12px' }}>
            <h3 style={{ color: '#fff', fontSize: '18px', marginBottom: '4px' }}>{role.title}</h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
              <span style={{ color: '#00FFFF', fontWeight: 500 }}>{role.company}</span>
              <span style={{ color: '#888', fontSize: '14px' }}>{role.dates}</span>
            </div>
          </div>
          <ul style={{ color: '#d0d0d0', lineHeight: 1.7, paddingLeft: '20px', marginBottom: role.tech ? '12px' : 0 }}>
            {role.bullets.map((bullet, bulletIdx) => (
              <li key={bulletIdx} style={{ marginBottom: '8px' }}>{bullet}</li>
            ))}
          </ul>
          {role.tech && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {role.tech.map((tech, techIdx) => (
                <span key={techIdx} style={{
                  background: 'rgba(0, 255, 255, 0.1)',
                  color: '#00FFFF',
                  padding: '4px 10px',
                  borderRadius: '4px',
                  fontSize: '12px',
                }}>
                  {tech}
                </span>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );

  const renderSkillsModal = () => (
    <div>
      {skillCategories.map((skill, idx) => (
        <div key={idx} style={{
          marginBottom: idx < skillCategories.length - 1 ? '28px' : 0,
          paddingBottom: idx < skillCategories.length - 1 ? '28px' : 0,
          borderBottom: idx < skillCategories.length - 1 ? '1px solid rgba(255,255,255,0.1)' : 'none',
        }}>
          <div style={{ marginBottom: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <h4 style={{ color: '#fff', fontSize: '16px' }}>{skill.name}</h4>
              <span style={{ color: '#00FFFF', fontWeight: 600 }}>{skill.percentage}%</span>
            </div>
            <div style={{
              height: '6px',
              background: 'rgba(255,255,255,0.1)',
              borderRadius: '3px',
              overflow: 'hidden',
            }}>
              <div style={{
                width: `${skill.percentage}%`,
                height: '100%',
                background: 'linear-gradient(90deg, #00FFFF, #00CCCC)',
                borderRadius: '3px',
              }} />
            </div>
          </div>
          <ul style={{ color: '#d0d0d0', lineHeight: 1.7, paddingLeft: '20px' }}>
            {skill.details.map((detail, detailIdx) => (
              <li key={detailIdx} style={{ marginBottom: '4px', fontSize: '14px' }}>{detail}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );

  const renderAchievementsModal = () => (
    <div>
      <div style={{
        background: 'rgba(0, 255, 255, 0.05)',
        padding: '24px',
        borderRadius: '12px',
        marginBottom: '28px',
        borderLeft: '4px solid #00FFFF',
      }}>
        <h3 style={{ color: '#00FFFF', fontSize: '28px', marginBottom: '8px' }}>$1.2M/mo Revenue</h3>
        <p style={{ color: '#d0d0d0', fontSize: '16px' }}>Scaled from $225K in under 14 months (5.3x growth)</p>
      </div>

      <h4 style={{ color: '#00FFFF', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '12px' }}>
        The Story
      </h4>

      <div style={{ marginBottom: '20px' }}>
        <p style={{ color: '#888', fontSize: '12px', textTransform: 'uppercase', marginBottom: '4px' }}>Starting Point</p>
        <p style={{ color: '#d0d0d0', lineHeight: 1.7 }}>Portfolio at $225K/month across multiple clients</p>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <p style={{ color: '#888', fontSize: '12px', textTransform: 'uppercase', marginBottom: '4px' }}>Challenge</p>
        <p style={{ color: '#d0d0d0', lineHeight: 1.7 }}>Manual processes, fragmented data, inconsistent results</p>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <p style={{ color: '#888', fontSize: '12px', textTransform: 'uppercase', marginBottom: '8px' }}>Solution</p>
        <ul style={{ color: '#d0d0d0', lineHeight: 1.7, paddingLeft: '20px' }}>
          <li style={{ marginBottom: '6px' }}>Implemented AI-powered lead generation and scoring</li>
          <li style={{ marginBottom: '6px' }}>Built behavior-driven nurture engines</li>
          <li style={{ marginBottom: '6px' }}>Created unified revenue dashboards tracking full pipeline</li>
          <li>Automated workflows reducing manual effort 60%</li>
        </ul>
      </div>

      <div style={{ marginBottom: '28px' }}>
        <p style={{ color: '#888', fontSize: '12px', textTransform: 'uppercase', marginBottom: '8px' }}>Results</p>
        <ul style={{ color: '#d0d0d0', lineHeight: 1.7, paddingLeft: '20px' }}>
          <li style={{ marginBottom: '6px' }}>Single client grew 8.9x ($16.5K → $147.9K/month)</li>
          <li style={{ marginBottom: '6px' }}>Call-booking +30%, close-rate +25%, ROAS +40%</li>
        </ul>
      </div>

      <h4 style={{ color: '#00FFFF', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '12px' }}>
        Other Key Achievements
      </h4>
      <ul style={{ color: '#d0d0d0', lineHeight: 1.7, paddingLeft: '20px' }}>
        <li style={{ marginBottom: '8px' }}>Secured tier-1 media placements (CNN, Forbes, WSJ, Fortune, BBC) with 18% reply rate (4-5x benchmarks)</li>
        <li style={{ marginBottom: '8px' }}>Built AI intake system reducing manual load 80% while maintaining HIPAA-adjacent compliance</li>
        <li style={{ marginBottom: '8px' }}>Reduced cost per 1,000 words 50-60% via GPT-powered content systems</li>
        <li>Cut 120 KPIs to ~45 while improving marketing efficiency 18-22%</li>
      </ul>
    </div>
  );

  const renderStrengthsModal = () => (
    <div>
      <div style={{
        background: 'rgba(0, 255, 255, 0.05)',
        padding: '20px',
        borderRadius: '12px',
        marginBottom: '28px',
      }}>
        <h3 style={{ color: '#fff', fontSize: '20px', marginBottom: '8px' }}>Data-Driven Diagnosis</h3>
        <p style={{ color: '#d0d0d0', lineHeight: 1.7 }}>
          Identifying when performance signals are misleading. Separating what&apos;s actually causal from what merely appears productive. Finding where systems are lying, where reporting is comforting.
        </p>
      </div>

      <h4 style={{ color: '#00FFFF', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '16px' }}>
        Case Study Examples
      </h4>

      <div style={{ marginBottom: '24px' }}>
        <h5 style={{ color: '#fff', fontSize: '15px', marginBottom: '8px' }}>Paid Acquisition Plateau ($450-600K/mo)</h5>
        <ul style={{ color: '#d0d0d0', lineHeight: 1.7, paddingLeft: '20px' }}>
          <li style={{ marginBottom: '4px' }}>Everyone said performance was &ldquo;stable&rdquo;</li>
          <li style={{ marginBottom: '4px' }}>Diagnosed: Structural saturation masked by platform optics</li>
          <li style={{ marginBottom: '4px' }}>Found: Emotionally protected segments consuming budget</li>
          <li>Result: 25-30% cost improvement after reframing metrics</li>
        </ul>
      </div>

      <div style={{ marginBottom: '24px' }}>
        <h5 style={{ color: '#fff', fontSize: '15px', marginBottom: '8px' }}>System Noise vs Signal (120 KPIs)</h5>
        <ul style={{ color: '#d0d0d0', lineHeight: 1.7, paddingLeft: '20px' }}>
          <li style={{ marginBottom: '4px' }}>Teams spending 30-40% capacity on non-causal optimization</li>
          <li style={{ marginBottom: '4px' }}>Diagnosis: Reporting complexity masking true drivers</li>
          <li style={{ marginBottom: '4px' }}>Intervention: Cut KPIs by 60-65%</li>
          <li>Result: 18-22% efficiency improvement, system became explainable</li>
        </ul>
      </div>

      <div style={{
        background: 'rgba(0, 255, 255, 0.05)',
        padding: '20px',
        borderRadius: '8px',
        borderLeft: '3px solid #00FFFF',
      }}>
        <h5 style={{ color: '#00FFFF', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>
          Philosophy
        </h5>
        <p style={{ color: '#d0d0d0', lineHeight: 1.7, fontStyle: 'italic' }}>
          &ldquo;I enter systems assuming three things: some parts work for reasons no one understands, some parts are protected because they feel validating, and most reporting tells a comforting story instead of a true one. My job is to identify which is which.&rdquo;
        </p>
      </div>
    </div>
  );

  const renderMyTimeModal = () => (
    <div>
      <p style={{ color: '#d0d0d0', lineHeight: 1.7, marginBottom: '28px' }}>
        How I allocate focus across engagements:
      </p>

      {timeCategories.map((cat, idx) => (
        <div key={idx} style={{
          marginBottom: '24px',
          paddingBottom: '24px',
          borderBottom: idx < timeCategories.length - 1 ? '1px solid rgba(255,255,255,0.1)' : 'none',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
            <span style={{
              background: '#00FFFF',
              color: '#000',
              width: '28px',
              height: '28px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 700,
              fontSize: '14px',
            }}>
              {cat.letter}
            </span>
            <h4 style={{ color: '#fff', fontSize: '16px' }}>{cat.name}</h4>
            <span style={{ color: '#00FFFF', fontSize: '14px', marginLeft: 'auto' }}>{cat.percentage}%</span>
          </div>
          <p style={{ color: '#d0d0d0', lineHeight: 1.7, paddingLeft: '40px' }}>
            {cat.description}
          </p>
        </div>
      ))}
    </div>
  );

  const renderEducationModal = () => (
    <div>
      <div style={{
        background: 'rgba(0, 255, 255, 0.05)',
        padding: '24px',
        borderRadius: '12px',
        marginBottom: '24px',
      }}>
        <h3 style={{ color: '#fff', fontSize: '20px', marginBottom: '8px' }}>B.A. Psychology</h3>
        <p style={{ color: '#00FFFF', marginBottom: '4px' }}>California State University, Long Beach</p>
        <p style={{ color: '#888', fontSize: '14px' }}>Class of 2005</p>
      </div>

      <h4 style={{ color: '#00FFFF', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '12px' }}>
        How Psychology Informs My Work
      </h4>
      <ul style={{ color: '#d0d0d0', lineHeight: 1.7, paddingLeft: '20px' }}>
        <li style={{ marginBottom: '8px' }}>Understanding cognitive biases that affect decision-making (both in consumers and stakeholders)</li>
        <li style={{ marginBottom: '8px' }}>Behavioral science principles applied to conversion optimization</li>
        <li style={{ marginBottom: '8px' }}>Recognition of organizational dynamics and resistance to change</li>
        <li>User research methodology and qualitative analysis</li>
      </ul>
    </div>
  );

  return (
    <Layout header={2} footer={5} video={0}>
      <style>{styles}</style>
      <CmnBanner
        title="Michael Soto"
        navigation="Senior Marketer & AI Growth Strategist"
      />

      {/* Interactive Resume Section */}
      <section className="section">
        <div className="container">
          <div className="row">
            <div className="col-12 text-center mb-5">
              <span className="sub-title">
                INTERACTIVE RESUME
                <i className="fa-solid fa-arrow-right"></i>
              </span>
              <h2 className="title title-anim mt-3">
                Click Any Section to Explore
              </h2>
            </div>
          </div>

          {/* Two-column Resume Layout */}
          <div className="row gaper">
            {/* Left Column */}
            <div className="col-12 col-lg-5">
              {/* Summary */}
              <div style={{ marginBottom: '20px' }}>
                <ResumeCard title="Summary" onClick={() => setActiveModal('summary')}>
                  <p style={{ color: '#d0d0d0', fontSize: '14px', lineHeight: 1.6 }}>
                    Senior Growth Marketing leader with 19+ years of experience. Brought in when leadership senses something is wrong but cannot articulate why.
                  </p>
                </ResumeCard>
              </div>

              {/* Skills */}
              <div style={{ marginBottom: '20px' }}>
                <ResumeCard title="Skills" onClick={() => setActiveModal('skills')}>
                  {skillCategories.slice(0, 4).map((skill) => (
                    <SkillBar key={skill.name} name={skill.name} percentage={skill.percentage} />
                  ))}
                  <p style={{ color: '#888', fontSize: '12px', marginTop: '8px' }}>+2 more skills</p>
                </ResumeCard>
              </div>

              {/* Key Achievements */}
              <div style={{ marginBottom: '20px' }}>
                <ResumeCard title="Key Achievements" onClick={() => setActiveModal('achievements')}>
                  <div style={{ textAlign: 'center', padding: '8px 0' }}>
                    <p style={{ color: '#00FFFF', fontSize: '28px', fontWeight: 700, marginBottom: '4px' }}>$1.2M/mo</p>
                    <p style={{ color: '#888', fontSize: '13px' }}>Revenue - up from $225k in &lt;14 months</p>
                  </div>
                </ResumeCard>
              </div>

              {/* Strengths */}
              <div style={{ marginBottom: '20px' }}>
                <ResumeCard title="Strengths" onClick={() => setActiveModal('strengths')}>
                  <p style={{ color: '#fff', fontSize: '16px', fontWeight: 600, marginBottom: '4px' }}>Data-Driven</p>
                  <p style={{ color: '#888', fontSize: '13px' }}>Diagnosing structural failure in growth systems</p>
                </ResumeCard>
              </div>
            </div>

            {/* Right Column */}
            <div className="col-12 col-lg-7">
              {/* Experience */}
              <div style={{ marginBottom: '20px' }}>
                <ResumeCard title="Experience" onClick={() => setActiveModal('experience')}>
                  {experienceRoles.map((role, idx) => (
                    <div key={idx} className="experience-item">
                      <p style={{ color: '#fff', fontSize: '14px', fontWeight: 500, marginBottom: '2px' }}>{role.title}</p>
                      <p style={{ color: '#00FFFF', fontSize: '13px', marginBottom: '2px' }}>{role.company}</p>
                      <p style={{ color: '#888', fontSize: '12px' }}>{role.dates}</p>
                    </div>
                  ))}
                </ResumeCard>
              </div>

              {/* My Time */}
              <div style={{ marginBottom: '20px' }}>
                <ResumeCard title="My Time" onClick={() => setActiveModal('mytime')}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
                    <div style={{ flexShrink: 0 }}>
                      <HexagonDiagram />
                    </div>
                    <div style={{ flex: 1 }}>
                      {timeCategories.slice(0, 3).map((cat) => (
                        <div key={cat.letter} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                          <span style={{ color: '#d0d0d0', fontSize: '12px' }}>
                            <span style={{ color: '#00FFFF', marginRight: '6px' }}>{cat.letter}</span>
                            {cat.name}
                          </span>
                          <span style={{ color: '#888', fontSize: '12px' }}>{cat.percentage}%</span>
                        </div>
                      ))}
                      <p style={{ color: '#888', fontSize: '11px', marginTop: '4px' }}>+3 more categories</p>
                    </div>
                  </div>
                </ResumeCard>
              </div>

              {/* Education */}
              <div>
                <ResumeCard title="Education" onClick={() => setActiveModal('education')}>
                  <p style={{ color: '#fff', fontSize: '15px', fontWeight: 500, marginBottom: '4px' }}>B.A. Psychology</p>
                  <p style={{ color: '#00FFFF', fontSize: '13px' }}>California State University, Long Beach</p>
                </ResumeCard>
              </div>
            </div>
          </div>

          {/* PDF Download Button */}
          <div className="row mt-5">
            <div className="col-12 text-center">
              <a
                href="/resumes/MichaelSotoResume.pdf"
                download
                className="btn btn--secondary"
                style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}
              >
                <i className="fa-solid fa-file-pdf"></i>
                Download Full Resume (PDF)
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Tech Stack Section - Scrolling Marquee */}
      <section className="section light">
        <div className="container">
          <div className="row">
            <div className="col-12 text-center mb-5">
              <span className="sub-title">
                TECHNICAL SKILLS
                <i className="fa-solid fa-arrow-right"></i>
              </span>
              <h2 className="title title-anim mt-3">
                Tools &amp; Technologies
              </h2>
            </div>
          </div>
        </div>

        {/* Top row - scrolls left */}
        <div className="marquee-container mb-4">
          <div className="marquee-left">
            {[...toolsRow, ...toolsRow].map((tool, index) => (
              <span key={index} className="skill-tag">{tool}</span>
            ))}
          </div>
        </div>

        {/* Bottom row - scrolls right */}
        <div className="marquee-container">
          <div className="marquee-right">
            {[...skillsRow, ...skillsRow].map((skill, index) => (
              <span key={index} className="skill-tag">{skill}</span>
            ))}
          </div>
        </div>
      </section>

      {/* Roles That Match My Experience */}
      <section className="section">
        <div className="container">
          <div className="row">
            <div className="col-12 text-center mb-5">
              <span className="sub-title">
                IDEAL FIT
                <i className="fa-solid fa-arrow-right"></i>
              </span>
              <h2 className="title title-anim mt-3">
                Roles Where I Deliver the Most Impact
              </h2>
              <p style={{ color: '#a0a0a0', maxWidth: '700px', margin: '0 auto' }}>
                Based on 19+ years of pattern recognition across growth systems, these are the roles
                where my experience creates the highest leverage.
              </p>
            </div>
          </div>
          <div className="row gaper">
            {roleMatches.map((role, index) => (
              <div key={index} className="col-12 col-lg-4">
                <div className="role-card">
                  <h4 style={{ color: '#00FFFF', fontSize: '20px', marginBottom: '8px' }}>{role.title}</h4>
                  <p style={{ color: '#a0a0a0', fontSize: '14px', marginBottom: '20px', lineHeight: 1.6 }}>
                    {role.tagline}
                  </p>

                  <h5 style={{ color: '#fff', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '12px' }}>
                    Key Responsibilities
                  </h5>
                  <ul style={{ color: '#d0d0d0', fontSize: '13px', lineHeight: 1.6, paddingLeft: '16px', marginBottom: '20px' }}>
                    {role.keyResponsibilities.map((resp, idx) => (
                      <li key={idx} style={{ marginBottom: '6px' }}>{resp}</li>
                    ))}
                  </ul>

                  <h5 style={{ color: '#00FFFF', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '12px' }}>
                    My Experience Match
                  </h5>
                  <ul style={{ color: '#a0a0a0', fontSize: '13px', lineHeight: 1.6, paddingLeft: '16px' }}>
                    {role.experienceMatch.map((match, idx) => (
                      <li key={idx} style={{ marginBottom: '6px' }}>{match}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="section light">
        <div className="container">
          <div className="row">
            <div className="col-12 text-center">
              <h2 className="title title-anim">
                Let&apos;s Talk
              </h2>
              <p style={{ color: '#a0a0a0', maxWidth: '500px', margin: '20px auto' }}>
                Looking for a growth marketing leader or AI automation expert?
                Schedule a conversation.
              </p>
              <button onClick={openCalendly} className="btn btn--secondary">
                Book Discovery Call
              </button>
              <p style={{ color: '#a0a0a0', marginTop: '20px' }}>
                Or email:{' '}
                <a href="mailto:info@theinnovativenative.com" style={{ color: '#fff' }}>
                  info@theinnovativenative.com
                </a>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Modals */}
      <ResumeModal
        isOpen={activeModal === 'summary'}
        onClose={() => setActiveModal(null)}
        title="Summary"
      >
        {renderSummaryModal()}
      </ResumeModal>

      <ResumeModal
        isOpen={activeModal === 'experience'}
        onClose={() => setActiveModal(null)}
        title="Professional Experience"
      >
        {renderExperienceModal()}
      </ResumeModal>

      <ResumeModal
        isOpen={activeModal === 'skills'}
        onClose={() => setActiveModal(null)}
        title="Skills"
      >
        {renderSkillsModal()}
      </ResumeModal>

      <ResumeModal
        isOpen={activeModal === 'achievements'}
        onClose={() => setActiveModal(null)}
        title="Key Achievements"
      >
        {renderAchievementsModal()}
      </ResumeModal>

      <ResumeModal
        isOpen={activeModal === 'strengths'}
        onClose={() => setActiveModal(null)}
        title="Strengths"
      >
        {renderStrengthsModal()}
      </ResumeModal>

      <ResumeModal
        isOpen={activeModal === 'mytime'}
        onClose={() => setActiveModal(null)}
        title="My Time"
      >
        {renderMyTimeModal()}
      </ResumeModal>

      <ResumeModal
        isOpen={activeModal === 'education'}
        onClose={() => setActiveModal(null)}
        title="Education"
      >
        {renderEducationModal()}
      </ResumeModal>
    </Layout>
  );
};

export default ProfessionalExperience;
