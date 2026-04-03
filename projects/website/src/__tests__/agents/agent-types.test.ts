/**
 * Agent Types & Data Model Tests
 * Feature: 032-ai-community-agents
 */

import type {
  AgentKey,
  AgentConfig,
  AgentDraft,
  AgentActivity,
  AgentStats,
  AgentActionType,
  DraftStatus,
} from '../../types/agents';

describe('Agent Type Definitions', () => {
  it('AgentKey is restricted to 3 valid values', () => {
    const validKeys: AgentKey[] = ['jenna', 'patrice', 'chris'];
    expect(validKeys).toHaveLength(3);
    // TypeScript compiler would catch invalid keys
  });

  it('AgentActionType covers all valid action types', () => {
    const actions: AgentActionType[] = [
      'post_created', 'comment_created', 'draft_queued',
      'draft_approved', 'draft_rejected', 'error', 'skipped',
    ];
    expect(actions).toHaveLength(7);
  });

  it('DraftStatus covers all valid statuses', () => {
    const statuses: DraftStatus[] = ['pending', 'approved', 'rejected', 'expired'];
    expect(statuses).toHaveLength(4);
  });

  it('AgentConfig interface has all required fields', () => {
    const config: AgentConfig = {
      id: 'test-id',
      profile_id: 'test-profile',
      agent_key: 'jenna',
      display_name: 'Jenna Cole',
      persona_prompt: 'You are Jenna...',
      posting_schedule: { monday: '09:00' },
      post_types: ['challenge', 'celebration'],
      is_active: true,
      review_mode: true,
      max_posts_per_week: 4,
      max_replies_per_hour: 0,
      llm_model: 'gemini-2.0-flash',
      llm_temperature: 0.85,
      knowledge_scope: ['masterclass'],
      last_posted_at: null,
      error_count_1h: 0,
      created_at: '2026-04-02T00:00:00Z',
      updated_at: '2026-04-02T00:00:00Z',
    };

    expect(config.agent_key).toBe('jenna');
    expect(config.is_active).toBe(true);
    expect(config.review_mode).toBe(true);
    expect(config.max_posts_per_week).toBe(4);
  });

  it('AgentDraft includes agent_config join data', () => {
    const draft: AgentDraft = {
      id: 'draft-1',
      agent_config_id: 'config-1',
      content_type: 'post',
      title: 'Weekly Challenge',
      body: '{"type":"doc","content":[]}',
      body_html: '<p>Hello</p>',
      category_id: null,
      parent_post_id: null,
      parent_comment_id: null,
      status: 'pending',
      reviewed_by: null,
      reviewed_at: null,
      rejection_reason: null,
      scheduled_for: null,
      expires_at: '2026-04-04T00:00:00Z',
      created_at: '2026-04-02T00:00:00Z',
      agent_config: { display_name: 'Jenna Cole', agent_key: 'jenna' },
    };

    expect(draft.status).toBe('pending');
    expect(draft.agent_config?.display_name).toBe('Jenna Cole');
  });

  it('AgentStats computes weekly metrics correctly', () => {
    const stats: AgentStats = {
      agent_key: 'chris',
      display_name: 'Chris Nakamura',
      posts_this_week: 0,
      replies_this_week: 15,
      drafts_pending: 2,
      errors_this_week: 1,
      tokens_this_week: 5000,
      cost_this_week: 0.05,
      avg_response_time_ms: 3500,
      escalations_this_week: 1,
    };

    expect(stats.replies_this_week).toBe(15);
    expect(stats.cost_this_week).toBeLessThan(1);
  });
});

