import React from 'react';
import type { FeedAttachment } from '@/types/feed';

interface AttachmentDisplayProps {
  attachments: FeedAttachment[];
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function getFileIcon(type: string): string {
  if (type.includes('pdf')) return 'fa-file-pdf';
  if (type.includes('zip')) return 'fa-file-zipper';
  if (type.includes('csv') || type.includes('spreadsheet')) return 'fa-file-csv';
  if (type.includes('word') || type.includes('document')) return 'fa-file-word';
  return 'fa-file';
}

const AttachmentDisplay: React.FC<AttachmentDisplayProps> = ({ attachments }) => {
  const images = attachments.filter(a => a.file_type.startsWith('image/'));
  const files = attachments.filter(a => !a.file_type.startsWith('image/'));

  return (
    <div className="attachment-display">
      {images.length > 0 && (
        <div className={`attachment-display__gallery ${images.length === 1 ? 'attachment-display__gallery--single' : ''}`}>
          {images.map(img => (
            <div key={img.id} className="attachment-display__image">
              <img
                src={img.file_path}
                alt={img.file_name}
                loading="lazy"
              />
            </div>
          ))}
        </div>
      )}

      {files.length > 0 && (
        <div className="attachment-display__files">
          {files.map(file => (
            <a
              key={file.id}
              href={file.file_path}
              className="attachment-display__file"
              download={file.file_name}
              target="_blank"
              rel="noopener noreferrer"
            >
              <i className={`fa-solid ${getFileIcon(file.file_type)}`}></i>
              <span className="attachment-display__file-name">{file.file_name}</span>
              <span className="attachment-display__file-size">{formatFileSize(file.file_size)}</span>
            </a>
          ))}
        </div>
      )}
    </div>
  );
};

export default AttachmentDisplay;
