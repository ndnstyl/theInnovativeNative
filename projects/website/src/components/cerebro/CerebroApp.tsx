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
 *
 * NOTE: All styling uses inline styles (no Tailwind).
 * This project uses SCSS + Bootstrap, not Tailwind CSS.
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
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        fontFamily: "'Inter', system-ui, sans-serif",
        backgroundColor: '#0d1117',
      }}
    >
      {/* Header */}
      <header
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '16px 24px',
          backgroundColor: '#1a365d',
          color: '#ffffff',
        }}
      >
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 700,
              fontSize: '20px',
              backgroundColor: '#d69e2e',
              color: '#1a365d',
            }}
          >
            C
          </div>
          <div>
            <h1 style={{ fontSize: '18px', fontWeight: 700, margin: 0 }}>Cerebro</h1>
            <p style={{ fontSize: '12px', opacity: 0.7, margin: 0 }}>Legal Research Assistant</p>
          </div>
        </div>

        {/* Practice Area Selector */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <PracticeAreaSelector selected={practiceArea} onChange={setPracticeArea} />

          {/* User Menu (placeholder) */}
          <button
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'rgba(255,255,255,0.1)',
              border: 'none',
              cursor: 'pointer',
              color: 'inherit',
            }}
            aria-label="User menu"
          >
            <svg style={{ width: '20px', height: '20px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
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

      {/* Main Content - Split Panels (Chat LEFT, Results RIGHT) */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'row-reverse', overflow: 'hidden' }}>
        {/* Search Results Panel (now RIGHT via row-reverse) */}
        <section
          ref={resultsPanelRef}
          style={{
            width: '50%',
            display: 'flex',
            flexDirection: 'column',
            borderLeft: '1px solid #2a3a50',
            overflow: 'hidden',
          }}
          aria-label="Search Results"
        >
          {/* Results Header */}
          <div
            style={{
              padding: '12px 16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              backgroundColor: '#131b2e',
              borderBottom: '1px solid #2a3a50',
            }}
          >
            <h2 style={{ fontSize: '14px', fontWeight: 600, color: '#e8e8e8', margin: 0 }}>
              {searchResults.length > 0
                ? `${searchResults.length} Results`
                : 'Search Results'}
            </h2>
            {searchResults.length > 0 && (
              <div style={{ fontSize: '12px', color: '#8899aa' }}>
                Sorted by relevance
              </div>
            )}
          </div>

          {/* Results List */}
          <div
            style={{
              flex: 1,
              overflowY: 'auto',
              padding: '16px',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
            }}
          >
            {searchResults.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '48px 0', color: '#8899aa' }}>
                <svg
                  style={{ width: '64px', height: '64px', margin: '0 auto 16px', opacity: 0.5, display: 'block' }}
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
                <p style={{ fontSize: '14px', margin: 0 }}>Enter a query to search legal documents</p>
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

        {/* Chat Panel (now LEFT via row-reverse) */}
        <section
          style={{
            width: '50%',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            backgroundColor: '#0d1117',
          }}
          aria-label="Chat Interface"
        >
          {/* Chat Messages */}
          <div
            ref={chatPanelRef}
            style={{ flex: 1, overflowY: 'auto', padding: '16px' }}
          >
            {messages.length === 0 ? (
              <div
                style={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#8899aa',
                }}
              >
                <div
                  style={{
                    width: '80px',
                    height: '80px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '16px',
                    backgroundColor: 'rgba(212, 168, 83, 0.1)',
                  }}
                >
                  <svg
                    style={{ width: '40px', height: '40px', color: '#d4a853' }}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                    />
                  </svg>
                </div>
                <h3 style={{ fontSize: '18px', fontWeight: 500, marginBottom: '8px', color: '#e8e8e8' }}>
                  How can I help with your research?
                </h3>
                <p style={{ fontSize: '14px', textAlign: 'center', maxWidth: '28rem' }}>
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
              <div style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: '16px' }}>
                <div
                  style={{
                    padding: '12px 16px',
                    borderRadius: '8px',
                    backgroundColor: '#0d1117',
                    border: '1px solid #2a3a50',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div
                      style={{
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        backgroundColor: '#2b6cb0',
                        animation: 'bounce 1s infinite',
                        animationDelay: '0ms',
                      }}
                    />
                    <div
                      style={{
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        backgroundColor: '#2b6cb0',
                        animation: 'bounce 1s infinite',
                        animationDelay: '150ms',
                      }}
                    />
                    <div
                      style={{
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        backgroundColor: '#2b6cb0',
                        animation: 'bounce 1s infinite',
                        animationDelay: '300ms',
                      }}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Error display */}
            {error && (
              <div
                style={{
                  margin: '0 16px',
                  padding: '16px',
                  borderRadius: '8px',
                  backgroundColor: 'rgba(220, 38, 38, 0.1)',
                  border: '1px solid rgba(220, 38, 38, 0.3)',
                }}
                role="alert"
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#dc2626' }}>
                  <svg style={{ width: '20px', height: '20px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span style={{ fontWeight: 500 }}>Error</span>
                </div>
                <p style={{ fontSize: '14px', marginTop: '4px', color: '#dc2626' }}>{error}</p>
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

      {/* Keyframe animation for loading dots (injected once) */}
      <style>{`
        @keyframes bounce {
          0%, 80%, 100% { transform: translateY(0); }
          40% { transform: translateY(-6px); }
        }
      `}</style>
    </div>
  );
};

export default CerebroApp;