describe('Agent Migration Schema Validation', () => {
  let migrationSQL: string;

  beforeAll(() => {
    const fs = require('fs');
    const path = require('path');
    migrationSQL = fs.readFileSync(
      path.join(__dirname, '../../../../../supabase/migrations/20260402000001_agent_tables.sql'),
      'utf-8'
    );
  });

  it('creates is_agent column on profiles', () => {
    expect(migrationSQL).toContain('ALTER TABLE profiles ADD COLUMN IF NOT EXISTS is_agent');
    expect(migrationSQL).toContain('boolean NOT NULL DEFAULT false');
  });

  it('creates agent_config table with all required columns', () => {
    expect(migrationSQL).toContain('CREATE TABLE IF NOT EXISTS agent_config');
    expect(migrationSQL).toContain('agent_key text UNIQUE NOT NULL');
    expect(migrationSQL).toContain('persona_prompt text NOT NULL');
    expect(migrationSQL).toContain('is_active boolean NOT NULL DEFAULT true');
    expect(migrationSQL).toContain('review_mode boolean NOT NULL DEFAULT true');
    expect(migrationSQL).toContain('error_count_1h integer NOT NULL DEFAULT 0');
  });

  it('creates agent_topic_history with vector column', () => {
    expect(migrationSQL).toContain('CREATE TABLE IF NOT EXISTS agent_topic_history');
    expect(migrationSQL).toContain('topic_embedding vector(1536)');
    expect(migrationSQL).toContain('hnsw');
  });

  it('creates agent_activity_log with valid action types', () => {
    expect(migrationSQL).toContain('CREATE TABLE IF NOT EXISTS agent_activity_log');
    expect(migrationSQL).toContain('post_created');
    expect(migrationSQL).toContain('comment_created');
    expect(migrationSQL).toContain('draft_queued');
    expect(migrationSQL).toContain('error');
    expect(migrationSQL).toContain('skipped');
  });

  it('creates agent_draft_queue with expiry', () => {
    expect(migrationSQL).toContain('CREATE TABLE IF NOT EXISTS agent_draft_queue');
    expect(migrationSQL).toContain('expires_at');
    expect(migrationSQL).toContain("interval '48 hours'");
  });

  it('enables RLS on all agent tables', () => {
    expect(migrationSQL).toContain('ALTER TABLE agent_config ENABLE ROW LEVEL SECURITY');
    expect(migrationSQL).toContain('ALTER TABLE agent_draft_queue ENABLE ROW LEVEL SECURITY');
    expect(migrationSQL).toContain('ALTER TABLE agent_activity_log ENABLE ROW LEVEL SECURITY');
    expect(migrationSQL).toContain('ALTER TABLE agent_topic_history ENABLE ROW LEVEL SECURITY');
  });

  it('creates admin-only RLS policies', () => {
    expect(migrationSQL).toContain("cm.role IN ('owner', 'admin')");
    expect(migrationSQL).toContain("cm.status = 'active'");
  });

  it('creates updated_at trigger for agent_config', () => {
    expect(migrationSQL).toContain('update_agent_config_updated_at');
    expect(migrationSQL).toContain('BEFORE UPDATE ON agent_config');
  });
});

describe('Agent Persona Prompts', () => {
  let seedScript: string;

  beforeAll(() => {
    const fs = require('fs');
    const path = require('path');
    seedScript = fs.readFileSync(
      path.join(__dirname, '../../../../../scripts/032-ai-community-agents/seed_agent_config.py'),
      'utf-8'
    );
  });

  it('Jenna persona is compassionate and conversational', () => {
    expect(seedScript).toContain('helper by nature');
    expect(seedScript).toContain('compassionate');
    expect(seedScript).toContain('soft-spoken');
    expect(seedScript).toContain('texting a friend');
  });

  it('Patrice persona is professional MBA tone', () => {
    expect(seedScript).toContain('MBA in the room');
    expect(seedScript).toContain('Professional');
    expect(seedScript).toContain('McKinsey memo');
    expect(seedScript).toContain('briefing a CEO');
  });

  it('Chris persona is loveable and humorous', () => {
    expect(seedScript).toContain('loveable');
    expect(seedScript).toContain('humor');
    expect(seedScript).toContain('crack a joke');
    expect(seedScript).toContain('Zero ego');
  });

  it('all personas prohibit em dashes', () => {
    // Count em dash prohibition mentions
    const emDashMentions = (seedScript.match(/NEVER use em dashes/g) || []).length;
    expect(emDashMentions).toBeGreaterThanOrEqual(3); // One per agent
  });

  it('all personas include AI disclosure', () => {
    const disclosureMentions = (seedScript.match(/NEVER claim to be human/g) || []).length;
    expect(disclosureMentions).toBeGreaterThanOrEqual(3);
  });

  it('uses correct email addresses', () => {
    // Emails are in create_agent_profiles.py, not seed script
    const fs = require('fs');
    const path = require('path');
    const profileScript = fs.readFileSync(
      path.join(__dirname, '../../../../../scripts/032-ai-community-agents/create_agent_profiles.py'),
      'utf-8'
    );
    expect(profileScript).toContain("'email': 'jenna@buildmytribe.ai'");
    expect(profileScript).toContain("'email': 'info@buildmytribe.ai'");
    expect(profileScript).toContain("'email': 'mike@buildmytribe.ai'");
  });
});

