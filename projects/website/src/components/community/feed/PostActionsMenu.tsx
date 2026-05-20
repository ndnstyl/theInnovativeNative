import React, { useState, useRef, useEffect } from 'react';
import { useRole } from '@/hooks/useRole';
import { usePostActions } from '@/hooks/usePostActions';
import type { FeedPost } from '@/types/feed';

interface PostActionsMenuProps {
  post: FeedPost;
  onPinChanged?: () => void;
  onPostDeleted?: () => void;
}

const PostActionsMenu: React.FC<PostActionsMenuProps> = ({ post, onPinChanged, onPostDeleted }) => {
  const { isAtLeast } = useRole();
  const { pinPost, unpinPost, deletePost, loading } = usePostActions();
  const [open, setOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const isMod = isAtLeast('moderator');
  const isPinned = post.pinned_position != null;

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
        setConfirmDelete(false);
      }
    };
    if (open) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open]);

  if (!isMod) return null;

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    setOpen(!open);
    setConfirmDelete(false);
  };

  const handlePin = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const fn = isPinned ? unpinPost : pinPost;
    const ok = await fn(post.id);
    if (ok) {
      setOpen(false);
      onPinChanged?.();
    }
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setConfirmDelete(true);
  };

  const handleDeleteConfirm = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const ok = await deletePost(post.id);
    if (ok) {
      setOpen(false);
      setConfirmDelete(false);
      onPostDeleted?.();
    }
  };

  const handleDeleteCancel = (e: React.MouseEvent) => {
    e.stopPropagation();
    setConfirmDelete(false);
  };

  return (
    <div className="post-actions-menu" ref={menuRef}>
      <button
        className="post-actions-menu__trigger"
        onClick={handleToggle}
        aria-label="Post actions"
        disabled={loading}
      >
        <i className="fa-solid fa-ellipsis"></i>
      </button>

      {open && (
        <div className="post-actions-menu__dropdown">
          {!confirmDelete ? (
            <>
              <button className="post-actions-menu__item" onClick={handlePin}>
                <i className="fa-solid fa-thumbtack" style={isPinned ? { opacity: 0.5 } : {}}></i>
                {isPinned ? 'Unpin post' : 'Pin post'}
              </button>
              <button className="post-actions-menu__item post-actions-menu__item--danger" onClick={handleDeleteClick}>
                <i className="fa-solid fa-trash"></i>
                Delete post
              </button>
            </>
          ) : (
            <div className="post-actions-menu__confirm">
              <p>Delete this post?</p>
              <div className="post-actions-menu__confirm-btns">
                <button className="btn btn--sm btn--danger" onClick={handleDeleteConfirm} disabled={loading}>
                  {loading ? '...' : 'Delete'}
                </button>
                <button className="btn btn--sm" onClick={handleDeleteCancel}>Cancel</button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PostActionsMenu;
