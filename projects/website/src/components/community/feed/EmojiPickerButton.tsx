import React, { useState, useRef, useEffect } from 'react';
import dynamic from 'next/dynamic';
import type { Editor } from '@tiptap/react';

const Picker = dynamic(
  () => import('@emoji-mart/react').then((mod) => mod.default || mod),
  { ssr: false, loading: () => <div className="emoji-picker-loading">Loading...</div> }
);

interface EmojiPickerButtonProps {
  editor: Editor | null;
}

const EmojiPickerButton: React.FC<EmojiPickerButtonProps> = ({ editor }) => {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    if (open) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open]);

  const handleSelect = (emoji: { native: string }) => {
    if (editor && emoji.native) {
      editor.chain().focus().insertContent(emoji.native).run();
    }
    setOpen(false);
  };

  if (!editor) return null;

  return (
    <div className="emoji-picker-btn" ref={containerRef}>
      <button
        type="button"
        className="emoji-picker-btn__trigger"
        onClick={() => setOpen(!open)}
        aria-label="Insert emoji"
        title="Emoji"
      >
        <i className="fa-regular fa-face-smile"></i>
      </button>

      {open && (
        <div className="emoji-picker-btn__popover">
          <Picker
            onEmojiSelect={handleSelect}
            theme="dark"
            previewPosition="none"
            skinTonePosition="none"
            maxFrequentRows={2}
            perLine={8}
          />
        </div>
      )}
    </div>
  );
};

export default EmojiPickerButton;
