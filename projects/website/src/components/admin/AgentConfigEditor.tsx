import React, { useState } from 'react';
import type { AgentConfig } from '../../types/agents';

interface AgentConfigEditorProps {
  config: AgentConfig;
  onSave: (configId: string, updates: Partial<AgentConfig>) => Promise<any>;
}

export default function AgentConfigEditor({ config, onSave }: AgentConfigEditorProps) {
  const [personaPrompt, setPersonaPrompt] = useState(config.persona_prompt);
  const [maxPosts, setMaxPosts] = useState(config.max_posts_per_week);
  const [maxReplies, setMaxReplies] = useState(config.max_replies_per_hour);
  const [temperature, setTemperature] = useState(config.llm_temperature);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    setSaved(false);
    await onSave(config.id, {
      persona_prompt: personaPrompt,
      max_posts_per_week: maxPosts,
      max_replies_per_hour: maxReplies,
      llm_temperature: temperature,
    });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const hasChanges = personaPrompt !== config.persona_prompt
    || maxPosts !== config.max_posts_per_week
    || maxReplies !== config.max_replies_per_hour
    || temperature !== config.llm_temperature;

  return (
    <div className="agent-config-editor">
      <h4 className="agent-config-editor__title">
        {config.display_name} Settings
      </h4>

      <div className="agent-config-editor__field">
        <label htmlFor={`persona-${config.agent_key}`}>Persona Prompt</label>
        <textarea
          id={`persona-${config.agent_key}`}
          value={personaPrompt}
          onChange={e => setPersonaPrompt(e.target.value)}
          rows={12}
          className="agent-config-editor__textarea"
        />
      </div>

      <div className="agent-config-editor__row">
        <div className="agent-config-editor__field">
          <label htmlFor={`max-posts-${config.agent_key}`}>Max Posts/Week</label>
          <input
            id={`max-posts-${config.agent_key}`}
            type="number"
            value={maxPosts}
            onChange={e => setMaxPosts(parseInt(e.target.value) || 0)}
            min={0}
            max={20}
          />
        </div>

        <div className="agent-config-editor__field">
          <label htmlFor={`max-replies-${config.agent_key}`}>Max Replies/Hour</label>
          <input
            id={`max-replies-${config.agent_key}`}
            type="number"
            value={maxReplies}
            onChange={e => setMaxReplies(parseInt(e.target.value) || 0)}
            min={0}
            max={10}
          />
        </div>

        <div className="agent-config-editor__field">
          <label htmlFor={`temp-${config.agent_key}`}>
            Temperature: {temperature}
          </label>
          <input
            id={`temp-${config.agent_key}`}
            type="range"
            value={temperature}
            onChange={e => setTemperature(parseFloat(e.target.value))}
            min={0}
            max={1}
            step={0.05}
          />
        </div>
      </div>

      <div className="agent-config-editor__info">
        <span>Model: {config.llm_model}</span>
        <span>Knowledge: {config.knowledge_scope.join(', ')}</span>
      </div>

      <div className="agent-config-editor__actions">
        <button
          className="btn btn-primary"
          onClick={handleSave}
          disabled={!hasChanges || saving}
        >
          {saving ? 'Saving...' : saved ? 'Saved' : 'Save Changes'}
        </button>
      </div>
    </div>
  );
}
