/**
 * useCerebroQuery - Hook for querying the Cerebro Legal RAG n8n webhook
 *
 * Handles:
 * - POST requests to the n8n webhook endpoint
 * - Loading and error states
 * - Response parsing
 */

import { useState, useCallback } from 'react';
import type {
  CerebroQueryRequest,
  CerebroQueryResponse,
  UseCerebroQueryReturn,
} from '../types/cerebro.types';

// Webhook endpoint - configure for your environment
const WEBHOOK_ENDPOINT = process.env.NEXT_PUBLIC_CEREBRO_WEBHOOK_URL || '/webhook/cerebro-query';

export function useCerebroQuery(): UseCerebroQueryReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const executeQuery = useCallback(
    async (request: CerebroQueryRequest): Promise<CerebroQueryResponse | null> => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(WEBHOOK_ENDPOINT, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(request),
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(
            `Query failed: ${response.status} ${response.statusText}. ${errorText}`
          );
        }

        const data: CerebroQueryResponse = await response.json();

        // Validate response structure
        if (!data.request_id) {
          throw new Error('Invalid response: missing request_id');
        }

        setIsLoading(false);
        return data;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'An unexpected error occurred';
        setError(errorMessage);
        setIsLoading(false);
        return null;
      }
    },
    []
  );

  const reset = useCallback(() => {
    setIsLoading(false);
    setError(null);
  }, []);

  return {
    executeQuery,
    isLoading,
    error,
    reset,
  };
}

export default useCerebroQuery;
