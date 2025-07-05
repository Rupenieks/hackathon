import type { AgentResponse, CompanyRecommendation } from "../types/api";

export interface RankedCompany {
  companyName: string;
  domain: string;
  mentionCount: number;
  percentageMentions: number;
}

// Function to normalize domain by removing TLD
export function normalizeDomain(domain: string): string {
  // Remove TLD (everything after the last dot)
  const parts = domain.split(".");
  if (parts.length > 1) {
    return parts.slice(0, -1).join(".");
  }
  return domain;
}

// Function to get the base domain for comparison
export function getBaseDomain(domain: string): string {
  return normalizeDomain(domain);
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
      const baseDomain = getBaseDomain(rec.domain);
      const existing = companyMap.get(baseDomain);

      if (existing) {
        existing.mentionCount += 1;
        // Keep the most descriptive company name
        if (rec.companyName.length > existing.companyName.length) {
          existing.companyName = rec.companyName;
        }
        // Keep the original domain format for display
        existing.domain = rec.domain;
      } else {
        companyMap.set(baseDomain, {
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
