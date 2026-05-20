import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { createBrowserClient } from '@/lib/supabase';
import AuthModal from '@/components/auth/AuthModal';

const InvitePage = () => {
  const router = useRouter();
  const { token } = router.query;
  const [status, setStatus] = useState<'loading' | 'valid' | 'invalid' | 'expired'>('loading');
  const [showAuth, setShowAuth] = useState(false);
  const [inviterMessage, setInviterMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!token || typeof token !== 'string') return;

    const validateToken = async () => {
      const supabase = createBrowserClient();

      const { data, error } = await supabase
        .from('invitations')
        .select('id, status, expires_at, personal_message')
        .eq('token', token)
        .single();

      if (error || !data) {
        setStatus('invalid');
        return;
      }

      if (data.status !== 'pending') {
        setStatus('invalid');
        return;
      }

      if (new Date(data.expires_at) < new Date()) {
        setStatus('expired');
        return;
      }

      setInviterMessage(data.personal_message);
      setStatus('valid');
      setShowAuth(true);
    };

    validateToken();
  }, [token]);

  return (
    <>
      <Head>
        <title>Join The Innovative Native</title>
        <meta name="robots" content="noindex" />
      </Head>
      <div className="invite-page">
        <div className="invite-container">
          {status === 'loading' && (
            <div className="invite-loading">
              <div className="invite-spinner" />
              <p>Verifying invitation...</p>
            </div>
          )}

          {status === 'valid' && (
            <div className="invite-valid">
              <i className="fa-solid fa-envelope-open" style={{ fontSize: 48, color: '#00FFFF', marginBottom: 20 }}></i>
              <h1>You&apos;re Invited!</h1>
              <p>You&apos;ve been invited to join The Innovative Native community.</p>
              {inviterMessage && (
                <blockquote className="invite-message">
                  &ldquo;{inviterMessage}&rdquo;
                </blockquote>
              )}
              <button className="btn btn--primary" onClick={() => setShowAuth(true)}>
                Accept Invitation
              </button>
            </div>
          )}

          {status === 'invalid' && (
            <div className="invite-error">
              <i className="fa-solid fa-circle-xmark" style={{ fontSize: 48, color: '#ff4444', marginBottom: 20 }}></i>
              <h2>Invalid Invitation</h2>
              <p>This invitation link is invalid or has already been used.</p>
              <a href="/" className="btn btn--outline">Go to Homepage</a>
            </div>
          )}

          {status === 'expired' && (
            <div className="invite-error">
              <i className="fa-solid fa-clock" style={{ fontSize: 48, color: '#ffa500', marginBottom: 20 }}></i>
              <h2>Invitation Expired</h2>
              <p>This invitation has expired. Please ask for a new invitation.</p>
              <a href="/" className="btn btn--outline">Go to Homepage</a>
            </div>
          )}
        </div>

        <AuthModal
          isOpen={showAuth}
          onClose={() => setShowAuth(false)}
          redirectTo={`/auth/callback?invite_token=${token}`}
        />
      </div>

      <style jsx>{`
        .invite-page {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #000;
          padding: 40px 20px;
          text-align: center;
        }
        .invite-container { max-width: 460px; }
        .invite-loading { color: #757575; }
        .invite-spinner {
          width: 40px;
          height: 40px;
          border: 3px solid #1a1a1a;
          border-top-color: #00FFFF;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin: 0 auto 16px;
        }
        .invite-valid h1, .invite-error h2 {
          color: #fff;
          margin: 0 0 8px;
        }
        .invite-valid p, .invite-error p {
          color: #757575;
          margin-bottom: 24px;
        }
        .invite-message {
          background: #0e0e0e;
          border-left: 3px solid #00FFFF;
          padding: 12px 16px;
          margin: 16px 0 24px;
          color: #ccc;
          font-style: italic;
          text-align: left;
          border-radius: 0 8px 8px 0;
        }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </>
  );
};

export default InvitePage;
