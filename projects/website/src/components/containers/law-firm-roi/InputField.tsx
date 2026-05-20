import React, { useState } from 'react';
import type { FieldMeta } from '@/types/roi-calculator';

interface InputFieldProps {
  field: FieldMeta;
  value: number;
  onChange: (key: string, value: number) => void;
}

const InputField = ({ field, value, onChange }: InputFieldProps) => {
  const [showTooltip, setShowTooltip] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    if (!isNaN(val)) {
      onChange(field.key, Math.min(Math.max(val, field.min), field.max));
    } else if (e.target.value === '') {
      onChange(field.key, 0);
    }
  };

  return (
    <div className="roi-input-field">
      <div className="roi-input-field__header">
        <label className="roi-input-field__label">{field.label}</label>
        <button
          className="roi-input-field__tooltip-btn"
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
          onClick={() => setShowTooltip(!showTooltip)}
          type="button"
          aria-label="More info"
        >
          <i className="fa-solid fa-circle-info"></i>
        </button>
        {showTooltip && (
          <div className="roi-input-field__tooltip">{field.tooltip}</div>
        )}
      </div>
      <div className="roi-input-field__input-wrap">
        {field.prefix && <span className="roi-input-field__prefix">{field.prefix}</span>}
        <input
          type="number"
          value={value || ''}
          onChange={handleChange}
          min={field.min}
          max={field.max}
          step={field.step || 1}
          placeholder={String(field.min)}
          className="roi-input-field__input"
        />
        {field.unit === '%' && <span className="roi-input-field__suffix">%</span>}
      </div>
      {field.proTip && (
        <div className="roi-input-field__pro-tip">
          <i className="fa-solid fa-lightbulb"></i>
          <span>{field.proTip}</span>
        </div>
      )}
    </div>
  );
};

export default InputField;
