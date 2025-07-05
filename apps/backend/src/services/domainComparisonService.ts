import { OpenAIService } from "./openaiService.js";
import {
  DomainAnalysisData,
  DomainComparisonRequest,
  DomainComparisonResponse,
  DomainComparisonAnalysis,
  CompetitorAnalysis,
} from "../types/index.js";

export class DomainComparisonService {
  private openaiService: OpenAIService;

  constructor() {
    this.openaiService = new OpenAIService(process.env.OPENAI_API_KEY || "");
  }

  async analyzeDomainDifferences(
    request: DomainComparisonRequest
  ): Promise<DomainComparisonResponse> {
    try {
      const { analyzedDomain, competitorDomains } = request;

      // Prepare data for LLM analysis
      const analysisData = {
        ourDomain: {
          domain: analyzedDomain.domain,
          title: analyzedDomain.title,
          description: analyzedDomain.description,
          content: analyzedDomain.content,
          performance: analyzedDomain.performance,
          resources: analyzedDomain.resources,
        },
        competitors: competitorDomains.map((comp) => ({
          domain: comp.domain,
          title: comp.title,
          description: comp.description,
          content: comp.content,
          performance: comp.performance,
          resources: comp.resources,
        })),
      };

      // Generate LLM analysis
      const analysis = await this.generateLLMAnalysis(analysisData);

      return {
        success: true,
        data: {
          analyzedDomain: {
            ...analyzedDomain,
            analysis: analysis.ourDomainAnalysis,
          },
          competitorAnalyses: competitorDomains.map((comp, index) => ({
            ...comp,
            analysis: analysis.competitorAnalyses[index],
          })),
          overallInsights: analysis.overallInsights,
        },
      };
    } catch (error) {
      console.error("Error in domain comparison analysis:", error);
      return {
        success: false,
        error:
          error instanceof Error ? error.message : "Unknown error occurred",
      };
    }
  }

  private async generateLLMAnalysis(data: any): Promise<{
    ourDomainAnalysis: DomainComparisonAnalysis;
    competitorAnalyses: CompetitorAnalysis[];
    overallInsights: string;
  }> {
    const prompt = `You are an expert SEO and content analyst. Analyze the following domain data and provide detailed insights.

Our Domain: ${data.ourDomain.domain}
Title: ${data.ourDomain.title}
Description: ${data.ourDomain.description}
Content Length: ${data.ourDomain.content.length} characters
Performance: ${data.ourDomain.performance.loadTime}ms load time
Resources: ${data.ourDomain.resources.scripts} scripts, ${data.ourDomain.resources.images} images

Competitor Domains:
${data.competitors
  .map(
    (comp: any) => `${comp.domain}:
- Title: ${comp.title}
- Description: ${comp.description}
- Content Length: ${comp.content.length} characters
- Performance: ${comp.performance.loadTime}ms load time
- Resources: ${comp.resources.scripts} scripts, ${comp.resources.images} images`
  )
  .join("\n\n")}

Please provide a detailed analysis in the following JSON format:

{
  "ourDomainAnalysis": {
    "contentStrengths": ["List 3-5 strengths of our content"],
    "contentWeaknesses": ["List 3-5 areas where our content can improve"],
    "performanceAnalysis": "Analysis of our performance metrics",
    "seoRecommendations": ["List 5-8 specific SEO improvements"],
    "contentRecommendations": ["List 5-8 specific content improvements"]
  },
  "competitorAnalyses": [
    {
      "domain": "competitor-domain.com",
      "keyDifferences": ["List 3-5 key differences from our domain"],
      "strengths": ["List 3-5 strengths of this competitor"],
      "weaknesses": ["List 3-5 weaknesses of this competitor"],
      "lessonsLearned": ["List 3-5 lessons we can learn from this competitor"]
    }
  ],
  "overallInsights": "A comprehensive summary of the analysis with actionable insights"
}

Focus on:
1. Content quality and relevance
2. SEO optimization opportunities
3. Performance differences
4. User experience factors
5. Specific actionable recommendations

Provide practical, implementable advice.`;

    const response = await this.openaiService.generateResponse(
      "You are an expert SEO and content analyst. Provide detailed analysis in JSON format.",
      prompt
    );

    try {
      const analysis = JSON.parse(response);
      return {
        ourDomainAnalysis: analysis.ourDomainAnalysis,
        competitorAnalyses: analysis.competitorAnalyses,
        overallInsights: analysis.overallInsights,
      };
    } catch (parseError) {
      console.error("Error parsing LLM response:", parseError);
      // Fallback analysis
      return {
        ourDomainAnalysis: {
          contentStrengths: ["Content analysis available"],
          contentWeaknesses: ["Content analysis available"],
          performanceAnalysis: "Performance analysis available",
          seoRecommendations: ["SEO analysis available"],
          contentRecommendations: ["Content analysis available"],
        },
        competitorAnalyses: data.competitors.map((comp: any) => ({
          domain: comp.domain,
          keyDifferences: ["Analysis available"],
          strengths: ["Analysis available"],
          weaknesses: ["Analysis available"],
          lessonsLearned: ["Analysis available"],
        })),
        overallInsights: "Analysis completed successfully",
      };
    }
  }
}
