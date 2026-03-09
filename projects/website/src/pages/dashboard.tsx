import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { createBrowserClient } from '@/lib/supabase';
import type { User } from '@supabase/supabase-js';
import type { Profile } from '@/types/supabase';
import Layout from '@/components/layout/Layout';
import UserMenu from '@/components/auth/UserMenu';

const Dashboard = () => {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserAndProfile = async () => {
      const supabase = createBrowserClient();

      // Get current user
      const { data: { user }, error: userError } = await supabase.auth.getUser();

      if (userError || !user) {
        router.replace('/law-firm-rag?auth=required');
        return;
      }

      setUser(user);

      // Try to get profile
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (profileData) {
        setProfile(profileData);
      }

      setLoading(false);
    };

    fetchUserAndProfile();

    // Listen for auth changes
    const supabase = createBrowserClient();
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT') {
        router.replace('/law-firm-rag');
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [router]);

  const getPilotStatusBadge = () => {
    const status = (profile as any)?.pilot_status || 'pending';
    const statusConfig: Record<string, { label: string; color: string }> = {
      pending: { label: 'Pending Approval', color: '#ffa500' },
      active: { label: 'Active Pilot', color: '#00FFFF' },
      completed: { label: 'Pilot Completed', color: '#4CAF50' },
      cancelled: { label: 'Cancelled', color: '#ff4444' },
    };

    const config = statusConfig[status] || statusConfig.pending;

    return (
      <span className="pilot-status-badge" style={{ backgroundColor: `${config.color}20`, color: config.color }}>
        {config.label}
      </span>
    );
  };

  if (loading) {
    return (
      <>
        <Head>
          <title>Dashboard | Law Firm RAG</title>
          <meta name="robots" content="noindex" />
        </Head>
        <div className="dashboard-loading">
          <div className="loading-spinner"></div>
          <p>Loading your dashboard...</p>
        </div>
        <style jsx>{`
          .dashboard-loading {
            min-height: 100vh;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            background-color: #000;
            gap: 20px;
          }

          .dashboard-loading p {
            color: #757575;
          }

          .loading-spinner {
            width: 40px;
            height: 40px;
            border: 3px solid #1a1a1a;
            border-top-color: #00FFFF;
            border-radius: 50%;
            animation: spin 1s linear infinite;
          }

          @keyframes spin {
            to {
              transform: rotate(360deg);
            }
          }
        `}</style>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>Dashboard | Law Firm RAG</title>
        <meta name="robots" content="noindex" />
      </Head>

      <div className="dashboard-page">
        {/* Dashboard Header */}
        <header className="dashboard-header">
          <div className="container">
            <div className="dashboard-header-inner">
              <Link href="/law-firm-rag" className="dashboard-logo">
                <span className="logo-text">Law Firm RAG</span>
              </Link>
              {user && <UserMenu user={user} />}
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="dashboard-main">
          <div className="container">
            <div className="dashboard-welcome">
              <h1>Welcome to your Dashboard</h1>
              <p>Manage your Law Firm RAG pilot program membership</p>
            </div>

            <div className="dashboard-grid">
              {/* Pilot Status Card */}
              <div className="dashboard-card">
                <div className="card-header">
                  <i className="fa-solid fa-rocket"></i>
                  <h2>Pilot Status</h2>
                </div>
                <div className="card-content">
                  <div className="status-row">
                    <span className="status-label">Current Status</span>
                    {getPilotStatusBadge()}
                  </div>
                  {(profile as any)?.pilot_started_at && (
                    <div className="status-row">
                      <span className="status-label">Started</span>
                      <span className="status-value">
                        {new Date((profile as any).pilot_started_at).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                  <p className="card-description">
                    {(profile as any)?.pilot_status === 'active'
                      ? "You're currently participating in the pilot program. Access to all features is enabled."
                      : "Your pilot application is being reviewed. We'll notify you once approved."}
                  </p>
                </div>
              </div>

              {/* Account Info Card */}
              <div className="dashboard-card">
                <div className="card-header">
                  <i className="fa-solid fa-user-circle"></i>
                  <h2>Account Information</h2>
                </div>
                <div className="card-content">
                  <div className="info-row">
                    <span className="info-label">Email</span>
                    <span className="info-value">{user?.email}</span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">Member Since</span>
                    <span className="info-value">
                      {user?.created_at
                        ? new Date(user.created_at).toLocaleDateString()
                        : 'N/A'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Billing Card */}
              <div className="dashboard-card" id="billing">
                <div className="card-header">
                  <i className="fa-solid fa-credit-card"></i>
                  <h2>Billing</h2>
                </div>
                <div className="card-content">
                  <div className="billing-status">
                    <span className="billing-badge">Pilot Program - Free</span>
                  </div>
                  <p className="card-description">
                    As a pilot member, you have free access to Law Firm RAG during the pilot period.
                    Billing details will be available when the pilot concludes.
                  </p>
                  <button className="btn btn--secondary billing-btn" disabled>
                    <i className="fa-solid fa-external-link-alt"></i>
                    Manage Billing (Coming Soon)
                  </button>
                </div>
              </div>

              {/* Quick Actions Card */}
              <div className="dashboard-card">
                <div className="card-header">
                  <i className="fa-solid fa-bolt"></i>
                  <h2>Quick Actions</h2>
                </div>
                <div className="card-content">
                  <div className="quick-actions">
                    <Link href="/law-firm-rag" className="quick-action-btn">
                      <i className="fa-solid fa-house"></i>
                      <span>Product Page</span>
                    </Link>
                    <a
                      href="https://calendly.com/mike-buildmytribe/ai-discovery-call"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="quick-action-btn"
                    >
                      <i className="fa-solid fa-calendar"></i>
                      <span>Schedule Call</span>
                    </a>
                    <a
                      href="mailto:info@theinnovativenative.com"
                      className="quick-action-btn"
                    >
                      <i className="fa-solid fa-envelope"></i>
                      <span>Contact Support</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      <style jsx>{`
        .dashboard-page {
          min-height: 100vh;
          background-color: #000;
        }

        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 24px;
        }

        .dashboard-header {
          border-bottom: 1px solid #1a1a1a;
          padding: 16px 0;
          position: sticky;
          top: 0;
          background-color: #000;
          z-index: 100;
        }

        .dashboard-header-inner {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .dashboard-logo {
          text-decoration: none;
        }

        .logo-text {
          color: #fff;
          font-size: 20px;
          font-weight: 700;
        }

        .logo-text::before {
          content: '';
          display: inline-block;
          width: 8px;
          height: 8px;
          background-color: #00FFFF;
          border-radius: 50%;
          margin-right: 10px;
        }

        .dashboard-main {
          padding: 48px 0;
        }

        .dashboard-welcome {
          margin-bottom: 40px;
        }

        .dashboard-welcome h1 {
          color: #fff;
          font-size: 32px;
          font-weight: 700;
          margin: 0 0 8px;
        }

        .dashboard-welcome p {
          color: #757575;
          font-size: 16px;
          margin: 0;
        }

        .dashboard-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 24px;
        }

        @media (max-width: 768px) {
          .dashboard-grid {
            grid-template-columns: 1fr;
          }
        }

        .dashboard-card {
          background-color: #0a0a0a;
          border: 1px solid #1a1a1a;
          border-radius: 16px;
          overflow: hidden;
        }

        .card-header {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 20px 24px;
          border-bottom: 1px solid #1a1a1a;
        }

        .card-header i {
          color: #00FFFF;
          font-size: 18px;
        }

        .card-header h2 {
          color: #fff;
          font-size: 18px;
          font-weight: 600;
          margin: 0;
        }

        .card-content {
          padding: 24px;
        }

        .status-row,
        .info-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 16px;
        }

        .status-label,
        .info-label {
          color: #757575;
          font-size: 14px;
        }

        .status-value,
        .info-value {
          color: #fff;
          font-size: 14px;
        }

        .pilot-status-badge {
          padding: 6px 12px;
          border-radius: 50px;
          font-size: 12px;
          font-weight: 600;
        }

        .card-description {
          color: #757575;
          font-size: 14px;
          line-height: 1.6;
          margin: 16px 0 0;
        }

        .billing-status {
          margin-bottom: 16px;
        }

        .billing-badge {
          background-color: rgba(0, 255, 255, 0.1);
          color: #00FFFF;
          padding: 8px 16px;
          border-radius: 50px;
          font-size: 14px;
          font-weight: 600;
        }

        .billing-btn {
          margin-top: 20px;
          display: inline-flex;
          align-items: center;
          gap: 8px;
        }

        .billing-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .quick-actions {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 12px;
        }

        @media (max-width: 480px) {
          .quick-actions {
            grid-template-columns: 1fr;
          }
        }

        .quick-action-btn {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          padding: 20px 16px;
          background-color: #0e0e0e;
          border: 1px solid #1a1a1a;
          border-radius: 12px;
          color: #c1c1c1;
          text-decoration: none;
          transition: all 0.2s ease;
        }

        .quick-action-btn:hover {
          border-color: #00FFFF;
          color: #fff;
        }

        .quick-action-btn i {
          font-size: 20px;
        }

        .quick-action-btn span {
          font-size: 13px;
        }
      `}</style>
    </>
  );
};

export default Dashboard;
