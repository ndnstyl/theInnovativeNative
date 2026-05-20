import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAuth } from '@/contexts/AuthContext';
import AuthModal from '@/components/auth/AuthModal';
import UnreadBadge from '@/components/messaging/UnreadBadge';
import NotificationBell from '@/components/notifications/NotificationBell';
import { useUnreadCount } from '@/hooks/useUnreadCount';
import { useRole } from '@/hooks/useRole';

interface ClassroomLayoutProps {
  title?: string;
  children: React.ReactNode;
}

const ClassroomLayout: React.FC<ClassroomLayoutProps> = ({ title, children }) => {
  const { session, isLoading, profile } = useAuth();
  const unreadCount = useUnreadCount();
  const { isAtLeast } = useRole();
  const router = useRouter();
  const [showAuth, setShowAuth] = useState(false);

  const pageTitle = title
    ? `${title} | Classroom | The Innovative Native`
    : 'Classroom | The Innovative Native';

  // Show auth modal if not logged in
  useEffect(() => {
    if (!isLoading && !session) {
      setShowAuth(true);
    }
  }, [isLoading, session]);

  if (isLoading) {
    return (
      <div className="classroom-loading">
        <div className="classroom-loading__spinner" />
        <p>Loading...</p>
      </div>
    );
  }

  if (!session) {
    return (
      <>
        <Head>
          <title>{pageTitle}</title>
        </Head>
        <div className="classroom-auth-required">
          <div className="classroom-auth-required__content">
            <i className="fa-solid fa-graduation-cap"></i>
            <h2>Sign in to access the Classroom</h2>
            <p>You need an account to view courses and track your progress.</p>
            <button className="btn btn--primary" onClick={() => setShowAuth(true)}>
              Sign In
            </button>
          </div>
        </div>
        <AuthModal
          isOpen={showAuth}
          onClose={() => setShowAuth(false)}
          redirectTo={router.asPath}
        />
      </>
    );
  }

  return (
    <>
      <Head>
        <title>{pageTitle}</title>
      </Head>
      <div className="classroom">
        <header className="classroom-header">
          <Link href="/" className="classroom-header__logo">
            The Innovative Native
          </Link>
          <nav className="classroom-header__nav">
            <Link href="/classroom" className={`classroom-header__link ${router.pathname.startsWith('/classroom') ? 'active' : ''}`}>
              <i className="fa-solid fa-graduation-cap"></i>
              Classroom
            </Link>
            <Link href="/community" className={`classroom-header__link ${router.pathname.startsWith('/community') ? 'active' : ''}`}>
              <i className="fa-regular fa-comments"></i>
              Community
            </Link>
            <Link href="/members" className={`classroom-header__link ${router.pathname.startsWith('/members') ? 'active' : ''}`}>
              <i className="fa-solid fa-users"></i>
              Members
            </Link>
            <Link href="/messages" className={`classroom-header__link ${router.pathname.startsWith('/messages') ? 'active' : ''}`}>
              <i className="fa-regular fa-comment-dots"></i>
              Messages
              <UnreadBadge count={unreadCount} />
            </Link>
            <Link href="/community/calendar" className={`classroom-header__link ${router.pathname.startsWith('/community/calendar') ? 'active' : ''}`}>
              <i className="fa-regular fa-calendar"></i>
              Calendar
            </Link>
            <Link href="/community/leaderboard" className={`classroom-header__link ${router.pathname === '/community/leaderboard' ? 'active' : ''}`}>
              <i className="fa-solid fa-trophy"></i>
              Leaderboard
            </Link>
            <Link href="/about" className={`classroom-header__link ${router.pathname === '/about' ? 'active' : ''}`}>
              <i className="fa-solid fa-circle-info"></i>
              About
            </Link>
            <Link href="/dashboard" className={`classroom-header__link ${router.pathname === '/dashboard' ? 'active' : ''}`}>
              <i className="fa-solid fa-gauge"></i>
              Dashboard
            </Link>
            {isAtLeast('admin') && (
              <Link href="/admin" className={`classroom-header__link ${router.pathname.startsWith('/admin') ? 'active' : ''}`}>
                <i className="fa-solid fa-shield-halved"></i>
                Admin
              </Link>
            )}
          </nav>
          <div className="classroom-header__user">
            <NotificationBell />
            {profile?.avatar_url ? (
              <img
                src={profile.avatar_url}
                alt={profile.display_name}
                className="classroom-header__avatar-img"
                style={{ width: 32, height: 32, borderRadius: '50%', objectFit: 'cover' }}
              />
            ) : (
              <span className="classroom-header__avatar">
                {(profile?.display_name || session.user.email || '?').charAt(0).toUpperCase()}
              </span>
            )}
          </div>
        </header>
        <main className="classroom-main">{children}</main>
      </div>
    </>
  );
};

export default ClassroomLayout;
