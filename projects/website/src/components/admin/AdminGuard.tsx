import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRole } from '@/hooks/useRole';

interface AdminGuardProps {
  children: React.ReactNode;
  requireOwner?: boolean;
}

const AdminGuard: React.FC<AdminGuardProps> = ({ children, requireOwner = false }) => {
  const { session, isLoading } = useAuth();
  const { role } = useRole();

  if (isLoading) {
    return (
      <div className="admin-guard-loading">
        <div className="admin-guard-loading__spinner" />
        <p>Verifying access...</p>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="admin-guard-denied">
        <i className="fa-solid fa-lock"></i>
        <h2>Sign in required</h2>
        <p>You must be signed in to access this area.</p>
      </div>
    );
  }

  const isAdmin = role === 'admin' || role === 'owner';
  const isOwner = role === 'owner';

  if (requireOwner && !isOwner) {
    return (
      <div className="admin-guard-denied">
        <i className="fa-solid fa-shield-halved"></i>
        <h2>Owner access required</h2>
        <p>Only community owners can access this section.</p>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="admin-guard-denied">
        <i className="fa-solid fa-shield-halved"></i>
        <h2>Admin access required</h2>
        <p>You don&apos;t have permission to access the admin dashboard.</p>
      </div>
    );
  }

  return <>{children}</>;
};

export default AdminGuard;
