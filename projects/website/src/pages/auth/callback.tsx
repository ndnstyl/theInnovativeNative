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

      // Get the code and error from URL if present (for PKCE flow)
      const { searchParams } = new URL(window.location.href);
      const code = searchParams.get('code');
      const errorParam = searchParams.get('error');
      const errorDescription = searchParams.get('error_description');

      if (errorParam) {
        setError(errorDescription || errorParam);
        return;
      }

      if (code) {
        try {
          // Exchange the code for a session
          const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);

          if (exchangeError) {
            console.error('Error exchanging code for session:', exchangeError);
            setError(exchangeError.message);
            return;
          }

          // Successfully authenticated, redirect to dashboard
          router.replace('/dashboard');
        } catch (err) {
          console.error('Unexpected error during auth callback:', err);
          setError('An unexpected error occurred during authentication.');
        }
      } else {
        // If no code, check if we already have a session
        const { data: { session } } = await supabase.auth.getSession();

        if (session) {
          router.replace('/dashboard');
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
        <title>Authenticating... | Law Firm RAG</title>
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
                onClick={() => router.push('/law-firm-rag')}
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
