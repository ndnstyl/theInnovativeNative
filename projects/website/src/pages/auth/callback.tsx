import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { createBrowserClient } from '@/lib/supabase';

const AuthCallback = () => {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleCallback = async () => {
      const supabase = createBrowserClient();

      const { searchParams } = new URL(window.location.href);
      const code = searchParams.get('code');
      const errorParam = searchParams.get('error');
      const errorDescription = searchParams.get('error_description');
      const inviteToken = searchParams.get('invite_token');

      if (errorParam) {
        setError(errorDescription || errorParam);
        return;
      }

      if (code) {
        try {
          const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);

          if (exchangeError) {
            setError(exchangeError.message);
            return;
          }

          // Get the authenticated user
          const { data: { user } } = await supabase.auth.getUser();
          if (!user) {
            setError('Authentication failed. Please try again.');
            return;
          }

          // Handle invitation token — auto-approve membership
          if (inviteToken) {
            const { data: invitation } = await supabase
              .from('invitations')
              .select('id, status, expires_at')
              .eq('token', inviteToken)
              .eq('status', 'pending')
              .single();

            if (invitation && new Date(invitation.expires_at) > new Date()) {
              await supabase
                .from('invitations')
                .update({ status: 'accepted' })
                .eq('id', invitation.id);

              await supabase
                .from('profiles')
                .update({ membership_status: 'approved' })
                .eq('id', user.id);
            }
          }

          // Fetch profile to determine redirect
          const { data: profile } = await supabase
            .from('profiles')
            .select('onboarding_complete, membership_status')
            .eq('id', user.id)
            .single();

          if (!profile || !profile.onboarding_complete) {
            router.replace('/members/onboarding');
          } else if (profile.membership_status === 'pending') {
            router.replace('/members');
          } else {
            router.replace('/members');
          }
        } catch {
          setError('An unexpected error occurred during authentication.');
        }
      } else {
        const { data: { session } } = await supabase.auth.getSession();

        if (session) {
          router.replace('/members');
        } else {
          setError('No authentication code found. Please try signing in again.');
        }
      }
    };

    handleCallback();
  }, [router]);

  return (
    <>
      <Head>
        <title>Authenticating... | The Innovative Native</title>
        <meta name="robots" content="noindex" />
      </Head>
      <div className="auth-callback-page">
        <div className="auth-callback-container">
          {error ? (
            <div className="auth-callback-error">
              <div className="error-icon">
                <i className="fa-solid fa-circle-exclamation"></i>
              </div>
              <h2>Authentication Error</h2>
              <p>{error}</p>
              <button
                onClick={() => router.push('/')}
                className="btn btn--primary"
              >
                Return to Home
              </button>
            </div>
          ) : (
            <div className="auth-callback-loading">
              <div className="loading-spinner"></div>
              <h2>Signing you in...</h2>
              <p>Please wait while we complete your authentication.</p>
            </div>
          )}
        </div>
      </div>
      <style jsx>{`
        .auth-callback-page {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: #000;
          padding: 20px;
        }

        .auth-callback-container {
          text-align: center;
          max-width: 400px;
        }

        .auth-callback-loading h2,
        .auth-callback-error h2 {
          color: #fff;
          margin: 24px 0 12px;
          font-size: 24px;
        }

        .auth-callback-loading p,
        .auth-callback-error p {
          color: #757575;
          margin-bottom: 24px;
        }

        .loading-spinner {
          width: 48px;
          height: 48px;
          border: 3px solid #1a1a1a;
          border-top-color: #00FFFF;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin: 0 auto;
        }

        .error-icon {
          font-size: 48px;
          color: #ff4444;
        }

        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </>
  );
};

export default AuthCallback;
