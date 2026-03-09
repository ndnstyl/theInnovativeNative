import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import ClassroomLayout from '@/components/layout/ClassroomLayout';
import ProtectedRoute from '@/components/common/ProtectedRoute';
import AvatarUpload from '@/components/members/AvatarUpload';
import { useAuth } from '@/contexts/AuthContext';
import { useProfile } from '@/hooks/useProfile';
import { useLastActive } from '@/hooks/useLastActive';
import type { SocialLink } from '@/types/members';

const EditProfilePage = () => {
  const router = useRouter();
  const { username } = router.query;
  const { session, profile, refreshProfile, supabaseClient } = useAuth();
  const { updateProfile, isLoading, error } = useProfile();
  useLastActive();

  const [displayName, setDisplayName] = useState('');
  const [editUsername, setEditUsername] = useState('');
  const [bio, setBio] = useState('');
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);
  const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(null);
  const [usernameCooldown, setUsernameCooldown] = useState<Date | null>(null);
  const [success, setSuccess] = useState(false);

  // Verify this is the user's own profile
  useEffect(() => {
    if (profile && username && profile.username !== username) {
      router.replace(`/members/${username}`);
    }
  }, [profile, username, router]);

  // Populate form from profile
  useEffect(() => {
    if (profile) {
      setDisplayName(profile.display_name || '');
      setEditUsername(profile.username || '');
      setBio(profile.bio || '');
      setAvatarUrl(profile.avatar_url);
      setSocialLinks((profile.social_links as unknown as SocialLink[]) || []);

      if (profile.username_changed_at) {
        const cooldownEnd = new Date(profile.username_changed_at);
        cooldownEnd.setDate(cooldownEnd.getDate() + 30);
        if (cooldownEnd > new Date()) {
          setUsernameCooldown(cooldownEnd);
        }
      }
    }
  }, [profile]);

  const checkUsername = useCallback(async (value: string) => {
    if (value === profile?.username || value.length < 3) {
      setUsernameAvailable(null);
      return;
    }

    const { data } = await supabaseClient
      .from('profiles')
      .select('id')
      .eq('username', value)
      .neq('id', session?.user?.id || '')
      .limit(1);

    setUsernameAvailable(!data || data.length === 0);
  }, [supabaseClient, session, profile]);

  const handleAddSocialLink = () => {
    if (socialLinks.length >= 5) return;
    setSocialLinks([...socialLinks, { label: '', url: '' }]);
  };

  const handleRemoveSocialLink = (index: number) => {
    setSocialLinks(socialLinks.filter((_, i) => i !== index));
  };

  const handleUpdateSocialLink = (index: number, field: 'label' | 'url', value: string) => {
    const updated = [...socialLinks];
    updated[index] = { ...updated[index], [field]: value };
    setSocialLinks(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess(false);

    const updates: any = {
      display_name: displayName,
      bio: bio || null,
      avatar_url: avatarUrl,
      social_links: socialLinks.filter(l => l.label && l.url),
    };

    // Only update username if changed and allowed
    if (editUsername !== profile?.username && !usernameCooldown) {
      updates.username = editUsername;
      updates.username_changed_at = new Date().toISOString();
    }

    await updateProfile(updates);

    if (!error) {
      setSuccess(true);
      await refreshProfile();
      setTimeout(() => setSuccess(false), 3000);
    }
  };

  if (!profile) return null;

  return (
    <ClassroomLayout title="Edit Profile">
      <ProtectedRoute>
        <Head>
          <title>Edit Profile | The Innovative Native</title>
        </Head>
        <div className="edit-profile">
          <h1>Edit Profile</h1>

          <form onSubmit={handleSubmit} className="edit-profile__form">
            <div className="edit-profile__avatar-section">
              <AvatarUpload
                currentAvatarUrl={avatarUrl}
                displayName={displayName}
                onUpload={(url) => setAvatarUrl(url)}
              />
            </div>

            <div className="form-group">
              <label htmlFor="edit-display-name">Display Name</label>
              <input
                type="text"
                id="edit-display-name"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="edit-username">
                Username
                {usernameCooldown && (
                  <span style={{ color: '#ffa500', fontSize: 12, marginLeft: 8 }}>
                    Can change after {usernameCooldown.toLocaleDateString()}
                  </span>
                )}
                {usernameAvailable === true && <span style={{ color: '#00FF88', fontSize: 12, marginLeft: 8 }}> available</span>}
                {usernameAvailable === false && <span style={{ color: '#ff4444', fontSize: 12, marginLeft: 8 }}> taken</span>}
              </label>
              <input
                type="text"
                id="edit-username"
                value={editUsername}
                onChange={(e) => {
                  const val = e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '');
                  setEditUsername(val);
                  setUsernameAvailable(null);
                }}
                onBlur={() => checkUsername(editUsername)}
                disabled={!!usernameCooldown}
                maxLength={30}
              />
            </div>

            <div className="form-group">
              <label htmlFor="edit-bio">Bio</label>
              <textarea
                id="edit-bio"
                value={bio}
                onChange={(e) => setBio(e.target.value.slice(0, 500))}
                rows={3}
                maxLength={500}
              />
              <span className="char-count" style={{ fontSize: 12, color: '#4a4a4a', textAlign: 'right' }}>
                {bio.length}/500
              </span>
            </div>

            <div className="form-group">
              <label>
                Social Links
                <span style={{ color: '#4a4a4a', fontSize: 12, marginLeft: 8 }}>
                  ({socialLinks.length}/5)
                </span>
              </label>
              {socialLinks.map((link, i) => (
                <div key={i} className="edit-profile__social-row">
                  <input
                    type="text"
                    placeholder="Label (e.g., Twitter)"
                    value={link.label}
                    onChange={(e) => handleUpdateSocialLink(i, 'label', e.target.value)}
                    style={{ flex: 1 }}
                  />
                  <input
                    type="url"
                    placeholder="https://..."
                    value={link.url}
                    onChange={(e) => handleUpdateSocialLink(i, 'url', e.target.value)}
                    style={{ flex: 2 }}
                  />
                  <button
                    type="button"
                    className="edit-profile__remove-link"
                    onClick={() => handleRemoveSocialLink(i)}
                    aria-label="Remove link"
                  >
                    <i className="fa-solid fa-xmark"></i>
                  </button>
                </div>
              ))}
              {socialLinks.length < 5 && (
                <button type="button" className="edit-profile__add-link" onClick={handleAddSocialLink}>
                  <i className="fa-solid fa-plus"></i> Add Link
                </button>
              )}
            </div>

            {error && (
              <div className="edit-profile__error">
                <i className="fa-solid fa-exclamation-circle"></i> {error}
              </div>
            )}

            {success && (
              <div className="edit-profile__success">
                <i className="fa-solid fa-check-circle"></i> Profile updated
              </div>
            )}

            <button
              type="submit"
              className="btn btn--primary"
              disabled={isLoading || !displayName || usernameAvailable === false}
            >
              {isLoading ? 'Saving...' : 'Save Changes'}
            </button>
          </form>
        </div>
      </ProtectedRoute>
    </ClassroomLayout>
  );
};

export default EditProfilePage;
