import React, { useState, useRef, useCallback } from 'react';

interface MessageInputProps {
  onSend: (body: string) => Promise<boolean>;
  onTyping?: () => void;
  disabled?: boolean;
  disabledReason?: string;
}

const MAX_LENGTH = 5000;

const MessageInput: React.FC<MessageInputProps> = ({ onSend, onTyping, disabled, disabledReason }) => {
  const [text, setText] = useState('');
  const [sending, setSending] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSend = useCallback(async () => {
    if (!text.trim() || sending || disabled) return;
    setSending(true);
    const success = await onSend(text);
    if (success) {
      setText('');
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
    setSending(false);
  }, [text, sending, disabled, onSend]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }, [handleSend]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    if (val.length <= MAX_LENGTH) {
      setText(val);
      onTyping?.();
      // Auto-resize
      const el = e.target;
      el.style.height = 'auto';
      el.style.height = Math.min(el.scrollHeight, 150) + 'px';
    }
  }, [onTyping]);

  const remaining = MAX_LENGTH - text.length;
  const showCounter = remaining <= 500;

  if (disabled) {
    return (
      <div className="message-input message-input--disabled">
        <p>{disabledReason || 'Messages are disabled'}</p>
      </div>
    );
  }

  return (
    <div className="message-input">
      <textarea
        ref={textareaRef}
        className="message-input__textarea"
        value={text}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder="Type a message..."
        rows={1}
        disabled={sending}
      />
      <div className="message-input__actions">
        {showCounter && (
          <span className={`message-input__counter ${remaining < 100 ? 'message-input__counter--warn' : ''}`}>
            {remaining}
          </span>
        )}
        <button
          className="message-input__send"
          onClick={handleSend}
          disabled={!text.trim() || sending}
          aria-label="Send message"
        >
          <i className={sending ? 'fa-solid fa-spinner fa-spin' : 'fa-solid fa-paper-plane'} />
        </button>
      </div>
    </div>
  );
};

export default MessageInput;
