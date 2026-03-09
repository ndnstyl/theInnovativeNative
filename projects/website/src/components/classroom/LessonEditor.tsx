import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import TiptapLink from '@tiptap/extension-link';
import TiptapImage from '@tiptap/extension-image';
import Placeholder from '@tiptap/extension-placeholder';
import type { Lesson, LessonUpdate } from '@/types/supabase';

interface LessonEditorProps {
  lesson: Lesson;
  onSave: (lessonId: string, updates: LessonUpdate) => Promise<boolean>;
}

/**
 * Tiptap-based lesson content editor with autosave.
 * Autosaves 2 seconds after the user stops typing.
 */
const LessonEditor: React.FC<LessonEditorProps> = ({ lesson, onSave }) => {
  const [title, setTitle] = useState(lesson.title);
  const [slug, setSlug] = useState(lesson.slug);
  const [videoUrl, setVideoUrl] = useState(lesson.video_url ?? '');
  const [isFreePreview, setIsFreePreview] = useState(lesson.is_free_preview);
  const [saving, setSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const autosaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const contentRef = useRef(lesson.content_markdown ?? '');

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        codeBlock: false,
      }),
      TiptapLink.configure({
        openOnClick: false,
        HTMLAttributes: { target: '_blank', rel: 'noopener noreferrer' },
      }),
      TiptapImage,
      Placeholder.configure({ placeholder: 'Write your lesson content...' }),
    ],
    content: lesson.content_markdown ?? '',
    onUpdate: ({ editor: ed }) => {
      contentRef.current = ed.getHTML();
      scheduleAutosave();
    },
  });

  const doSave = useCallback(async () => {
    setSaving(true);
    const success = await onSave(lesson.id, {
      title,
      slug,
      video_url: videoUrl || null,
      is_free_preview: isFreePreview,
      content_markdown: contentRef.current || null,
    });
    if (success) {
      setLastSaved(new Date());
    }
    setSaving(false);
  }, [onSave, lesson.id, title, slug, videoUrl, isFreePreview]);

  const scheduleAutosave = useCallback(() => {
    if (autosaveTimer.current) clearTimeout(autosaveTimer.current);
    autosaveTimer.current = setTimeout(() => {
      doSave();
    }, 2000);
  }, [doSave]);

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (autosaveTimer.current) clearTimeout(autosaveTimer.current);
    };
  }, []);

  // Reset editor content when lesson changes
  useEffect(() => {
    setTitle(lesson.title);
    setSlug(lesson.slug);
    setVideoUrl(lesson.video_url ?? '');
    setIsFreePreview(lesson.is_free_preview);
    contentRef.current = lesson.content_markdown ?? '';
    if (editor) {
      editor.commands.setContent(lesson.content_markdown ?? '');
    }
  }, [lesson.id]); // eslint-disable-line react-hooks/exhaustive-deps

  const setLink = useCallback(() => {
    if (!editor) return;
    const previousUrl = editor.getAttributes('link').href;
    const url = window.prompt('URL', previousUrl);
    if (url === null) return;
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  }, [editor]);

  return (
    <div className="classroom-lesson-editor">
      <div className="classroom-lesson-editor__header">
        <div className="classroom-lesson-editor__field">
          <label>Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => { setTitle(e.target.value); scheduleAutosave(); }}
            placeholder="Lesson title"
          />
        </div>
        <div className="classroom-lesson-editor__field classroom-lesson-editor__field--sm">
          <label>Slug</label>
          <input
            type="text"
            value={slug}
            onChange={(e) => { setSlug(e.target.value); scheduleAutosave(); }}
            placeholder="lesson-slug"
          />
        </div>
        <div className="classroom-lesson-editor__field">
          <label>Video URL</label>
          <input
            type="url"
            value={videoUrl}
            onChange={(e) => { setVideoUrl(e.target.value); scheduleAutosave(); }}
            placeholder="YouTube, Vimeo, or direct URL"
          />
        </div>
        <label className="classroom-lesson-editor__toggle">
          <input
            type="checkbox"
            checked={isFreePreview}
            onChange={(e) => { setIsFreePreview(e.target.checked); scheduleAutosave(); }}
          />
          <span>Free Preview</span>
        </label>
      </div>

      {editor && (
        <div className="classroom-lesson-editor__toolbar">
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={editor.isActive('bold') ? 'active' : ''}
            title="Bold"
          >
            <strong>B</strong>
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={editor.isActive('italic') ? 'active' : ''}
            title="Italic"
          >
            <em>I</em>
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleStrike().run()}
            className={editor.isActive('strike') ? 'active' : ''}
            title="Strikethrough"
          >
            <del>S</del>
          </button>
          <span className="classroom-lesson-editor__divider" />
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            className={editor.isActive('heading', { level: 2 }) ? 'active' : ''}
            title="Heading 2"
          >
            H2
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
            className={editor.isActive('heading', { level: 3 }) ? 'active' : ''}
            title="Heading 3"
          >
            H3
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={editor.isActive('bulletList') ? 'active' : ''}
            title="Bullet List"
          >
            <i className="fa-solid fa-list-ul"></i>
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            className={editor.isActive('orderedList') ? 'active' : ''}
            title="Ordered List"
          >
            <i className="fa-solid fa-list-ol"></i>
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            className={editor.isActive('blockquote') ? 'active' : ''}
            title="Blockquote"
          >
            <i className="fa-solid fa-quote-left"></i>
          </button>
          <button type="button" onClick={setLink} className={editor.isActive('link') ? 'active' : ''} title="Link">
            <i className="fa-solid fa-link"></i>
          </button>
        </div>
      )}

      <div className="classroom-lesson-editor__content">
        {editor && <EditorContent editor={editor} />}
      </div>

      <div className="classroom-lesson-editor__footer">
        <button
          type="button"
          className="classroom-lesson-editor__save-btn"
          onClick={doSave}
          disabled={saving}
        >
          {saving ? 'Saving...' : 'Save'}
        </button>
        {lastSaved && (
          <span className="classroom-lesson-editor__saved-at">
            Last saved {lastSaved.toLocaleTimeString()}
          </span>
        )}
      </div>
    </div>
  );
};

export default LessonEditor;
