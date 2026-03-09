import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRole } from '@/hooks/useRole';
import { usePostActions } from '@/hooks/usePostActions';
import ReportDialog from './ReportDialog';

interface PostActionsProps {
  postId: string;
  authorId: string;
  isPinned: boolean;
  createdAt: string;
  onDeleted?: () => void;
  onPinChanged?: () => void;
}

const PostActions: React.FC<PostActionsProps> = ({
  postId, authorId, isPinned, createdAt, onDeleted, onPinChanged,
}) => {
  const { session } = useAuth();
  const { isAtLeast } = useRole();
  const { pinPost, unpinPost, deletePost, followPost, unfollowPost, isFollowing, copyLink } = usePostActions(postId);
  const [open, setOpen] = useState(false);
  const [showReport, setShowReport] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const isOwn = session?.user?.id === authorId;
  const isAdmin = isAtLeast('admin');
  const canEdit = isOwn && (Date.now() - new Date(createdAt).getTime()) < 24 * 60 * 60 * 1000;

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const handleDelete = async () => {
    const success = await deletePost();
    if (success) {
      setShowDeleteConfirm(false);
      setOpen(false);
      onDeleted?.();
    }
  };

  const handlePin = async () => {
    if (isPinned) {
      await unpinPost();
    } else {
      await pinPost(1);
    }
    setOpen(false);
    onPinChanged?.();
  };

  return (
    <div className="post-actions" ref={menuRef}>
      <button className="post-actions__trigger" onClick={() => setOpen(!open)} aria-label="Post actions">
        <i className="fa-solid fa-ellipsis"></i>
      </button>

      {open && (
        <div className="post-actions__menu">
          <button onClick={() => { copyLink(); setOpen(false); }}>
            <i className="fa-solid fa-link"></i> Copy link
          </button>
          <button onClick={() => { isFollowing ? unfollowPost() : followPost(); setOpen(false); }}>
            <i className={`fa-solid fa-bell${isFollowing ? '-slash' : ''}`}></i>
            {isFollowing ? 'Unfollow' : 'Follow thread'}
          </button>

          {!isOwn && (
            <button onClick={() => { setShowReport(true); setOpen(false); }}>
              <i className="fa-solid fa-flag"></i> Report
            </button>
          )}

          {isAdmin && (
            <button onClick={handlePin}>
              <i className="fa-solid fa-thumbtack"></i> {isPinned ? 'Unpin' : 'Pin'}
            </button>
          )}

          {(isOwn || isAdmin) && (
            <button className="post-actions__danger" onClick={() => setShowDeleteConfirm(true)}>
              <i className="fa-solid fa-trash"></i> Delete
            </button>
          )}
        </div>
      )}

      {showDeleteConfirm && (
        <div className="post-actions__confirm-overlay">
          <div className="post-actions__confirm">
            <p>Are you sure? This removes the post and all comments.</p>
            <div className="post-actions__confirm-buttons">
              <button onClick={() => setShowDeleteConfirm(false)}>Cancel</button>
              <button className="btn--danger" onClick={handleDelete}>Delete</button>
            </div>
          </div>
        </div>
      )}

      {showReport && (
        <ReportDialog
          postId={postId}
          onClose={() => setShowReport(false)}
        />
      )}
    </div>
  );
};

export default PostActions;
