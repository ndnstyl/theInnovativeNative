/**
 * Structured logging utility.
 * Format: [TIMESTAMP] [LEVEL] [SOURCE] message | {context}
 *
 * Usage:
 *   logger.error('AuthContext', 'getSession', err);
 *   logger.warn('CourseGallery', 'fetchCourses', 'No courses returned');
 *   logger.info('Onboarding', 'profileUpdate', 'Success');
 */

type LogLevel = 'ERROR' | 'WARN' | 'INFO';

interface LogContext {
  [key: string]: unknown;
}

function formatTimestamp(): string {
  return new Date().toISOString();
}

function formatError(err: unknown): string {
  if (err instanceof Error) return err.message;
  if (typeof err === 'string') return err;
  return JSON.stringify(err);
}

function log(level: LogLevel, source: string, action: string, messageOrError: unknown, context?: LogContext): void {
  if (typeof window === 'undefined') return;

  const timestamp = formatTimestamp();
  const message = formatError(messageOrError);
  const contextStr = context ? ` | ${JSON.stringify(context)}` : '';
  const formatted = `[${timestamp}] [${level}] [${source}] ${action}: ${message}${contextStr}`;

  switch (level) {
    case 'ERROR':
      console.error(formatted);
      break;
    case 'WARN':
      console.warn(formatted);
      break;
    case 'INFO':
      console.info(formatted);
      break;
  }
}

export const logger = {
  error: (source: string, action: string, err: unknown, context?: LogContext) =>
    log('ERROR', source, action, err, context),
  warn: (source: string, action: string, message: string, context?: LogContext) =>
    log('WARN', source, action, message, context),
  info: (source: string, action: string, message: string, context?: LogContext) =>
    log('INFO', source, action, message, context),
};
