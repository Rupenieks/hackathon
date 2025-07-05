import { useMutation } from "@tanstack/react-query";
import { analyzeDomains } from "../services/api";
import type {
  DomainAnalysisRequest,
  DomainAnalysisResponse,
} from "../types/api";

export const useAnalyzeDomains = () => {
  return useMutation({
    mutationFn: (request: DomainAnalysisRequest) => analyzeDomains(request),
    onSuccess: (data: DomainAnalysisResponse) => {
      console.log("Domain analysis completed:", data);
    },
    onError: (error: Error) => {
      console.error("Domain analysis failed:", error);
    },
  });
};
