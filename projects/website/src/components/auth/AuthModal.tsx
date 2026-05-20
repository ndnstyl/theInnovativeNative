import React, { useState, useEffect, useCallback } from 'react';
import { getSupabaseBrowserClient } from '@/lib/supabase';
import { useToast } from '@/components/common/ToastProvider';
import { logger } from '@/lib/logger';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  redirectTo?: string;
}

type AuthMode = 'signin' | 'signup' | 'forgot';

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, redirectTo }) => {
  const { showToast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [mode, setMode] = useState<AuthMode>('signin');

  // Reset state when modal opens/closes
  useEffect(() => {
    if (!isOpen) {
      setEmail('');
      setPassword('');
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

  // Focus trap
  useEffect(() => {
    if (!isOpen) return;
    const modal = document.querySelector('[role="dialog"]');
    if (!modal) return;
    const focusable = modal.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    const trap = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;
      if (e.shiftKey) {
        if (document.activeElement === first) { e.preventDefault(); last.focus(); }
      } else {
        if (document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    };

    document.addEventListener('keydown', trap);
    first?.focus();
    return () => document.removeEventListener('keydown', trap);
  }, [isOpen]);

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

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setMessage({ type: 'error', text: 'Please enter a valid email address.' });
      return;
    }

    if (mode !== 'forgot' && (!password || password.length < 8)) {
      setMessage({ type: 'error', text: 'Password must be at least 8 characters.' });
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      const supabase = getSupabaseBrowserClient();

      if (mode === 'forgot') {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/auth/reset-password`,
        });

        if (error) {
          logger.warn('AuthModal', 'forgotPassword', error.message);
          setMessage({ type: 'error', text: error.message });
        } else {
          setMessage({
            type: 'success',
            text: 'Password reset email sent! Check your inbox and click the link to set a new password.',
          });
          showToast('Reset email sent! Check your inbox.', 'success');
        }
        setLoading(false);
        return;
      }

      // Redirect to the destination page. Onboarding gating is handled by
      // ProtectedRoute on pages that need it. The classroom page is public.
      // Previous approach of checking onboarding here caused a loop where
      // the profile query failed (RLS timing) and always redirected to onboarding.
      const redirect = () => {
        window.location.href = redirectTo || '/classroom';
      };

      if (mode === 'signup') {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/auth/callback`,
          },
        });

        if (error) {
          logger.error('AuthModal', 'signUp', error);
          setMessage({ type: 'error', text: error.message });
          showToast('Sign up failed: ' + error.message, 'error');
        } else if (data.session) {
          showToast('Account created!', 'success');
          onClose();
          redirect();
        } else {
          setMessage({
            type: 'success',
            text: 'Account created! Check your email to confirm, then sign in.',
          });
          showToast('Account created! Check your email.', 'success');
          setEmail('');
          setPassword('');
        }
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) {
          logger.error('AuthModal', 'signIn', error);
          setMessage({ type: 'error', text: error.message });
          showToast('Login failed: ' + error.message, 'error');
        } else if (data.session) {
          showToast('Signed in successfully', 'success');
          onClose();
          redirect();
        }
      }
    } catch (err) {
      logger.error('AuthModal', 'handleSubmit', err);
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
      <div className="auth-modal" role="dialog" aria-modal="true" aria-labelledby="auth-modal-title">
        <button className="auth-modal-close" onClick={onClose} aria-label="Close modal">
          <i className="fa-solid fa-xmark"></i>
        </button>

        <div className="auth-modal-header">
          <h2 id="auth-modal-title">
            {mode === 'signin' ? 'Welcome Back' : mode === 'signup' ? 'Get Started' : 'Reset Password'}
          </h2>
          <p>
            {mode === 'signin'
              ? 'Sign in to access the community'
              : mode === 'signup'
              ? 'Create an account to join the community'
              : 'Enter your email and we\'ll send you a reset link'}
          </p>
        </div>

        {/* Google OAuth removed — provider not enabled in Supabase. Re-add when configured. */}

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

          {mode !== 'forgot' && (
            <div className="form-group">
              <label htmlFor="auth-password">Password</label>
              <input
                type="password"
                id="auth-password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={mode === 'signup' ? 'Create a password (min 8 chars)' : 'Your password'}
                disabled={loading}
                autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
              />
            </div>
          )}

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
                {mode === 'forgot' ? 'Sending Reset Link...' : mode === 'signup' ? 'Creating Account...' : 'Signing In...'}
              </>
            ) : (
              <>
                {mode === 'forgot' ? 'Send Reset Link' : mode === 'signup' ? 'Create Account' : 'Sign In'}
                <i className={`fa-solid ${mode === 'forgot' ? 'fa-envelope' : mode === 'signup' ? 'fa-user-plus' : 'fa-sign-in-alt'}`}></i>
              </>
            )}
          </button>
        </form>

        <div className="auth-modal-footer">
          {mode === 'signin' ? (
            <>
              <p>
                <button
                  type="button"
                  className="auth-switch-btn"
                  onClick={() => { setMode('forgot'); setMessage(null); }}
                >
                  Forgot your password?
                </button>
              </p>
              <p>
                New here?{' '}
                <button
                  type="button"
                  className="auth-switch-btn"
                  onClick={() => { setMode('signup'); setMessage(null); }}
                >
                  Create an account
                </button>
              </p>
            </>
          ) : mode === 'signup' ? (
            <p>
              Already have an account?{' '}
              <button
                type="button"
                className="auth-switch-btn"
                onClick={() => { setMode('signin'); setMessage(null); }}
              >
                Sign in
              </button>
            </p>
          ) : (
            <p>
              Remember your password?{' '}
              <button
                type="button"
                className="auth-switch-btn"
                onClick={() => { setMode('signin'); setMessage(null); }}
              >
                Back to sign in
              </button>
            </p>
          )}
        </div>

        <div className="auth-modal-legal">
          <p>
            By continuing, you agree to our{' '}
            <a href="/terms-and-conditions" target="_blank" rel="noopener noreferrer">
              Terms of Service
            </a>{' '}
            and{' '}
            <a href="/privacy-policy" target="_blank" rel="noopener noreferrer">
              Privacy Policy
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
