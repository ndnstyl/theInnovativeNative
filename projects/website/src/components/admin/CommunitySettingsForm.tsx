import React, { useState, useEffect } from 'react';
import { CommunitySettingsData } from '@/hooks/useCommunitySettings';

interface CommunitySettingsFormProps {
  settings: CommunitySettingsData | null;
  loading: boolean;
  saving: boolean;
  onSave: (updates: Partial<CommunitySettingsData>) => void;
}

const PRIVACY_OPTIONS = [
  { value: 'public', label: 'Public', desc: 'Anyone can join' },
  { value: 'private', label: 'Private', desc: 'Invite only' },
  { value: 'approval_required', label: 'Approval Required', desc: 'Members must be approved' },
];

const CommunitySettingsForm: React.FC<CommunitySettingsFormProps> = ({
  settings, loading, saving, onSave
}) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [privacyMode, setPrivacyMode] = useState('public');
  const [timezone, setTimezone] = useState('UTC');

  useEffect(() => {
    if (settings) {
      setName(settings.community_name);
      setDescription(settings.description || '');
      setPrivacyMode(settings.privacy_mode);
      setTimezone(settings.timezone);
    }
  }, [settings]);

  if (loading) {
    return <div className="admin-loading"><div className="admin-loading__spinner" /></div>;
  }

  if (!settings) {
    return <div className="admin-empty"><p>No settings found</p></div>;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      community_name: name,
      description: description || null,
      privacy_mode: privacyMode as any,
      timezone,
    });
  };

  return (
    <form className="settings-form" onSubmit={handleSubmit}>
      <div className="settings-form__group">
        <label className="settings-form__label">Community Name</label>
        <input
          type="text"
          className="settings-form__input"
          value={name}
          onChange={e => setName(e.target.value)}
          required
        />
      </div>

      <div className="settings-form__group">
        <label className="settings-form__label">Description</label>
        <textarea
          className="settings-form__textarea"
          value={description}
          onChange={e => setDescription(e.target.value)}
          rows={3}
        />
      </div>

      <div className="settings-form__group">
        <label className="settings-form__label">Privacy Mode</label>
        <div className="settings-form__radio-group">
          {PRIVACY_OPTIONS.map(opt => (
            <label key={opt.value} className={`settings-form__radio ${privacyMode === opt.value ? 'active' : ''}`}>
              <input
                type="radio"
                name="privacy"
                value={opt.value}
                checked={privacyMode === opt.value}
                onChange={() => setPrivacyMode(opt.value)}
              />
              <span className="settings-form__radio-label">{opt.label}</span>
              <span className="settings-form__radio-desc">{opt.desc}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="settings-form__group">
        <label className="settings-form__label">Timezone</label>
        <select
          className="settings-form__select"
          value={timezone}
          onChange={e => setTimezone(e.target.value)}
        >
          <option value="UTC">UTC</option>
          <option value="America/New_York">Eastern Time</option>
          <option value="America/Chicago">Central Time</option>
          <option value="America/Denver">Mountain Time</option>
          <option value="America/Los_Angeles">Pacific Time</option>
          <option value="America/Phoenix">Arizona (MST)</option>
        </select>
      </div>

      <div className="settings-form__actions">
        <button type="submit" className="btn btn--primary" disabled={saving}>
          {saving ? 'Saving...' : 'Save Settings'}
        </button>
      </div>
    </form>
  );
};

export default CommunitySettingsForm;
