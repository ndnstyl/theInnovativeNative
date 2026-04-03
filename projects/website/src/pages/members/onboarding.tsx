import React, { useState, useCallback, useEffect, useRef } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useAuth } from '@/contexts/AuthContext';
import { useProfile } from '@/hooks/useProfile';
import { useToast } from '@/components/common/ToastProvider';
import { logger } from '@/lib/logger';
import { getValidToken } from '@/lib/auth-token';
import ProtectedRoute from '@/components/common/ProtectedRoute';
import AvatarUpload from '@/components/members/AvatarUpload';

const OnboardingPage = () => {
  const router = useRouter();
  const { session, profile, isOnboarded, refreshProfile } = useAuth();
  const { updateProfile, generateUsername, isLoading, error } = useProfile();
  const { showToast } = useToast();
  const submitTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const [displayName, setDisplayName] = useState('');
  const [username, setUsername] = useState('');
  const [usernameChecking, setUsernameChecking] = useState(false);
  const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(null);
  const [bio, setBio] = useState('');
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [step, setStep] = useState(1);

  // DIRECT profile check — bypasses AuthContext entirely.
  // If the user is already onboarded but AuthContext couldn't detect it
  // (because fetchProfile failed), this catches it and redirects.
  useEffect(() => {
    if (!session?.user?.id) return;
    const token = getValidToken();
    if (!token) return;

    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

    fetch(`${url}/rest/v1/profiles?id=eq.${session.user.id}&select=onboarding_complete`, {
      headers: { 'apikey': anonKey, 'Authorization': `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0 && data[0].onboarding_complete) {
          logger.info('Onboarding', 'directCheck', 'User already onboarded — redirecting');
          router.replace('/classroom');
        }
      })
      .catch(() => { /* non-critical */ });
  }, [session, router]);

  // If AuthContext knows we're onboarded, also redirect
  useEffect(() => {
    if (isOnboarded && profile?.onboarding_complete) {
      router.replace('/classroom');
    }
  }, [isOnboarded, profile, router]);

  // Auto-generate username from display name
  const handleDisplayNameBlur = useCallback(async () => {
    if (displayName.length >= 2) {
      const slug = await generateUsername(displayName);
      setUsername(slug);
      setUsernameAvailable(true);
    }
  }, [displayName, generateUsername]);

  // Check username availability on blur
  const { supabaseClient } = useAuth();
  const checkUsername = useCallback(async (value: string) => {
    if (value.length < 3) {
      setUsernameAvailable(null);
      return;
    }
    setUsernameChecking(true);
    const { data } = await supabaseClient
      .from('profiles')
      .select('id')
      .eq('username', value)
      .neq('id', session?.user?.id || '')
      .limit(1);

    setUsernameAvailable(!data || data.length === 0);
    setUsernameChecking(false);
  }, [supabaseClient, session]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!displayName || !username) return;

    if (submitTimeoutRef.current) clearTimeout(submitTimeoutRef.current);
    submitTimeoutRef.current = setTimeout(() => {
      showToast('This is taking longer than expected. Please try again.', 'warning');
    }, 10000);

    try {
      // updateProfile now throws on failure — if this line completes, the save succeeded
      await updateProfile({
        display_name: displayName,
        username,
        bio: bio || null,
        avatar_url: avatarUrl,
        onboarding_complete: true,
      });

      // refreshProfile updates AuthContext state (isOnboarded, profile, etc.)
      await refreshProfile();

      showToast('Profile updated! Welcome to the community.', 'success');
      router.replace('/classroom');
    } catch (err) {
      // updateProfile threw — save actually failed. Tell the user the truth.
      logger.error('Onboarding', 'handleSubmit', err);
      showToast(
        err instanceof Error ? err.message : 'Failed to save profile. Please try again.',
        'error'
      );
    } finally {
      if (submitTimeoutRef.current) clearTimeout(submitTimeoutRef.current);
    }
  };

  return (
    <ProtectedRoute requireOnboarded={false}>
      <Head>
        <title>Welcome | The Innovative Native</title>
        <meta name="robots" content="noindex" />
      </Head>
      <div className="onboarding-page">
        <div className="onboarding-container">
          <div className="onboarding-header">
            <h1>Welcome to the community</h1>
            <p>Let&apos;s set up your profile</p>
          </div>

          <div className="onboarding-steps">
            <div className={`onboarding-step-dot ${step >= 1 ? 'active' : ''}`} />
            <div className={`onboarding-step-dot ${step >= 2 ? 'active' : ''}`} />
          </div>

          <form onSubmit={handleSubmit} className="onboarding-form">
            {step === 1 && (
              <div className="onboarding-step">
                <div className="form-group">
                  <label htmlFor="display_name">Display Name *</label>
                  <input
                    type="text"
                    id="display_name"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    onBlur={handleDisplayNameBlur}
                    placeholder="Your name"
                    required
                    autoFocus
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="username">
                    Username *
                    {usernameChecking && <span className="field-status checking"> checking...</span>}
                    {usernameAvailable === true && <span className="field-status available"> available</span>}
                    {usernameAvailable === false && <span className="field-status taken"> taken</span>}
                  </label>
                  <input
                    type="text"
                    id="username"
                    value={username}
                    onChange={(e) => {
                      const val = e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '');
                      setUsername(val);
                      setUsernameAvailable(null);
                    }}
                    onBlur={() => checkUsername(username)}
                    placeholder="your-username"
                    required
                    maxLength={30}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="bio">Bio <span style={{ color: '#4a4a4a' }}>(optional)</span></label>
                  <textarea
                    id="bio"
                    value={bio}
                    onChange={(e) => setBio(e.target.value.slice(0, 500))}
                    placeholder="Tell us about yourself..."
                    rows={3}
                    maxLength={500}
                  />
                  <span className="char-count">{bio.length}/500</span>
                </div>

                <button
                  type="button"
                  className="btn btn--primary onboarding-next-btn"
                  onClick={() => setStep(2)}
                  disabled={!displayName || !username || usernameAvailable === false}
                >
                  Next
                  <i className="fa-solid fa-arrow-right"></i>
                </button>
              </div>
            )}

            {step === 2 && (
              <div className="onboarding-step">
                <div className="form-group">
                  <label>Profile Photo <span style={{ color: '#4a4a4a' }}>(optional)</span></label>
                  <AvatarUpload
                    currentAvatarUrl={avatarUrl}
                    displayName={displayName}
                    onUpload={(url) => setAvatarUrl(url)}
                  />
                </div>

                {error && (
                  <div className="onboarding-error">
                    <i className="fa-solid fa-exclamation-circle"></i>
                    <span>{error}</span>
                  </div>
                )}

                <div className="onboarding-actions">
                  <button
                    type="button"
                    className="btn btn--outline onboarding-back-btn"
                    onClick={() => setStep(1)}
                  >
                    <i className="fa-solid fa-arrow-left"></i>
                    Back
                  </button>
                  <button
                    type="submit"
                    className="btn btn--primary onboarding-submit-btn"
                    disabled={isLoading || !displayName || !username}
                  >
                    {isLoading ? 'Setting up...' : 'Join Community'}
                    {!isLoading && <i className="fa-solid fa-check"></i>}
                  </button>
                </div>
              </div>
            )}
          </form>

          <div style={{ textAlign: 'center', marginTop: '24px' }}>
            <button
              type="button"
              onClick={async () => {
                const supabase = (await import('@/lib/supabase')).getSupabaseBrowserClient();
                await supabase.auth.signOut();
                window.location.href = '/classroom';
              }}
              style={{
                background: 'none', border: 'none', color: '#757575',
                fontSize: '13px', cursor: 'pointer', textDecoration: 'underline',
              }}
            >
              Sign out and start over
            </button>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default OnboardingPage;
