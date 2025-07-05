import axios from "axios";
import type {
  CompanyAnalysisRequest,
  CompanyAnalysisResponse,
  DomainAnalysisRequest,
  DomainAnalysisResponse,
  DomainComparisonRequest,
  DomainComparisonResponse,
} from "../types/api";

const API_BASE_URL = "http://localhost:3001";

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const analyzeCompany = async (
  request: CompanyAnalysisRequest
): Promise<CompanyAnalysisResponse> => {
  const response = await api.post<CompanyAnalysisResponse>(
    "/api/analyze-company",
    request
  );
  return response.data;
};

export const analyzeDomains = async (
  request: DomainAnalysisRequest
): Promise<DomainAnalysisResponse> => {
  const response = await api.post<DomainAnalysisResponse>(
    "/api/analyze-domains",
    request
  );
  return response.data;
};

export const analyzeDomainComparison = async (
  request: DomainComparisonRequest
): Promise<DomainComparisonResponse> => {
  const response = await api.post<DomainComparisonResponse>(
    "/api/domain-comparison/analyze",
    request
  );
  return response.data;
};
