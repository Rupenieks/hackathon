import type { AgentResponse, CompanyRecommendation } from "../types/api";

export interface RankedCompany {
  companyName: string;
  domain: string;
  mentionCount: number;
  percentageMentions: number;
}

export function calculateRankedCompanies(
  agentResponses: AgentResponse[]
): RankedCompany[] {
  const companyMap = new Map<string, RankedCompany>();
  let totalMentions = 0;

  // Process all agent responses
  agentResponses.forEach((response) => {
    response.recommendations.forEach((rec) => {
      totalMentions++;
      const existing = companyMap.get(rec.domain);
      if (existing) {
        existing.mentionCount += 1;
        // Keep the most descriptive company name
        if (rec.companyName.length > existing.companyName.length) {
          existing.companyName = rec.companyName;
        }
      } else {
        companyMap.set(rec.domain, {
          companyName: rec.companyName,
          domain: rec.domain,
          mentionCount: 1,
          percentageMentions: 0, // Will be calculated after all companies are processed
        });
      }
    });
  });

  // Convert to array and calculate percentage of mentions
  const companies = Array.from(companyMap.values());
  companies.forEach((company) => {
    company.percentageMentions =
      totalMentions > 0 ? (company.mentionCount / totalMentions) * 100 : 0;
  });

  // Sort by mention count (descending), then by percentageMentions (descending)
  return companies.sort((a, b) => {
    if (b.mentionCount !== a.mentionCount) {
      return b.mentionCount - a.mentionCount;
    }
    return b.percentageMentions - a.percentageMentions;
  });
}
