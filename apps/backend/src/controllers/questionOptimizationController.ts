import { Request, Response } from "express";
import { OpenAIService } from "../services/openaiService.js";
import { LLMAgentService } from "../services/llmAgentService.js";

export class QuestionOptimizationController {
  private openaiService: OpenAIService;
  private llmAgentService: LLMAgentService;

  constructor() {
    this.openaiService = new OpenAIService(process.env.OPENAI_API_KEY || "");
    this.llmAgentService = new LLMAgentService(this.openaiService);
  }

  async optimizeQuestions(req: Request, res: Response) {
    try {
      const {
        targetDomain,
        originalQuestions,
        usedQuestions,
        currentResults,
        iteration = 1,
      } = req.body;

      if (
        !targetDomain ||
        !originalQuestions ||
        !Array.isArray(originalQuestions)
      ) {
        return res.status(400).json({
          success: false,
          error:
            "Missing required fields: targetDomain and originalQuestions array",
        });
      }

      console.log(`Starting question optimization iteration ${iteration}...`);

      // Generate new question variations based on current results
      const newQuestions = await this.generateOptimizedQuestions({
        targetDomain,
        originalQuestions,
        usedQuestions: usedQuestions || [],
        currentResults,
        iteration,
      });

      console.log("Generated new questions:", newQuestions);

      // Test the new questions with LLM agents
      const agentResponses =
        await this.llmAgentService.queryAgentsWithQuestions(newQuestions);

      console.log("Agent responses:", agentResponses);

      // Analyze results to see if we got more hits
      const analysis = this.analyzeResults(
        agentResponses,
        targetDomain,
        currentResults
      );

      res.json({
        success: true,
        data: {
          iteration,
          newQuestions,
          agentResponses,
          analysis,
          isComplete: iteration >= 3,
        },
      });
    } catch (error) {
      console.error("Error in question optimization:", error);
      res.status(500).json({
        success: false,
        error:
          error instanceof Error ? error.message : "Unknown error occurred",
      });
    }
  }

  private async generateOptimizedQuestions({
    targetDomain,
    originalQuestions,
    usedQuestions,
    currentResults,
    iteration,
  }: {
    targetDomain: string;
    originalQuestions: string[];
    usedQuestions: string[];
    currentResults: any;
    iteration: number;
  }): Promise<string[]> {
    const prompt = `You are an expert in search optimization and question generation. Your task is to generate 10 new search questions that are variations of the original questions, but optimized to increase visibility for the target domain: ${targetDomain}

Original Questions:
${originalQuestions.map((q, i) => `${i + 1}. ${q}`).join("\n")}

Already Used Questions (avoid these):
${usedQuestions.map((q, i) => `${i + 1}. ${q}`).join("\n")}

Current Results Analysis:
${this.formatCurrentResults(currentResults)}

Iteration: ${iteration}

Instructions:
1. Generate 10 NEW questions that are variations of the original questions
2. Focus on questions that would likely mention ${targetDomain} or similar services
3. Avoid any questions already in the "used questions" list
4. If iteration > 1 and we got more hits, focus on the context that worked
5. If iteration > 1 and we got fewer hits, try different approaches
6. Make questions natural and conversational
7. Vary the intent (informational, transactional, navigational)

Return ONLY a JSON array of strings, no additional text or explanation.`;

    const response = await this.openaiService.generateResponse(
      "You are an expert in search optimization. Generate optimized search questions in JSON format.",
      prompt
    );

    console.log("Raw OpenAI response:", response);

    try {
      // Try to parse as JSON array first
      const questions = JSON.parse(response);
      if (Array.isArray(questions)) {
        console.log("Successfully parsed questions array:", questions);
        return questions;
      }

      // If it's not an array, try to extract from object
      if (typeof questions === "object" && questions !== null) {
        const possibleArrays = [
          "questions",
          "queries",
          "search_questions",
          "newQuestions",
        ];
        for (const key of possibleArrays) {
          if (Array.isArray(questions[key])) {
            console.log(`Found questions in ${key}:`, questions[key]);
            return questions[key];
          }
        }
      }

      console.error("No valid questions array found in response");
      return [];
    } catch (parseError) {
      console.error("Error parsing optimized questions:", parseError);
      console.error("Raw response was:", response);
      return [];
    }
  }

  private formatCurrentResults(currentResults: any): string {
    if (!currentResults || !currentResults.agentResponses) {
      return "No previous results available.";
    }

    const totalMentions = currentResults.agentResponses.reduce(
      (total: number, response: any) => {
        return total + (response.recommendations?.length || 0);
      },
      0
    );

    const targetDomainMentions = currentResults.agentResponses.reduce(
      (total: number, response: any) => {
        const mentions =
          response.recommendations?.filter(
            (rec: any) => rec.domain === currentResults.targetDomain
          ).length || 0;
        return total + mentions;
      },
      0
    );

    return `
Total mentions across all questions: ${totalMentions}
Target domain mentions: ${targetDomainMentions}
Hit rate: ${totalMentions > 0 ? ((targetDomainMentions / totalMentions) * 100).toFixed(1) : 0}%
    `.trim();
  }

  private analyzeResults(
    agentResponses: any[],
    targetDomain: string,
    previousResults: any
  ) {
    const currentTotalMentions = agentResponses.reduce((total, response) => {
      return total + (response.recommendations?.length || 0);
    }, 0);

    const currentTargetMentions = agentResponses.reduce((total, response) => {
      const mentions =
        response.recommendations?.filter(
          (rec: any) => rec.domain === targetDomain
        ).length || 0;
      return total + mentions;
    }, 0);

    const previousTotalMentions =
      previousResults?.agentResponses?.reduce(
        (total: number, response: any) => {
          return total + (response.recommendations?.length || 0);
        },
        0
      ) || 0;

    const previousTargetMentions =
      previousResults?.agentResponses?.reduce(
        (total: number, response: any) => {
          const mentions =
            response.recommendations?.filter(
              (rec: any) => rec.domain === targetDomain
            ).length || 0;
          return total + mentions;
        },
        0
      ) || 0;

    const totalMentionsChange = currentTotalMentions - previousTotalMentions;
    const targetMentionsChange = currentTargetMentions - previousTargetMentions;
    const hitRateChange =
      previousTotalMentions > 0
        ? (currentTargetMentions / currentTotalMentions -
            previousTargetMentions / previousTotalMentions) *
          100
        : 0;

    return {
      currentTotalMentions,
      currentTargetMentions,
      previousTotalMentions,
      previousTargetMentions,
      totalMentionsChange,
      targetMentionsChange,
      hitRateChange,
      isImproving: targetMentionsChange > 0,
      currentHitRate:
        currentTotalMentions > 0
          ? (currentTargetMentions / currentTotalMentions) * 100
          : 0,
      previousHitRate:
        previousTotalMentions > 0
          ? (previousTargetMentions / previousTotalMentions) * 100
          : 0,
    };
  }
}
