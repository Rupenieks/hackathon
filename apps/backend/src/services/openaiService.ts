import axios from "axios";
import { BrandfetchCompanyInfo } from "../types/index.js";

export class OpenAIService {
  private apiKey: string;
  private baseUrl = "https://api.openai.com/v1";

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async generateSearchQuestions(
    companyInfo: BrandfetchCompanyInfo
  ): Promise<string[]> {
    try {
      // Extract essential company information
      const companyData = {
        name: companyInfo.name,
        domain: companyInfo.domain,
        description: companyInfo.description,
        industries:
          companyInfo.company?.industries?.map((ind) => ind.name) || [],
        longDescription: companyInfo.longDescription,
      };

      const systemPrompt = `You are an expert in search engine optimization and competitive analysis. Your task is to generate 10-15 search questions that users might ask when looking for services similar to the provided company, WITHOUT mentioning the company name directly.

The questions should be:
- Natural and conversational
- Focused on the company's industry and services
- Generic enough to not directly mention the company
- Varied in intent (informational, transactional, navigational)
- Optimized for search engines

For example, if the company is a car marketplace like AutoScout24, generate questions like:
- "best car buying app"
- "where to find used cars online"
- "car listings website"
- "how to sell my car online"
- "car marketplace Germany"

Return ONLY a JSON array of strings, no additional text or explanation.`;

      const userPrompt = `Generate search questions for this company:

Company Name: ${companyData.name}
Domain: ${companyData.domain}
Description: ${companyData.description}
Industries: ${companyData.industries.join(", ")}

Generate 10-15 search questions that users might ask when looking for similar services.`;

      const response = await axios.post(
        `${this.baseUrl}/chat/completions`,
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
          max_tokens: 1000,
          response_format: { type: "json_object" },
        },
        {
          headers: {
            Authorization: `Bearer ${this.apiKey}`,
            "Content-Type": "application/json",
          },
        }
      );

      const content = response.data.choices[0].message.content;

      // Parse the JSON response
      const parsedResponse = JSON.parse(content);

      // Extract the questions array (assuming the response has a 'questions' key)
      const questions =
        parsedResponse.questions ||
        parsedResponse.queries ||
        parsedResponse.search_questions ||
        [];

      if (!Array.isArray(questions)) {
        throw new Error("Invalid response format from OpenAI");
      }

      return questions;
    } catch (error) {
      console.error("Error generating search questions:", error);
      throw error;
    }
  }
}
