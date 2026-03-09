import React, { useEffect, useState } from 'react';

interface NewPostsToastProps {
  count: number;
  onLoad: () => void;
}

const NewPostsToast: React.FC<NewPostsToastProps> = ({ count, onLoad }) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    setVisible(true);
    const timer = setTimeout(() => setVisible(false), 10000);
    return () => clearTimeout(timer);
  }, [count]);

  if (count === 0 || !visible) return null;

  return (
    <button className="new-posts-toast" onClick={onLoad}>
      {count} new {count === 1 ? 'post' : 'posts'} — click to load
    </button>
  );
};

export default NewPostsToast;
