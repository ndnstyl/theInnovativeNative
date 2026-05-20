import React from 'react';

interface AvatarStackProps {
  avatars: { url: string | null; name: string }[];
  maxVisible?: number;
  size?: number;
}

function getInitial(name: string): string {
  return name.charAt(0).toUpperCase();
}

const AvatarStack: React.FC<AvatarStackProps> = ({ avatars, maxVisible = 5, size = 28 }) => {
  const visible = avatars.slice(0, maxVisible);
  const overflow = avatars.length - maxVisible;

  return (
    <div
      className="avatar-stack"
      aria-label={`${avatars.length} commenters`}
      style={{ display: 'inline-flex', alignItems: 'center' }}
    >
      {visible.map((avatar, i) => (
        <div
          key={i}
          title={avatar.name}
          style={{
            width: size,
            height: size,
            borderRadius: '50%',
            overflow: 'hidden',
            border: '2px solid #000',
            marginLeft: i > 0 ? -8 : 0,
            position: 'relative',
            zIndex: maxVisible - i,
            backgroundColor: '#1a1a1a',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: size * 0.4,
            fontWeight: 600,
            color: '#757575',
          }}
        >
          {avatar.url ? (
            <img
              src={avatar.url}
              alt={avatar.name}
              width={size}
              height={size}
              style={{ objectFit: 'cover', width: '100%', height: '100%' }}
              loading="lazy"
            />
          ) : (
            getInitial(avatar.name)
          )}
        </div>
      ))}
      {overflow > 0 && (
        <span
          style={{
            marginLeft: 6,
            fontSize: 12,
            color: '#757575',
            fontWeight: 500,
          }}
        >
          +{overflow}
        </span>
      )}
    </div>
  );
};

export default AvatarStack;
