import { useMutation } from "@tanstack/react-query";
import { analyzeCompany } from "../services/api";
import type {
  CompanyAnalysisRequest,
  CompanyAnalysisResponse,
} from "../types/api";

export const useAnalyzeDomain = () => {
  return useMutation({
    mutationFn: (request: CompanyAnalysisRequest) => analyzeCompany(request),
    onSuccess: (data: CompanyAnalysisResponse) => {
      console.log("Analysis completed:", data);
    },
    onError: (error: Error) => {
      console.error("Analysis failed:", error);
    },
  });
};
