import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { getSupabaseBrowserClient } from '@/lib/supabase';

const AuthCallback = () => {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleCallback = async () => {
      const supabase = getSupabaseBrowserClient();
      const { searchParams, hash } = new URL(window.location.href);

      const errorParam = searchParams.get('error');
      const errorDescription = searchParams.get('error_description');

      if (errorParam) {
        setError(errorDescription || errorParam);
        return;
      }

      const code = searchParams.get('code');

      if (code) {
        // PKCE flow: exchange code for session
        const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);

        if (exchangeError) {
          setError(exchangeError.message);
          return;
        }

        const session = data?.session;
        if (!session?.user) {
          setError('Authentication failed. Please try again.');
          return;
        }

        // Handle invitation token
        const inviteToken = searchParams.get('invite_token');
        if (inviteToken) {
          try {
            const { data: invitation } = await supabase
              .from('invitations')
              .select('id, status, expires_at')
              .eq('token', inviteToken)
              .eq('status', 'pending')
              .single();

            if (invitation && new Date(invitation.expires_at) > new Date()) {
              await supabase.from('invitations').update({ status: 'accepted' }).eq('id', invitation.id);
              await supabase.from('profiles').update({ membership_status: 'approved' }).eq('id', session.user.id);
            }
          } catch { /* invitation handling non-critical */ }
        }

        await redirectUser(supabase, session.user.id, searchParams);
        return;
      }

      // No code — check for hash fragment (implicit flow fallback) or existing session
      if (hash && (hash.includes('access_token') || hash.includes('type=recovery'))) {
        // detectSessionInUrl: true will handle this automatically via onAuthStateChange
        // Wait briefly for the client to process the hash
        await new Promise(r => setTimeout(r, 1000));
      }

      // Check if we have a session now (either from hash processing or existing)
      const { data: { session: existingSession } } = await supabase.auth.getSession();
      if (existingSession?.user) {
        await redirectUser(supabase, existingSession.user.id, searchParams);
      } else {
        setError('No authentication code found. Please try signing in again.');
      }
    };

    const redirectUser = async (
      supabase: ReturnType<typeof getSupabaseBrowserClient>,
      userId: string,
      searchParams: URLSearchParams
    ) => {
      // Check return_to
      const rawReturnTo = searchParams.get('return_to') || sessionStorage.getItem('auth_return_to');
      sessionStorage.removeItem('auth_return_to');
      const returnTo = rawReturnTo && rawReturnTo.startsWith('/') && !rawReturnTo.startsWith('//') ? rawReturnTo : null;

      if (returnTo) {
        router.replace(returnTo);
        return;
      }

      // Fetch profile to determine redirect
      const { data: profile } = await supabase
        .from('profiles')
        .select('onboarding_complete, membership_status')
        .eq('id', userId)
        .single();

      if (!profile || !profile.onboarding_complete) {
        router.replace('/members/onboarding');
      } else if (profile.membership_status === 'pending') {
        router.replace('/members');
      } else {
        router.replace('/classroom');
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
              <button onClick={() => router.push('/')} className="btn btn--primary">
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
        .auth-callback-container { text-align: center; max-width: 400px; }
        .auth-callback-loading h2, .auth-callback-error h2 {
          color: #fff; margin: 24px 0 12px; font-size: 24px;
        }
        .auth-callback-loading p, .auth-callback-error p {
          color: #757575; margin-bottom: 24px;
        }
        .loading-spinner {
          width: 48px; height: 48px; border: 3px solid #1a1a1a;
          border-top-color: #00FFFF; border-radius: 50%;
          animation: spin 1s linear infinite; margin: 0 auto;
        }
        .error-icon { font-size: 48px; color: #ff4444; }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </>
  );
};

export default AuthCallback;
