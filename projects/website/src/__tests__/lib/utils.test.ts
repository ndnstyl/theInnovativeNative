import { timeAgo, formatFileSize, extractYouTubeId } from '@/lib/utils';

// ---------------------------------------------------------------------------
// timeAgo
// ---------------------------------------------------------------------------

describe('timeAgo', () => {
  const now = Date.now();

  beforeEach(() => {
    jest.spyOn(Date, 'now').mockReturnValue(now);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('returns "just now" for dates less than 60 seconds ago', () => {
    const date = new Date(now - 30 * 1000).toISOString();
    expect(timeAgo(date)).toBe('just now');
  });

  it('returns minutes ago for dates less than 60 minutes ago', () => {
    const date = new Date(now - 5 * 60 * 1000).toISOString();
    expect(timeAgo(date)).toBe('5m ago');
  });

  it('returns hours ago for dates less than 24 hours ago', () => {
    const date = new Date(now - 3 * 60 * 60 * 1000).toISOString();
    expect(timeAgo(date)).toBe('3h ago');
  });

  it('returns days ago for dates less than 30 days ago', () => {
    const date = new Date(now - 7 * 24 * 60 * 60 * 1000).toISOString();
    expect(timeAgo(date)).toBe('7d ago');
  });

  it('returns locale date string for dates 30+ days ago', () => {
    const dateObj = new Date(now - 45 * 24 * 60 * 60 * 1000);
    const date = dateObj.toISOString();
    expect(timeAgo(date)).toBe(dateObj.toLocaleDateString());
  });

  it('returns "just now" for a date 0 seconds ago', () => {
    const date = new Date(now).toISOString();
    expect(timeAgo(date)).toBe('just now');
  });

  it('returns "1m ago" at exactly 60 seconds', () => {
    const date = new Date(now - 60 * 1000).toISOString();
    expect(timeAgo(date)).toBe('1m ago');
  });

  it('returns "1h ago" at exactly 60 minutes', () => {
    const date = new Date(now - 60 * 60 * 1000).toISOString();
    expect(timeAgo(date)).toBe('1h ago');
  });

  it('returns "1d ago" at exactly 24 hours', () => {
    const date = new Date(now - 24 * 60 * 60 * 1000).toISOString();
    expect(timeAgo(date)).toBe('1d ago');
  });
});

// ---------------------------------------------------------------------------
// formatFileSize
// ---------------------------------------------------------------------------

describe('formatFileSize', () => {
  it('formats bytes', () => {
    expect(formatFileSize(0)).toBe('0 B');
    expect(formatFileSize(512)).toBe('512 B');
    expect(formatFileSize(1023)).toBe('1023 B');
  });

  it('formats kilobytes', () => {
    expect(formatFileSize(1024)).toBe('1.0 KB');
    expect(formatFileSize(1536)).toBe('1.5 KB');
    expect(formatFileSize(10240)).toBe('10.0 KB');
  });

  it('formats megabytes', () => {
    expect(formatFileSize(1024 * 1024)).toBe('1.0 MB');
    expect(formatFileSize(1.5 * 1024 * 1024)).toBe('1.5 MB');
    expect(formatFileSize(100 * 1024 * 1024)).toBe('100.0 MB');
  });

  it('formats gigabytes', () => {
    expect(formatFileSize(1024 * 1024 * 1024)).toBe('1.0 GB');
    expect(formatFileSize(2.5 * 1024 * 1024 * 1024)).toBe('2.5 GB');
  });

  it('handles boundary between KB and MB', () => {
    expect(formatFileSize(1024 * 1024 - 1)).toBe('1024.0 KB');
  });
});

// ---------------------------------------------------------------------------
// extractYouTubeId
// ---------------------------------------------------------------------------

describe('extractYouTubeId', () => {
  it('extracts ID from standard watch URL', () => {
    expect(extractYouTubeId('https://www.youtube.com/watch?v=dQw4w9WgXcQ')).toBe('dQw4w9WgXcQ');
  });

  it('extracts ID from short URL', () => {
    expect(extractYouTubeId('https://youtu.be/dQw4w9WgXcQ')).toBe('dQw4w9WgXcQ');
  });

  it('extracts ID from embed URL', () => {
    expect(extractYouTubeId('https://www.youtube.com/embed/dQw4w9WgXcQ')).toBe('dQw4w9WgXcQ');
  });

  it('extracts ID from URL with extra params', () => {
    expect(extractYouTubeId('https://www.youtube.com/watch?v=dQw4w9WgXcQ&t=42')).toBe('dQw4w9WgXcQ');
  });

  it('extracts ID with hyphens and underscores', () => {
    expect(extractYouTubeId('https://youtu.be/a1B2-c_D3e4')).toBe('a1B2-c_D3e4');
  });

  it('returns null for non-YouTube URLs', () => {
    expect(extractYouTubeId('https://vimeo.com/123456')).toBeNull();
  });

  it('returns null for invalid URLs', () => {
    expect(extractYouTubeId('not a url')).toBeNull();
  });

  it('returns null for empty string', () => {
    expect(extractYouTubeId('')).toBeNull();
  });

  it('returns null for YouTube URL without valid ID', () => {
    expect(extractYouTubeId('https://www.youtube.com/watch?v=short')).toBeNull();
  });
});
