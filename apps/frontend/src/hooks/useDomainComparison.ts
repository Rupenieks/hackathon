import { useMutation } from "@tanstack/react-query";
import { api } from "../services/api.js";
import type { DomainComparisonResponse } from "../types/api";

interface UseDomainComparisonProps {
  analyzedDomain: string;
  competitorDomains: string[];
  locale?: string;
}

export const useDomainComparison = ({
  analyzedDomain,
  competitorDomains,
  locale = "international",
}: UseDomainComparisonProps) => {
  const mutation = useMutation({
    mutationFn: async () => {
      console.log("Starting combined domain analysis and comparison...");
      const response = await api.post<DomainComparisonResponse>(
        "/api/domain-comparison/analyze",
        {
          analyzedDomain,
          competitorDomains,
          locale,
        }
      );

      if (response.data.success) {
        console.log("Domain comparison analysis complete");
        return response.data.data || null;
      } else {
        throw new Error(response.data.error || "Analysis failed");
      }
    },
  });

  return {
    data: mutation.data,
    isLoading: mutation.isPending,
    error: mutation.error?.message || null,
    analyzeDomainComparison: mutation.mutate,
  };
};
