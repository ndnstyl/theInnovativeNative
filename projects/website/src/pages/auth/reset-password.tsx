import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import Layout from '@/components/layout/Layout';
import { getSupabaseBrowserClient } from '@/lib/supabase';

export default function ResetPassword() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [sessionReady, setSessionReady] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);

  useEffect(() => {
    const supabase = getSupabaseBrowserClient();
    let timeout: NodeJS.Timeout | null = null;
    let subscription: { unsubscribe: () => void } | null = null;

    const initRecovery = async () => {
      // Method 1: PKCE flow — Supabase sends ?code= in URL
      const params = new URLSearchParams(window.location.search);
      const code = params.get('code');

      if (code) {
        try {
          const { error } = await supabase.auth.exchangeCodeForSession(code);
          if (!error) {
            setSessionReady(true);
            setCheckingSession(false);
            return;
          }
        } catch (err) {
          console.warn('[ResetPassword] Code exchange failed:', err instanceof Error ? err.message : 'unknown');
        }
      }

      // Method 2: Hash fragment flow — #access_token=...&type=recovery
      const hash = window.location.hash;
      if (hash && hash.includes('type=recovery')) {
        timeout = setTimeout(() => {
          setCheckingSession(false);
        }, 5000);

        const { data: { subscription: sub } } = supabase.auth.onAuthStateChange((event) => {
          if (event === 'PASSWORD_RECOVERY' || event === 'SIGNED_IN') {
            if (timeout) clearTimeout(timeout);
            setSessionReady(true);
            setCheckingSession(false);
          }
        });
        subscription = sub;
        return;
      }

      // Method 3: Check localStorage for existing session
      const projectRef = (process.env.NEXT_PUBLIC_SUPABASE_URL || '').replace('https://', '').split('.')[0];
      const stored = localStorage.getItem(`sb-${projectRef}-auth-token`);
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          if (parsed?.access_token) {
            setSessionReady(true);
          }
        } catch { /* ignore corrupt storage */ }
      }
      setCheckingSession(false);
    };

    initRecovery();

    // Proper cleanup — prevents memory leak
    return () => {
      if (timeout) clearTimeout(timeout);
      if (subscription) subscription.unsubscribe();
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    if (password.length < 8) {
      setMessage({ type: 'error', text: 'Password must be at least 8 characters.' });
      return;
    }

    if (password !== confirmPassword) {
      setMessage({ type: 'error', text: 'Passwords do not match.' });
      return;
    }

    setLoading(true);

    try {
      const supabase = getSupabaseBrowserClient();
      const { error } = await supabase.auth.updateUser({ password });

      if (error) {
        setMessage({ type: 'error', text: error.message });
      } else {
        setMessage({ type: 'success', text: 'Password updated successfully! Redirecting...' });
        setTimeout(() => {
          router.push('/classroom');
        }, 2000);
      }
    } catch { /* ignore corrupt storage */
      setMessage({ type: 'error', text: 'Something went wrong. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Reset Password | The Innovative Native</title>
        <meta name="robots" content="noindex" />
      </Head>
      <Layout header={1} footer={1} video={false}>
        <div style={{
          minHeight: '80vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '120px 20px 80px',
        }}>
          <div style={{
            maxWidth: 440,
            width: '100%',
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '16px',
            padding: '40px 32px',
          }}>
            {checkingSession ? (
              <div style={{ textAlign: 'center' }}>
                <div style={{
                  width: 40, height: 40, border: '3px solid rgba(255,255,255,0.1)',
                  borderTopColor: '#00ffff', borderRadius: '50%',
                  animation: 'spin 1s linear infinite', margin: '0 auto 16px',
                }} />
                <p style={{ color: 'rgba(255,255,255,0.5)' }}>Verifying your reset link...</p>
              </div>
            ) : !sessionReady ? (
              <div style={{ textAlign: 'center' }}>
                <div style={{
                  width: 64, height: 64, borderRadius: '50%',
                  background: 'rgba(255,68,68,0.1)', border: '2px solid rgba(255,68,68,0.3)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  margin: '0 auto 20px', fontSize: 28, color: '#ff6b6b',
                }}>
                  <i className="fa-solid fa-exclamation-triangle" />
                </div>
                <h2 style={{ color: '#fff', fontSize: 24, marginBottom: 12 }}>
                  Invalid or Expired Link
                </h2>
                <p style={{ color: 'rgba(255,255,255,0.6)', lineHeight: 1.6, marginBottom: 24 }}>
                  This password reset link is invalid or has expired. Please request a new one.
                </p>
                <Link href="/classroom" style={{
                  display: 'inline-block', padding: '12px 24px',
                  background: '#00ffff', color: '#000', fontWeight: 700,
                  textDecoration: 'none', borderRadius: '8px',
                }}>
                  Back to Classroom
                </Link>
              </div>
            ) : (
              <>
                <div style={{ textAlign: 'center', marginBottom: 32 }}>
                  <div style={{
                    width: 56, height: 56, borderRadius: '50%',
                    background: 'rgba(0,255,255,0.1)', border: '2px solid rgba(0,255,255,0.2)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    margin: '0 auto 16px', fontSize: 24, color: '#00ffff',
                  }}>
                    <i className="fa-solid fa-lock" />
                  </div>
                  <h2 style={{ color: '#fff', fontSize: 24, marginBottom: 8 }}>
                    Set New Password
                  </h2>
                  <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 14 }}>
                    Choose a strong password for your account
                  </p>
                </div>

                <form onSubmit={handleSubmit}>
                  <div style={{ marginBottom: 16 }}>
                    <label style={{ display: 'block', color: 'rgba(255,255,255,0.6)', fontSize: 14, marginBottom: 6 }}>
                      New Password
                    </label>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Min 8 characters"
                      disabled={loading}
                      autoFocus
                      style={{
                        width: '100%', padding: '14px 16px',
                        background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.15)',
                        borderRadius: '8px', color: '#fff', fontSize: 15,
                        outline: 'none', boxSizing: 'border-box',
                      }}
                    />
                  </div>

                  <div style={{ marginBottom: 24 }}>
                    <label style={{ display: 'block', color: 'rgba(255,255,255,0.6)', fontSize: 14, marginBottom: 6 }}>
                      Confirm Password
                    </label>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Re-enter your password"
                      disabled={loading}
                      style={{
                        width: '100%', padding: '14px 16px',
                        background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.15)',
                        borderRadius: '8px', color: '#fff', fontSize: 15,
                        outline: 'none', boxSizing: 'border-box',
                      }}
                    />
                  </div>

                  {message && (
                    <div style={{
                      padding: '12px 16px', borderRadius: '8px', marginBottom: 16,
                      background: message.type === 'error' ? 'rgba(255,68,68,0.1)' : 'rgba(63,185,80,0.1)',
                      border: `1px solid ${message.type === 'error' ? 'rgba(255,68,68,0.3)' : 'rgba(63,185,80,0.3)'}`,
                      color: message.type === 'error' ? '#ff6b6b' : '#3fb950',
                      fontSize: 14,
                    }}>
                      <i className={`fa-solid ${message.type === 'error' ? 'fa-exclamation-circle' : 'fa-check-circle'}`} style={{ marginRight: 8 }} />
                      {message.text}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    style={{
                      width: '100%', padding: '14px',
                      background: '#00ffff', color: '#000', border: 'none',
                      borderRadius: '8px', fontSize: 16, fontWeight: 700,
                      cursor: loading ? 'not-allowed' : 'pointer',
                      opacity: loading ? 0.7 : 1,
                    }}
                  >
                    {loading ? 'Updating Password...' : 'Update Password'}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>

        <style jsx>{`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
          input:focus {
            border-color: rgba(0,255,255,0.4) !important;
            box-shadow: 0 0 0 2px rgba(0,255,255,0.1);
          }
        `}</style>
      </Layout>
    </>
  );
}
