/**
 * Cerebro Legal RAG - TypeScript Type Definitions
 * Version: 1.0
 */

// Practice area options for query routing
export type PracticeArea = 'bankruptcy' | 'criminal_procedure' | 'administrative';

// Query mode options
export type QueryMode = 'search' | 'chat' | 'hybrid';

// Authority level for legal documents
export type AuthorityLevel = 'scotus' | 'circuit' | 'district' | 'agency' | 'statute';

// Citation object for inline references
export interface Citation {
  text: string;           // e.g., "Miranda v. Arizona, 384 U.S. 436"
  documentId: string;     // Links to result card
  court: string;
  year: number;
}

// Search result from the RAG system
export interface SearchResult {
  documentId: string;
  citation: string;
  title: string;
  court: string;
  authorityLevel: AuthorityLevel;
  datePublished: string;
  snippet: string;
  relevanceScore: number;
  adjustedScore: number;
}

// Chat message in conversation
export interface ChatMessageData {
  id: string;
  type: 'ai' | 'user';
  content: string;
  citations: Citation[];
  timestamp: Date;
  verificationRequired?: boolean;
}

// API Request payload
export interface CerebroQueryRequest {
  query: string;
  practice_area: PracticeArea;
  mode: QueryMode;
  session_id: string;
  user_id: string;
}

// API Response payload
export interface CerebroQueryResponse {
  request_id: string;
  answer: {
    text: string;
    citations: Citation[];
    verification_required: boolean;
  };
  results: Array<{
    document_id: string;
    citation: string;
    title: string;
    court: string;
    authority_level: AuthorityLevel;
    date_published: string;
    snippet: string;
    relevance_score: number;
    adjusted_score: number;
  }>;
  metadata: {
    retrieval_k: number;
    rerank_n: number;
    latency_ms: number;
  };
}

// Global state for Cerebro app
export interface CerebroState {
  // Query State
  currentQuery: string;
  practiceArea: PracticeArea;
  mode: QueryMode;
  isLoading: boolean;
  error: string | null;

  // Results State
  searchResults: SearchResult[];
  highlightedResultId: string | null;

  // Chat State
  messages: ChatMessageData[];
  sessionId: string;

  // User State
  userId: string | null;
  firmId: string | null;
}

// Component Props

export interface PracticeAreaSelectorProps {
  selected: PracticeArea;
  onChange: (area: PracticeArea) => void;
}

export interface ResultCardProps {
  citation: string;
  title: string;
  court: string;
  authorityLevel: AuthorityLevel;
  datePublished: string;
  snippet: string;
  relevanceScore: number;
  authorityScore: number;
  isHighlighted: boolean;
  onClick: () => void;
}

export interface AuthorityBadgeProps {
  level: AuthorityLevel;
}

export interface ChatMessageProps {
  type: 'ai' | 'user';
  content: string;
  citations: Citation[];
  timestamp: Date;
  verificationRequired?: boolean;
  onCitationClick?: (documentId: string) => void;
  onCitationHover?: (documentId: string | null) => void;
}

export interface InlineCitationProps {
  citation: string;
  documentId: string;
  onHover: () => void;
  onHoverEnd: () => void;
  onClick: () => void;
}

export interface InputBarProps {
  mode: QueryMode;
  onSubmit: (query: string) => void;
  onModeChange: (mode: QueryMode) => void;
  isLoading: boolean;
  placeholder?: string;
}

// Hook return types

export interface UseCerebroQueryReturn {
  executeQuery: (request: CerebroQueryRequest) => Promise<CerebroQueryResponse | null>;
  isLoading: boolean;
  error: string | null;
  reset: () => void;
}
