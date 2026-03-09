import React, { useState, useRef, useCallback } from 'react';
import { useProfile } from '@/hooks/useProfile';

interface AvatarUploadProps {
  currentAvatarUrl: string | null;
  displayName: string;
  onUpload: (url: string) => void;
}

const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

function getInitials(name: string): string {
  return name
    .split(' ')
    .map(n => n.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

const AvatarUpload: React.FC<AvatarUploadProps> = ({ currentAvatarUrl, displayName, onUpload }) => {
  const { uploadAvatar, isLoading } = useProfile();
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentAvatarUrl);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);

    // Validate type
    if (!ALLOWED_TYPES.includes(file.type)) {
      setError('Please upload a JPEG, PNG, or WebP image.');
      return;
    }

    // Validate size
    if (file.size > MAX_FILE_SIZE) {
      setError('Image must be under 2MB.');
      return;
    }

    // Client-side resize to 200x200
    const resizedBlob = await resizeImage(file, 200, 200);
    const resizedFile = new File([resizedBlob], file.name, { type: file.type });

    // Preview
    const reader = new FileReader();
    reader.onload = () => setPreviewUrl(reader.result as string);
    reader.readAsDataURL(resizedFile);

    // Upload
    const url = await uploadAvatar(resizedFile);
    if (url) {
      onUpload(url);
    }
  }, [uploadAvatar, onUpload]);

  return (
    <div className="avatar-upload">
      <div
        className="avatar-upload__preview"
        onClick={() => fileInputRef.current?.click()}
        role="button"
        tabIndex={0}
        aria-label="Upload avatar"
        onKeyDown={(e) => e.key === 'Enter' && fileInputRef.current?.click()}
      >
        {previewUrl ? (
          <img src={previewUrl} alt="Avatar preview" />
        ) : (
          <span className="avatar-upload__initials">
            {displayName ? getInitials(displayName) : '?'}
          </span>
        )}
        <div className="avatar-upload__overlay">
          <i className="fa-solid fa-camera"></i>
        </div>
        {isLoading && (
          <div className="avatar-upload__loading">
            <div className="avatar-upload__spinner" />
          </div>
        )}
      </div>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={handleFileSelect}
        style={{ display: 'none' }}
      />
      <p className="avatar-upload__hint">Click to upload (max 2MB)</p>
      {error && <p className="avatar-upload__error">{error}</p>}

      <style jsx>{`
        .avatar-upload {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
        }
        .avatar-upload__preview {
          width: 96px;
          height: 96px;
          border-radius: 50%;
          overflow: hidden;
          background-color: #1a1a1a;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          position: relative;
          border: 2px solid #1a1a1a;
          transition: border-color 0.2s;
        }
        .avatar-upload__preview:hover {
          border-color: #00FFFF;
        }
        .avatar-upload__preview img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .avatar-upload__initials {
          font-size: 32px;
          font-weight: 700;
          color: #757575;
        }
        .avatar-upload__overlay {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: rgba(0, 0, 0, 0.6);
          opacity: 0;
          transition: opacity 0.2s;
          color: #fff;
          font-size: 20px;
        }
        .avatar-upload__preview:hover .avatar-upload__overlay {
          opacity: 1;
        }
        .avatar-upload__loading {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: rgba(0, 0, 0, 0.7);
        }
        .avatar-upload__spinner {
          width: 24px;
          height: 24px;
          border: 2px solid #333;
          border-top-color: #00FFFF;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }
        @keyframes spin { to { transform: rotate(360deg); } }
        .avatar-upload__hint {
          font-size: 12px;
          color: #4a4a4a;
          margin: 0;
        }
        .avatar-upload__error {
          font-size: 12px;
          color: #ff4444;
          margin: 0;
        }
      `}</style>
    </div>
  );
};

// Client-side image resize using canvas
function resizeImage(file: File, maxWidth: number, maxHeight: number): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = maxWidth;
      canvas.height = maxHeight;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Canvas context unavailable'));
        return;
      }

      // Center crop to square
      const size = Math.min(img.width, img.height);
      const sx = (img.width - size) / 2;
      const sy = (img.height - size) / 2;

      ctx.drawImage(img, sx, sy, size, size, 0, 0, maxWidth, maxHeight);

      canvas.toBlob(
        (blob) => {
          if (blob) resolve(blob);
          else reject(new Error('Canvas export failed'));
        },
        file.type,
        0.85
      );
    };
    img.onerror = reject;
    img.src = URL.createObjectURL(file);
  });
}

export default AvatarUpload;
