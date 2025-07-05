export interface BrandfetchCompanyInfo {
  id: string;
  name: string;
  domain: string;
  claimed: boolean;
  description?: string;
  longDescription?: string;
  links?: {
    name: string;
    url: string;
  }[];
  logos?: {
    theme: string;
    formats: {
      src: string;
      background: string | null;
      format: string;
      height: number;
      width: number;
      size: number;
    }[];
    tags: string[];
    type: string;
  }[];
  colors?: {
    hex: string;
    type: string;
    brightness: number;
  }[];
  fonts?: {
    name: string;
    type: string;
    origin: string;
    originId: string | null;
    weights: string[];
  }[];
  images?: any[];
  qualityScore?: number;
  company?: {
    employees?: number | null;
    financialIdentifiers?: {
      isin: string[];
      ticker: string[];
    };
    foundedYear?: number | null;
    industries?: {
      score: number;
      id: string;
      name: string;
      emoji: string;
      parent: {
        emoji: string;
        id: string;
        name: string;
        slug: string;
      } | null;
      slug: string;
    }[];
    kind?: string | null;
    location?: {
      city?: string | null;
      country?: string | null;
      countryCode?: string | null;
      region?: string | null;
      state?: string | null;
      subregion?: string | null;
    };
  };
  isNsfw?: boolean;
  urn?: string;
}

export interface CompanyRecommendation {
  companyName: string;
  domain: string;
}

export interface AgentResponse {
  question: string;
  recommendations: CompanyRecommendation[];
  error?: string;
}

export interface CompanyAnalysisRequest {
  companyUrl: string;
  locale?: string;
}

export interface CompanyAnalysisResponse {
  success: boolean;
  data?: BrandfetchCompanyInfo;
  searchQuestions?: string[];
  agentResponses?: AgentResponse[];
  error?: string;
}

export interface ApiError {
  message: string;
  status: number;
}

export interface DomainAnalysisRequest {
  analyzedDomain: string;
  competitorDomains: string[];
  locale?: string;
}

export interface DomainAnalysisData {
  domain: string;
  url: string;
  title: string;
  description: string;
  content: string;
  metaTags: {
    [key: string]: string;
  };
  performance: {
    loadTime: number;
    domContentLoaded: number;
  };
  resources: {
    scripts: number;
    stylesheets: number;
    images: number;
    fonts: number;
  };
  errors: string[];
}

export interface DomainAnalysisResponse {
  success: boolean;
  data?: {
    analyzedDomain: DomainAnalysisData;
    competitorDomains: DomainAnalysisData[];
  };
  error?: string;
}
