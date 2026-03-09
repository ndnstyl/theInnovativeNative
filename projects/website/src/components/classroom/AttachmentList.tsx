import React, { useRef } from 'react';
import { useLessonAttachments } from '@/hooks/useLessonAttachments';
import { useEngagementTracker } from '@/hooks/useEngagementTracker';
import type { LessonAttachment } from '@/types/supabase';

interface AttachmentListProps {
  lessonId: string;
  courseId: string;
  isAdmin?: boolean;
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function getFileIcon(fileType: string): string {
  if (fileType.startsWith('image/')) return 'fa-solid fa-image';
  if (fileType.startsWith('video/')) return 'fa-solid fa-video';
  if (fileType.includes('pdf')) return 'fa-solid fa-file-pdf';
  if (fileType.includes('zip') || fileType.includes('rar')) return 'fa-solid fa-file-zipper';
  if (fileType.includes('spreadsheet') || fileType.includes('csv') || fileType.includes('excel'))
    return 'fa-solid fa-file-excel';
  return 'fa-solid fa-file';
}

/**
 * Attachment download list + admin upload for lesson files.
 */
const AttachmentList: React.FC<AttachmentListProps> = ({ lessonId, courseId, isAdmin = false }) => {
  const {
    attachments,
    loading,
    uploading,
    uploadAttachment,
    deleteAttachment,
    getDownloadUrl,
  } = useLessonAttachments(lessonId);
  const { track } = useEngagementTracker();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    await uploadAttachment(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleDownload = (attachment: LessonAttachment) => {
    track(lessonId, courseId, 'attachment_download', { file_name: attachment.file_name });
    const url = getDownloadUrl(attachment.file_path);
    window.open(url, '_blank');
  };

  if (loading) return null;
  if (attachments.length === 0 && !isAdmin) return null;

  return (
    <div className="classroom-attachments">
      <h4 className="classroom-attachments__heading">
        <i className="fa-solid fa-paperclip"></i>
        Attachments
      </h4>

      {attachments.length > 0 && (
        <ul className="classroom-attachments__list">
          {attachments.map((a) => (
            <li key={a.id} className="classroom-attachments__item">
              <button
                className="classroom-attachments__download"
                onClick={() => handleDownload(a)}
                type="button"
              >
                <i className={getFileIcon(a.file_type)}></i>
                <span className="classroom-attachments__name">{a.file_name}</span>
                <span className="classroom-attachments__size">{formatFileSize(a.file_size)}</span>
                <i className="fa-solid fa-download"></i>
              </button>
              {isAdmin && (
                <button
                  className="classroom-attachments__remove"
                  onClick={() => deleteAttachment(a)}
                  title="Remove attachment"
                  type="button"
                >
                  <i className="fa-solid fa-trash"></i>
                </button>
              )}
            </li>
          ))}
        </ul>
      )}

      {isAdmin && (
        <div className="classroom-attachments__upload">
          <input
            ref={fileInputRef}
            type="file"
            onChange={handleFileSelect}
            style={{ display: 'none' }}
          />
          <button
            className="classroom-attachments__upload-btn"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            type="button"
          >
            {uploading ? (
              <>
                <span className="classroom-loading__spinner" style={{ width: 14, height: 14 }} />
                Uploading...
              </>
            ) : (
              <>
                <i className="fa-solid fa-plus"></i>
                Add Attachment
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
};

export default AttachmentList;
