import { Request, Response } from "express";
import { DomainComparisonService } from "../services/domainComparisonService.js";
import { DomainAnalysisService } from "../services/domainAnalysisService.js";

export class DomainComparisonController {
  private domainComparisonService: DomainComparisonService;
  private domainAnalysisService: DomainAnalysisService;

  constructor() {
    this.domainComparisonService = new DomainComparisonService();
    this.domainAnalysisService = new DomainAnalysisService();
  }

  async analyzeDomainComparison(req: Request, res: Response) {
    try {
      const { analyzedDomain, competitorDomains, locale } = req.body;

      if (
        !analyzedDomain ||
        !competitorDomains ||
        !Array.isArray(competitorDomains)
      ) {
        return res.status(400).json({
          success: false,
          error:
            "Missing required fields: analyzedDomain and competitorDomains array",
        });
      }

      // First, analyze all domains with Puppeteer
      console.log("Starting domain analysis with Puppeteer...");
      const analysisResponse = await this.domainAnalysisService.analyzeDomains({
        analyzedDomain,
        competitorDomains,
        locale,
      });

      if (!analysisResponse.success || !analysisResponse.data) {
        return res.status(500).json({
          success: false,
          error: "Failed to analyze domains with Puppeteer",
        });
      }

      console.log("Domain analysis complete, starting LLM comparison...");

      // Then, perform LLM comparison analysis
      const comparisonResponse =
        await this.domainComparisonService.analyzeDomainDifferences({
          analyzedDomain: analysisResponse.data.analyzedDomain,
          competitorDomains: analysisResponse.data.competitorDomains,
        });

      if (!comparisonResponse.success) {
        return res.status(500).json({
          success: false,
          error:
            comparisonResponse.error || "Failed to analyze domain differences",
        });
      }

      console.log("Domain comparison analysis complete");

      res.json(comparisonResponse);
    } catch (error) {
      console.error("Error in domain comparison analysis:", error);
      res.status(500).json({
        success: false,
        error:
          error instanceof Error ? error.message : "Unknown error occurred",
      });
    }
  }
}
