import React from 'react';

interface DateRangePickerProps {
  value: string;
  onChange: (range: string) => void;
}

const OPTIONS = [
  { value: 'today', label: 'Today' },
  { value: 'last7', label: 'Last 7 Days' },
  { value: 'last30', label: 'Last 30 Days' },
  { value: 'last90', label: 'Last 90 Days' },
  { value: 'custom', label: 'Custom' },
];

const DateRangePicker: React.FC<DateRangePickerProps> = ({ value, onChange }) => (
  <div className="analytics__date-picker">
    <select value={value} onChange={(e) => onChange(e.target.value)}>
      {OPTIONS.map((o) => (
        <option key={o.value} value={o.value}>{o.label}</option>
      ))}
    </select>
  </div>
);

export default DateRangePicker;
