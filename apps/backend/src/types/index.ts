export interface BrandfetchCompanyInfo {
  id: string;
  name: string;
  domain: string;
  description?: string;
  logo?: {
    type: string;
    url: string;
  };
  colors?: {
    type: string;
    hex: string;
  }[];
  fonts?: {
    type: string;
    name: string;
  }[];
  images?: {
    type: string;
    url: string;
  }[];
  links?: {
    type: string;
    url: string;
  }[];
}

export interface CompanyAnalysisRequest {
  companyUrl: string;
}

export interface CompanyAnalysisResponse {
  success: boolean;
  data?: BrandfetchCompanyInfo;
  error?: string;
}

export interface ApiError {
  message: string;
  status: number;
}
