import axios from "axios";
import type {
  CompanyAnalysisRequest,
  CompanyAnalysisResponse,
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
