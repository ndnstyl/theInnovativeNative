interface ShareButtonsProps {
  url: string;
  title: string;
}

const ShareButtons = ({ url, title }: ShareButtonsProps) => {
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  const shareLinks = {
    twitter: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      alert("Link copied to clipboard!");
    } catch {
      // Fallback for older browsers
      const textArea = document.createElement("textarea");
      textArea.value = url;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      alert("Link copied to clipboard!");
    }
  };

  return (
    <div className="share-buttons">
      <span className="share-buttons__label">Share:</span>

      <a
        href={shareLinks.twitter}
        target="_blank"
        rel="noopener noreferrer"
        className="share-button share-button--twitter"
        aria-label="Share on Twitter"
      >
        <i className="fa-brands fa-x-twitter"></i>
      </a>

      <a
        href={shareLinks.linkedin}
        target="_blank"
        rel="noopener noreferrer"
        className="share-button share-button--linkedin"
        aria-label="Share on LinkedIn"
      >
        <i className="fa-brands fa-linkedin-in"></i>
      </a>

      <a
        href={shareLinks.facebook}
        target="_blank"
        rel="noopener noreferrer"
        className="share-button share-button--facebook"
        aria-label="Share on Facebook"
      >
        <i className="fa-brands fa-facebook-f"></i>
      </a>

      <button
        onClick={handleCopyLink}
        className="share-button share-button--copy"
        aria-label="Copy link"
      >
        <i className="fa-solid fa-link"></i>
      </button>

      <style jsx>{`
        .share-buttons {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .share-buttons__label {
          font-size: 14px;
          color: rgba(255, 255, 255, 0.6);
        }

        .share-button {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 40px;
          height: 40px;
          border-radius: 8px;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          color: rgba(255, 255, 255, 0.7);
          text-decoration: none;
          font-size: 16px;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .share-button:hover {
          background: rgba(0, 255, 255, 0.1);
          border-color: rgba(0, 255, 255, 0.3);
          color: #00ffff;
        }

        .share-button--twitter:hover {
          background: rgba(29, 161, 242, 0.1);
          border-color: rgba(29, 161, 242, 0.3);
          color: #1da1f2;
        }

        .share-button--linkedin:hover {
          background: rgba(10, 102, 194, 0.1);
          border-color: rgba(10, 102, 194, 0.3);
          color: #0a66c2;
        }

        .share-button--facebook:hover {
          background: rgba(24, 119, 242, 0.1);
          border-color: rgba(24, 119, 242, 0.3);
          color: #1877f2;
        }
      `}</style>
    </div>
  );
};

export default ShareButtons;
