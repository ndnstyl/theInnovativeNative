import React, { useState, useEffect, useCallback } from 'react';
import Head from 'next/head';
import Layout from '@/components/layout/Layout';
import ClassroomLanding from '@/components/classroom/ClassroomLanding';
import CourseGrid from '@/components/classroom/CourseGrid';
import AuthModal from '@/components/auth/AuthModal';
import { useAuth } from '@/contexts/AuthContext';
import { useCommunityStats } from '@/hooks/useCommunityStats';
import { usePresence } from '@/hooks/usePresence';
import { useCourseProgress } from '@/hooks/useCourseProgress';
import { getValidToken } from '@/lib/auth-token';
import { logger } from '@/lib/logger';
import type { Course, CourseWithProgress } from '@/types/supabase';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

/** Fetch all published courses ordered by display_order (direct REST) */
async function fetchCourses(token: string): Promise<Course[]> {
  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/courses?published=eq.true&select=id,community_id,title,slug,description,thumbnail_url,access_level,is_free,stripe_price_id,published,display_order,created_at,updated_at&order=display_order.asc`,
    {
      headers: {
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
      },
    }
  );
  if (!res.ok) return [];
  return res.json();
}

/** Fetch enrolled course IDs for the authenticated user */
async function fetchEnrolledCourseIds(userId: string, token: string): Promise<Set<string>> {
  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/enrollments?user_id=eq.${userId}&status=eq.active&select=course_id`,
    {
      headers: {
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
      },
    }
  );
  if (!res.ok) return new Set();
  const rows: { course_id: string }[] = await res.json();
  return new Set(rows.map((r) => r.course_id));
}

const ClassroomPage: React.FC = () => {
  const { session, isLoading, membershipStatus } = useAuth();
  const { memberCount, adminCount, loading: statsLoading } = useCommunityStats();
  const { onlineCount, isConnected } = usePresence();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authRedirectTo, setAuthRedirectTo] = useState('/classroom');

  const isAuthenticated = !!session;
  const isExpiredMember = !!(session && membershipStatus === 'expired');
  const userId = session?.user?.id ?? null;

  // --- Authenticated dashboard state ---
  const [courses, setCourses] = useState<CourseWithProgress[]>([]);
  const [coursesLoading, setCoursesLoading] = useState(true);

  const { progressMap, loading: progressLoading } = useCourseProgress(userId);

  /** Fetch courses + enrollments, merge with progress map */
  const loadDashboard = useCallback(async () => {
    if (!userId) return;
    const token = getValidToken();
    if (!token) { setCoursesLoading(false); return; }

    try {
      const [allCourses, enrolledIds] = await Promise.all([
        fetchCourses(token),
        fetchEnrolledCourseIds(userId, token),
      ]);

      const merged: CourseWithProgress[] = allCourses.map((c) => {
        const enrolled = enrolledIds.has(c.id);
        const cp = progressMap[c.id];
        return {
          ...c,
          is_enrolled: enrolled,
          progress: cp?.percentage ?? 0,
          total_lessons: cp?.totalLessons ?? 0,
          completed_lessons: cp?.completedLessons ?? 0,
        };
      });

      setCourses(merged);
    } catch (err) {
      logger.error('ClassroomPage', 'loadDashboard', err);
    } finally {
      setCoursesLoading(false);
    }
  }, [userId, progressMap]);

  useEffect(() => {
    if (isAuthenticated && !progressLoading) {
      loadDashboard();
    }
  }, [isAuthenticated, progressLoading, loadDashboard]);

  const handleLoginClick = useCallback(() => {
    setAuthRedirectTo('/classroom');
    setShowAuthModal(true);
  }, []);

  const handleTrialClick = useCallback(() => {
    setAuthRedirectTo('/checkout/classroom');
    setShowAuthModal(true);
  }, []);

  // --- Global loading spinner ---
  if (isLoading) {
    return (
      <Layout header={1} footer={1} video={false}>
        <div className="classroom-landing classroom-landing--loading">
          <div className="classroom-loading__spinner" />
        </div>
      </Layout>
    );
  }

  // --- Authenticated: show course grid dashboard ---
  if (isAuthenticated) {
    const dashLoading = coursesLoading || progressLoading;

    return (
      <Layout header={1} footer={1} video={false}>
        <Head>
          <title>Classroom — The Innovative Native</title>
          <meta name="description" content="Your enrolled courses and learning progress." />
        </Head>
        <div className="classroom">
          <div className="classroom-main">
            <div className="classroom-dashboard">
              <div className="classroom-dashboard__header">
                <h1>Classroom</h1>
                <p>Pick up where you left off, or explore new courses.</p>
              </div>
              <CourseGrid courses={courses} loading={dashLoading} />
            </div>
          </div>
        </div>
        <AuthModal
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
          redirectTo={authRedirectTo}
        />
      </Layout>
    );
  }

  // --- Unauthenticated: show landing page ---
  return (
    <Layout header={1} footer={1} video={false}>
      <Head>
        <title>Learn — The Innovative Native</title>
        <meta
          name="description"
          content="Join BuildMyTribe.AI — AI-first systems, brand builders, and workflow automation. 7-day free trial, then $99/month."
        />
        <meta property="og:title" content="BuildMyTribe.AI Classroom" />
        <meta property="og:description" content="AI-first systems, brand builders, and workflow automation. 7-day free trial, then $99/month." />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="/images/classroom/banner.jpg" />
        <meta name="twitter:card" content="summary_large_image" />
      </Head>
      <ClassroomLanding
        memberCount={memberCount}
        adminCount={adminCount}
        onlineCount={onlineCount}
        isConnected={isConnected}
        loading={statsLoading}
        isAuthenticated={isAuthenticated}
        onLoginClick={handleLoginClick}
        onTrialClick={isExpiredMember ? handleLoginClick : handleTrialClick}
      />
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        redirectTo={authRedirectTo}
      />
    </Layout>
  );
};

export default ClassroomPage;
