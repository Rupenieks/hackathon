import type { AgentResponse, CompanyRecommendation } from "../types/api";

export interface RankedCompany {
  companyName: string;
  domain: string;
  totalScore: number;
  mentionCount: number;
  averageScore: number;
  percentageScore: number;
}

export function calculateRankedCompanies(
  agentResponses: AgentResponse[]
): RankedCompany[] {
  const companyMap = new Map<string, RankedCompany>();

  // Process all agent responses
  agentResponses.forEach((response) => {
    response.recommendations.forEach((rec) => {
      const existing = companyMap.get(rec.companyName);

      if (existing) {
        existing.totalScore += rec.relevanceScore;
        existing.mentionCount += 1;
        existing.averageScore = existing.totalScore / existing.mentionCount;
      } else {
        companyMap.set(rec.companyName, {
          companyName: rec.companyName,
          domain: rec.domain,
          totalScore: rec.relevanceScore,
          mentionCount: 1,
          averageScore: rec.relevanceScore,
          percentageScore: 0, // Will be calculated after all companies are processed
        });
      }
    });
  });

  // Convert to array and calculate percentage scores
  const companies = Array.from(companyMap.values());
  const maxScore = Math.max(...companies.map((c) => c.averageScore));

  companies.forEach((company) => {
    company.percentageScore = (company.averageScore / maxScore) * 100;
  });

  // Sort by average score (descending) and then by mention count (descending)
  return companies.sort((a, b) => {
    if (b.averageScore !== a.averageScore) {
      return b.averageScore - a.averageScore;
    }
    return b.mentionCount - a.mentionCount;
  });
}
