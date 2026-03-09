import React, { useState, useEffect, useCallback } from 'react';
import { createBrowserClient } from '@/lib/supabase';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  redirectTo?: string;
}

type AuthMode = 'signin' | 'signup';

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, redirectTo }) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [mode, setMode] = useState<AuthMode>('signin');

  // Reset state when modal opens/closes
  useEffect(() => {
    if (!isOpen) {
      setEmail('');
      setMessage(null);
      setLoading(false);
    }
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !email.includes('@')) {
      setMessage({ type: 'error', text: 'Please enter a valid email address.' });
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      const supabase = createBrowserClient();

      // Build the redirect URL
      const redirectUrl = `${window.location.origin}/auth/callback`;

      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: redirectUrl,
          shouldCreateUser: mode === 'signup',
        },
      });

      if (error) {
        console.error('Auth error:', error);
        setMessage({ type: 'error', text: error.message });
      } else {
        setMessage({
          type: 'success',
          text: 'Check your email for the magic link to sign in!',
        });
        setEmail('');
      }
    } catch (err) {
      console.error('Unexpected error:', err);
      setMessage({ type: 'error', text: 'An unexpected error occurred. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const handleBackdropClick = useCallback(
    (e: React.MouseEvent) => {
      if (e.target === e.currentTarget) {
        onClose();
      }
    },
    [onClose]
  );

  if (!isOpen) return null;

  return (
    <div className="auth-modal-overlay" onClick={handleBackdropClick}>
      <div className="auth-modal">
        <button className="auth-modal-close" onClick={onClose} aria-label="Close modal">
          <i className="fa-solid fa-xmark"></i>
        </button>

        <div className="auth-modal-header">
          <h2>{mode === 'signin' ? 'Welcome Back' : 'Get Started'}</h2>
          <p>
            {mode === 'signin'
              ? 'Sign in to access the community'
              : 'Create an account to join the community'}
          </p>
        </div>

        <button
          type="button"
          className="auth-google-btn"
          onClick={async () => {
            const supabase = createBrowserClient();
            await supabase.auth.signInWithOAuth({
              provider: 'google',
              options: {
                redirectTo: window.location.origin + '/auth/callback',
              },
            });
          }}
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 01-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
            <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z" fill="#34A853"/>
            <path d="M3.964 10.71A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.997 8.997 0 000 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/>
            <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
          </svg>
          Continue with Google
        </button>

        <div className="auth-divider">
          <span>or</span>
        </div>

        <form onSubmit={handleSubmit} className="auth-modal-form">
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@email.com"
              disabled={loading}
              autoComplete="email"
              autoFocus
            />
          </div>

          {message && (
            <div className={`auth-message ${message.type}`}>
              <i className={`fa-solid ${message.type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}`}></i>
              <span>{message.text}</span>
            </div>
          )}

          <button
            type="submit"
            className="btn btn--primary auth-submit-btn"
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="auth-spinner"></span>
                Sending Magic Link...
              </>
            ) : (
              <>
                Send Magic Link
                <i className="fa-solid fa-paper-plane"></i>
              </>
            )}
          </button>
        </form>

        <div className="auth-modal-footer">
          {mode === 'signin' ? (
            <p>
              New here?{' '}
              <button
                type="button"
                className="auth-switch-btn"
                onClick={() => setMode('signup')}
              >
                Create an account
              </button>
            </p>
          ) : (
            <p>
              Already have an account?{' '}
              <button
                type="button"
                className="auth-switch-btn"
                onClick={() => setMode('signin')}
              >
                Sign in
              </button>
            </p>
          )}
        </div>

        <div className="auth-modal-legal">
          <p>
            By continuing, you agree to our{' '}
            <a href="/terms" target="_blank" rel="noopener noreferrer">
              Terms of Service
            </a>{' '}
            and{' '}
            <a href="/privacy" target="_blank" rel="noopener noreferrer">
              Privacy Policy
            </a>
          </p>
        </div>
      </div>

      <style jsx>{`
        .auth-modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(0, 0, 0, 0.85);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 10000;
          padding: 20px;
          animation: fadeIn 0.2s ease;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        .auth-modal {
          background-color: #0a0a0a;
          border: 1px solid #1a1a1a;
          border-radius: 16px;
          width: 100%;
          max-width: 420px;
          padding: 40px;
          position: relative;
          animation: slideUp 0.3s ease;
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .auth-modal-close {
          position: absolute;
          top: 16px;
          right: 16px;
          background: none;
          border: none;
          color: #757575;
          font-size: 20px;
          cursor: pointer;
          padding: 8px;
          transition: color 0.2s ease;
        }

        .auth-modal-close:hover {
          color: #fff;
        }

        .auth-modal-header {
          text-align: center;
          margin-bottom: 32px;
        }

        .auth-modal-header h2 {
          color: #fff;
          font-size: 28px;
          font-weight: 700;
          margin: 0 0 8px;
        }

        .auth-modal-header p {
          color: #757575;
          font-size: 14px;
          margin: 0;
        }

        .auth-google-btn {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          padding: 14px 24px;
          font-size: 15px;
          font-weight: 500;
          color: #fff;
          background-color: #0e0e0e;
          border: 1px solid #1a1a1a;
          border-radius: 8px;
          cursor: pointer;
          transition: border-color 0.2s ease, background-color 0.2s ease;
        }

        .auth-google-btn:hover {
          border-color: #333;
          background-color: #141414;
        }

        .auth-divider {
          display: flex;
          align-items: center;
          gap: 16px;
          margin: 4px 0;
        }

        .auth-divider::before,
        .auth-divider::after {
          content: '';
          flex: 1;
          height: 1px;
          background-color: #1a1a1a;
        }

        .auth-divider span {
          color: #4a4a4a;
          font-size: 13px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .auth-modal-form {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .form-group label {
          color: #fff;
          font-size: 14px;
          font-weight: 500;
        }

        .form-group input {
          background-color: #0e0e0e;
          border: 1px solid #1a1a1a;
          border-radius: 8px;
          padding: 14px 16px;
          color: #fff;
          font-size: 16px;
          transition: border-color 0.2s ease, box-shadow 0.2s ease;
        }

        .form-group input::placeholder {
          color: #4a4a4a;
        }

        .form-group input:focus {
          outline: none;
          border-color: #00FFFF;
          box-shadow: 0 0 0 3px rgba(0, 255, 255, 0.1);
        }

        .form-group input:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .auth-message {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 12px 16px;
          border-radius: 8px;
          font-size: 14px;
        }

        .auth-message.success {
          background-color: rgba(0, 255, 255, 0.1);
          color: #00FFFF;
          border: 1px solid rgba(0, 255, 255, 0.2);
        }

        .auth-message.error {
          background-color: rgba(255, 68, 68, 0.1);
          color: #ff4444;
          border: 1px solid rgba(255, 68, 68, 0.2);
        }

        .auth-submit-btn {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          padding: 16px 24px;
          font-size: 16px;
          margin-top: 8px;
        }

        .auth-submit-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .auth-spinner {
          width: 18px;
          height: 18px;
          border: 2px solid #1a1a1a;
          border-top-color: currentColor;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }

        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }

        .auth-modal-footer {
          text-align: center;
          margin-top: 24px;
          padding-top: 24px;
          border-top: 1px solid #1a1a1a;
        }

        .auth-modal-footer p {
          color: #757575;
          font-size: 14px;
          margin: 0;
        }

        .auth-switch-btn {
          background: none;
          border: none;
          color: #00FFFF;
          font-size: 14px;
          cursor: pointer;
          padding: 0;
          text-decoration: underline;
          text-underline-offset: 2px;
        }

        .auth-switch-btn:hover {
          color: #fff;
        }

        .auth-modal-legal {
          text-align: center;
          margin-top: 16px;
        }

        .auth-modal-legal p {
          color: #4a4a4a;
          font-size: 12px;
          margin: 0;
        }

        .auth-modal-legal a {
          color: #757575;
          text-decoration: underline;
          text-underline-offset: 2px;
        }

        .auth-modal-legal a:hover {
          color: #00FFFF;
        }

        @media (max-width: 480px) {
          .auth-modal {
            padding: 32px 24px;
          }

          .auth-modal-header h2 {
            font-size: 24px;
          }
        }
      `}</style>
    </div>
  );
};

export default AuthModal;
