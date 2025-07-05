import axios, { AxiosError } from "axios";
import { BrandfetchCompanyInfo } from "../types/index.js";

export class BrandfetchService {
  private apiKey: string;
  private baseUrl = "https://api.brandfetch.io/v2";

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async getCompanyInfo(domain: string): Promise<BrandfetchCompanyInfo> {
    try {
      // Search for the company by domain
      const searchResponse = await axios.get(`${this.baseUrl}/search`, {
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          "Content-Type": "application/json",
        },
        params: {
          q: domain,
        },
      });

      if (!searchResponse.data || searchResponse.data.length === 0) {
        throw new Error(`No company found for domain: ${domain}`);
      }

      // Get the first result's ID
      const companyId = searchResponse.data[0].id;

      // Fetch detailed company information
      const companyResponse = await axios.get(
        `${this.baseUrl}/brands/${companyId}`,
        {
          headers: {
            Authorization: `Bearer ${this.apiKey}`,
            "Content-Type": "application/json",
          },
        }
      );

      return companyResponse.data;
    } catch (error) {
      throw error;
    }
  }

  async getCompanyByDomain(domain: string): Promise<BrandfetchCompanyInfo> {
    try {
      // Try to get company directly by domain using the brands endpoint
      // const response = peecAIData;
      const response = await axios.get(`${this.baseUrl}/brands/${domain}`, {
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          "Content-Type": "application/json",
        },
      });

      return response.data;
    } catch (error) {
      // If direct domain lookup fails, try search
      return await this.getCompanyInfo(domain);
    }
  }
}

const peecAIData = {
  success: true,
  data: {
    id: "idWZRlNnjg",
    name: "Peec AI",
    domain: "peec.ai",
    claimed: false,
    description:
      "Peec AI helps marketing teams analyze brand performance across ChatGPT, Perplexity, Claude, and Gemini. Track visibility, benchmark competitors, and optimize AI search presence.",
    longDescription:
      "**Brand Description:**\n\nIntroducing a forward-thinking brand dedicated to enhancing online visibility in an increasingly digital world. Specializing in AI-driven search optimization, this brand helps businesses rank higher in search results through innovative strategies and tailored solutions. With a strong commitment to staying ahead of the curve, the brand is currently preparing to launch enhanced offerings that leverage the latest advancements in artificial intelligence.\n\nIn addition to their core service of search optimization, the brand believes in fostering community engagement and knowledge sharing. Subscribers to their monthly newsletter gain exclusive insights, tools, and trends that empower them to navigate the evolving landscape of online marketing effectively. By prioritizing client education and support, the brand establishes itself as a trusted partner in the journey toward achieving digital success.\n\nStay tuned as they prepare to unveil new solutions designed to transform your online presence and connect with your audience more effectively. Sign up today to be among the first to receive updates and exclusive content.",
    links: [
      {
        name: "linkedin",
        url: "https://linkedin.com/company/peec-ai",
      },
    ],
    logos: [
      {
        theme: "dark",
        formats: [
          {
            src: "https://cdn.brandfetch.io/idWZRlNnjg/w/180/h/180/theme/dark/logo.png?c=1bxidN2eYLKB0NnUIJfmr",
            background: "transparent",
            format: "png",
            height: 180,
            width: 180,
            size: 1823,
          },
        ],
        tags: [],
        type: "logo",
      },
      {
        theme: "dark",
        formats: [
          {
            src: "https://cdn.brandfetch.io/idWZRlNnjg/w/400/h/400/theme/dark/icon.jpeg?c=1bxidN2eYLKB0NnUIJfmr",
            background: null,
            format: "jpeg",
            height: 400,
            width: 400,
            size: 4204,
          },
        ],
        tags: [],
        type: "icon",
      },
    ],
    colors: [
      {
        hex: "#000000",
        type: "dark",
        brightness: 0,
      },
      {
        hex: "#ffffff",
        type: "light",
        brightness: 255,
      },
      {
        hex: "#5d5d5d",
        type: "accent",
        brightness: 93,
      },
    ],
    fonts: [
      {
        name: "sans-serif",
        type: "body",
        origin: "custom",
        originId: null,
        weights: [],
      },
    ],
    images: [],
    qualityScore: 0.4358974358974359,
    company: {
      employees: null,
      financialIdentifiers: {
        isin: [],
        ticker: [],
      },
      foundedYear: null,
      industries: [
        {
          score: 0.3736089766025543,
          id: "28",
          name: "Computers Electronics and Technology",
          emoji: "🖥",
          parent: null,
          slug: "computers-electronics-and-technology",
        },
        {
          score: 0.3594493865966797,
          id: "10",
          name: "Business and Consumer Services",
          emoji: "📊",
          parent: null,
          slug: "business-and-consumer-services",
        },
        {
          score: 0.3301492929458618,
          id: "32",
          name: "Computers Electronics and Technology",
          emoji: "🖥",
          parent: {
            emoji: "🖥",
            id: "28",
            name: "Computers Electronics and Technology",
            slug: "computers-electronics-and-technology",
          },
          slug: "computers-electronics-and-technology",
        },
        {
          score: 0.32660236954689026,
          id: "13",
          name: "Marketing and Advertising",
          emoji: "📊",
          parent: {
            emoji: "📊",
            id: "10",
            name: "Business and Consumer Services",
            slug: "business-and-consumer-services",
          },
          slug: "marketing-and-advertising",
        },
        {
          score: 0.2411595731973648,
          id: "37",
          name: "Programming and Developer Software",
          emoji: "🖥",
          parent: {
            emoji: "🖥",
            id: "28",
            name: "Computers Electronics and Technology",
            slug: "computers-electronics-and-technology",
          },
          slug: "programming-and-developer-software",
        },
      ],
      kind: null,
      location: {
        city: null,
        country: null,
        countryCode: null,
        region: null,
        state: null,
        subregion: null,
      },
    },
    isNsfw: false,
    urn: "urn:brandfetch:brand:idWZRlNnjg",
  },
  searchQuestions: [],
};
