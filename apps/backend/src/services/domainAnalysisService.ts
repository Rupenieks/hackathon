import puppeteer, { Browser } from "puppeteer";
import {
  DomainAnalysisRequest,
  DomainAnalysisResponse,
  DomainAnalysisData,
} from "../types/index.js";

export class DomainAnalysisService {
  private browser: Browser | null = null;

  async initialize() {
    if (!this.browser) {
      // Connect to remote Chrome instance
      const browserURL = process.env.CHROME_URL || "http://localhost:9222";

      try {
        this.browser = await puppeteer.connect({
          browserURL,
          defaultViewport: { width: 1280, height: 720 },
        });
        console.log("Connected to remote Chrome instance");
      } catch (error) {
        console.error(
          "Failed to connect to remote Chrome, falling back to local:",
          error
        );
        // Fallback to local Chrome if remote connection fails
        this.browser = await puppeteer.launch({
          headless: true,
          args: [
            "--no-sandbox",
            "--disable-setuid-sandbox",
            "--disable-dev-shm-usage",
            "--disable-accelerated-2d-canvas",
            "--no-first-run",
            "--no-zygote",
            "--disable-gpu",
            "--disable-web-security",
            "--disable-features=VizDisplayCompositor",
          ],
        });
      }
    }
  }

  async close() {
    if (this.browser) {
      await this.browser.close();
      this.browser = null;
    }
  }

  async analyzeDomains(
    request: DomainAnalysisRequest
  ): Promise<DomainAnalysisResponse> {
    try {
      await this.initialize();

      const { analyzedDomain, competitorDomains } = request;
      const allDomains = [analyzedDomain, ...competitorDomains];

      const results: DomainAnalysisData[] = [];

      for (const domain of allDomains) {
        try {
          const domainData = await this.analyzeSingleDomain(domain);
          results.push(domainData);
        } catch (error) {
          console.error(`Error analyzing domain ${domain}:`, error);
          results.push({
            domain,
            url: `https://${domain}`,
            title: "",
            description: "",
            content: "",
            metaTags: {},
            performance: {
              loadTime: 0,
              domContentLoaded: 0,
            },
            resources: {
              scripts: 0,
              stylesheets: 0,
              images: 0,
              fonts: 0,
            },
            errors: [error instanceof Error ? error.message : "Unknown error"],
          });
        }
      }

      // Separate analyzed domain from competitors
      const analyzedDomainData = results.find(
        (r) => r.domain === analyzedDomain
      );
      const competitorDomainsData = results.filter(
        (r) => r.domain !== analyzedDomain
      );

      return {
        success: true,
        data: {
          analyzedDomain: analyzedDomainData!,
          competitorDomains: competitorDomainsData,
        },
      };
    } catch (error) {
      console.error("Error in domain analysis:", error);
      return {
        success: false,
        error:
          error instanceof Error ? error.message : "Unknown error occurred",
      };
    }
  }

  private async analyzeSingleDomain(
    domain: string
  ): Promise<DomainAnalysisData> {
    if (!this.browser) {
      throw new Error("Browser not initialized");
    }

    const page = await this.browser.newPage();
    const url = `https://${domain}`;

    // Enable performance monitoring
    await page.setCacheEnabled(false);

    // Set viewport
    await page.setViewport({ width: 1280, height: 720 });

    // Collect performance metrics
    const performanceMetrics: any = {};
    const errors: string[] = [];

    // Listen for console errors
    page.on("console", (msg) => {
      if (msg.type() === "error") {
        errors.push(msg.text());
      }
    });

    // Listen for page errors
    page.on("pageerror", (error) => {
      errors.push(error.message);
    });

    try {
      // Navigate to the page and wait for network idle
      const startTime = Date.now();
      await page.goto(url, {
        waitUntil: "networkidle2",
        timeout: 30000,
      });
      const loadTime = Date.now() - startTime;

      // Get performance metrics
      const performance = await page.evaluate(() => {
        const nav = (window as any).performance.getEntriesByType(
          "navigation"
        )[0] as any;
        const paint = (window as any).performance.getEntriesByType(
          "paint"
        ) as any[];

        return {
          domContentLoaded:
            nav.domContentLoadedEventEnd - nav.domContentLoadedEventStart,
          firstContentfulPaint:
            paint.find((p: any) => p.name === "first-contentful-paint")
              ?.startTime || 0,
          largestContentfulPaint: 0, // Will be calculated separately
        };
      });

      // Get page content and meta tags
      const pageData = await page.evaluate(() => {
        try {
          const title = document.title;
          const description =
            document
              .querySelector('meta[name="description"]')
              ?.getAttribute("content") || "";

          // Collect all meta tags
          const metaTags = {};
          document.querySelectorAll("meta").forEach((meta) => {
            const name =
              meta.getAttribute("name") || meta.getAttribute("property") || "";
            const content = meta.getAttribute("content") || "";
            if (name && content) {
              metaTags[name] = content;
            }
          });

          // Simple text extraction
          const bodyText = document.body ? document.body.textContent || "" : "";
          const content = bodyText
            .replace(/\s+/g, " ")
            .trim()
            .substring(0, 10000);

          // Count resources
          const scripts = document.querySelectorAll("script").length;
          const stylesheets = document.querySelectorAll(
            'link[rel="stylesheet"]'
          ).length;
          const images = document.querySelectorAll("img").length;
          const fonts = document.querySelectorAll(
            'link[rel="preload"][as="font"], link[rel="font"]'
          ).length;

          return {
            title,
            description,
            metaTags,
            resources: { scripts, stylesheets, images, fonts },
            content,
          };
        } catch (error) {
          return {
            title: "",
            description: "",
            metaTags: {},
            resources: { scripts: 0, stylesheets: 0, images: 0, fonts: 0 },
            content: "",
          };
        }
      });

      await page.close();

      return {
        domain,
        url,
        title: pageData.title,
        description: pageData.description,
        content: pageData.content,
        metaTags: pageData.metaTags,
        performance: {
          loadTime,
          domContentLoaded: performance.domContentLoaded,
        },
        resources: pageData.resources,
        errors,
      };
    } catch (error) {
      await page.close();
      throw error;
    }
  }
}
