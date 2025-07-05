import { useState, useCallback } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../services/api";
import type {
  QuestionOptimizationRequest,
  QuestionOptimizationResponse,
  CompanyAnalysisResponse,
} from "../types/api";

interface UseQuestionOptimizationReturn {
  optimizeQuestions: (request: QuestionOptimizationRequest) => Promise<void>;
  isLoading: boolean;
  currentIteration: number;
  results: QuestionOptimizationResponse["data"][];
  isComplete: boolean;
  reset: () => void;
  error: Error | null;
}

export function useQuestionOptimization(): UseQuestionOptimizationReturn {
  const [currentIteration, setCurrentIteration] = useState(0);
  const [results, setResults] = useState<
    QuestionOptimizationResponse["data"][]
  >([]);
  const [isComplete, setIsComplete] = useState(false);

  const optimizationMutation = useMutation({
    mutationFn: async (
      request: QuestionOptimizationRequest
    ): Promise<QuestionOptimizationResponse> => {
      const response = await api.post<QuestionOptimizationResponse>(
        "/api/question-optimization/optimize",
        request
      );
      return response.data;
    },
    onSuccess: (data) => {
      if (data.success && data.data) {
        setResults((prev) => [...prev, data.data]);

        if (data.data.isComplete) {
          setIsComplete(true);
        }
      }
    },
    onError: (error) => {
      console.error("Question optimization error:", error);
    },
  });

  const optimizeQuestions = useCallback(
    async (request: QuestionOptimizationRequest) => {
      setCurrentIteration(0);
      setResults([]);
      setIsComplete(false);

      try {
        let currentResults = request.currentResults;
        let usedQuestions = request.usedQuestions || [];
        let iteration = 1;

        while (iteration <= 3) {
          setCurrentIteration(iteration);

          const optimizationRequest: QuestionOptimizationRequest = {
            targetDomain: request.targetDomain,
            originalQuestions: request.originalQuestions,
            usedQuestions,
            currentResults,
            iteration,
          };

          const response =
            await optimizationMutation.mutateAsync(optimizationRequest);

          if (response.success && response.data) {
            // Update used questions and current results for next iteration
            usedQuestions = [...usedQuestions, ...response.data.newQuestions];
            currentResults = {
              success: true,
              agentResponses: response.data.agentResponses,
            } as CompanyAnalysisResponse;

            if (response.data.isComplete) {
              setIsComplete(true);
              break;
            }

            iteration++;
          } else {
            throw new Error(response.error || "Optimization failed");
          }
        }
      } catch (error) {
        console.error("Question optimization error:", error);
        throw error;
      }
    },
    [optimizationMutation]
  );

  const reset = useCallback(() => {
    setCurrentIteration(0);
    setResults([]);
    setIsComplete(false);
    optimizationMutation.reset();
  }, [optimizationMutation]);

  return {
    optimizeQuestions,
    isLoading: optimizationMutation.isPending,
    currentIteration,
    results,
    isComplete,
    reset,
    error: optimizationMutation.error,
  };
}
