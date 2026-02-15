/**
 * CerebroApp - Main layout component for Cerebro Legal RAG
 *
 * Layout:
 * - Header with logo, practice area selector, user menu
 * - Side-by-side Search Results (left) + Chat Interface (right)
 * - Unified InputBar at bottom
 *
 * State Management:
 * - Uses React state (can migrate to Zustand if needed)
 * - Session ID generated per app mount
 */

import React, { useState, useCallback, useRef, useEffect } from 'react';
import type {
  PracticeArea,
  QueryMode,
  SearchResult,
  ChatMessageData,
  CerebroQueryRequest,
} from './types/cerebro.types';
import { useCerebroQuery } from './hooks/useCerebroQuery';
import { PracticeAreaSelector } from './Header/PracticeAreaSelector';
import { ResultCard } from './SearchPanel/ResultCard';
import { ChatMessage } from './ChatPanel/ChatMessage';
import { InputBar } from './InputBar/InputBar';

// Simple ID generator (avoids uuid dependency)
const generateId = () => `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

interface CerebroAppProps {
  userId?: string;
  firmId?: string;
  webhookUrl?: string;
}

export const CerebroApp: React.FC<CerebroAppProps> = ({
  userId = 'anonymous',
  firmId = 'pilot',
}) => {
  // Session management
  const [sessionId] = useState(() => generateId());

  // Query state
  const [practiceArea, setPracticeArea] = useState<PracticeArea>('criminal_procedure');
  const [mode, setMode] = useState<QueryMode>('hybrid');

  // Results state
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [highlightedResultId, setHighlightedResultId] = useState<string | null>(null);

  // Chat state
  const [messages, setMessages] = useState<ChatMessageData[]>([]);

  // Refs for scrolling
  const chatPanelRef = useRef<HTMLDivElement>(null);
  const resultsPanelRef = useRef<HTMLDivElement>(null);

  // Query hook
  const { executeQuery, isLoading, error } = useCerebroQuery();

  // Scroll chat to bottom on new message
  useEffect(() => {
    if (chatPanelRef.current) {
      chatPanelRef.current.scrollTop = chatPanelRef.current.scrollHeight;
    }
  }, [messages]);

  // Handle query submission
  const handleSubmit = useCallback(
    async (query: string) => {
      // Add user message
      const userMessage: ChatMessageData = {
        id: generateId(),
        type: 'user',
        content: query,
        citations: [],
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, userMessage]);

      // Build request
      const request: CerebroQueryRequest = {
        query,
        practice_area: practiceArea,
        mode,
        session_id: sessionId,
        user_id: userId,
      };

      // Execute query
      const response = await executeQuery(request);

      if (response) {
        // Update search results
        const results: SearchResult[] = response.results.map((r) => ({
          documentId: r.document_id,
          citation: r.citation,
          title: r.title,
          court: r.court,
          authorityLevel: r.authority_level,
          datePublished: r.date_published,
          snippet: r.snippet,
          relevanceScore: r.relevance_score,
          adjustedScore: r.adjusted_score,
        }));
        setSearchResults(results);

        // Add AI response message
        if (response.answer && response.answer.text) {
          const aiMessage: ChatMessageData = {
            id: generateId(),
            type: 'ai',
            content: response.answer.text,
            citations: response.answer.citations,
            timestamp: new Date(),
            verificationRequired: response.answer.verification_required,
          };
          setMessages((prev) => [...prev, aiMessage]);
        }
      }
    },
    [practiceArea, mode, sessionId, userId, executeQuery]
  );

  // Handle citation click - scroll to result
  const handleCitationClick = useCallback((documentId: string) => {
    setHighlightedResultId(documentId);

    // Find and scroll to the result
    const resultElement = document.getElementById(`result-${documentId}`);
    if (resultElement && resultsPanelRef.current) {
      resultElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    // Clear highlight after delay
    setTimeout(() => setHighlightedResultId(null), 3000);
  }, []);

  // Handle result card click
  const handleResultClick = useCallback((documentId: string) => {
    setHighlightedResultId(documentId);
    // Could open detail modal or expand card
  }, []);

  return (
    <div
      className="flex flex-col h-screen"
      style={{
        fontFamily: "'Inter', system-ui, sans-serif",
        backgroundColor: '#f7fafc',
      }}
    >
      {/* Header */}
      <header
        className="flex items-center justify-between px-6 py-4"
        style={{
          backgroundColor: '#1a365d',
          color: '#ffffff',
        }}
      >
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-lg flex items-center justify-center font-bold text-xl"
            style={{ backgroundColor: '#d69e2e', color: '#1a365d' }}
          >
            C
          </div>
          <div>
            <h1 className="text-lg font-bold">Cerebro</h1>
            <p className="text-xs opacity-70">Legal Research Assistant</p>
          </div>
        </div>

        {/* Practice Area Selector */}
        <div className="flex items-center gap-4">
          <PracticeAreaSelector selected={practiceArea} onChange={setPracticeArea} />

          {/* User Menu (placeholder) */}
          <button
            className="w-9 h-9 rounded-full flex items-center justify-center"
            style={{ backgroundColor: 'rgba(255,255,255,0.1)' }}
            aria-label="User menu"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
          </button>
        </div>
      </header>

      {/* Main Content - Split Panels */}
      <main className="flex-1 flex overflow-hidden">
        {/* Search Results Panel (Left) */}
        <section
          ref={resultsPanelRef}
          className="w-1/2 flex flex-col border-r overflow-hidden"
          style={{ borderColor: '#e2e8f0' }}
          aria-label="Search Results"
        >
          {/* Results Header */}
          <div
            className="px-4 py-3 flex items-center justify-between"
            style={{ backgroundColor: '#ffffff', borderBottom: '1px solid #e2e8f0' }}
          >
            <h2 className="text-sm font-semibold" style={{ color: '#1a202c' }}>
              {searchResults.length > 0
                ? `${searchResults.length} Results`
                : 'Search Results'}
            </h2>
            {searchResults.length > 0 && (
              <div className="text-xs" style={{ color: '#718096' }}>
                Sorted by relevance
              </div>
            )}
          </div>

          {/* Results List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {searchResults.length === 0 ? (
              <div className="text-center py-12" style={{ color: '#718096' }}>
                <svg
                  className="w-16 h-16 mx-auto mb-4 opacity-50"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                <p className="text-sm">Enter a query to search legal documents</p>
              </div>
            ) : (
              searchResults.map((result) => (
                <div key={result.documentId} id={`result-${result.documentId}`}>
                  <ResultCard
                    citation={result.citation}
                    title={result.title}
                    court={result.court}
                    authorityLevel={result.authorityLevel}
                    datePublished={result.datePublished}
                    snippet={result.snippet}
                    relevanceScore={result.relevanceScore}
                    authorityScore={result.adjustedScore}
                    isHighlighted={highlightedResultId === result.documentId}
                    onClick={() => handleResultClick(result.documentId)}
                  />
                </div>
              ))
            )}
          </div>
        </section>

        {/* Chat Panel (Right) */}
        <section
          className="w-1/2 flex flex-col overflow-hidden"
          style={{ backgroundColor: '#ffffff' }}
          aria-label="Chat Interface"
        >
          {/* Chat Messages */}
          <div
            ref={chatPanelRef}
            className="flex-1 overflow-y-auto p-4"
          >
            {messages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center" style={{ color: '#718096' }}>
                <div
                  className="w-20 h-20 rounded-full flex items-center justify-center mb-4"
                  style={{ backgroundColor: 'rgba(43, 108, 176, 0.1)' }}
                >
                  <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: '#2b6cb0' }}>
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-medium mb-2" style={{ color: '#1a202c' }}>
                  How can I help with your research?
                </h3>
                <p className="text-sm text-center max-w-md">
                  Ask a legal question and I'll search our {practiceArea.replace('_', ' ')} case database
                  to provide relevant authorities with citations.
                </p>
              </div>
            ) : (
              messages.map((message) => (
                <ChatMessage
                  key={message.id}
                  type={message.type}
                  content={message.content}
                  citations={message.citations}
                  timestamp={message.timestamp}
                  verificationRequired={message.verificationRequired}
                  onCitationClick={handleCitationClick}
                  onCitationHover={setHighlightedResultId}
                />
              ))
            )}

            {/* Loading indicator */}
            {isLoading && (
              <div className="flex justify-start mb-4">
                <div
                  className="px-4 py-3 rounded-lg"
                  style={{ backgroundColor: '#f7fafc', border: '1px solid #e2e8f0' }}
                >
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full animate-bounce" style={{ backgroundColor: '#2b6cb0', animationDelay: '0ms' }} />
                    <div className="w-2 h-2 rounded-full animate-bounce" style={{ backgroundColor: '#2b6cb0', animationDelay: '150ms' }} />
                    <div className="w-2 h-2 rounded-full animate-bounce" style={{ backgroundColor: '#2b6cb0', animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}

            {/* Error display */}
            {error && (
              <div
                className="mx-4 p-4 rounded-lg"
                style={{ backgroundColor: 'rgba(220, 38, 38, 0.1)', border: '1px solid rgba(220, 38, 38, 0.3)' }}
                role="alert"
              >
                <div className="flex items-center gap-2 text-red-600">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="font-medium">Error</span>
                </div>
                <p className="text-sm mt-1" style={{ color: '#dc2626' }}>{error}</p>
              </div>
            )}
          </div>
        </section>
      </main>

      {/* Input Bar */}
      <InputBar
        mode={mode}
        onSubmit={handleSubmit}
        onModeChange={setMode}
        isLoading={isLoading}
        placeholder={`Ask about ${practiceArea.replace('_', ' ')}...`}
      />
    </div>
  );
};

export default CerebroApp;
