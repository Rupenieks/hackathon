import type { AgentResponse } from "../types/api";

export function preparePieChartData(agentResponse: AgentResponse) {
  const companyCounts = new Map<string, number>();

  agentResponse.recommendations.forEach((rec) => {
    const count = companyCounts.get(rec.companyName) || 0;
    companyCounts.set(rec.companyName, count + 1);
  });

  return Array.from(companyCounts.entries()).map(([name, value]) => ({
    name,
    value,
    color: getCompanyColor(name),
  }));
}

export function prepareRadarChartData(agentResponses: AgentResponse[]) {
  const allCompanies = new Set<string>();
  const questionData: Array<{
    question: string;
    [key: string]: string | number;
  }> = [];

  // Collect all unique companies
  agentResponses.forEach((response) => {
    response.recommendations.forEach((rec) => {
      allCompanies.add(rec.companyName);
    });
  });

  // Create data for each question
  agentResponses.forEach((response) => {
    const questionDataPoint: {
      question: string;
      [key: string]: string | number;
    } = {
      question: response.question,
    };

    // Count mentions for each company in this question
    allCompanies.forEach((company) => {
      const mentions = response.recommendations.filter(
        (rec) => rec.companyName === company
      ).length;
      questionDataPoint[company] = mentions;
    });

    questionDataPoint.question = response.question;
    questionData.push(questionDataPoint);
  });

  return {
    data: questionData,
    companies: Array.from(allCompanies),
  };
}

function getCompanyColor(companyName: string): string {
  const colors = [
    "#FF6B6B",
    "#4ECDC4",
    "#45B7D1",
    "#96CEB4",
    "#FFEAA7",
    "#DDA0DD",
    "#98D8C8",
    "#F7DC6F",
    "#BB8FCE",
    "#85C1E9",
    "#F8C471",
    "#82E0AA",
    "#F1948A",
    "#85C1E9",
    "#D7BDE2",
    "#F9E79F",
    "#A9DFBF",
    "#F5B7B1",
    "#AED6F1",
    "#FAD7A0",
    "#D5A6BD",
    "#A3E4D7",
    "#F8C471",
    "#BB8FCE",
  ];
  const hash = companyName
    .split("")
    .reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return colors[hash % colors.length];
}
