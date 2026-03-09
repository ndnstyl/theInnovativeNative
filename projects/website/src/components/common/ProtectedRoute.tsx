import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@/contexts/AuthContext';
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
  const { session, isLoading, profile, role, membershipStatus, isOnboarded } = useAuth();
  const router = useRouter();
  const [showAuth, setShowAuth] = useState(false);

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

  // Banned
  if (membershipStatus === 'banned') {
    return (
      <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
        <div>
          <i className="fa-solid fa-ban" style={{ fontSize: 48, color: '#ff4444', marginBottom: 24 }}></i>
          <h2 style={{ color: '#fff', marginBottom: 8 }}>Account Suspended</h2>
          <p style={{ color: '#757575' }}>Your account has been suspended. Contact support for more information.</p>
        </div>
      </div>
    );
  }

  // Pending membership
  if (membershipStatus === 'pending') {
    return (
      <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
        <div>
          <i className="fa-solid fa-clock" style={{ fontSize: 48, color: '#00FFFF', marginBottom: 24 }}></i>
          <h2 style={{ color: '#fff', marginBottom: 8 }}>Membership Pending</h2>
          <p style={{ color: '#757575', maxWidth: 400 }}>
            Your membership request is under review. You&apos;ll receive an email when it has been processed.
          </p>
        </div>
      </div>
    );
  }

  // Not onboarded
  if (requireOnboarded && !isOnboarded) {
    if (typeof window !== 'undefined' && router.pathname !== '/members/onboarding') {
      router.replace('/members/onboarding');
    }
    return null;
  }

  // Role check
  if (requiredRole && role && !requiredRole.includes(role)) {
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

  return <>{children}</>;
};

export default ProtectedRoute;