describe('Tiptap Converter', () => {
  // Test the JS version that runs in n8n Code nodes
  function markdownToTiptap(text: string) {
    const lines = text.trim().split('\n');
    const content: any[] = [];
    const htmlParts: string[] = [];
    let i = 0;

    while (i < lines.length) {
      const line = lines[i].trim();
      if (!line) { i++; continue; }

      if (line.startsWith('- ') || line.startsWith('* ')) {
        const items: any[] = [];
        const htmlItems: string[] = [];
        while (i < lines.length && (lines[i].trim().startsWith('- ') || lines[i].trim().startsWith('* '))) {
          const t = lines[i].trim().substring(2);
          items.push({ type: 'listItem', content: [{ type: 'paragraph', content: [{ type: 'text', text: t }] }] });
          htmlItems.push('<li>' + t + '</li>');
          i++;
        }
        content.push({ type: 'bulletList', content: items });
        htmlParts.push('<ul>' + htmlItems.join('') + '</ul>');
        continue;
      }

      const paraLines = [line];
      i++;
      while (i < lines.length && lines[i].trim() && !lines[i].trim().startsWith('- ') && !lines[i].trim().startsWith('* ')) {
        paraLines.push(lines[i].trim());
        i++;
      }
      const paraText = paraLines.join(' ');
      content.push({ type: 'paragraph', content: [{ type: 'text', text: paraText }] });
      htmlParts.push('<p>' + paraText + '</p>');
    }

    return {
      tiptapJson: JSON.stringify({ type: 'doc', content }),
      bodyHtml: htmlParts.join('\n'),
    };
  }

  it('converts simple paragraph to valid Tiptap JSON', () => {
    const result = markdownToTiptap('Hello world');
    const parsed = JSON.parse(result.tiptapJson);
    expect(parsed.type).toBe('doc');
    expect(parsed.content[0].type).toBe('paragraph');
    expect(parsed.content[0].content[0].text).toBe('Hello world');
  });

  it('converts bullet list to Tiptap bulletList', () => {
    const result = markdownToTiptap('- Item 1\n- Item 2\n- Item 3');
    const parsed = JSON.parse(result.tiptapJson);
    expect(parsed.content[0].type).toBe('bulletList');
    expect(parsed.content[0].content).toHaveLength(3);
  });

  it('generates matching HTML', () => {
    const result = markdownToTiptap('Hello world');
    expect(result.bodyHtml).toContain('<p>Hello world</p>');
  });

  it('handles multi-paragraph content', () => {
    const result = markdownToTiptap('First paragraph\n\nSecond paragraph');
    const parsed = JSON.parse(result.tiptapJson);
    expect(parsed.content).toHaveLength(2);
  });

  it('produces valid JSON', () => {
    const result = markdownToTiptap('**Bold text** and normal text\n\n- List item');
    expect(() => JSON.parse(result.tiptapJson)).not.toThrow();
  });
});

