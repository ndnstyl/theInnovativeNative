// Cerebro Legal RAG Components
export { CerebroModal, default as CerebroModalDefault } from './CerebroModal';
export { CerebroApp, default as CerebroAppDefault } from './CerebroApp';

// Header Components
export { PracticeAreaSelector } from './Header/PracticeAreaSelector';

// Search Panel Components
export { ResultCard } from './SearchPanel/ResultCard';
export { AuthorityBadge } from './SearchPanel/AuthorityBadge';

// Chat Panel Components
export { ChatMessage } from './ChatPanel/ChatMessage';
export { InlineCitation } from './ChatPanel/InlineCitation';

// Input Components
export { InputBar } from './InputBar/InputBar';

// Hooks
export { useCerebroQuery } from './hooks/useCerebroQuery';

// Types
export type {
  PracticeArea,
  QueryMode,
  AuthorityLevel,
  Citation,
  SearchResult,
  ChatMessageData,
  CerebroQueryRequest,
  CerebroQueryResponse,
  CerebroState,
  PracticeAreaSelectorProps,
  ResultCardProps,
  AuthorityBadgeProps,
  ChatMessageProps,
  InlineCitationProps,
  InputBarProps,
  UseCerebroQueryReturn,
} from './types/cerebro.types';
