import axios from "axios";
import { BrandfetchCompanyInfo } from "../types/index.js";

export class OpenAIService {
  private apiKey: string;
  private baseUrl = "https://api.openai.com/v1";

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async generateSearchQuestions(
    companyInfo: BrandfetchCompanyInfo,
    locale: string = "international"
  ): Promise<string[]> {
    try {
      // Extract essential company information
      const companyData = {
        domain: companyInfo.domain,
        description: companyInfo.description,
        industries:
          companyInfo.company?.industries?.map((ind) => ind.name) || [],
        longDescription: companyInfo.longDescription,
      };

      const systemPrompt = `You are an expert in search engine optimization and competitive analysis. Your task is to generate 30 search questions that users might ask when looking for services similar to the provided company, WITHOUT mentioning the company name directly.

The questions should be:
- Natural and conversational
- Focused on the company's industry and services
- Generic enough to not directly mention the company
- Varied in intent (informational, transactional, navigational)
- Optimized for search engines
- Tailored for the specified locale/market: ${locale}

For example, if the company is a car marketplace like AutoScout24 and the locale is "germany", generate questions like:
- "best car buying app Germany"
- "where to find used cars online Germany"
- "car listings website Germany"
- "how to sell my car online Germany"
- "car marketplace Germany"

If the locale is "international", generate generic questions without specific location mentions.

Return ONLY a JSON array of strings, no additional text or explanation.`;

      const userPrompt = `Generate search questions for this company:

Domain: ${companyData.domain}
Description: ${companyData.description}
Industries: ${companyData.industries.join(", ")}
Target Locale: ${locale}

Generate 30 search questions that users might ask when looking for similar services, tailored for the ${locale} market.`;

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

const htmlContentOptimizationGuide = {
  title: "HTML & Content Optimizations for LLM/SEO",

  htmlStructure: {
    headingHierarchy: {
      description: "Proper heading structure for content hierarchy",
      example: `<h1>Main Topic</h1>
  <h2>Subsection</h2>
  <h3>Sub-subsection</h3>`,
    },

    semanticTags: {
      description: "Semantic HTML tags for better AI understanding",
      tags: [
        "<article> <!-- For blog posts, articles -->",
        "<section> <!-- For content sections -->",
        "<nav> <!-- For navigation -->",
        "<main> <!-- Main content area -->",
        "<aside> <!-- Related content -->",
        "<header> <!-- Page header -->",
        "<footer> <!-- Page footer -->",
      ],
    },

    contentStructure: {
      paragraphs: "<p>Clear, concise sentences.</p>",
      lists: `<ul>
    <li>Key point 1</li>
    <li>Key point 2</li>
  </ul>`,
      tables: `<table>
    <thead>
      <tr><th>Header 1</th><th>Header 2</th></tr>
    </thead>
    <tbody>
      <tr><td>Data 1</td><td>Data 2</td></tr>
    </tbody>
  </table>`,
    },
  },

  schemaMarkup: {
    faqSchema: {
      description: "FAQ schema for question-answer content",
      example: `<script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [{
      "@type": "Question",
      "name": "What is LLM Optimization?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "LLM Optimization is the practice of optimizing content for AI models."
      }
    }]
  }
  </script>`,
    },

    articleSchema: {
      description: "Article schema for blog posts and articles",
      example: `<script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": "Article Title",
    "author": {
      "@type": "Person",
      "name": "Author Name"
    },
    "datePublished": "2024-01-01",
    "description": "Article description"
  }
  </script>`,
    },
  },

  contentFormatting: {
    invertedPyramid: {
      description: "Most important info first",
      example: `<!-- Most important info first -->
  <h1>Main Answer</h1>
  <p>Direct answer to the question in the first paragraph.</p>
  
  <!-- Supporting details after -->
  <h2>Supporting Information</h2>
  <p>Additional context and details.</p>`,
    },

    keyTakeaways: {
      description: "Summarize main points at the start",
      example: `<div class="key-takeaways">
    <h2>Key Takeaways</h2>
    <ul>
      <li>Point 1: Brief explanation</li>
      <li>Point 2: Brief explanation</li>
      <li>Point 3: Brief explanation</li>
    </ul>
  </div>`,
    },
  },

  contentElements: {
    qaFormat: {
      description: "Direct Q&A format for easy AI parsing",
      example: `<div class="qa-section">
    <h3>Q: What is the main benefit?</h3>
    <p><strong>A:</strong> Direct answer here.</p>
    
    <h3>Q: How does it work?</h3>
    <p><strong>A:</strong> Clear explanation here.</p>
  </div>`,
    },

    expertQuotes: {
      description: "Expert quotes with proper attribution",
      example: `<blockquote>
    <p>"Expert opinion or quote here."</p>
    <cite>— Expert Name, Title</cite>
  </blockquote>`,
    },

    statistics: {
      description: "Statistics and data presentation",
      example: `<div class="statistics">
    <h3>Key Statistics</h3>
    <ul>
      <li><strong>250M+</strong> ChatGPT monthly users</li>
      <li><strong>140M+</strong> Google Gemini users</li>
    </ul>
  </div>`,
    },
  },

  contentOptimization: {
    naturalKeywords: {
      description: "Natural keyword integration",
      goodExample:
        "LLM optimization helps improve visibility in AI search results.",
      badExample: "LLM optimization LLM optimization LLM optimization",
    },

    clearLanguage: {
      description: "Use simple, clear language",
      replacements: {
        utilize: "use",
        facilitate: "help",
        implement: "use",
        leverage: "use",
      },
    },
  },

  contentStructure: {
    tableOfContents: {
      description: "Table of contents for navigation",
      example: `<nav class="table-of-contents">
    <h2>Table of Contents</h2>
    <ul>
      <li><a href="#section1">What is LLM Optimization?</a></li>
      <li><a href="#section2">Why It Matters</a></li>
      <li><a href="#section3">Key Strategies</a></li>
    </ul>
  </nav>`,
    },

    sectionBreaks: {
      description: "Clear section organization",
      example: `<section id="section1">
    <h2>What is LLM Optimization?</h2>
    <p>Clear definition and explanation.</p>
  </section>
  
  <section id="section2">
    <h2>Why It Matters</h2>
    <p>Importance and benefits.</p>
  </section>`,
    },
  },

  contentElementsForAI: {
    definitions: {
      description: "Definition lists for terms",
      example: `<dl>
    <dt>LLMO</dt>
    <dd>Large Language Model Optimization</dd>
    <dt>GAIO</dt>
    <dd>Generative Artificial Intelligence Optimization</dd>
  </dl>`,
    },

    comparisonTables: {
      description: "Comparison tables for easy scanning",
      example: `<table>
    <thead>
      <tr>
        <th>Traditional SEO</th>
        <th>LLM Optimization</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>Keyword-focused</td>
        <td>Answer-focused</td>
      </tr>
    </tbody>
  </table>`,
    },
  },

  accessibility: {
    altText: {
      description: "Descriptive alt text for images",
      example:
        '<img src="chart.png" alt="Chart showing LLM optimization growth from 2023 to 2024" />',
    },

    ariaLabels: {
      description: "ARIA labels for interactive elements",
      example:
        '<button aria-label="Read more about LLM optimization">Read More</button>',
    },

    semanticEmphasis: {
      description: "Semantic emphasis for important content",
      example: `<p>This is <strong>important information</strong> that AI should notice.</p>
  <p>This is <em>additional context</em> for better understanding.</p>`,
    },
  },

  bestPractices: {
    principles: [
      "Make content easily scannable by AI models",
      "Use clear, semantic HTML structure",
      "Provide direct answers to potential questions",
      "Structure content with proper hierarchy",
      "Include schema markup for better understanding",
      "Use natural language and avoid jargon",
      "Focus on answer-based content over keyword stuffing",
      "Ensure content is accessible and well-formatted",
    ],

    keyTakeaway:
      "The goal is to make content easily parseable and understandable by AI models while maintaining excellent user experience for humans.",
  },
};