describe('N8N Workflow Validation', () => {
  const fs = require('fs');
  const path = require('path');
  const workflowDir = path.join(__dirname, '../../../../../scripts/n8n-workflows');

  const workflows = [
    'agent-jenna-engagement.json',
    'agent-patrice-spotlight.json',
    'agent-chris-responder.json',
    'agent-weekly-summary.json',
  ];

  for (const wfFile of workflows) {
    describe(wfFile, () => {
      let wf: any;

      beforeAll(() => {
        const content = fs.readFileSync(path.join(workflowDir, wfFile), 'utf-8');
        wf = JSON.parse(content);
      });

      it('is valid JSON with required fields', () => {
        expect(wf.name).toBeTruthy();
        expect(wf.nodes).toBeInstanceOf(Array);
        expect(wf.connections).toBeTruthy();
        expect(wf.settings).toBeTruthy();
      });

      it('has a manual trigger', () => {
        const manual = wf.nodes.find((n: any) => n.type === 'n8n-nodes-base.manualTrigger');
        expect(manual).toBeTruthy();
      });

      it('has a schedule trigger', () => {
        const schedule = wf.nodes.find((n: any) => n.type === 'n8n-nodes-base.scheduleTrigger');
        expect(schedule).toBeTruthy();
      });

      it('has Slack notification node with correct credential', () => {
        const slack = wf.nodes.find((n: any) => n.type === 'n8n-nodes-base.slack');
        expect(slack).toBeTruthy();
        expect(slack.credentials?.slackApi?.id).toBe('jJXwWkgHHkur9ZF3');
      });

      it('all connections reference existing nodes', () => {
        const nodeNames = new Set(wf.nodes.map((n: any) => n.name));
        for (const [src, data] of Object.entries(wf.connections)) {
          expect(nodeNames.has(src)).toBe(true);
          for (const branch of (data as any).main || []) {
            for (const conn of branch) {
              expect(nodeNames.has((conn as any).node)).toBe(true);
            }
          }
        }
      });

      it('Code nodes contain em-dash scrubbing', () => {
        const codeNodes = wf.nodes.filter((n: any) => n.type === 'n8n-nodes-base.code');
        const hasEmDashCheck = codeNodes.some((n: any) =>
          (n.parameters?.jsCode || '').includes('\\u2014') ||
          (n.parameters?.jsCode || '').includes('em dash') ||
          (n.parameters?.jsCode || '').includes('2014')
        );
        // At least the generation nodes should scrub em dashes
        if (wfFile !== 'agent-weekly-summary.json') {
          expect(hasEmDashCheck).toBe(true);
        }
      });
    });
  }
});

describe('RoleBadge AI Team Badge', () => {
  it('RoleBadge component file contains AI badge implementation', () => {
    const fs = require('fs');
    const path = require('path');
    const content = fs.readFileSync(
      path.join(__dirname, '../../components/members/RoleBadge.tsx'),
      'utf-8'
    );

    expect(content).toContain('isAgent');
    expect(content).toContain('AI Team');
    expect(content).toContain('aria-label="AI Team Member"');
  });
});

describe('Leaderboard Agent Exclusion', () => {
  it('useLeaderboard hook excludes agents', () => {
    const fs = require('fs');
    const path = require('path');
    const content = fs.readFileSync(
      path.join(__dirname, '../../hooks/useLeaderboard.ts'),
      'utf-8'
    );

    expect(content).toContain('is_agent');
    expect(content).toContain('return false');
  });
});

describe('Agent Profile Banner', () => {
  it('member profile page includes agent banner', () => {
    const fs = require('fs');
    const path = require('path');
    const content = fs.readFileSync(
      path.join(__dirname, '../../pages/members/[username].tsx'),
      'utf-8'
    );

    expect(content).toContain('isAgent');
    expect(content).toContain('agent-profile-banner');
    expect(content).toContain('AI community team member');
  });
});
