import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';

const CommunitySettings: React.FC = () => {
  const { supabaseClient } = useAuth();
  const [privacy, setPrivacy] = useState<'public' | 'private'>('private');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [communityId, setCommunityId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);

  useEffect(() => {
    const fetchSettings = async () => {
      const { data } = await supabaseClient
        .from('communities')
        .select('id, privacy')
        .limit(1)
        .single();

      if (data) {
        setCommunityId(data.id);
        setPrivacy(data.privacy as 'public' | 'private');
      }
      setIsLoading(false);
    };

    fetchSettings();
  }, [supabaseClient]);

  const handleToggle = async () => {
    if (!communityId) return;
    setIsSaving(true);
    setFeedback(null);

    const newPrivacy = privacy === 'public' ? 'private' : 'public';

    const { error } = await supabaseClient
      .from('communities')
      .update({ privacy: newPrivacy })
      .eq('id', communityId);

    if (error) {
      setFeedback(`Error: ${error.message}`);
    } else {
      setPrivacy(newPrivacy);
      setFeedback(`Community is now ${newPrivacy}`);
    }
    setIsSaving(false);
  };

  if (isLoading) return <p style={{ color: '#757575' }}>Loading settings...</p>;

  return (
    <div className="community-settings">
      <div className="community-settings__row">
        <div className="community-settings__info">
          <h3>Community Privacy</h3>
          <p>
            {privacy === 'public'
              ? 'Public: Member directory is visible to visitors. Profile pages still require sign-in.'
              : 'Private: All member pages require authentication.'}
          </p>
        </div>
        <button
          className={`community-settings__toggle-btn ${privacy === 'public' ? 'active' : ''}`}
          onClick={handleToggle}
          disabled={isSaving}
          aria-label={`Toggle community to ${privacy === 'public' ? 'private' : 'public'}`}
        >
          <span className="community-settings__toggle-track">
            <span className="community-settings__toggle-thumb" />
          </span>
          <span className="community-settings__toggle-label">
            {privacy === 'public' ? 'Public' : 'Private'}
          </span>
        </button>
      </div>

      {feedback && (
        <div className="community-settings__feedback">{feedback}</div>
      )}

      <style jsx>{`
        .community-settings__row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 24px;
          padding: 20px;
          background: #0a0a0a;
          border: 1px solid #1a1a1a;
          border-radius: 12px;
        }
        .community-settings__info h3 {
          color: #fff;
          font-size: 16px;
          margin: 0 0 6px;
        }
        .community-settings__info p {
          color: #757575;
          font-size: 13px;
          margin: 0;
          max-width: 400px;
        }
        .community-settings__toggle-btn {
          display: flex;
          align-items: center;
          gap: 10px;
          background: none;
          border: none;
          cursor: pointer;
          padding: 0;
        }
        .community-settings__toggle-track {
          width: 44px;
          height: 24px;
          background: #333;
          border-radius: 12px;
          position: relative;
          transition: background 0.2s;
        }
        .community-settings__toggle-btn.active .community-settings__toggle-track {
          background: #00FFFF;
        }
        .community-settings__toggle-thumb {
          position: absolute;
          top: 2px;
          left: 2px;
          width: 20px;
          height: 20px;
          background: #fff;
          border-radius: 50%;
          transition: transform 0.2s;
        }
        .community-settings__toggle-btn.active .community-settings__toggle-thumb {
          transform: translateX(20px);
        }
        .community-settings__toggle-label {
          color: #757575;
          font-size: 13px;
          font-weight: 600;
          min-width: 50px;
        }
        .community-settings__toggle-btn.active .community-settings__toggle-label {
          color: #00FFFF;
        }
        .community-settings__feedback {
          margin-top: 12px;
          padding: 8px 12px;
          background: rgba(0, 255, 255, 0.1);
          border: 1px solid rgba(0, 255, 255, 0.2);
          border-radius: 6px;
          color: #00FFFF;
          font-size: 13px;
        }
      `}</style>
    </div>
  );
};

export default CommunitySettings;
