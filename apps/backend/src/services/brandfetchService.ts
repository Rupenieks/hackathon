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
