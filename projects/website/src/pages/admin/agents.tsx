import React, { useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useAgentConfigs, useAgentDrafts, useAgentActivity, useAgentStats } from '../../hooks/useAgentAdmin';
import AgentCard from '../../components/admin/AgentCard';
import AgentDraftQueue from '../../components/admin/AgentDraftQueue';
import AgentActivityLog from '../../components/admin/AgentActivityLog';
import AgentConfigEditor from '../../components/admin/AgentConfigEditor';
import type { AgentConfig, AgentDraft } from '../../types/agents';

type Tab = 'drafts' | 'activity' | 'settings';

export default function AdminAgentsPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Tab>('drafts');
  const [selectedAgent, setSelectedAgent] = useState<AgentConfig | null>(null);

  const { configs, loading: configsLoading, toggleActive, toggleReviewMode, updateConfig } = useAgentConfigs();
  const { drafts, loading: draftsLoading, approveDraft, rejectDraft } = useAgentDrafts();
  const { activities, loading: activityLoading } = useAgentActivity();
  const { stats } = useAgentStats();

  const handleApprove = async (draft: AgentDraft) => {
    const userId = ''; // Will be filled from auth context
    const result = await approveDraft(draft, userId);
    if (result.error) {
      alert(`Failed to approve: ${result.error}`);
    }
  };

  const handleReject = async (draftId: string, reason: string) => {
    await rejectDraft(draftId, '', reason);
  };

  const totalPending = drafts.length;

  return (
    <>
      <Head>
        <title>AI Agents | Admin | BuildMyTribe</title>
      </Head>

      <div className="agent-admin">
        <div className="agent-admin__header">
          <h1>AI Community Agents</h1>
          <p className="agent-admin__subtitle">
            Manage engagement agents, review drafts, and monitor activity.
          </p>
        </div>

        {/* Agent Cards */}
        <div className="agent-admin__cards">
          {configsLoading ? (
            <div className="agent-admin__loading">Loading agents...</div>
          ) : (
            configs.map(config => (
              <AgentCard
                key={config.id}
                config={config}
                stats={stats.find(s => s.agent_key === config.agent_key)}
                onToggleActive={toggleActive}
                onToggleReview={toggleReviewMode}
              />
            ))
          )}
        </div>

        {/* Tabs */}
        <div className="agent-admin__tabs" role="tablist">
          <button
            className={`agent-admin__tab ${activeTab === 'drafts' ? 'active' : ''}`}
            onClick={() => setActiveTab('drafts')}
            role="tab"
            aria-selected={activeTab === 'drafts'}
          >
            Drafts
            {totalPending > 0 && (
              <span className="agent-admin__tab-badge">{totalPending}</span>
            )}
          </button>
          <button
            className={`agent-admin__tab ${activeTab === 'activity' ? 'active' : ''}`}
            onClick={() => setActiveTab('activity')}
            role="tab"
            aria-selected={activeTab === 'activity'}
          >
            Activity
          </button>
          <button
            className={`agent-admin__tab ${activeTab === 'settings' ? 'active' : ''}`}
            onClick={() => setActiveTab('settings')}
            role="tab"
            aria-selected={activeTab === 'settings'}
          >
            Settings
          </button>
        </div>

        {/* Tab Content */}
        <div className="agent-admin__content" role="tabpanel">
          {activeTab === 'drafts' && (
            <AgentDraftQueue
              drafts={drafts}
              loading={draftsLoading}
              onApprove={handleApprove}
              onReject={handleReject}
            />
          )}

          {activeTab === 'activity' && (
            <AgentActivityLog
              activities={activities}
              loading={activityLoading}
            />
          )}

          {activeTab === 'settings' && (
            <div className="agent-admin__settings">
              {configs.map(config => (
                <AgentConfigEditor
                  key={config.id}
                  config={config}
                  onSave={updateConfig}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
