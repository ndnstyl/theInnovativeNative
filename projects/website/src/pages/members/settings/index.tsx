import React, { useState } from 'react';
import Head from 'next/head';
import ClassroomLayout from '@/components/layout/ClassroomLayout';
import ProtectedRoute from '@/components/common/ProtectedRoute';
import MembershipQuestions from '@/components/members/MembershipQuestions';
import InvitationForm from '@/components/members/InvitationForm';
import CommunitySettings from '@/components/members/CommunitySettings';
import { useAuth } from '@/contexts/AuthContext';
import { useLastActive } from '@/hooks/useLastActive';

type Tab = 'questions' | 'invitations' | 'settings';

const MemberSettings = () => {
  useLastActive();
  const { supabaseClient } = useAuth();
  const [activeTab, setActiveTab] = useState<Tab>('questions');

  const tabs: { id: Tab; label: string; icon: string }[] = [
    { id: 'questions', label: 'Membership Questions', icon: 'fa-clipboard-question' },
    { id: 'invitations', label: 'Invitations', icon: 'fa-envelope' },
    { id: 'settings', label: 'Community Settings', icon: 'fa-gear' },
  ];

  return (
    <ClassroomLayout title="Settings">
      <ProtectedRoute requiredRole={['owner', 'admin']}>
        <Head>
          <title>Settings | The Innovative Native</title>
        </Head>
        <div className="member-settings">
          <h1>Community Settings</h1>

          <div className="member-settings__tabs">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                className={`member-settings__tab ${activeTab === tab.id ? 'active' : ''}`}
                onClick={() => setActiveTab(tab.id)}
              >
                <i className={`fa-solid ${tab.icon}`}></i>
                {tab.label}
              </button>
            ))}
          </div>

          <div className="member-settings__content">
            {activeTab === 'questions' && <MembershipQuestions />}
            {activeTab === 'invitations' && <InvitationForm />}
            {activeTab === 'settings' && <CommunitySettings />}
          </div>
        </div>
      </ProtectedRoute>
    </ClassroomLayout>
  );
};

export default MemberSettings;
