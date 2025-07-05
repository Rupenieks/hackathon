export interface CompanyRecommendation {
  companyName: string;
  domain: string;
}

export interface AgentResponse {
  question: string;
  recommendations: CompanyRecommendation[];
  error?: string;
}

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

export interface CompanyAnalysisResponse {
  success: boolean;
  data?: BrandfetchCompanyInfo;
  searchQuestions?: string[];
  agentResponses?: AgentResponse[];
  error?: string;
}

export interface CompanyAnalysisRequest {
  companyUrl: string;
  locale?: string;
}
