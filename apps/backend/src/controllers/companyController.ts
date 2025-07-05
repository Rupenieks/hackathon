import { Request, Response } from "express";
import { BrandfetchService } from "../services/brandfetchService.js";
import { OpenAIService } from "../services/openaiService.js";
import { LLMAgentService } from "../services/llmAgentService.js";
import {
  CompanyAnalysisRequest,
  CompanyAnalysisResponse,
} from "../types/index.js";

export class CompanyController {
  private brandfetchService: BrandfetchService;
  private openaiService: OpenAIService;
  private llmAgentService: LLMAgentService;

  constructor(
    brandfetchService: BrandfetchService,
    openaiService: OpenAIService
  ) {
    this.brandfetchService = brandfetchService;
    this.openaiService = openaiService;
    this.llmAgentService = new LLMAgentService(openaiService);
  }

  async analyzeCompany(req: Request, res: Response): Promise<void> {
    try {
      const { companyUrl, locale = "international" }: CompanyAnalysisRequest =
        req.body;

      if (!companyUrl) {
        res.status(400).json({
          success: false,
          error: "companyUrl is required",
        });
        return;
      }

      // Extract domain from URL
      const domain = this.extractDomain(companyUrl);

      // Fetch company information from Brandfetch
      const companyInfo =
        await this.brandfetchService.getCompanyByDomain(domain);

      // Generate search questions using OpenAI
      const searchQuestions = await this.openaiService.generateSearchQuestions(
        companyInfo,
        locale
      );

      // Query agents with search questions asynchronously
      const agentResponses =
        await this.llmAgentService.queryAgentsWithQuestions(searchQuestions);

      const response: CompanyAnalysisResponse = {
        success: true,
        data: companyInfo,
        searchQuestions: searchQuestions,
        agentResponses: agentResponses,
      };

      res.json(response);
    } catch (error) {
      console.error("Error analyzing company:", error);

      const errorMessage =
        error instanceof Error ? error.message : "Unknown error occurred";

      res.status(500).json({
        success: false,
        error: errorMessage,
      });
    }
  }

  private extractDomain(url: string): string {
    try {
      // Remove protocol and www if present
      let domain = url.replace(/^https?:\/\//, "").replace(/^www\./, "");

      // Remove path and query parameters
      domain = domain.split("/")[0];

      return domain;
    } catch (error) {
      throw new Error("Invalid URL format");
    }
  }
}
