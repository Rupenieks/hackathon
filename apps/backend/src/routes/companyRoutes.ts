import { Router, Request, Response } from "express";
import { CompanyController } from "../controllers/companyController.js";
import { BrandfetchService } from "../services/brandfetchService.js";
import { OpenAIService } from "../services/openaiService.js";

export function createCompanyRoutes(
  brandfetchApiKey: string,
  openaiApiKey: string
): Router {
  const router = Router();
  const brandfetchService = new BrandfetchService(brandfetchApiKey);
  const openaiService = new OpenAIService(openaiApiKey);
  const companyController = new CompanyController(
    brandfetchService,
    openaiService
  );

  // POST /api/analyze-company
  router.post("/analyze-company", (req: Request, res: Response) => {
    companyController.analyzeCompany(req, res);
  });

  return router;
}
