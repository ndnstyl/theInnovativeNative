import React, { useState, useEffect } from 'react';
import type { Course, CourseInsert, CourseUpdate } from '@/types/supabase';

interface CourseSettingsPanelProps {
  course?: Course | null;
  communityId: string;
  onSave: (data: CourseInsert | CourseUpdate) => Promise<boolean>;
  onDelete?: () => Promise<boolean>;
  saving?: boolean;
}

/**
 * Course create/edit form with title, slug, description, publish toggle, pricing.
 */
const CourseSettingsPanel: React.FC<CourseSettingsPanelProps> = ({
  course,
  communityId,
  onSave,
  onDelete,
  saving = false,
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [thumbnailUrl, setThumbnailUrl] = useState('');
  const [isPublished, setIsPublished] = useState(false);
  const [isFree, setIsFree] = useState(true);
  const [stripePriceId, setStripePriceId] = useState('');
  const [showDelete, setShowDelete] = useState(false);

  useEffect(() => {
    if (course) {
      setTitle(course.title);
      setDescription(course.description ?? '');
      setThumbnailUrl(course.thumbnail_url ?? '');
      setIsPublished(course.published);
      setIsFree(course.is_free);
      setStripePriceId(course.stripe_price_id ?? '');
    }
  }, [course]);

  const handleTitleChange = (val: string) => {
    setTitle(val);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (course) {
      // Update
      const updates: CourseUpdate = {
        title,
        description: description || null,
        thumbnail_url: thumbnailUrl || null,
        published: isPublished,
        is_free: isFree,
        stripe_price_id: stripePriceId || null,
      };
      await onSave(updates);
    } else {
      // Create
      const insert: CourseInsert = {
        community_id: communityId,
        title,
        description: description || null,
        thumbnail_url: thumbnailUrl || null,
        published: isPublished,
        is_free: isFree,
        stripe_price_id: stripePriceId || null,
      };
      await onSave(insert);
    }
  };

  return (
    <form className="classroom-settings-panel" onSubmit={handleSubmit}>
      <h3 className="classroom-settings-panel__heading">
        {course ? 'Course Settings' : 'New Course'}
      </h3>

      <div className="classroom-settings-panel__field">
        <label htmlFor="course-title">Title</label>
        <input
          id="course-title"
          type="text"
          value={title}
          onChange={(e) => handleTitleChange(e.target.value)}
          placeholder="Course title"
          required
        />
      </div>

      <div className="classroom-settings-panel__field">
        <label htmlFor="course-description">Description</label>
        <textarea
          id="course-description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Brief description"
          rows={3}
        />
      </div>

      <div className="classroom-settings-panel__field">
        <label htmlFor="course-thumbnail">Thumbnail URL</label>
        <input
          id="course-thumbnail"
          type="url"
          value={thumbnailUrl}
          onChange={(e) => setThumbnailUrl(e.target.value)}
          placeholder="https://..."
        />
      </div>

      <div className="classroom-settings-panel__row">
        <label className="classroom-settings-panel__toggle">
          <input
            type="checkbox"
            checked={isPublished}
            onChange={(e) => setIsPublished(e.target.checked)}
          />
          <span>Published</span>
        </label>

        <label className="classroom-settings-panel__toggle">
          <input
            type="checkbox"
            checked={isFree}
            onChange={(e) => setIsFree(e.target.checked)}
          />
          <span>Free</span>
        </label>
      </div>

      {!isFree && (
        <div className="classroom-settings-panel__field">
          <label htmlFor="course-price-id">Stripe Price ID</label>
          <input
            id="course-price-id"
            type="text"
            value={stripePriceId}
            onChange={(e) => setStripePriceId(e.target.value)}
            placeholder="price_..."
          />
        </div>
      )}

      <div className="classroom-settings-panel__actions">
        <button
          type="submit"
          className="classroom-settings-panel__save"
          disabled={saving || !title}
        >
          {saving ? 'Saving...' : course ? 'Save Changes' : 'Create Course'}
        </button>

        {course && onDelete && (
          <>
            {showDelete ? (
              <div className="classroom-settings-panel__delete-confirm">
                <span>Delete this course?</span>
                <button type="button" className="classroom-settings-panel__delete-yes" onClick={onDelete}>
                  Yes, Delete
                </button>
                <button type="button" className="classroom-settings-panel__delete-no" onClick={() => setShowDelete(false)}>
                  Cancel
                </button>
              </div>
            ) : (
              <button
                type="button"
                className="classroom-settings-panel__delete"
                onClick={() => setShowDelete(true)}
              >
                Delete Course
              </button>
            )}
          </>
        )}
      </div>
    </form>
  );
};

export default CourseSettingsPanel;
