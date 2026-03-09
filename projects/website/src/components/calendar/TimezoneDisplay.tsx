import React from 'react';

interface TimezoneDisplayProps {
  timezone: string;
}

const TimezoneDisplay: React.FC<TimezoneDisplayProps> = ({ timezone }) => {
  const userTz = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const isDifferent = userTz !== timezone;

  if (!isDifferent) return null;

  return (
    <span className="timezone-display" title={`Event timezone: ${timezone}`}>
      <i className="fa-regular fa-clock" />
      {timezone.replace(/_/g, ' ')}
    </span>
  );
};

export default TimezoneDisplay;
