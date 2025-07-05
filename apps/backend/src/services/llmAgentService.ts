import axios from "axios";
import { OpenAIService } from "./openaiService.js";

export interface CompanyRecommendation {
  companyName: string;
  domain: string;
}

export interface AgentResponse {
  question: string;
  recommendations: CompanyRecommendation[];
  error?: string;
}

export class LLMAgentService {
  private openaiService: OpenAIService;

  constructor(openaiService: OpenAIService) {
    this.openaiService = openaiService;
  }

  async queryAgentsWithQuestions(
    questions: string[]
  ): Promise<AgentResponse[]> {
    try {
      // Create an array of promises for concurrent execution
      const agentPromises = questions.map((question) =>
        this.querySingleAgent(question)
      );

      // Execute all agent queries concurrently
      const responses = await Promise.allSettled(agentPromises);

      // Process results
      const results: AgentResponse[] = [];

      responses.forEach((result, index) => {
        if (result.status === "fulfilled") {
          results.push(result.value);
        } else {
          // Handle rejected promises
          results.push({
            question: questions[index],
            recommendations: [],
            error: result.reason?.message || "Agent query failed",
          });
        }
      });

      return results;
    } catch (error) {
      console.error("Error querying agents:", error);
      throw error;
    }
  }

  private async querySingleAgent(question: string): Promise<AgentResponse> {
    try {
      const systemPrompt = `You are an expert business analyst specializing in company research and recommendations. Your task is to provide a list of companies that best match the user's search query.

IMPORTANT RULES:
1. Focus on companies that are relevant to the search query
2. Consider the regional context first and foremost. If international, then don't consider it, otherwise focus on the regional context.

Response Format (JSON):
{
  "recommendations": [
    {
      "companyName": "Company Name",
      "domain": "company.com"
    }
  ]
}`;

      const userPrompt = `Search Query: "${question}"

Please provide company recommendations that best match this search query.`;

      const response = await axios.post(
        "https://api.openai.com/v1/chat/completions",
        {
          model: "gpt-4o",
          messages: [
            {
              role: "system",
              content: systemPrompt,
            },
            {
              role: "user",
              content: userPrompt,
            },
          ],
          temperature: 0.7,
          max_tokens: 1500,
          response_format: { type: "json_object" },
        },
        {
          headers: {
            Authorization: `Bearer ${this.openaiService["apiKey"]}`,
            "Content-Type": "application/json",
          },
        }
      );

      const content = response.data.choices[0].message.content;
      const parsedResponse = JSON.parse(content);

      return {
        question,
        recommendations: parsedResponse.recommendations || [],
      };
    } catch (error) {
      console.error(`Error querying agent for question "${question}":`, error);
      return {
        question,
        recommendations: [],
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }
}
