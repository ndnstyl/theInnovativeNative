import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@/contexts/AuthContext';
import { getValidToken } from '@/lib/auth-token';
import AuthModal from '@/components/auth/AuthModal';
import type { Role } from '@/types/members';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: Role[];
  requireOnboarded?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredRole,
  requireOnboarded = true,
}) => {
  const { session, isLoading, role, membershipStatus, isOnboarded, authError } = useAuth();
  const router = useRouter();
  const [showAuth, setShowAuth] = useState(false);
  const redirectedRef = useRef(false);
  const [directOnboardCheck, setDirectOnboardCheck] = useState<boolean | null>(null);

  // Direct profile check — if AuthContext's fetchProfile failed, verify directly
  useEffect(() => {
    if (!session?.user?.id || isOnboarded || !requireOnboarded) return;
    const token = getValidToken();
    if (!token) return;

    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

    fetch(`${url}/rest/v1/profiles?id=eq.${session.user.id}&select=onboarding_complete`, {
      headers: { 'apikey': anonKey, 'Authorization': `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0 && data[0].onboarding_complete) {
          setDirectOnboardCheck(true);
        } else {
          setDirectOnboardCheck(false);
        }
      })
      .catch(() => setDirectOnboardCheck(false));
  }, [session, isOnboarded, requireOnboarded]);

  // Use EITHER AuthContext's isOnboarded OR the direct check
  const effectiveOnboarded = isOnboarded || directOnboardCheck === true;

  // Onboarding redirect — in useEffect, NOT during render
  useEffect(() => {
    if (isLoading) return;
    if (!session) return;
    if (!requireOnboarded) return;
    if (effectiveOnboarded) return;
    if (directOnboardCheck === null) return; // Still checking — wait
    if (authError) return;
    if (router.pathname === '/members/onboarding') return;
    if (redirectedRef.current) return;

    redirectedRef.current = true;
    router.replace('/members/onboarding');
  }, [isLoading, session, requireOnboarded, effectiveOnboarded, directOnboardCheck, authError, router]);

  if (isLoading) {
    return (
      <div className="protected-loading">
        <div className="protected-loading__spinner" />
        <p>Loading...</p>
        <style jsx>{`
          .protected-loading {
            min-height: 60vh;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            gap: 16px;
            color: #757575;
          }
          .protected-loading__spinner {
            width: 40px;
            height: 40px;
            border: 3px solid #1a1a1a;
            border-top-color: #00FFFF;
            border-radius: 50%;
            animation: spin 1s linear infinite;
          }
          @keyframes spin { to { transform: rotate(360deg); } }
        `}</style>
      </div>
    );
  }

  // Not authenticated
  if (!session) {
    return (
      <>
        <div className="protected-auth-required">
          <div className="protected-auth-required__content">
            <i className="fa-solid fa-lock" style={{ fontSize: 48, color: '#757575', marginBottom: 24 }}></i>
            <h2 style={{ color: '#fff', marginBottom: 8 }}>Sign in required</h2>
            <p style={{ color: '#757575', marginBottom: 24 }}>You need an account to access this page.</p>
            <button className="btn btn--primary" onClick={() => setShowAuth(true)}>
              Sign In
            </button>
          </div>
          <style jsx>{`
            .protected-auth-required {
              min-height: 60vh;
              display: flex;
              align-items: center;
              justify-content: center;
              text-align: center;
            }
          `}</style>
        </div>
        <AuthModal
          isOpen={showAuth}
          onClose={() => setShowAuth(false)}
          redirectTo={router.asPath}
        />
      </>
    );
  }

  // Blocked state helper with sign-out escape
  const blockedUI = (icon: string, iconColor: string, title: string, message: string) => (
    <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
      <div>
        <i className={`fa-solid ${icon}`} style={{ fontSize: 48, color: iconColor, marginBottom: 24 }}></i>
        <h2 style={{ color: '#fff', marginBottom: 8 }}>{title}</h2>
        <p style={{ color: '#757575', maxWidth: 400, marginBottom: 24 }}>{message}</p>
        <button
          onClick={async () => {
            const { getSupabaseBrowserClient } = await import('@/lib/supabase');
            await getSupabaseBrowserClient().auth.signOut();
            window.location.href = '/classroom';
          }}
          style={{ background: 'none', border: '1px solid rgba(255,255,255,0.2)', borderRadius: 8, color: '#757575', padding: '10px 20px', cursor: 'pointer', fontSize: 14 }}
        >
          Sign out
        </button>
      </div>
    </div>
  );

  // Banned / declined / removed
  if (membershipStatus === 'banned' || membershipStatus === 'declined' || membershipStatus === 'removed') {
    return blockedUI('fa-ban', '#ff4444', 'Account Suspended', 'Your account has been suspended. Contact support for more information.');
  }

  // Pending membership
  if (membershipStatus === 'pending') {
    return blockedUI('fa-clock', '#00FFFF', 'Membership Pending', 'Your membership request is under review. You\'ll receive an email when it has been processed.');
  }

  // Expired membership
  if (membershipStatus === 'expired') {
    return blockedUI('fa-clock-rotate-left', '#ff8800', 'Membership Expired', 'Your membership has expired. Please renew to continue accessing this content.');
  }

  // Auth error — don't redirect to onboarding, show the actual problem
  if (authError && !effectiveOnboarded) {
    return (
      <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
        <div>
          <i className="fa-solid fa-exclamation-triangle" style={{ fontSize: 48, color: '#ff4444', marginBottom: 24 }}></i>
          <h2 style={{ color: '#fff', marginBottom: 8 }}>Something went wrong</h2>
          <p style={{ color: '#757575', maxWidth: 400, marginBottom: 24 }}>{authError}</p>
          <button className="btn btn--primary" onClick={() => window.location.reload()}>
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Not onboarded — useEffect handles the redirect, show loading in the meantime
  if (requireOnboarded && !effectiveOnboarded) {
    return null;
  }

  // Role check — restrictive by default (null role = no access)
  if (requiredRole) {
    if (!role || !requiredRole.includes(role)) {
      return (
        <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
          <div>
            <i className="fa-solid fa-shield-halved" style={{ fontSize: 48, color: '#ff4444', marginBottom: 24 }}></i>
            <h2 style={{ color: '#fff', marginBottom: 8 }}>Access Denied</h2>
            <p style={{ color: '#757575' }}>You don&apos;t have permission to view this page.</p>
          </div>
        </div>
      );
    }
  }

  return <>{children}</>;
};

export default ProtectedRoute;
