import React, { useState, useEffect, useCallback } from 'react';
import Head from 'next/head';
import ClassroomLayout from '@/components/layout/ClassroomLayout';
import ProtectedRoute from '@/components/common/ProtectedRoute';
import FeedPage from '@/components/community/feed/FeedPage';
import { useCommunityStats } from '@/hooks/useCommunityStats';
import { usePresence } from '@/hooks/usePresence';
import { getValidToken } from '@/lib/auth-token';
import { COMMUNITY_ID } from '@/lib/constants';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

interface CommunityInfo {
  name: string;
  description: string | null;
  banner_url: string | null;
  avatar_url: string | null;
}

const CommunityPage = () => {
  const { memberCount, adminCount } = useCommunityStats();
  const { onlineCount } = usePresence();
  const [community, setCommunity] = useState<CommunityInfo | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const fetchCommunity = useCallback(async () => {
    const token = getValidToken();
    try {
      const res = await fetch(
        `${SUPABASE_URL}/rest/v1/communities?id=eq.${COMMUNITY_ID}&select=name,description,banner_url,avatar_url&limit=1`,
        {
          headers: {
            'apikey': SUPABASE_ANON_KEY,
            'Authorization': `Bearer ${token || SUPABASE_ANON_KEY}`,
            'Accept': 'application/json',
          },
        },
      );
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          setCommunity(data[0]);
        }
      }
    } catch {
      // Sidebar info is non-critical
    }
  }, []);

  useEffect(() => {
    fetchCommunity();
  }, [fetchCommunity]);

  const sidebar = (
    <aside className="community-sidebar">
      {community?.banner_url && (
        <div className="community-sidebar__banner">
          <img src={community.banner_url} alt="" />
        </div>
      )}
      <div className="community-sidebar__body">
        <div className="community-sidebar__identity">
          {community?.avatar_url && (
            <img
              src={community.avatar_url}
              alt=""
              className="community-sidebar__avatar"
            />
          )}
          <h2 className="community-sidebar__name">{community?.name || 'Community'}</h2>
        </div>
        {community?.description && (
          <p className="community-sidebar__desc">{community.description}</p>
        )}
        <div className="community-sidebar__stats">
          <div className="community-sidebar__stat">
            <span className="community-sidebar__stat-value">{memberCount.toLocaleString()}</span>
            <span className="community-sidebar__stat-label">Members</span>
          </div>
          <div className="community-sidebar__stat">
            <span className="community-sidebar__stat-value community-sidebar__stat-value--online">
              <span className="community-sidebar__online-dot" />
              {onlineCount}
            </span>
            <span className="community-sidebar__stat-label">Online</span>
          </div>
          <div className="community-sidebar__stat">
            <span className="community-sidebar__stat-value">{adminCount}</span>
            <span className="community-sidebar__stat-label">Admins</span>
          </div>
        </div>
      </div>
    </aside>
  );

  return (
    <ClassroomLayout title="Community">
      <ProtectedRoute>
        <Head>
          <title>Community | The Innovative Native</title>
        </Head>
        <div className="community-layout">
          {/* Mobile: collapsible sidebar toggle */}
          <button
            className="community-layout__sidebar-toggle"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-expanded={sidebarOpen}
            aria-controls="community-sidebar-panel"
          >
            <i className={`fa-solid fa-chevron-${sidebarOpen ? 'up' : 'down'}`}></i>
            <span>{sidebarOpen ? 'Hide' : 'Show'} community info</span>
          </button>

          {/* Mobile sidebar (collapsible) */}
          <div
            id="community-sidebar-panel"
            className={`community-layout__sidebar-mobile ${sidebarOpen ? 'community-layout__sidebar-mobile--open' : ''}`}
          >
            {sidebar}
          </div>

          <div className="community-layout__main">
            {/* Feed column */}
            <div className="community-layout__feed">
              <FeedPage />
            </div>

            {/* Desktop sidebar */}
            <div className="community-layout__sidebar-desktop">
              {sidebar}
            </div>
          </div>
        </div>
      </ProtectedRoute>
    </ClassroomLayout>
  );
};

export default CommunityPage;
